import json
import logging
import requests
from requests.auth import HTTPBasicAuth
import requests
import config.instool as instool

import config.datacite as datacite
from data_converter.datacite import register_doi_json, update_doi_json

import urllib3

from apis.server_error import ServerError
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

headers = {
    'Content-Type': 'application/json',
    'X-API-Key': instool.auth
}

class Api:
    """Wrapper for the Instool API.
       Test mode is passed to the api, and all updates are skipped in test mode
    """
    use_test_dois = False

    def __init__(self, use_test_dois: bool):
        self.use_test_dois = use_test_dois
        if (not self.use_test_dois):
            raise Exception("Registering real DOIs is not yet implemented")

    def register_doi(self, instrument) -> str:
        data = {
            "data": register_doi_json(instrument)
        }
        response = requests.post(datacite.url, json=data, headers=headers, auth = HTTPBasicAuth(datacite.user, datacite.password))
        if response.status_code == 201:
            try:
                response_data = json.loads(response.text)
                doi = response_data['data']['id']
                logging.debug(f"Sucessfully registered, doi is {doi}")
                return doi
            except:
                raise ServerError([], response.status_code, "Error parsing json response: " + response.text)
        else: 
            raise ServerError(data, response.status_code, response.text)

    def update_doi_set_url(self, doi):
        data = {
            "data": update_doi_json(doi)
        }
        response = requests.put(datacite.url + '/' + doi, json=data, headers=headers, auth = HTTPBasicAuth(datacite.user, datacite.password))
        if response.status_code == 200:
            logging.debug(f"Sucessfully updated doi, url {doi}")
        else: 
            raise ServerError(data, response.status_code, response.text)

