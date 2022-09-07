from asyncio.windows_events import NULL
import csv
import json
from unicodedata import category
from requests.auth import HTTPBasicAuth
import requests
import config.instool as instool

import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def create_json(name, abbreviation, label, category):
    json_dict = {
        "name": name,
        "label": label,
        "abbreviation": abbreviation,
        "uri": None
    }
    if (category):
        json_dict["category"] = {
            "name": category
        }
    
    return json_dict

headers = {
    'Content-Type': 'application/json',
    'X-API-Key': instool.auth
}

with open('data/types.csv', encoding='utf-8-sig') as csvfile:
    reader = csv.reader(csvfile, dialect='excel')
    currentCategories = [None] * 5
    for row in reader:
        level, name = next((x, val) for x, val in enumerate(row) if val)
        currentCategories[level] = name
        abbreviation = row[level + 1]
        label = row[level + 2] or name
        print("{level}: {name} - {label}".format(level=level, name=name, label=label))

        data = create_json(name, abbreviation, label, currentCategories[level-1] )

        result = requests.post(instool.url + '/instrument-types', json=data, headers=headers, verify=False)
        if result.status_code == 201 or result.status_code == 200:
                print('Sucessful')
        else: 
                print('Error {}: {}'.format(result.status_code, result.text))




