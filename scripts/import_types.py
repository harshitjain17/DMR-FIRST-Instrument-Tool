from asyncio.windows_events import NULL
import csv
import json
from unicodedata import category
from requests.auth import HTTPBasicAuth
import requests
import config.instool as instool

def create_json(name, label, category):
    json_dict = {
        "name": name,
        "label": label,
        "uri": None
    }
    if (category):
        json_dict["category"] = {
            "name": category
        }
    
    return json_dict

headers = {'Content-Type': 'application/json'}

with open('data/types.csv', encoding='utf-8-sig') as csvfile:
    reader = csv.reader(csvfile, dialect='excel')
    currentCategories = [None] * 5
    for row in reader:
        level, name = next((x, val) for x, val in enumerate(row) if val)
        currentCategories[level] = name
        label = row[level + 1] or name
        print("{level}: {name} - {label}".format(level=level, name=name, label=label))

        data = create_json(name, label, currentCategories[level-1] )

        result = requests.post(instool.url + '/instrument-types', json=data, headers=headers, auth=HTTPBasicAuth('X-API-Key', instool.auth), verify=False)
        if result.status_code == 201:
            try:
                result = json.load(result)
            except:
                print(result.text)
        else: 
                print(result.text)




