import argparse
import csv
import io

import logging
import logging.config
import requests
import sys
from urllib import request
import data_converter.csv_data_source as csv_data_source
import apis.server_api as server_api
import apis.datacite_api as datacite_api
import data_converter.instrument_comparator as instrument_comparator
import data_converter.json_ld_source as json_ld_source


class DoiRegistration:
    what_if: False

    def __init__(self, server_api: server_api.Api, datacite_api: datacite_api.Api, what_if: bool):
        self.what_if = what_if
        self.server_api = server_api
        self.datacite_api = datacite_api

    def register_all(self):
        instrument_table = self.server_api.get_instrument_table()
        without_doi = [i for i in instrument_table if not i.get('doi')]
        print('Found {} instruments without DOI'.format(len(without_doi)))
        for i in without_doi:
            instrument = self.server_api.get_instrument(i['instrumentId'])
            self.register_doi(instrument)

    def register_doi(self, instrument: dict):
        if instrument.get('doi'):
            logging.debug(f"{instrument['name']} already has DOI {instrument['doi']}")
        else:
            logging.info(f"Registring DOI for {instrument['name']} ({instrument['instrumentId']})")
            if not self.what_if:
                doi = self.datacite_api.register_doi(instrument)
                self.server_api.set_doi(instrument['instrumentId'], doi)
                self.datacite_api.update_doi_set_url(doi)
                logging.info(f"Done, got DOI {doi} for {instrument['name']} ({instrument['instrumentId']})")
            else:
                logging.info("Registring DOI skipped because of --what-if")


class SpiderTool:
    what_if = False

    def __init__(self, comparator: instrument_comparator.InstrumentComparator, doi_registration: DoiRegistration, api: server_api.Api, what_if: bool):
        self.what_if = what_if
        self.api = api
        self.comparator = comparator
        self.doi_registration = doi_registration

    def handle_errors(self, error: server_api.ServerError) -> None:
        """ this handles unexpected errors returned by the server (other than not found)
            For the moment, they are just logged
        """

        # Multiple choices - more than one instrument found
        if error.status_code == 409:
            logging.error(
                f"Conflict found while processing {error.data.get('name')}: Duplicate (multiple) instruments found on the server. {error.message}.")

        # Unprocessable Entity - data is incomplete/invalid/corrupt and declided by the server
        elif error.status_code == 412 or error.status_code == 400:
            logging.error(
                f"Data for {error.data.get('name')} was invalid and could not be processed by the server: {error.message}.")

        elif error.status_code == 501:
            logging.error(
                f"That operation is not yet implemented {error.data.get('name')}.")

        # Handling Server Errors - log and stop further processing. Something is wrong on the server.
        elif error.status_code >= 500:
            logging.fatal(
                f"Server Error {error.status_code} while processing {error.data.get('name')}: {error.message}.")
            logging.fatal("Aborting now, please check the server and restart once the problem is resolved.")
            sys.exit(1)

        # Anything else than NOT FOUND, is an error
        elif error.status_code != 404:
            logging.error(
                f"Unexpected HTTP error {error.status_code} occured while processing {error.data.get('name')}: {error.message}.")

    def update(self, data: dict) -> dict:
        """this function updates an instrument on the server
        """

        response = self.api.update_instrument(data.get('instrumentId'), data)
        return response

    def lookup(self, data: dict) -> dict:
        """This functions looks for an existing instrument on the server in several ways:
           * by DOI, if present
           * by Serial number and manufacture, if those are set
           * by Name and institution

           It returns the instrument json (dict), or None if nothing is found
        """
        existing = None

        # LOOKING UP THROUGH DOI
        if data['doi']:
            existing = self.api.get_instrument(data['doi'])

        # LOOKING UP THROUGH SERIAL# AND MANUFACTURER
        if not existing and data['serialNumber'] and data['manufacturer']:

            # parameters
            criteria = {
                'serialNumber': data['serialNumber'],
                'manufacturer': data['manufacturer']
            }
            existing = self.api.lookup_instrument(criteria)

        # LOOKING UP THROUGH NAME AND INSTITUTION NAME
        if not existing and data['name'] and data['institution']['name']:

            # parameters
            criteria = {
                'name': data['name'],
                'institution': data['institution']['name']
            }
            existing = self.api.lookup_instrument(criteria)
        return existing

    def upload_image(self, instrument: dict, image: dict):
        if (image.get('file')):
            with open('data/'+image['file'], "rb") as file:
                try:
                    self.api.upload_image(instrument['instrumentId'], file, image['filename'])
                finally:
                    file.close()
        else:
            file = requests.get(image.get('url'));
            content = io.BytesIO(file.content)
            self.api.upload_image(instrument['instrumentId'], content, image['filename'])

    def process_instrument(self, data: dict):
        """ This function process the incoming data by 
            * lookup up the data on the server
            * creating it on the server if nothing is found
            * comparing server data to source data if something is found
            * and pushing an update to the server if there are differences
        """
        try:
            existing = self.lookup(data)
            if not existing:
                existing = self.api.create_instrument(data)
                for image in data.get('images_to_upload') or {}:
                    self.upload_image(existing, image)

                # is DOI not in the source but in the server?
                if not existing.get('doi'):
                    doi = doi_registration.register_doi(existing)
                    self.communicate_doi(existing, doi)

            else:
                comparisonResult = self.comparator.compare_instruments(data, existing)

                if comparisonResult.is_major_update:
                    # TODO: Handle major updates
                    logging.error(f"Major update found for {data['name']}, not yet implemeted.")
                elif comparisonResult.is_modified:
                    existing = self.update(comparisonResult.data)
                else:
                    logging.info(f"Nothing to do for {data['name']} ({data.get('doi')})")

                for image in comparisonResult.data.get('images_to_upload') or {}:
                    self.upload_image(comparisonResult.data, image)

                if comparisonResult.register_doi:
                    existing = self.api.get_instrument(existing['instrumentId'])
                    doi = doi_registration.register_doi(existing)
                    self.communicate_doi(existing, doi)

                elif comparisonResult.notify_doi:
                    self.communicate_doi(existing, existing['doi'])

        except server_api.ServerError as e:
            self.handle_errors(e)
        except instrument_comparator.InstrumentConflict as e:
            logging.error(e.message)

    def communicate_doi(self, data: dict, doi: str) -> None:
        if self.what_if:
            logging.info(f"Skipped communication DOI to source")
        else:
            logging.error(f"{data['name']} has DOI {doi}, communication that to source is not yet implemented.")

    def import_from_csv(self, file: str) -> None:
        """Import from a csv file, convert each row to an instrument json, and process that instrument
        """
        with open(file, encoding='utf-8-sig') as csvfile:

            # Reading CSV and looping over rows
            reader = csv.DictReader(csvfile, dialect='excel')
            for row in reader:

                # Converting one CSV row to instrument JSON (dictionary)
                data = csv_data_source.create_json(row)
                if data.get('name'):
                    self.process_instrument(data)

    def import_from_json_ld(self, url: str) -> None:
        """Import from a web page containing JSON LD (Drupal web page for example)
        """
        data = json_ld_source.get_instrument_data(url)
        self.process_instrument(data)

    def spider_web_site(self, url: str) -> None:
        """Check a web site for instrument web pages, and process them one by one
        """
        raise Exception("Not implemented yet")


