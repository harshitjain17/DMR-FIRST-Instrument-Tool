def create_json(row):  # 'row' is a dictionary type here

    json_dict = {
        'name': row['Name'],
        'doi': row['doi'] or None,
        'description': row['Description'] or None,
        'capabilities': row['Capabilities'] or None,
        'manufacturer': row['Manufacturer'] or None,
        'modelNumber': row['Model Number'] or None,
        'serialNumber': row['Serial Number'] or None,
        'acquisitionDate': row['Acquisition Date'] or None,
        'completionDate': row['Completion Date'] or None,
        'roomNumber': row['Room'].strip(),
        'status': 'A',
        'institution': {
            'facility': row['Facility'],
            # row['Institution Name'] # NOTE: We currently do not have this field in the 'row' in CSV, but we need to have it for lookup purposes
            'name': 'Penn State'
        }
    }

    # handling 'location' to add in the JSON
    if (row['Location']):
        json_dict['location'] = {
            'building': row['Location']
        }

    # handling 'awards' to add in the JSON
    awards = []
    for award_number in row['Award'].split(','):
        if award_number:
            awards.append({
                'awardNumber': award_number
            })
    if len(awards) > 0:
        json_dict['awards'] = awards

    # handling 'instrumentTypes' to add in the JSON
    instrument_types = []
    for technique_name in row['Technique'].split(','):
        if technique_name:
            instrument_types.append({
                'name': technique_name
            })
    if len(instrument_types) > 0:
        json_dict['instrumentTypes'] = instrument_types

    # handling 'contacts' to add in the JSON
    contacts = []
    PSU_DOMAIN = '@psu.edu'

    for i in range(1, 4):  # NOTE: taking into account at most 3 Faculty contacts as of now
        value = row.get('Faculty Contact {}'.format(i))
        if (value):
            if not '@' in value:
                value = value + PSU_DOMAIN  # NOTE: Considering just PSU contacts as of now
            contacts.append({
                'eppn': value,
                'role': 'Faculty'  # F = Faculty Role
            })

    for i in range(1, 4):  # NOTE: taking into account at most 3 Technical contacts as of now
        value = row.get('Technical Contact {}'.format(i))
        if (value):
            if not '@' in value:
                value = value + PSU_DOMAIN  # NOTE: Considering just PSU contacts as of now
            contacts.append({
                'eppn': value,
                'role': 'Technical'  # T = Technical Role
            })

    if len(contacts) > 0:
        json_dict['contacts'] = contacts

    if row.get('Image'):
        filename = row.get('Image').split('/')[-1]
        json_dict['images_to_upload'] = [
            {
                'file': row.get('Image'),
                'filename': filename
            }
        ]

    return json_dict
