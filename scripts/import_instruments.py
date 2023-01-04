import argparse
import csv

import logging
import sys

import data_converter.csv_data_source as csv_data_source
import server_api
import data_converter.instrument_comparator as instrument_comparator

from register_doi import main


class SpiderTool:
    test_mode = False

    def __init__(self, comparator: instrument_comparator.InstrumentComparator, api: server_api.Api, test_mode: bool):
        self.test_mode = test_mode
        self.api = api
        self.comparator = comparator

    def handle_errors(self, error: server_api.ServerError) -> None:
        """ this handles unexpected errors returned by the server (other than not found)
            For the moment, they are just logged
        """

        # Multiple choices - more than one instrument found
        if error.status_code == 409:
            logging.error(f"Conflict found while processing {error.data.get('name')}: Duplicate (multiple) instruments found on the server. {error.message}.")

        # Unprocessable Entity - data is incomplete/invalid/corrupt and declided by the server
        if error.status_code == 412:
            logging.error(f"Data for {error.data.get('name')} was invalid and could not be processed by the server: {error.message}.")

        # Handling Server Errors - log and stop further processing. Something is wrong on the server.
        elif error.status_code >= 500:
            logging.fatal(f"Server Error {error.status_code} while processing {error.data.get('name')}: {error.message}.")
            logging.fatal("Aborting now, please check the server and restart once the problem is resolved.")
            sys.exit(1)

        # Anything else than NOT FOUND, is an error
        elif error.status_code != 404:
            logging.error(f"Unexpected HTTP error {error.status_code} occured while processing {error.data.get('name')}: {error.message}.")

    def update(self, data: dict) -> dict:
        """this function updates an instrument on the server
        """

        response = self.api.update_instrument(data['doi'] or data.get('instrumentId'), data)
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

                # is DOI not in the source but in the server?
                if not existing['doi']:
                    doi = self.register_doi(existing)       
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

                if comparisonResult.register_doi:
                    doi = self.register_doi(existing)                  
                    self.communicate_doi(existing, doi)

                elif comparisonResult.notify_doi:
                    self.communicate_doi(existing, data['doi'])



        except server_api.ServerError as e:
            self.handle_errors(e)
        except instrument_comparator.InstrumentConflict as e:
            logging.error(e.message)

    def register_doi(self, data: dict) -> str: 
        """Register a DOI with DataCite, and update that on the server
        """
        if self.test_mode:
            logging.info(f"{data['name']} needs a DOI, but no updates are pocessed in test mode.")
        else:
            logging.error(f"{data['name']} needs a DOI, not yet implemeted.")
            return "N/A"

    def communicate_doi(self, data: dict, doi: str) -> None:
        if not self.test_mode:
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
        raise Exception("Not implemented yet")

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
    logging.basicConfig(level=numeric_level)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-t', '--test', action='store_true',
                        help='Test mode, only get data from website, do not send updates')
    parser.add_argument('--version', action='version', version='%(prog)s 0.1')
    parser.add_argument('--log') # TODO: Add allowed params

    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('-c', '--csv', help='A CSV file containing (initial) instrument data')
    group.add_argument('-u', '--url', help='A url of an instrument web page containing JSON LD instrument data')
    group.add_argument('-s', '--site', help='A web site containing several instrument web pages')
    
    # This calls processed the command line, and creates an object with the options used (or raises an exception if options are invalid)
    args = parser.parse_args()
    
    init_logging(args.log or 'INFO')

    # Initialize the API with the test mode. If test mode is set, no updates will be performed
    api = server_api.Api(args.test)
    comparator = instrument_comparator.InstrumentComparator()
    tool = SpiderTool(comparator, api, args.test)
    if args.csv:
        tool.import_from_csv(args.csv)
    elif args.url:
        tool.import_from_json_ld(args.url)
    elif args.site:
        tool.spider_web_site(args.site)
