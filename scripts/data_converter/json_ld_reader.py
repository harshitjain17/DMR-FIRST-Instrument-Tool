"""Fetch structured JSON-LD data from a given URL, based on https://hackersandslackers.dev/scrape-metadata-json-ld/
"""
import requests
import extruct
from w3lib.html import get_base_url


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
    return req.text


def get_metadata(html, url):
    """Fetch JSON-LD structured data."""
    metadata = extruct.extract(
        html,
        base_url=get_base_url(html, url),
        syntaxes=['json-ld'],
    )['json-ld'][0]
    return metadata


def get_instrument_data(url: str):
    html = get_html(url)
    metadata = get_metadata(html, url)
    json_ld = metadata['@graph'][0]
    return map_to_instool_json(json_ld)


def map_to_instool_json(json_ld: dict) -> dict:
    json_dict = {
        'name': json_ld.get('name'),
        'doi': json_ld.get('identifier') or None,
        'description': json_ld.get('description') or None,
        'capabilities': json_ld.get('capabilities') or None,
        'manufacturer': (json_ld.get('manufacturer') or {}).get('name'),
        'modelNumber': json_ld.get('model') or None,
        'serialNumber': json_ld.get('serial_number') or None,
        'acquisitionDate': None,
        'completionDate': None,
        'roomNumber': json_ld.get('room').strip(),
        'status': 'A',
        'institution': {
            'facility': json_ld.get('facility'),
            'name': 'Penn State'
        }
    }

    award_number = json_ld.get('funding') and json_ld.get('funding').get('identifier')
    if award_number:
        json_dict['awards'] = [{
            'awardNumber': award_number
        }]

    # handling 'instrumentTypes' to add in the JSON
    technique_name = json_ld.get('category')
    if technique_name:
        json_dict['instrumentTypes'] = {
            'name': technique_name
        }

    return json_dict