def init_logging(loglevel: str):
    """Initialize logging system, settign a filter by loglevel

        Throws an esception if the loglevel is invalid.
    """
    numeric_level = getattr(logging, loglevel.upper(), None)
    if not isinstance(numeric_level, int):
        raise ValueError('Invalid log level: %s' % loglevel)
    logging.config.fileConfig('logging.conf')
    logging.getLogger().setLevel(numeric_level)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--version', action='version', version='%(prog)s 0.5')

    subparsers = parser.add_subparsers(dest='cmd')

    spider = subparsers.add_parser('import', aliases=['i'])
    spider.add_argument('-l', '--log', choices=['ERROR', 'WARNING', 'INFO', 'DEBUG'], default='INFO')
    spider.add_argument('-w', '--what-if', action='store_true', help='Only compare and show what would need to be done')
    spider.add_argument('-n', '--no-doi', action='store_true', help='Do no register DOIs')
    spider.add_argument('-t', '--test-account', default=True, action='store_true', help="Use DataCite test account")

    group = spider.add_mutually_exclusive_group(required=True)
    group.add_argument('-c', '--csv', help='A CSV file containing (initial) instrument data')
    group.add_argument('-u', '--url', help='A url of an instrument web page containing JSON LD instrument data')
    group.add_argument('-s', '--site', help='A web site containing several instrument web pages')

    register = subparsers.add_parser('doi', aliases='d')
    register.add_argument('-i', '--instrument', help='the numerical ID of an instrument')
    register.add_argument('--log', choices=['ERROR', 'WARNING', 'INFO', 'DEBUG'])
    register.add_argument('-w', '--what-if', action='store_true',
                          help='Only compare and show what would need to be done')
    register.add_argument('-t', '--test-account', default=True, action='store_true', help="Use DataCite test account")

    # This call processed the command line, and creates an object with the options used (or raises an exception if options are invalid)
    args = parser.parse_args()

    init_logging(args.log if args.log else 'INFO')

    # Initialize the API with the test mode. If test mode is set, no updates will be performed
    server = server_api.Api(args.what_if)
    datacite = datacite_api.Api(args.test_account)
    doi_registration = DoiRegistration(server, datacite, args.what_if or args.no_doi)

    if args.cmd == 'import':
        comparator = instrument_comparator.InstrumentComparator()
        spider = SpiderTool(comparator, doi_registration, server, args.what_if)
        if args.csv:
            spider.import_from_csv(args.csv)
        elif args.url:
            spider.import_from_json_ld(args.url)
        elif args.site:
            spider.spider_web_site(args.site)

    elif args.cmd == 'doi':
        if args.instrument:
            instrument = server.get_instrument(args.instrument)
            if instrument:
                doi_registration.register_doi(instrument)
            else:
                logging.warning(f"No instrument found with id {args.instrument}")
        else:
            doi_registration.register_all()
