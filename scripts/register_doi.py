import json
import requests
import sys
import getopt
from requests.auth import HTTPBasicAuth
import requests
import config.instool as instool

import config.datacite as datacite
from export.data_cite import register_doi_json, update_doi_json

import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

help_message = "register_doi.py -i instrumentId"

headers = {
    'Content-Type': 'application/json',
    'X-API-Key': instool.auth
}

def get_instrument(instrument_id):
    result = requests.get(instool.url + '/instruments/' + instrument_id, headers=headers, verify=False)
    if result.status_code == 200:
        print('Successfully got instrument data')
        return json.loads(result.text)
    else: 
        print('Error getting instrument {}: {}'.format(instrument_id, result.text))
        quit(-1)

def update_instrument_set_doi(instrument_id, doi):
    result = requests.put("{}/instruments/{}/doi/{}".format(instool.url, instrument_id, doi), headers=headers, verify=False)
    if result.status_code == 200 or result.status_code == 204:
        print('Successfully updated instrument')
    else: 
        print('Error updating instrument {}: {}'.format(instrument_id, result.text))
        quit(-1)

def register_doi(instrument):
    data = {
        "data": register_doi_json(instrument)
    }
    result = requests.post(datacite.url, json=data, headers=headers, auth = HTTPBasicAuth(datacite.user, datacite.password))
    if result.status_code == 201:
        try:
            result = json.loads(result.text)
            doi = result['data']['id']
            print(f"Sucessfully registered, doi is {doi}")
            return doi
        except:
            print(result.text)
            quit();
    else: 
            print(result.text)
            quit;

def update_doi_set_url(doi):
    data = {
        "data": update_doi_json(doi)
    }
    result = requests.put(datacite.url + '/' + doi, json=data, headers=headers, auth = HTTPBasicAuth(datacite.user, datacite.password))
    if result.status_code == 200:
        try:
            result = json.loads(result.text)
            print(f"Sucessfully updated doi, url {doi}")
        except:
            print(result.text)
            quit();
    else: 
            print(result.text)
            quit;

def main(argv):
    instrument_id = 6
    try:
        opts, args = getopt.getopt(argv, "hi:", ["instrument="])
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
    instrument = get_instrument(instrument_id)
    if ('doi' in instrument and instrument['doi']):
        print(f"{instrument.name} already has DOI {instrument.doi}")
        sys.exit()
    doi = register_doi(instrument)    
    update_instrument_set_doi(instrument_id, doi)
    update_doi_set_url(doi)

if __name__ == "__main__":
    main(sys.argv[1:])
