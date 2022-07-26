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
    result = requests.get("{}/instruments/{}".format(instool.url, instrument_id), headers=headers, verify=False)
    if result.status_code == 200:
        data = json.loads(result.text)
        print('Successfully got instrument data for {} ({})'.format(data.get('name'),instrument_id))
        return data
    else: 
        print('Error getting instrument {}: {}'.format(instrument_id, result.text))
        quit(-1)

def get_instruments():
    result = requests.post(instool.url + '/instruments/search', json={}, headers=headers, verify=False)
    if result.status_code == 200:
        all = json.loads(result.text)['instruments']
        without_doi = [i for i in all if i.get('doi') == None]
        print('Found {} instruments'.format(len(without_doi)))
        return [i['instrumentId'] for i in without_doi]
        
    else: 
        print('Error getting instruments: {}'.format(result.text))
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

def register_doi_and_update_instrument(instrument_id):
    instrument = get_instrument(instrument_id)
    if ('doi' in instrument and instrument['doi']):
        print(f"{instrument['name']} already has DOI {instrument['doi']}")
        return
    doi = register_doi(instrument)    
    update_instrument_set_doi(instrument_id, doi)
    update_doi_set_url(doi)

def main(argv):
    instrument_id = None
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
            register_doi_and_update_instrument(instrument_id)
    if instrument_id == None:
        all = get_instruments()
        for instrument_id in all:
            register_doi_and_update_instrument(instrument_id)
    

if __name__ == "__main__":
    main(sys.argv[1:])
