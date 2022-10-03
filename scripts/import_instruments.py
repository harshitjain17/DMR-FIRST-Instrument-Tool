from asyncio.windows_events import NULL
import csv
import json
from unicodedata import category
from requests.auth import HTTPBasicAuth
import requests
import config.instool as instool

import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def create_json(row): # 'row' is a dictionary type here
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

    # handling 'location' to add in the JSON
    if (row["Location"]):
        json_dict["location"] = {
            "building": row["Location"]
        }
    
    # handling 'awards' to add in the JSON
    awards = []
    for a in row["Award"].split(','):
        if a:
            awards.append({"awardNumber": a})
    if len(awards) > 0:
        json_dict["awards"] = awards        

    # handling 'instrumentTypes' to add in the JSON
    instrumentTypes = []
    for t in row["Technique"].split(','):
        if t:
            instrumentTypes.append({"name": t})
    if len(instrumentTypes) > 0:
        json_dict["instrumentTypes"] = instrumentTypes
    
    # handling 'contacts' to add in the JSON
    contacts = []
    PSU_DOMAIN = '@psu.edu'
    for i in range(1, 3): # NOTE: taking into account just 2 Faculty contacts as of now
        value = row.get("Faculty Contact {}".format(i))
        if (value):
            if not '@' in value:
                value = value + PSU_DOMAIN # NOTE: Considering just PSU contacts as of now
            contacts.append({
                "eppn": value,
                "role": "F" # F = Faculty Role
            })
    for i in range(1, 4): # NOTE: taking into account just 3 Faculty contacts as of now
        value = row.get("Technical Contact {}".format(i))
        if (value):
            if not '@' in value:
                value = value + PSU_DOMAIN
            contacts.append({
                "eppn": value,
                "role": "T" # T = Technical Role
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
        data = create_json(row) # 'data' is the JSON type
        



        result = requests.post(instool.url + '/instruments', json=data, headers=headers, verify=False, timeout=60)
        if result.status_code == 201 or result.status_code == 200:
                print('Sucessfully added {}'.format(row["Name"]))
        else: 
                print('Error {} inserting {}: {}'.format(result.status_code, row["Name"], result.text))




