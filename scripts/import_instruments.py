from asyncio.windows_events import NULL
import csv
import json # to parse or dump - not using yet
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

def otherFieldsSame(data, response):
    # if data["doi"] != response["doi"]:
    #     return f'DOI Conflict: Error {response.status_code} updating {data["Name"]}: {response.text}'
    # if data["Serial Number"] != response["serialNumber"]:
    #     return f'Serial Number: Error {response.status_code} updating {data["Name"]}: {response.text}'
    
    # Updating instrumentTypes - MAJOR UPDATE
    if data["Technique"]:

        listOfInstrumentTypesInData = data["Technique"].split(',')

        # it creates the List of the instrumentType "name" fetched from the server
        # NOTE: other properties in the response such as "instrumentTypeId", "abbreviation", "label", etc. are not included here since we try to match just the names
        if response["instrumentTypes"]:
            listOfInstrumentTypesInServer = []
            for instrumentType in response["instrumentTypes"]:
                listOfInstrumentTypesInServer.append(instrumentType["name"])

        # comparing and updating the list of "Technique" from "Data" with the list of "instrumentTypes" from "Response"
        # initialized a new variable (updatedInstrumentTypes) for the final list of updated instruments to be returned to the server
        if set(listOfInstrumentTypesInData) != set(listOfInstrumentTypesInServer):
            updatedInstrumentTypes = []
            print("Major Update") #BUG: HOw to notify the developer???
            for technique in listOfInstrumentTypesInData:
                updatedInstrumentTypes.append({
                    "name": technique, # NOTE: We could also update/add the "instrumentTypeId", "abbreviation", "label", etc. here, if known
                })
            response["instrumentTypes"] = updatedInstrumentTypes
    
    
    # Updating roomNumber - MAJOR UPDATE
    if data["Room"]:
        if data["Room"] != response["roomNumber"]:
            print("Major Update") # NOTE: MAJOR UPDATE; BUG: HOw to notify the developer???
            response["roomNumber"] = data["Room"]
    
    
    # Updating name
    if data["Name"]:
        if data["Name"] != response["name"]:
            response["name"] = data["Name"]

    # updating manufacturer
    if data["Manufacturer"]:
        if data["Manufacturer"] != response["manufacturer"]:
            response["manufacturer"] = data["Manufacturer"]
    
    # updating modelNumber
    if data["Model Number"]:
        if data["Model Number"] != response["modelNumber"]:
            response["modelNumber"] = data["Manufacturer"]
    
    # updating serialNumber
    if data["Serial Number"]:
        if data["Serial Number"] != response["serialNumber"]:
            response["serialNumber"] = data["Serial Number"]
    
    # updating status
    if data["Status"]:
        if data["Status"] != response["status"]:
            response["status"] = data["Status"]
    
    # updating acquisitionDate
    if data["Acquisition Date"]:
        if data["Acquisition Date"] != response["acquisitionDate"]:
            response["acquisitionDate"] = data["Acquisition Date"]
    
    # updating completionDate
    if data["Completion Date"]:
        if data["Completion Date"] != response["completionDate"]:
            response["completionDate"] = data["Completion Date"]
    
    # updating description
    if data["Description"]:
        if data["Description"] != response["description"]:
            response["description"] = data["Description"]
            
    # updating capabilities
    if data["Capabilities"]:
        if data["Capabilities"] != response["capabilities"]:
            response["capabilities"] = data["Capabilities"]
   
    # updating facility
    if data["Facility"]:
        if data["Facility"] != response["institution"]["facility"]:
            response["institution"]["facility"] = data["Facility"]

    # NOTE: Doubt in LOCATION!!!
    
    # updating awards
    if data["Award"]:
        
        listOfAwardsInData = data["Award"].split(',')

        # it creates the List of the awards "awardNumber" fetched from the server
        # NOTE: other properties in the response such as "awardId", "title", "startDate", "endDate", etc. are not included here since we try to match just the awardNumber
        if response["awards"]:
            listOfAwardsInServer = []
            for award in response["awards"]:
                listOfAwardsInServer.append(award["awardNumber"])

        # comparing and updating the list of "Award" from "Data" with the list of "awards" from "Response"
        # initialized a new variable (updatedAwards) for the final list of updated awards to be returned to the server
        if set(listOfAwardsInData) != set(listOfAwardsInServer):
            updatedAwards = []
            for award in listOfAwardsInData:
                 updatedAwards.append({
                    "awardNumber": award, # NOTE: We could also update/add the "awardId", "title", "startDate", "endDate", etc. here, if known
                })
            response["awards"] = updatedAwards

    # updating contacts
    if (data["Faculty Contact 1"] or data["Faculty Contact 2"] or data["Technical Contact 1"] or data["Technical Contact 2"] or data["Technical Contact 3"]):

        # it creates the list of contacts "email" fetched from the data  
        listOfContactsInData = []
        if data["Faculty Contact 1"]: listOfContactsInData.append(data["Faculty Contact 1"])
        if data["Faculty Contact 2"]: listOfContactsInData.append(data["Faculty Contact 2"])
        if data["Technical Contact 1"]: listOfContactsInData.append(data["Technical Contact 1"])
        if data["Technical Contact 2"]: listOfContactsInData.append(data["Technical Contact 2"])
        if data["Technical Contact 3"]: listOfContactsInData.append(data["Technical Contact 3"])

        # it creates the List of the contacts "email" fetched from the server
        if response["contacts"]:
            listOfContactsInServer = []
            for contact in response["contacts"]:
                listOfContactsInServer.append(contact["email"])
            
            # comparing and updating the list of "contact" from "Data" with the list of "awards" from "Response"
            # initialized a new variable (updatedContacts) for the final list of updated contacts to be returned to the server
            if set(listOfContactsInData) != set(listOfContactsInServer):
                updatedContacts = []
                for contact in listOfContactsInData:
                    updatedContacts.append({
                        "email": contact # NOTE: We could also update/add the "eppn", "firstName", "middleName", "lastName", "role", etc. here, if known
                    })
            response["contacts"] = updatedContacts




with open('data/nanofab.csv', encoding='utf-8-sig') as csvfile:
    reader = csv.DictReader(csvfile, dialect='excel')
    for row in reader:
        data = create_json(row) # 'data' is the JSON type
        if data["doi"]:
            response = requests.get(instool.url + f'/instruments/{data["doi"]}') # Looking up through DOI/ID
            if response.status_code == 201 or response.status_code == 200:
                otherFieldsSame(data, response)



        result = requests.post(instool.url + '/instruments', json=data, headers=headers, verify=False, timeout=60)
        if result.status_code == 201 or result.status_code == 200:
            print(f'Sucessfully added {row["Name"]}')
        else: 
            print(f'Error {result.status_code} inserting {row["Name"]}: {result.text}')




