from asyncio.windows_events import NULL
import csv
import json
from unicodedata import category
from requests.auth import HTTPBasicAuth
import requests
import config.instool as instool

import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def create_json(row):
    json_dict = {
        "name": row[0],
        "description": row[9],
        "manufacturer": row[2],
        "modelNumber": row[3],
        "serialNumber": row[4],
        "roomNumber": row[5].strip(),
        "status": 'A',
        "location" : {
            "building": row[11]
        },
        "institution" : {
            "facility": row[10]
        }
    }
    instrumentTypes = []
    for t in row[1].split(','):
        if t:
            instrumentTypes.append({"name": t})
    if len(instrumentTypes) > 0:
        json_dict["instrumentTypes"] = instrumentTypes
    contacts = []
    for i in range(12, len(row)):
        if (row[i]):
            contacts.append({
                "eppn": row[i]
            })
    if len(contacts) > 0:
        json_dict["contacts"] = contacts
    
    return json_dict

headers = {
    'Content-Type': 'application/json',
    'X-API-Key': instool.auth
}

with open('data/instruments.csv', encoding='utf-8-sig') as csvfile:
    reader = csv.reader(csvfile, dialect='excel')
    inHeader = True
    for row in reader:
        if inHeader:
            inHeader = False
            continue
        data = create_json(row)

        result = requests.post(instool.url + '/instruments', json=data, headers=headers, verify=False)
        if result.status_code == 201 or result.status_code == 200:
                print('Sucessful')
        else: 
                print('Error {} inserting {}: {}'.format(result.status_code, row[0], result.text))




