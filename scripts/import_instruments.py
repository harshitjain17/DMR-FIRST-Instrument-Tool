from asyncio.windows_events import NULL
import csv
import json # to parse or dump - not using yet
from unicodedata import category
from requests.auth import HTTPBasicAuth
import requests
import config.instool as instool
import urllib3
import logging
from register_doi import main
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

headers = {
    'Content-Type': 'application/json',
    'X-API-Key': instool.auth
}

def create_json(row): # 'row' is a dictionary type here
    
    json_dict = {
        "name": row["Name"],
        "doi": row["doi"],
        "description": row["Description"],
        "capabilities": row["Capabilities"],
        "manufacturer": row["Manufacturer"],
        "modelNumber": row["Model Number"],
        "serialNumber": row["Serial Number"],
        "acquisitionDate": row["Acquisition Date"],
        "completionDate": row["Completion Date"],
        "roomNumber": row["Room"].strip(),
        "status": 'A',
        "institution" : {
            "facility": row["Facility"],
            "name": row["Institution Name"] # NOTE: We currently do not have this field in the "row" in CSV, but we need to have it for lookup purposes
        }
    }


    # handling 'location' to add in the JSON
    if (row["Location"]):
        json_dict["location"] = {
            "building": row["Location"]
        }
    
    
    # handling 'awards' to add in the JSON
    awards = []
    for awardNumber in row["Award"].split(','):
        if awardNumber:
            awards.append({
                "awardNumber": awardNumber
            })
    if len(awards) > 0:
        json_dict["awards"] = awards        

    
    # handling 'instrumentTypes' to add in the JSON
    instrumentTypes = []
    for techniqueName in row["Technique"].split(','):
        if techniqueName:
            instrumentTypes.append({
                "name": techniqueName
            })
    if len(instrumentTypes) > 0:
        json_dict["instrumentTypes"] = instrumentTypes
    
    
    # handling 'contacts' to add in the JSON
    contacts = []
    PSU_DOMAIN = '@psu.edu'
    
    for i in range(1, 4): # NOTE: taking into account atmost 3 Faculty contacts as of now
        value = row.get("Faculty Contact {}".format(i))
        if (value):
            if not '@' in value:
                value = value + PSU_DOMAIN # NOTE: Considering just PSU contacts as of now
            contacts.append({
                "eppn": value,
                "role": "F" # F = Faculty Role
            })
    
    for i in range(1, 4): # NOTE: taking into account atmost 3 Technical contacts as of now
        value = row.get("Technical Contact {}".format(i))
        if (value):
            if not '@' in value:
                value = value + PSU_DOMAIN # NOTE: Considering just PSU contacts as of now
            contacts.append({
                "eppn": value,
                "role": "T" # T = Technical Role
            })

    if len(contacts) > 0:
        json_dict["contacts"] = contacts
    
    return json_dict


def handling_DOI_discrepancy(data, response, updatedResponse):
    
    # DOIs are not same in Server and Source - DOI Conflict
    if (data["doi"]) and (response["doi"]) and (data["doi"] != response["doi"]):
        return f'DOI Conflict: Error {response.status_code} updating {data["Name"]}: {response.text}'
    
    # DOI not present in the Server - Update it
    elif (data["doi"]) and (not response["doi"]):
        updatedResponse["doi"] = data["doi"]
    
    # DOI not present in the Source - Notify to the Source
    elif (not data["doi"]) and (response["doi"]):
        logging.info("Communicate DOI to Source.") # NOTE: How to do that??
    
    # Server and Source do not have DOI - Register DOI
    elif (not data["doi"]) and (not response["doi"]):
        main()
    

