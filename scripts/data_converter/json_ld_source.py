"""Fetch structured JSON-LD data from a given URL, based on https://hackersandslackers.dev/scrape-metadata-json-ld/
"""
import requests
import unicodedata
import extruct
from w3lib.html import get_base_url

from apis.server_error import ServerError


def get_html(url):
    """Get raw HTML from a URL."""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '3600',
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0'
    }
    req = requests.get(url, headers=headers)
    if req.status_code != 200:
        raise ServerError({}, req.status_code, req.text)
    return req.text


def get_metadata(html, url):
    """Fetch JSON-LD structured data."""
    metadata = extruct.extract(
        html,
        base_url=get_base_url(html, url),
        syntaxes=['json-ld'],
    )['json-ld']
    if len(metadata) != 1:
        raise Exception("That doesn't look like an instrument web page with JSON-LD information.")
    return metadata[0]


def get_instrument_data(url: str):
    html = get_html(url)
    metadata = get_metadata(html, url)
    if metadata['@context'] != 'https://schema.org':
        raise Exception(f"That doesn't look like an instrument web page, @context was {metadata['@context']}")
    json_ld = metadata['@graph'][0]
    if json_ld['@type'] != 'ResearchInstrument':
        raise Exception(f"That doesn't look like an instrument web page, @type was {json_ld['@type']}")
    return map_to_instool_json(url, json_ld)


def map_contact(json_ld: dict) -> dict:
    if json_ld.get('@type') != 'Person':
        raise Exception(f"source data is no valid instrument type json-ld", json_ld)

    eppn = json_ld.get('identifier')
    if not eppn:
        # TODO: Fix. normaly, there should be an identifier field!
        eppn = json_ld['url'].split('/')[-1] + '@psu.edu'
    givenName = json_ld.get('givenName')
    familyName = json_ld.get('familyName')

    if not givenName or not familyName and json_ld.get('name'):
        nameParts = json_ld['name'].split()
        if len(nameParts) > 1:
            givenName = nameParts[0]
            familyName = nameParts[-1]
    contact = {
        'eppn': eppn,
        'firstName': givenName,
        'lastName': familyName,
        'jobTitle': json_ld.get('jobTitle'),
        'email':  json_ld.get('email') or eppn,
        'role': 'Technical'  # T = Technical Role
    }
    return contact

def format(input: str):
    input = unicodedata.normalize('NFKD', input)
    if not input:
        return None
    if not '\t' in input:    
        return input.strip().replace('\n','<br>')
    output = '<ul>'
    for line in input.split('\t'):
        trimmed = line.strip()
        if (trimmed):
            output += f"<li>{trimmed}</li>"
    output += '<ul>'
    return output

def map_to_instool_json(url: str, json_ld: dict) -> dict:
    json_dict = {
        'name': json_ld.get('name'),
        'description': format(json_ld.get('description')) or "",
        'capabilities': format(json_ld.get('capabilities')) or None,
        'manufacturer': (json_ld.get('manufacturer') or {}).get('name'),
        'modelNumber': json_ld.get('model') or None,
        'serialNumber': json_ld.get('serial_number') or None,
        'acquisitionDate': None,
        'completionDate': None,
        'sourceUrl': url,
        'roomNumber': json_ld.get('room').strip(),
        'status': 'A',
        'institution': {
            'facility': json_ld.get('facility'),
            'name': 'Penn State'
        }
    }
    

    doi = json_ld['identifier'].split(".org/")[-1] if json_ld.get('identifier') else None            
    json_dict['doi'] = doi

    funding = json_ld.get('funding')
    if funding:
        if funding.get('@type') != 'Grant' or funding.get('funder').get('name') != 'National Science Foundation':
            raise Exception(f"Only NSF grants can be handled so far.", json_ld)

        award_number = funding.get('identifier')
        if award_number:
            json_dict['awards'] = [{
                'awardNumber': award_number
            }]

    # handling 'instrumentTypes' to add in the JSON
    technique_name = json_ld.get('category')
    if technique_name:
        json_dict['instrumentTypes'] = [{'name': technique_name}]

    # handling 'contacts' to add in the JSON
    contacts = []

    research_experts = json_ld.get('research_experts')
    for contact in research_experts:
        contacts.append(map_contact(contact))

    if len(contacts) > 0:
        json_dict['contacts'] = contacts

    place = json_ld['location']
    if place.get('@type') != 'Place':
        raise Exception(f"source data is no valid instrument type json-ld", json_ld)
    json_dict['location'] = {
        'building': place['name'],
        'street': place['address'].get('streetAddress'),
        'city': place['address'].get('addressLocality'),
        'state': place['address'].get('addressRegion'),
        'zip': place['address'].get('postalCode'),
        'country': place['address'].get('addressCountry'),
    }

    images = []
    for image in json_ld.get('image') or []:
        if image.get('@type') != 'ImageObject':
            raise Exception(f"source data is no valid instrument type json-ld", json_ld)
        filename = image.get('url').split('/')[-1]
        images.append(
            {
                'url': image['url'],
                'filename': filename
            }
        )

    if images:
        json_dict['images_to_upload'] = images

    return json_dict
