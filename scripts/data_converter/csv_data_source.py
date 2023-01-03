def create_json(row): # 'row' is a dictionary type here
    
    json_dict = {
        'name': row['Name'],
        'doi': row['doi'],
        'description': row['Description'],
        'capabilities': row['Capabilities'],
        'manufacturer': row['Manufacturer'],
        'modelNumber': row['Model Number'],
        'serialNumber': row['Serial Number'],
        'acquisitionDate': row['Acquisition Date'],
        'completionDate': row['Completion Date'],
        'roomNumber': row['Room'].strip(),
        'status': 'A',
        'institution' : {
            'facility': row['Facility'],
            'name': 'The Pennsylvania State University' # row['Institution Name'] # NOTE: We currently do not have this field in the 'row' in CSV, but we need to have it for lookup purposes
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
    
    for i in range(1, 4): # NOTE: taking into account atmost 3 Faculty contacts as of now
        value = row.get('Faculty Contact {}'.format(i))
        if (value):
            if not '@' in value:
                value = value + PSU_DOMAIN # NOTE: Considering just PSU contacts as of now
            contacts.append({
                'eppn': value,
                'role': 'F' # F = Faculty Role
            })
    
    for i in range(1, 4): # NOTE: taking into account atmost 3 Technical contacts as of now
        value = row.get('Technical Contact {}'.format(i))
        if (value):
            if not '@' in value:
                value = value + PSU_DOMAIN # NOTE: Considering just PSU contacts as of now
            contacts.append({
                'eppn': value,
                'role': 'T' # T = Technical Role
            })

    if len(contacts) > 0:
        json_dict['contacts'] = contacts
    
    return json_dict