def handling_serialNumber_discrepancy(data, response, updatedResponse):
    
    # Serial Numbers are not same in Server and Source - Serial Number Conflict
    if (data["serialNumber"]) and (response["serialNumber"]) and (data["serialNumber"] != response["serialNumber"]):
        return f'Serial Number Conflict: Error {response.status_code} updating {data["Name"]}: {response.text}'
    
    # Serial Number not present in the Server - Update it
    elif (data["serialNumber"]) and (not response["serialNumber"]):
        updatedResponse["serialNumber"] = data["serialNumber"]
    
    # Serial Number not present in the Source - Notify to the Source
    elif (not data["serialNumber"]) and (response["serialNumber"]):
        logging.info("Communicate Serial Number to Source.") # NOTE: How to do that??



# this function compares each field from Source and Server
# Input: Data - Source; Response - Server
# Output: Updated Response
def compareFields(data, response):

    # initializing the new response
    updatedResponse = response.copy()

    # handling DOI discrepancy
    conflict_message = handling_DOI_discrepancy(data, response, updatedResponse)
    if conflict_message:
        return conflict_message

    # handling Serial Number discrepancy
    conflict_message = handling_serialNumber_discrepancy(data, response, updatedResponse)
    if conflict_message:
        return conflict_message

    # Updating instrumentTypes - MAJOR UPDATE
    if data["instrumentTypes"]:

        # it creates the List of the instrumentTypes' "name" fetched from the source
        listOfInstrumentTypesInSource = []
        for instrumentType in data["instrumentTypes"]:
            listOfInstrumentTypesInSource.append(instrumentType["name"]) # NOTE: Instead of just Name, we can also compare the whole intrumentType JSON

        # it creates the List of the instrumentTypes' "name" fetched from the server
        # NOTE: other properties in the response such as "instrumentTypeId", "abbreviation", "label", etc. are not included here since we try to match just the names
        if response["instrumentTypes"]:
            listOfInstrumentTypesInServer = []
            for instrumentType in response["instrumentTypes"]:
                listOfInstrumentTypesInServer.append(instrumentType["name"])

        # comparing and updating the list of "Technique" from "Data" with the list of "instrumentTypes" from "Response"
        # initialized a new variable (updatedInstrumentTypes) for the final list of updated instruments to be returned to the server
        if set(listOfInstrumentTypesInSource) != set(listOfInstrumentTypesInServer):
            updatedInstrumentTypes = []
            print("Major Update") #NOTE: How to notify the developer???
            for techniqueName in listOfInstrumentTypesInSource:
                updatedInstrumentTypes.append({
                    "name": techniqueName, # NOTE: We could also update/add the "instrumentTypeId", "abbreviation", "label", etc. here, if known
                })
            updatedResponse["instrumentTypes"] = updatedInstrumentTypes
    
    
    # updating awards - MAJOR UPDATE
    if data["awards"]:
        
        # it creates the List of the awards' "awardNumber" fetched from the source
        listOfAwardsInSource = []
        for award in data["awards"]:
            listOfAwardsInSource.append(award["awardNumber"])

        # it creates the List of the awards' "awardNumber" fetched from the server
        # NOTE: other properties in the response such as "awardId", "title", "startDate", "endDate", etc. are not included here since we try to match just the awardNumber
        if response["awards"]:
            listOfAwardsInServer = []
            for award in response["awards"]:
                listOfAwardsInServer.append(award["awardNumber"])

        # comparing and updating the list of "Award" from "Data" with the list of "awards" from "Response"
        # initialized a new variable (updatedAwards) for the final list of updated awards to be returned to the server
        if set(listOfAwardsInSource) != set(listOfAwardsInServer):
            updatedAwards = []
            for awardNumber in listOfAwardsInSource:
                 updatedAwards.append({
                    "awardNumber": awardNumber, # NOTE: We could also update/add the "awardId", "title", "startDate", "endDate", etc. here, if known
                })
            updatedResponse["awards"] = updatedAwards

    
    # updating contacts
    if (data["contacts"]):

        # it creates the list of contacts' "eppn" and "role" fetched from the source 
        listOfContactsInSource = data["contacts"] # It only contains "eppn" and "role"
            
        # it creates the List of the contacts' "eppn" and "role" fetched from the server
        if response["contacts"]:
            listOfContactsInServer = []
            for contact in response["contacts"]:
                listOfContactsInServer.append({
                    "eppn": contact["eppn"],
                    "role": contact["role"]
                })
            
            # comparing and updating the list of "contact" from "Data" with the list of "awards" from "Response"
            # initialized a new variable (updatedContacts) for the final list of updated contacts to be returned to the server
            if set(listOfContactsInSource) != set(listOfContactsInServer):
                updatedContacts = []
                for contact in listOfContactsInSource:
                    updatedContacts.append({
                        "eppn": contact["eppn"], # NOTE: We could also update/add the "eppn", "firstName", "middleName", "lastName", "role", etc. here, if known
                        "role": contact["role"]
                    })
            updatedResponse["contacts"] = updatedContacts


    # Updating roomNumber - MAJOR UPDATE
    if data["roomNumber"]:
        if data["roomNumber"] != response["roomNumber"]:
            print("Major Update") # BUG: HOw to notify the developer???
            updatedResponse["roomNumber"] = data["roomNumber"]
    
    
    # Updating name
    if data["name"]:
        if data["name"] != response["name"]:
            updatedResponse["name"] = data["name"]

    
    # updating manufacturer
    if data["manufacturer"]:
        if data["manufacturer"] != response["manufacturer"]:
            updatedResponse["manufacturer"] = data["manufacturer"]
    
    
    # updating modelNumber
    if data["modelNumber"]:
        if data["modelNumber"] != response["modelNumber"]:
            updatedResponse["modelNumber"] = data["modelNumber"]
    
    
    # updating serialNumber
    if data["serialNumber"]:
        if data["serialNumber"] != response["serialNumber"]:
            updatedResponse["serialNumber"] = data["serialNumber"]
    
    
    # updating status
    if data["status"]:
        if data["status"] != response["status"]:
            updatedResponse["status"] = data["status"]
    
    
    # updating acquisitionDate
    if data["acquisitionDate"]:
        if data["acquisitionDate"] != response["acquisitionDate"]:
            updatedResponse["acquisitionDate"] = data["acquisitionDate"]
    
    
    # updating completionDate
    if data["completionDate"]:
        if data["completionDate"] != response["completionDate"]:
            updatedResponse["completionDate"] = data["completionDate"]
    
    
    # updating description
    if data["description"]:
        if data["description"] != response["description"]:
            updatedResponse["description"] = data["description"]
            
    
    # updating capabilities
    if data["capabilities"]:
        if data["capabilities"] != response["capabilities"]:
            updatedResponse["capabilities"] = data["capabilities"]
   
    
    # updating facility
    if data["institution"]["facility"]:
        if data["institution"]["facility"] != response["institution"]["facility"]:
            updatedResponse["institution"]["facility"] = data["institution"]["facility"]

    
    # updating location
    if data["location"]["building"]:
        if data["location"]["building"] != response["location"]["building"]:
            updatedResponse["location"]["building"] = data["location"]["building"]

    return updatedResponse



