import json
import requests
from requests.auth import HTTPBasicAuth
from sqlalchemy.orm import sessionmaker, joinedload
from sqlalchemy.ext.declarative import declarative_base
import sys
import getopt

import config.db as dbconf
import config.datacite as datacite
import db.db as db
from db.entities import Instrument, Award
from export.data_cite import create_data_cite_json, write_json_file
from export.pidinst import create_xml, write_xml_file

help_message = "register_doi.py -i instrumentId"


def get_instrument(id):
    engine = db.connect(dbconf)

    Session = sessionmaker(bind=engine)
    session = Session()

    return session.query(Instrument).options(joinedload(Instrument.types)).filter_by(instrumentId=id).first()


def main(argv):
    instrument_id = 6
    try:
        opts, args = getopt.getopt(argv, "hi:", ["instrument="])
    except getopt.GetoptError:
        print(help_message)
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print(help_message)
            sys.exit()
        elif opt in ("-i", "--instrument"):
            instrument_id = arg
        if instrument_id == -1:
            print(help_message)
            sys.exit()
    instrument = get_instrument(instrument_id)
    if (instrument.doi):
        print(f"{instrument.name} already has DOI {instrument.doi}")
        sys.exit()
    data = {
        "data": create_data_cite_json(instrument)
    }
    headers = {
        "Content-Type": "application/vnd.api+json"
    }
    # result = requests.post(datacite.url, json=data, headers=headers, auth = HTTPBasicAuth(datacite.user, datacite.password))
    # if result.status_code == 201:
    #     try:
    #         result = json.load(result)
    #         doi = result.data.id
    #         print(f"Sucessfully registered, doi is {doi}")
    #         instrument.doi = doi
    #     except:
    #         print(result.text)
    # else: 
    #         print(result.text)

if __name__ == "__main__":
    main(sys.argv[1:])
