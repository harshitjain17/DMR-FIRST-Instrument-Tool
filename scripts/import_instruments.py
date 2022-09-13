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
        "name": row["Name"],
        "doi": row["doi"],
        "description": row["Description"],
        "capabilities": row["Capabilities"],
        "manufacturer": row["Manufacturer"],
        "modelNumber": row["Model Number"],
        "serialNumber": row["Serial Number"],
        "roomNumber": row["Room"].strip(),
        "status": 'A',
        "institution" : {
            "facility": row["Facility"]
        }
    }
    if (row["Location"]):
        json_dict["location"] = {
            "building": row["Location"]
        }
    awards = []
    for a in row["Award"].split(','):
        if a:
            awards.append({"awardNumber": a})
    if len(awards) > 0:
        json_dict["awards"] = awards        

    instrumentTypes = []
    for t in row["Technique"].split(','):
        if t:
            instrumentTypes.append({"name": t})
    if len(instrumentTypes) > 0:
        json_dict["instrumentTypes"] = instrumentTypes
    contacts = []
    for i in range(1, 3):
        value = row.get("Faculty Contact {}".format(i))
        if (value):
            if not '@' in value:
                value = value + '@psu.edu'
            contacts.append({
                "eppn": value,
                "role": "F"
            })
    for i in range(1, 4):
        value = row.get("Technical Contact {}".format(i))
        if (value):
            if not '@' in value:
                value = value + '@psu.edu'
            contacts.append({
                "eppn": value,
                "role": "T"
            })
    if len(contacts) > 0:
        json_dict["contacts"] = contacts
    
    return json_dict

headers = {
    'Content-Type': 'application/json',
    'X-API-Key': instool.auth
}

with open('data/nanofab.csv', encoding='utf-8-sig') as csvfile:
    reader = csv.DictReader(csvfile, dialect='excel')
    for row in reader:
        data = create_json(row)

        result = requests.post(instool.url + '/instruments', json=data, headers=headers, verify=False, timeout=60)
        if result.status_code == 201 or result.status_code == 200:
                print('Sucessfully added {}'.format(row["Name"]))
        else: 
                print('Error {} inserting {}: {}'.format(result.status_code, row["Name"], result.text))