# this function handles all errors except Error 404 (Not Found)
# INPUT: data - source (Dictionary); response - server (Dictionary)
# OUTPUT: Detailed Error message (String)
def handle_errors(data, response):
    
    # Multiple choices - more than one response received - Error should be raised
    if (response.status_code == 409):
        return (f'Error {response.status_code} inserting {data["name"]}: {response.text}. Duplicate (multiple) instruments fetched from the server.')
    
    # Handling Server Errors
    if (response.status_code >= 500):
        return (f'Server Error {response.status_code} inserting {data["name"]}: {response.text}.')

    # Anything else than NOT FOUND, is an error
    if (response.status_code != 404):
        return (f'Error {response.status_code} inserting {data["name"]}: {response.text}.')

    

# this function looks up for the instrument and update the server, if there is any update
# Input: Data - Source; Response - Server
# Output: Lookup Message
def update(updated_result):

    # PUT the updated instrument to the server
    result = requests.put(instool.url + '/instruments/' + updated_result["doi"], data=updated_result, headers=headers, verify=False, timeout=60)
    if result.status_code != 201 and result.status_code != 200:
        return handle_errors(updated_result, result)

    logging.info(f'Sucessfully updated {updated_result["name"]}')
    return result.json()


# this function looks up for the instrument in the server
# INPUT: data - source (Dictionary)
# OUTPUT: response - server (Dictionary) / Error message (String)
def lookup(data):
    
    try:
        # LOOKING UP THROUGH DOI
        if data["doi"]:
            response = requests.get(instool.url + f'/instruments/{data["doi"]}')
            if (response.status_code == 200):
                return response.json()
            if (response.status_code == 409) or (response.status_code != 404):
                return handle_errors(data, response)
        
        # LOOKING UP THROUGH SERIAL# AND MANUFACTURER
        if data["serialNumber"] and data["manufacturer"]:
            
            # parameters
            requestBody = { 
                "serialNumber": data["serialNumber"],
                "manufacturer": data["manufacturer"]
            }
            response = requests.post(instool.url + f'/instruments/lookup', json = requestBody)
            if (response.status_code == 200):
                return response.json()
            if (response.status_code == 409) or (response.status_code != 404):
                return handle_errors(data, response)

        # LOOKING UP THROUGH NAME AND INSTITUTION NAME
        if data["name"] and data["institution"]["name"]:
            
            # parameters
            requestBody = { 
                "name": data["Name"],
                "institution": data["institution"]["name"]
            }
            response = requests.post(instool.url + f'/instruments/lookup', json = requestBody) 
            if (response.status_code == 200):
                return response.json()
            if (response.status_code == 409) or (response.status_code != 404):
                return handle_errors(data, response)
        
        # NOT ABLE TO LOOKUP THROUGH ANY FIELD - POST the incoming data directly, i.e., create an instrument in the server
        result = requests.post(instool.url + '/instruments', json=data, headers=headers, verify=False, timeout=60)
        if (result.status_code == 201) or (result.status_code == 200):
            server_data = result.json()
            
            # is DOI not in the source but in the server?
            if (not data["doi"]) and (server_data["doi"]):
                logging.info(f'Communicate DOI {server_data["doi"]} of {server_data["name"]} to Source')
            
            return (f'Sucessfully added {data["name"]}')
        else: 
            return (f'Error {result.status_code} inserting {data["name"]}: {result.text}')

    except:
        # Deal with 409 and 500 (server) error
        handle_errors(data, response)


def process_instrument(data):
    lookup_result = lookup(data)

    # handling the error message returned
    if (type(lookup_result) == str):
        logging.info(lookup_result)

    # handling the response JSON
    elif (type(lookup_result) == dict):
        updated_result = compareFields(data, lookup_result)
        
        # handling if there is an update
        if (type(updated_result) == dict):
            if (updated_result != lookup_result):
                result = update(updated_result) # posted (PUT) the updates in the server
            
                if (type(result) == dict):

                    # is DOI not in the source but in the server?
                    if (not data["doi"]) and (result["doi"]):
                        logging.info("Communicate DOI to Source.") # NOTE: How to do that??
                
                # handling the error message returned
                elif (type(result) == str):
                    logging.error(result)
        
        # handling conflicts
        elif (type(updated_result) == str):
            logging.error(updated_result)


# this function is the Main function
# it reads the CSV of source, check each row (instrument), and try to lookup for that instrument in the server
def import_instruments():
    with open('data/nanofab.csv', encoding='utf-8-sig') as csvfile:
        
        # Reading CSV and looping over rows
        reader = csv.DictReader(csvfile, dialect='excel')
        for row in reader:

            # Converting one CSV row to instrument JSON (dictionary)
            data = create_json(row)
            
            process_instrument(data)