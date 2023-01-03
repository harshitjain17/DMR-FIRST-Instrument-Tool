
import logging


class InstrumentConflict(Exception):
    # Exception raised for unexepcted Server results
    def __init__(self, instrument: str, message: str):
        self.message = message
        self.instrument = instrument
    def __str__(self):
        return 'Error {self.code} - {self.message}'

class InstrumentComparator:

    def handle_doi(source, existing, updated):
        
        # DOIs are not same in Server and Source - DOI Conflict
        if (source['doi']) and (existing['doi']) and (source['doi'] != existing['doi']):
            raise InstrumentConflict(source['name'], f"DOI Conflict: Source doi {source['doi']} is different than doi on server {existing['doi']}")
        
        # DOI not present in the Server - Update it
        elif (source['doi']) and (not existing['doi']):
            updated['doi'] = source['doi']
        
        # DOI not present in the Source - Notify to the Source
        elif (not source['doi']) and (existing['doi']):
            logging.info('Communicate DOI to Source.') # NOTE: How to do that??
        
        # Server and Source do not have DOI - Register DOI
        elif (not source['doi']) and (not existing['doi']):
            logging.info('Register DOI.')
        

    def handle_serial_number(source, existing, updated):
        
        # Serial Numbers are not same in Server and Source - Serial Number Conflict
        if (source['serialNumber']) and (existing['serialNumber']) and (source['serialNumber'] != existing['serialNumber']):
            raise InstrumentConflict(f"Serial Number Conflict: Error {existing.status_code} updating {source['Name']}: {existing.text}")
        
        # Serial Number not present in the Server - Update it
        elif (source['serialNumber']) and (not existing['serialNumber']):
            updated['serialNumber'] = source['serialNumber']
        
        # Serial Number not present in the Source - Notify to the Source
        elif (not source['serialNumber']) and (existing['serialNumber']):
            logging.info('Communicate Serial Number to Source.') # NOTE: How to do that??



    # this function compares each field from Source and Server
    # INPUT: data - Source; Response - Server
    # OUTPUT: Updated Response
    def compare_instruments(self, source: dict, existing: dict):

        # initializing the updated response
        updated = existing.copy()

        self.handle_doi(source, existing, updated)
        self.handle_serial_number(source, existing, updated)

        # Updating instrumentTypes - MAJOR UPDATE
        if source['instrumentTypes']:

            # it creates the List of the instrumentTypes' 'name' fetched from the source
            list_of_instrument_types_in_source = []
            for instrument_type in source['instrumentTypes']:
                list_of_instrument_types_in_source.append(instrument_type['name']) # NOTE: Instead of just Name, we can also compare the whole intrumentType JSON

            # it creates the List of the instrumentTypes' 'name' fetched from the server
            # NOTE: other properties in the response such as 'instrumentTypeId', 'abbreviation', 'label', etc. are not included here since we try to match just the names
            if existing['instrumentTypes']:
                list_of_instrument_types_in_server = []
                for instrument_type in existing['instrumentTypes']:
                    list_of_instrument_types_in_server.append(instrument_type['name'])

            # comparing and updating the list of 'Technique' from 'Data' with the list of 'instrumentTypes' from 'Response'
            # initialized a new variable (updated_instrument_types) for the final list of updated instruments to be returned to the server
            if set(list_of_instrument_types_in_source) != set(list_of_instrument_types_in_server):
                updated_instrument_types = []
                logging.info('Major Update') #NOTE: How to notify the developer???
                for technique_name in list_of_instrument_types_in_source:
                    updated_instrument_types.append({
                        'name': technique_name, # NOTE: We could also update/add the 'instrumentTypeId', 'abbreviation', 'label', etc. here, if known
                    })
                updated['instrumentTypes'] = updated_instrument_types
        
        
        # updating awards - MAJOR UPDATE
        if source['awards']:
            
            # it creates the List of the awards' 'awardNumber' fetched from the source
            list_of_awards_in_source = []
            for award in source['awards']:
                list_of_awards_in_source.append(award['awardNumber'])

            # it creates the List of the awards' 'awardNumber' fetched from the server
            # NOTE: other properties in the response such as 'awardId', 'title', 'startDate', 'endDate', etc. are not included here since we try to match just the awardNumber
            if existing['awards']:
                list_of_awards_in_server = []
                for award in existing['awards']:
                    list_of_awards_in_server.append(award['awardNumber'])

            # comparing and updating the list of 'Award' from 'Data' with the list of 'awards' from 'Response'
            # initialized a new variable (updatedAwards) for the final list of updated awards to be returned to the server
            if set(list_of_awards_in_source) != set(list_of_awards_in_server):
                updated_awards = []
                for award_number in list_of_awards_in_source:
                    updated_awards.append({
                        'awardNumber': award_number, # NOTE: We could also update/add the 'awardId', 'title', 'startDate', 'endDate', etc. here, if known
                    })
                updated['awards'] = updated_awards

        
        # updating contacts
        if (source['contacts']):

            # it creates the list of contacts' 'eppn' and 'role' fetched from the source 
            list_of_contacts_in_source = source['contacts'] # It only contains 'eppn' and 'role'
                
            # it creates the List of the contacts' 'eppn' and 'role' fetched from the server
            if existing['contacts']:
                list_of_contacts_in_server = []
                for contact in existing['contacts']:
                    list_of_contacts_in_server.append({
                        'eppn': contact['eppn'],
                        'role': contact['role']
                    })
                
                # comparing and updating the list of 'contact' from 'Data' with the list of 'awards' from 'Response'
                # initialized a new variable (updatedContacts) for the final list of updated contacts to be returned to the server
                if set(list_of_contacts_in_source) != set(list_of_contacts_in_server):
                    updated_contacts = []
                    for contact in list_of_contacts_in_source:
                        updated_contacts.append({
                            'eppn': contact['eppn'], # NOTE: We could also update/add the 'eppn', 'firstName', 'middleName', 'lastName', 'role', etc. here, if known
                            'role': contact['role']
                        })
                updated['contacts'] = updated_contacts


        # Updating roomNumber - MAJOR UPDATE
        if source['roomNumber']:
            if source['roomNumber'] != existing['roomNumber']:
                logging.info('Major Update') # BUG: HOw to notify the developer???
                updated['roomNumber'] = source['roomNumber']
        
        
        # Updating name
        if source['name']:
            if source['name'] != existing['name']:
                updated['name'] = source['name']

        
        # updating manufacturer
        if source['manufacturer']:
            if source['manufacturer'] != existing['manufacturer']:
                updated['manufacturer'] = source['manufacturer']
        
        
        # updating modelNumber
        if source['modelNumber']:
            if source['modelNumber'] != existing['modelNumber']:
                updated['modelNumber'] = source['modelNumber']
        
        
        # updating serialNumber
        if source['serialNumber']:
            if source['serialNumber'] != existing['serialNumber']:
                updated['serialNumber'] = source['serialNumber']
        
        
        # updating status
        if source['status']:
            if source['status'] != existing['status']:
                updated['status'] = source['status']
        
        
        # updating acquisitionDate
        if source['acquisitionDate']:
            if source['acquisitionDate'] != existing['acquisitionDate']:
                updated['acquisitionDate'] = source['acquisitionDate']
        
        
        # updating completionDate
        if source['completionDate']:
            if source['completionDate'] != existing['completionDate']:
                updated['completionDate'] = source['completionDate']
        
        
        # updating description
        if source['description']:
            if source['description'] != existing['description']:
                updated['description'] = source['description']
                
        
        # updating capabilities
        if source['capabilities']:
            if source['capabilities'] != existing['capabilities']:
                updated['capabilities'] = source['capabilities']

        
        # updating facility
        if source['institution']['facility']:
            if source['institution']['facility'] != existing['institution']['facility']:
                updated['institution']['facility'] = source['institution']['facility']

        
        # updating location
        if source['location']['building']:
            if source['location']['building'] != existing['location']['building']:
                updated['location']['building'] = source['location']['building']

        return updated
