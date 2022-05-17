from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import sys, getopt

import db.dbconf as dbconf
import db.db as db
from db.entities import Instrument

HelpMessage = "export_instrument.py -i instrumentId"

def createExport(id):
    engine = db.connect(dbconf)

    Session = sessionmaker(bind = engine)
    session = Session()

    for i in session.query(Instrument).all():
        print ("ID: {} Name: {}, Types: [{}] ".format(i.instrumentId, i.name, ", ".join(x.name for x in i.types)))



def main(argv):
    instId = 6;
    try:
        opts, args = getopt.getopt(argv,"hi:",["instrument="])
    except getopt.GetoptError:
        print(HelpMessage)
        sys.exit(2)
    for opt, arg in opts:
      if opt == '-h':
         print(HelpMessage)
         sys.exit()
      elif opt in ("-i", "--instrument"):
         instId = arg
    if instId == -1:
         print(HelpMessage)
         sys.exit()
    createExport(instId)


if __name__ == "__main__":
   main(sys.argv[1:])


# with open('data/types.csv', encoding='utf-8-sig') as csvfile:
#     reader = csv.reader(csvfile, dialect='excel')
#     currentCategories = [None] * 5
#     for row in reader:
#         level, name = next((x, val) for x, val in enumerate(row) if val)
#         currentCategories[level] = name
#         print("{level}: {name}".format(level=level, name=name))
#         # That's a top-level category
#         if (level == 0): 
#             cursor.execute(insertTopLevel, name)
#         else:
#             cursor.execute(insert, name, currentCategories[level -1 ])
       
#     cnxn.commit()

# cursor.close()
# cnxn.close()