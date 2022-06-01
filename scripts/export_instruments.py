import json
from sqlalchemy.orm import sessionmaker, joinedload
from sqlalchemy.ext.declarative import declarative_base
import sys
import getopt

import config.db as dbconf
import db.db as db
from db.entities import Instrument, Award
from export.data_cite import create_data_cite_json, write_json_file
from export.pidinst import create_xml, write_xml_file

help_message = "export_instrument.py -i instrumentId"


def get_instrument(id):
    engine = db.connect(dbconf)

    Session = sessionmaker(bind=engine)
    session = Session()

    return session.query(Instrument).options(joinedload(Instrument.types)).filter_by(instrumentId=id).first()


def main(argv):
    instrument_id = 6
    try:
        opts, args = getopt.getopt(argv, "hi:e:", ["instrument=", "export="])
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
        if (opt in ("-e", "--export")):
            instrument = get_instrument(instrument_id)
            if arg == "DataCite":
                dict = create_data_cite_json(instrument)
                write_json_file(dict, "data/" + instrument.name)
            else:
                xml = create_xml.pidinst(instrument)
                write_xml_file(xml, "data/" + instrument.name)


if __name__ == "__main__":
    main(sys.argv[1:])
