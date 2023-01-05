import json
import urllib3
import logging
import requests

import config.instool as instool
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
    test_mode = False

    def __init__(self, test_mode: bool):
        self.test_mode = test_mode

    def get_instrument(self, id_or_doi: str | int) -> dict:
        response = requests.get(instool.url + f"/instruments/{id_or_doi}")
        if (response.status_code == 200):
            return response.json()
        elif (response.status_code == 404):
            return None
        raise ServerError(None, response.status_code, response.text)

    def get_instrument_table(self) -> dict:
        response = requests.post(instool.url + f"/instruments/search", json={})
        if (response.status_code == 200):
            return json.loads(response.text)['instruments']
        elif (response.status_code == 404):
            return None
        raise ServerError(None, response.status_code, response.text)

    def update_instrument(self, doi: str, data: dict) -> dict:
        if (self.test_mode):
            logging.warning(f"Test mode, not executing update for {data['name']} ({doi})")
            return data
        response = requests.put(instool.url + f"/instruments/{doi}",
                                json=data, headers=headers, verify=False, timeout=60)
        if response.status_code != 201 and response.status_code != 200:
            raise ServerError(data, response.status_code, response.text)

        logging.info(f"Sucessfully updated {data['name']}")
        return response.json()

    def lookup_instrument(self, criteria: dict) -> dict:
        response = requests.post(instool.url + f"/instruments/lookup", json=criteria,
                                 headers=headers, verify=False, timeout=60)
        if (response.status_code == 200):
            return response.json()
        elif (response.status_code == 409) or (response.status_code != 404):
            raise ServerError(criteria, response.status_code, response.text)
        return None

    def create_instrument(self, data: dict) -> dict:
        if (self.test_mode):
            logging.warning(f"Test mode, not creating instrument {data['name']}")
            # Subsequent functions will assume an instrument has an ID after beeing created on the server ...
            # They will skip due to --what-if anyway, but might raise an exception if its None
            data['instrumentId'] = 123456789
            return data
        response = requests.post(instool.url + f"/instruments", json=data, headers=headers, verify=False, timeout=60)
        if (response.status_code == 201) or (response.status_code == 200):
            return response.json()
        raise ServerError(data, response.status_code, response.text)

    def set_doi(self, instrument_id: int, doi: str):
        """Set the DOI after it has been registered
        """
        response = requests.patch(f"{instool.url}/instruments/{instrument_id}/doi/{doi}",
                                  headers=headers, verify=False, timeout=60)
        if response.status_code == 200 or response.status_code == 204:
            logging.debug(f'Successfully set doi {doi} instrument')
        else:
            raise ServerError({"instrumentId": instrument_id, "doi": doi}, response.status_code, response.text)

    def upload_image(self, instrument_id: int, file: str):
        response = requests.post(instool.url + f'/instruments/{instrument_id}/images',
                               headers=headers, verify=False, files={"form_field_name": file})
        if response.status_code == 204:
            logging.debug(f'Sucessfully uploaded {file}')
        else:
           raise ServerError({"instrumentId": instrument_id, "file": file}, response.status_code, response.text)
