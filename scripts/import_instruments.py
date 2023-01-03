import argparse
import csv
import sys

import logging

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

    # this function handles all errors except Error 404 (Not Found)
    # INPUT: data - source (Dictionary); response - server (Dictionary)
    # OUTPUT: Detailed Error message (String)
    def handle_errors(self, error: server_api.ServerError):

        # Multiple choices - more than one response received - Error should be raised
        if (error.status_code == 409):
            logging.error(
                f"Error {error.status_code} inserting {error.data.get('name')}: {error.message}. Duplicate (multiple) instruments fetched from the server.")

        # Handling Server Errors
        if (error.status_code >= 500):
            logging.error(f"Server Error {error.status_code} inserting {error.data.get('name')}: {error.message}.")

        # Anything else than NOT FOUND, is an error
        if (error.status_code != 404):
            logging.error(f"Error {error.status_code} inserting {error.data.get('name')}: {error.message}.")

    # this function looks up for the instrument and update the server, if there is any update
    # INPUT: Data - Source

    def update(self, data: dict) -> dict:

        # PUT the updated instrument to the server
        response = self.api.update_instrument(data['doi'] or data.get('instrumentId'), data)
        return response

    # this function looks up for the instrument in the server
    # INPUT: data - source
    # OUTPUT: response - server

    def lookup(self, data: dict) -> dict:
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

    # this function process the incoming data by calling functions for
    # lookup through the server, comparing it with the response, updating in the server
    # INPUT: data - Source
    def process_instrument(self, data: dict):
        try:
            existing = self.lookup(data)
            if not existing:
                existing = self.api.create_instrument(data)
            else:
                comparisonResult = self.comparator.compare_instruments(data, existing)

                # handling if there is an update
                if (comparisonResult.is_modified):
                    existing = self.update(comparisonResult.data)  # posted (PUT) the updates in the server
                else:
                    logging.info(f"Nothing to do for {data['name']} ({data.get('doi')})")

            # is DOI not in the source but in the server?
            if (not data['doi']) and (existing['doi']):
                logging.info('Communicate DOI to Source.')  # NOTE: How to do that??

        except server_api.ServerError as e:
            self.handle_errors(e)
        except instrument_comparator.InstrumentConflict as e:
            logging.error(e.message)

    # Import from a csv file, check each row (instrument), and try to lookup for that instrument in the server
    def import_from_csv(self, file: str) -> None:
        with open(file, encoding='utf-8-sig') as csvfile:

            # Reading CSV and looping over rows
            reader = csv.DictReader(csvfile, dialect='excel')
            for row in reader:

                # Converting one CSV row to instrument JSON (dictionary)
                data = csv_data_source.create_json(row)
                if (data.get('name')):
                    self.process_instrument(data)


def init_logging(loglevel: str):
    numeric_level = getattr(logging, loglevel.upper(), None)
    if not isinstance(numeric_level, int):
        raise ValueError('Invalid log level: %s' % loglevel)
    logging.basicConfig(level=numeric_level)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-t', '--test', action='store_true',
                        help='Test mode, only get data from website, do not send updates')
    parser.add_argument('--version', action='version', version='%(prog)s 0.1')
    parser.add_argument('--log')
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('-c', '--csv', help='A CSV file containing (initial) instrument data')
    group.add_argument('-u', '--url', help='A url of an instrument web page containing JSON LD instrument data')
    group.add_argument('-s', '--site', help='A web site containing several instrument web pages')
    args = parser.parse_args()
    init_logging(args.log or 'INFO')

    api = server_api.Api(args.test)
    comparator = instrument_comparator.InstrumentComparator()
    tool = SpiderTool(comparator, api, args.test)
    if (args.csv):
        tool.import_from_csv(args.csv)
    elif (args.url):
        raise Exception("Not implemented yet")
    elif (args.site):
        raise Exception("Not implemented yet")
