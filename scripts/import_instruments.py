from asyncio.windows_events import NULL
import csv
import json # to parse or dump - not using yet
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




def otherFieldsSame(data, response):
    # if data["doi"] != response["doi"]:
    #     return f'DOI Conflict: Error {response.status_code} updating {data["Name"]}: {response.text}'
    # if data["Serial Number"] != response["serialNumber"]:
    #     return f'Serial Number: Error {response.status_code} updating {data["Name"]}: {response.text}'
    
    # Updating instrumentTypes - MAJOR UPDATE
    if data["instrumentTypes"]:

        # it creates the List of the instrumentTypes' "name" fetched from the source
        listOfInstrumentTypesInSource = []
        for instrumentType in data["instrumentTypes"]:
            listOfInstrumentTypesInSource.append(instrumentType["name"])

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
            print("Major Update") #BUG: HOw to notify the developer???
            for techniqueName in listOfInstrumentTypesInSource:
                updatedInstrumentTypes.append({
                    "name": techniqueName, # NOTE: We could also update/add the "instrumentTypeId", "abbreviation", "label", etc. here, if known
                })
            response["instrumentTypes"] = updatedInstrumentTypes
    
    
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
            response["awards"] = updatedAwards

    
    # updating contacts
    if (data["contacts"]):

        # it creates the list of contacts' "eppn" and "role" fetched from the source 
        listOfContactsInSource = data["contacts"] # It only contains "eppn" and "role"
            
        # it creates the List of the contacts' "eppn" and "role" fetched from the server
        if response["contacts"]:
            listOfContactsInServer = []
            for contact in response["contacts"]:
                listOfContactsInServer.append({
                    "eppn": contact["eppn"], # NOTE: We could have used "email" instead of "eppn". Ask supervisor.
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
            response["contacts"] = updatedContacts


    # Updating roomNumber - MAJOR UPDATE
    if data["roomNumber"]:
        if data["roomNumber"] != response["roomNumber"]:
            print("Major Update") # BUG: HOw to notify the developer???
            response["roomNumber"] = data["roomNumber"]
    
    
    # Updating name
    if data["name"]:
        if data["name"] != response["name"]:
            response["name"] = data["name"]

    
    # updating manufacturer
    if data["manufacturer"]:
        if data["manufacturer"] != response["manufacturer"]:
            response["manufacturer"] = data["manufacturer"]
    
    
    # updating modelNumber
    if data["modelNumber"]:
        if data["modelNumber"] != response["modelNumber"]:
            response["modelNumber"] = data["modelNumber"]
    
    
    # updating serialNumber
    if data["serialNumber"]:
        if data["serialNumber"] != response["serialNumber"]:
            response["serialNumber"] = data["serialNumber"]
    
    
    # updating status
    if data["status"]:
        if data["status"] != response["status"]:
            response["status"] = data["status"]
    
    
    # updating acquisitionDate
    if data["acquisitionDate"]:
        if data["acquisitionDate"] != response["acquisitionDate"]:
            response["acquisitionDate"] = data["acquisitionDate"]
    
    
    # updating completionDate
    if data["completionDate"]:
        if data["completionDate"] != response["completionDate"]:
            response["completionDate"] = data["completionDate"]
    
    
    # updating description
    if data["description"]:
        if data["description"] != response["description"]:
            response["description"] = data["description"]
            
    
    # updating capabilities
    if data["capabilities"]:
        if data["capabilities"] != response["capabilities"]:
            response["capabilities"] = data["capabilities"]
   
    
    # updating facility
    if data["institution"]["facility"]:
        if data["institution"]["facility"] != response["institution"]["facility"]:
            response["institution"]["facility"] = data["institution"]["facility"]

    
    # updating location
    if data["location"]["building"]:
        if data["location"]["building"] != response["location"]["building"]:
            response["location"]["building"] = data["location"]["building"]

    return (data, response)



def import_instruments():
    with open('data/nanofab.csv', encoding='utf-8-sig') as csvfile:
        reader = csv.DictReader(csvfile, dialect='excel')
        for row in reader:
            data = create_json(row) # 'data' is the JSON type


            # LOOKING UP THROUGH DOI/ID
            if data["doi"]:
                response = requests.get(instool.url + f'/instruments/{data["doi"]}')
                
                
                # Success - one response received
                if response.status_code == 201 or response.status_code == 200:
                    
                    # checks for the similarity of rest of the fields
                    data, updatedResponse = otherFieldsSame(data, response)

                    # if there is any update made, then post the new instrument details to the server
                    if (response != updatedResponse):

                        # POST the updated instrument to the server
                        result = requests.post(instool.url + '/instruments', json=updatedResponse, headers=headers, verify=False, timeout=60)
                        if result.status_code == 201 or result.status_code == 200:
                            print(f'Sucessfully added {row["Name"]}')
                        else: 
                            print(f'Error {result.status_code} inserting {row["Name"]}: {result.text}')


                # Multiple choices - more than one response received - Error should be raised
                elif response.status_code == 300:
                    return (f'Error {result.status_code} inserting {row["Name"]}: {result.text}. Duplicate (multiple) instruments fetched from the server with the same "Name" and "Institution Name".')
                    


            # LOOKING UP THROUGH SERIAL# AND MANUFACTURER
            elif data["serialNumber"] and data["manufacturer"]:
                
                # parameters
                requestBody = { 
                    "serialNumber": data["serialNumber"],
                    "manufacturer": data["manufacturer"]
                }
                response = requests.post(instool.url + f'/instruments/lookup', json = requestBody)
                
                # Success - one response received
                if response.status_code == 201 or response.status_code == 200:
                    
                    # checks for the similarity of rest of the fields
                    data, updatedResponse = otherFieldsSame(data, response)

                    # if there is any update made
                    # then post the new instrument details to the server
                    if (updatedResponse != response):
                        
                        # POST the updated instrument to the server
                        result = requests.post(instool.url + '/instruments', json=updatedResponse, headers=headers, verify=False, timeout=60)
                        if result.status_code == 201 or result.status_code == 200:
                            print(f'Sucessfully added {row["Name"]}')
                        else: 
                            print(f'Error {result.status_code} inserting {row["Name"]}: {result.text}')

                    else:
                        # is DOI not in the source but in the server?
                        if (not data["doi"]) and (response["doi"]):
                            print("Communicate DOI to Source.") # NOTE: How to do that??

                
                # Multiple choices - more than one response received - Error should be raised
                elif response.status_code == 300:
                    return (f'Error {result.status_code} inserting {row["Name"]}: {result.text}. Duplicate (multiple) instruments fetched from the server with the same "Name" and "Institution Name".')
                


            # LOOKING UP THROUGH NAME AND INSTITUTION NAME
            elif data["name"] and data["institution"]["name"]:
                
                # parameters
                requestBody = { 
                    "name": data["Name"],
                    "institution": data["institution"]["name"]
                }
                response = requests.post(instool.url + f'/instruments/lookup', json = requestBody) 
                
                # Success - one response received
                if response.status_code == 201 or response.status_code == 200:
                    
                    # checks for the similarity of rest of the fields
                    data, updatedResponse = otherFieldsSame(data, response)

                    # if there is any update made
                    # then post the new instrument details to the server
                    if (updatedResponse != response):

                        # POST the updated instrument to the server
                        result = requests.post(instool.url + '/instruments', json=updatedResponse, headers=headers, verify=False, timeout=60)
                        if result.status_code == 201 or result.status_code == 200:
                            print(f'Sucessfully added {row["Name"]}')
                        else: 
                            print(f'Error {result.status_code} inserting {row["Name"]}: {result.text}')

                    else:
                        # is DOI not in the source but in the server?
                        if (not data["doi"]) and (response["doi"]):
                            print("Communicate DOI to Source.") # NOTE: How to do that??


                # Multiple choices - more than one response received - Error should be raised
                elif response.status_code == 300:
                    return (f'Error {result.status_code} inserting {row["Name"]}: {result.text}. Duplicate (multiple) instruments fetched from the server with the same "Name" and "Institution Name".')
                    

            # not able to lookup through any field
            # POST the incoming data directly
            # create an instrument in the server
            else:
                result = requests.post(instool.url + '/instruments', json=data, headers=headers, verify=False, timeout=60)
                if result.status_code == 201 or result.status_code == 200:
                    print(f'Sucessfully added {row["Name"]}')
                else: 
                    print(f'Error {result.status_code} inserting {row["Name"]}: {result.text}')