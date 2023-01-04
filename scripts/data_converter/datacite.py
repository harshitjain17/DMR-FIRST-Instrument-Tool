import datetime
import json
import config.datacite as conf

def write_json_file(dict, filename):
    with open(filename + ".json", "w") as writer:
        writer.write(json.dumps(dict, indent=4))


def get_related_identifiers(instrument):
    result = []
    if ('isReplacedBy' in instrument):
        result.append({
            "relatedIdentifier": instrument['isReplacedBy']['doi'],
            "relatedIdentifierType": "DOI",
            "relationType": "isPreviousVersionOf"
        })
    if 'replaces' in instrument:
        for old in instrument['replaces']:
            result.append({
                "relatedIdentifier": old['doi'],
                "relatedIdentifierType": "DOI",
                "relationType": "IsNewVersionOf"
            })
    return result


def get_awards(instrument):
    result = []
    for a in instrument['awards']:
        result.append({
            "funderName": "National Science Foundation",
            "awardNumber": a['awardNumber'],
            "awardTitle": a['title']
        })
    return result

def get_location(instrument):
    result = []
    if 'location' in instrument:
        l = instrument['location'];
        address = "{}, {}, {} {}, {}".format(l['street'], l['city'], l['state'], l['zip'], l['country'])
        if 'building' in l:
            address = l['building'] + ', ' + address

        result.append({
            'geoLocationPlace': address,
            'geoLocationPoint': {
                "pointLongitude": instrument['location']['longitude'],
                "pointLatitude": instrument['location']['latitude']
            }
        })
    return result

def update_doi_json(doi):
    json_dict = {
        "id": doi,
        "type": "dois",
        # "event": "draft",
        "attributes": {
            "url": "https://m4-instool.vmhost.psu.edu/instrument/{}".format(doi),
            "schemaVersion": "http://datacite.org/schema/kernel-4"
        }
    }
    return json_dict

def register_doi_json(instrument):
    currentDate = datetime.date.today()

    instrumentTypes = []
    for t in instrument['instrumentTypes']:
        instrumentType = {
            "subject": t['label'],
        }
        if ('uri' in t and t['uri']):
            instrumentType["valueUri"] = t['uri']
        instrumentTypes.append(instrumentType)

    json_dict = {
        "type": "dois",
        "attributes": {
            "prefix": conf.doi_prefix,
            "event": "draft",
            "creators": [{
                "creatorName": instrument.get('manufacturer'),
                "nameIdentifier": "?"
            }],
            "titles": [{
                "title": instrument['name'],
                "titleType": "Other"
            }],
            "publisher": conf.doi_publisher,
            "publicationYear": currentDate.year,
            "subjects": instrumentTypes,
            "types": {
                "resourceType": "Instrument",
                "resourceTypeGeneral": "Other"
            },
            "descriptions": [{
                "description": instrument.get('description'),
                "descriptionType": "Abstract"
            }],
            "fundingReferences": [],
            "url": "https://m4-instool.vmhost.psu.edu/instrument/{}".format(instrument['instrumentId']),
            "schemaVersion": "http://datacite.org/schema/kernel-4"
        }
    }
    if 'completionDate' in instrument:
        json_dict["dates"] = [{
            "date": str(instrument['completionDate']),
            "dateType": "Available"
        }],
    relatedIdentifiers = get_related_identifiers(instrument)
    if relatedIdentifiers:
        json_dict["attributes"]["relatedIdentifiers"] = relatedIdentifiers

    awards = get_awards(instrument)
    if awards:
        json_dict["attributes"]["fundingReferences"] = awards

    location = get_location(instrument)
    if (location):
        json_dict["attributes"]["geoLocations"] = location

    return json_dict
