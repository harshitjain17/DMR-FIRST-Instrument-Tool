from asyncio.windows_events import NULL
import csv
import json
from unicodedata import category
from requests.auth import HTTPBasicAuth
import requests
import config.instool as instool

import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

headers = {
    'Content-Type': 'application/json',
    'X-API-Key': instool.auth
}

uploadHeaders = {
    'X-API-Key': instool.auth
}

with open('data/instruments.csv', encoding='utf-8-sig') as csvfile:
    reader = csv.DictReader(csvfile, dialect='excel')
    for row in reader:
        if not row['doi'] or not row['Image']:
            continue

        doi = row['doi']
        instrumentResult = requests.get(instool.url + '/instruments/{}'.format(doi), headers=headers, verify=False)
        if (instrumentResult.status_code != 200):
            print('Error {}, could not get instrument with doi {}: {}'.format(instrumentResult.status_code, row['doi'], instrumentResult.text))
            continue
        instrumentData = json.loads(instrumentResult.text)

        file = open('data/'+row['Image'], "rb")

        result = requests.post(
            instool.url + '/instruments/{}/images'.format(instrumentData['instrumentId']), 
            files={"form_field_name": file}, 
            headers=uploadHeaders, 
            verify=False)
        if result.status_code == 204:
                print('Sucessfully uploaded {}'.format(row['image']))
        else: 
                print('Error {} uploading {}: {}'.format(result.status_code, row['Image'], result.text))




