import datetime
import json
import config.datacite as conf

def write_json_file(dict, filename):
    with open(filename + ".json", "w") as writer:
        writer.write(json.dumps(dict, indent=4))


def get_related_identifiers(instrument):
    result = []
    if (instrument.isReplacedBy):
        result.append({
            "relatedIdentifier": instrument.isReplacedBy.doi,
            "relatedIdentifierType": "DOI",
            "relationType": "isPreviousVersionOf"
        })
    for old in instrument.replaces:
        result.append({
            "relatedIdentifier": old.doi,
            "relatedIdentifierType": "DOI",
            "relationType": "IsNewVersionOf"
        })
    return result


def get_awards(instrument):
    result = []
    for a in instrument.awards:
        result.append({
            "funderName": "National Science Foundation",
            "awardNumber": a.awardNumber,
            "awardTitle": a.title
        })
    return result


def create_data_cite_json(instrument):
    currentDate = datetime.date.today()

    instrumentTypes = []
    for t in instrument.types:
        instrumentType = {
            "subject": t.name,
        }
        if (t.uri):
            instrumentType["valueUri"] = t.uri
        instrumentTypes.append(instrumentType)

    json_dict = {
        #            "id": "doi",
        "type": "dois",
        "attributes": {
            "prefix":
            conf.doi_prefix,
            # or use doi "doi": "doi"
            "event": "draft",
            "creators": [{
                "creatorName": instrument.manufacturer,
                "nameIdentifier": "?"
            }],
            "titles": [{
                "title": instrument.name,
                "titleType": "Other"
            }],
            "publisher": conf.doi_publisher,
            "publicationYear": currentDate.year,
            "subjects": instrumentTypes,
            "dates": [{
                "date": str(instrument.completionDate),
                "dateType": "Available"
            }],
            "types": {
                "resourceType": "Instrument",
                "resourceTypeGeneral": "Other"
            },
            "descriptions": [{
                "description": instrument.description,
                "descriptionType": "Abstract"
            }],
            "geolocations": [{
                "geoLocationPlace": instrument.location.get_address(),
                "geoLocationPoint": {
                    "pointLongitude": instrument.location.longitude,
                    "pointLatitude": instrument.location.latitude
                }
            }],
            "fundingReferences": [],
            "url": "https://m4-instool/instrument/{}".format(instrument.instrumentId),
            "schemaVersion": "http://datacite.org/schema/kernel-4"
        }
    }
    relatedIdentifiers = get_related_identifiers(instrument)
    if relatedIdentifiers:
        json_dict["attributes"]["relatedIdentifiers"] = relatedIdentifiers

    awards = get_awards(instrument)
    if awards:
        json_dict["attributes"]["fundingReferences"] = awards

    return json_dict
