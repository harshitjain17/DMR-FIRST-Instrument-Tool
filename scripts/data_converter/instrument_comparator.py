
import logging


class InstrumentConflict(Exception):
    # Exception raised for unexepcted Server results
    def __init__(self, instrument: str, message: str):
        self.message = message
        self.instrument = instrument

    def __str__(self):
        return 'Error {self.code} - {self.message}'


class InstrumentComparisonResult:
    """ Container for updated data (json == dict) and the following flags
        * is_modified - true if any modification was detected and an update should be sent to the server
        * is_major_update - true if the modification might require a new DOI. 
        * notify_doi - a doi is present on the server, but not the source. Source should be notified
        * register_doi - instrument has no DOI. DOI should be registered (and send to the source).
    """
    is_modified = False
    is_major_update = False
    notify_doi = False
    register_doi = False

    def __init__(self, data: dict):
        self.data = data.copy()

    def modify(self, key: str, data, major_update=False):
        self.is_modified = True
        self.data[key] = data

    def check(self, key: str, source: dict, existing: dict, major_update=False):
        # Negating turns it into a bool, so None and '' considered to be equal.
        # We don't want to update Null to '' or the other way round.
        if (not source.get(key)) != (not existing.get(key)) and source.get(key) != existing.get(key):
            self.modify(key, source.get(key), major_update)

class InstrumentComparator:

    def compare_doi(self, source: dict, existing: dict, comparisonResult: InstrumentComparisonResult) -> InstrumentComparisonResult:
        """Compare DOIs. Possible outcomes are 
           * conflicts (source and server have different DOIs)
           * DOI needs to be registered
           * DOI present on the server, has to be communicated back to the source
           """

        # DOIs are not same in Server and Source - DOI Conflict
        if source.get('doi') and existing.get('doi') and source['doi'] != existing['doi']:
            raise InstrumentConflict(
                source.get['name'], f"DOI Conflict: Source doi {source['doi']} is different than doi on server {existing['doi']}")

        # DOI not present in the Server - Update it
        elif (source.get('doi')) and (not existing.get('doi')):
            comparisonResult.modify('doi', source['doi'])

        # DOI not present in the Source - Notify to the Source
        elif (not source.get('doi')) and (existing.get('doi')):
            comparisonResult.notify_doi = True

        # Server and Source do not have DOI - Register DOI
        elif (not source.get('doi')) and (not existing.get('doi')):
            comparisonResult.register_doi = True
        return comparisonResult

    def handle_serial_number(self, source: dict, existing: dict, comparisonResult: InstrumentComparisonResult) -> InstrumentComparisonResult:
        """Compare the serial numbers. Those can be added, but source and server should never have different number. That will be reported as a conflict.
           """

        # Serial Numbers are not same in Server and Source - Serial Number Conflict
        if source['serialNumber'] and existing['serialNumber'] and source['serialNumber'] != existing['serialNumber']:
            raise InstrumentConflict(
                source.get('name'), f"Serial nubmer conflict: Source serial number {source['serialNumber']} is different from # on server {existing['serialNumber']}")

        # Serial Number not present in the Server - Update it
        elif (source.get('serialNumber')) and (not existing.get('serialNumber')):
            comparisonResult.modify('serialNumber', existing.get('seralNumber'))

        return comparisonResult

    def compare_instruments(self, source: dict, existing: dict) -> InstrumentComparisonResult:
        """ This function compares each field from Source and Server
            The output contains the updated json (dict), if updates are required,
            as well as flags indicating which differences were found
        """

        result = InstrumentComparisonResult(existing)

        result = self.compare_doi(source, existing, result)
        result = self.handle_serial_number(source, existing, result)

        # Updating instrumentTypes - MAJOR UPDATE
        # We can assume that the instrument types are immutable in DMR First - if the name matches, it's the same type. We do not compare further fields.
        list_of_instrument_types_in_source = []
        for instrument_type in source.get('instrumentTypes', []):
            list_of_instrument_types_in_source.append(instrument_type['name'])

        list_of_instrument_types_in_server = []
        for instrument_type in existing.get('instrumentTypes', []):
            list_of_instrument_types_in_server.append(instrument_type['name'])

        # comparing and updating the list of 'Technique' from 'Data' with the list of 'instrumentTypes' from 'Response'
        if set(list_of_instrument_types_in_source) != set(list_of_instrument_types_in_server):
            names = list(map(lambda n: {"name": n}, list_of_instrument_types_in_source))

            result.modify('instrumentTypes', names, major_update=True)

        # updating awards - MAJOR UPDATE
        list_of_awards_in_source = []
        for award in source.get('awards', []):
            list_of_awards_in_source.append(award['awardNumber'])

        # Awards are immutable, so as long as the award number matches, it's the same award.
        list_of_awards_in_server = []
        for award in existing.get('awards', []):
            list_of_awards_in_server.append(award['awardNumber'])

        # comparing and updating the list of 'Award' from 'Data' with the list of 'awards' from 'Response'
        if set(list_of_awards_in_source) != set(list_of_awards_in_server):
            result.modify('awards', list_of_awards_in_source, major_update=True)

        # updating contacts
        # Create lists of only eppn and role. That's all we need to decide if there is a modification
        list_of_contacts_in_source = []
        for contact in source.get('contacts', []):
            list_of_contacts_in_source.append(f"{contact['role']}-{contact['eppn']}")

        list_of_contacts_in_server = []
        for contact in existing.get('contacts', []):
            list_of_contacts_in_server.append(f"{contact['role']}-{contact['eppn']}")

        # comparing and updating the list of contacts from source with those from the server
        if set(list_of_contacts_in_source) != set(list_of_contacts_in_server):
            result.modify('contacts', source.get('contacts', []))

        result.check('roomNumber', source, existing, major_update=True)
        result.check('name', source, existing)
        result.check('manufacturer', source, existing)
        result.check('modelNumber', source, existing)
        result.check('serialNumber', source, existing)
        result.check('status', source, existing)
        result.check('acquisitionDate', source, existing)
        result.check('completionDate', source, existing)
        result.check('description', source, existing)
        result.check('capabilities', source, existing)

        # updating facility - Institutions do have to exist.
        if source['institution'].get('facility') != existing['institution'].get('facility'):
            result.modify('institution', source['institution'])

        # Checking Location - make sure this does not cause errors if there is no location.
        if source.get('location', []).get('building') != existing.get('location', []).get('building'):
            result.is_modified = True
            if not result.data.get('location'):
                result.modify('location', [])
            result.data['location']['building'] = source['location']['building']

        return result
