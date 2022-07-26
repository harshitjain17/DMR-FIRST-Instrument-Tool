import json
import requests
import sys
import getopt

import config.datacite as datacite
from export.data_cite import create_data_cite_json, write_json_file
from export.pidinst import create_xml, write_xml_file

from requests.auth import HTTPBasicAuth
import requests
import config.instool as instool

import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

from export.data_cite import create_data_cite_json, write_json_file
from export.pidinst import create_xml, write_xml_file

help_message = "export_instrument.py -i instrumentId"

headers = {
    'Content-Type': 'application/json',
    'X-API-Key': instool.auth
}

def get_instrument(id):
    result = requests.get(instool.url + '/instruments/' + id, headers=headers, verify=False)
    if result.status_code == 200:
        print('Successfully got instrument data')
        return json.loads(result.text)
    else: 
        print('Error getting instrument {}: {}'.format(id, result.text))
        quit(-1)


def main(argv):
    instrument_id = 6
    try:
        opts, args = getopt.getopt(argv, "hi:e:", ["instrument=", "export="])
    except getopt.GetoptError:
        print(help_message)
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print(help_message)
            sys.exit()
        elif opt in ("-i", "--instrument"):
            instrument_id = arg
        if instrument_id == -1:
            print(help_message)
            sys.exit()
        if (opt in ("-e", "--export")):
            instrument = get_instrument(instrument_id)
            if arg == "DataCite":
                dict = create_data_cite_json(instrument)
                write_json_file(dict, "data/" + instrument['name'])
            else:
                xml = create_xml.pidinst(instrument)
                write_xml_file(xml, "data/" + instrument.name)


if __name__ == "__main__":
    main(sys.argv[1:])
