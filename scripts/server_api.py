import urllib3
import logging
import requests

import config.instool as instool

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

headers = {
    'Content-Type': 'application/json',
    'X-API-Key': instool.auth
}

class ServerError(Exception):
    # Exception raised for unexepcted Server results
    def __init__(self, data: dict, code: int, message: str):
        self.status_code = code
        self.message = message
        self.data = data
    def __str__(self):
        return 'Error {self.code} - {self.message}'


class Api:
    """Wrapper for the Instool API.
       Test mode is passed to the api, and all updates are skipped in test mode
    """
    test_mode = False

    def __init__(self, test_mode: bool):
        self.test_mode = test_mode

    def get_instrument(self, doi: str) -> dict:
        response = requests.get(instool.url + f"/instruments/{doi}")
        if (response.status_code == 200):
            return response.json()
        elif (response.status_code == 404):
            return None
        raise ServerError(None, response.status_code, response.text)

    def update_instrument(self, doi: str, data: dict) -> dict:
        if (self.test_mode):
            logging.warning(f"Test mode, not executing update for {data['name']} ({doi})")
            return data
        response = requests.put(instool.url + f"/instruments/{doi}", json=data, headers=headers, verify=False, timeout=60)
        if response.status_code != 201 and response.status_code != 200:
            raise ServerError(data, response.status_code, response.text)

        logging.info(f"Sucessfully updated {data['name']}")
        return response.json() 

    def lookup_instrument(self, criteria: dict) -> dict:
        response = requests.post(instool.url + f"/instruments/lookup", json=criteria, headers=headers, verify=False, timeout=60)
        if (response.status_code == 200):
            return response.json()
        elif (response.status_code == 409) or (response.status_code != 404):
            raise ServerError(criteria, response.status_code, response.text)
        return None
    
    def create_instrument(self, data: dict) -> dict:
        if (self.test_mode):
            logging.warning(f"Test mode, not creating instrument {data['name']}")
            return data
        response = requests.post(instool.url + f"/instruments", json=data, headers=headers, verify=False, timeout=60)
        if (response.status_code == 201) or (response.status_code == 200):
           return response.json()
        raise ServerError(data, response.status_code, response.text)
    

