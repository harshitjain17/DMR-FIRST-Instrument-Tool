from asyncio.windows_events import NULL
import pandas as pd
#from sqlalchemy.engine import URL
import sqlalchemy as sa
import dbconf
import sys, getopt

SelectInstrument = """
    Select i.InstrumentID, i.DOI, i.MANUFACTURER, i.[COMPLETION DATE], o.Name as [Owner], i.DESCRIPTION, i.[MODEL NUMBER]
    from Instrument i JOIN Institution o ON i.InstitutionID = o.InstitutionID 
    WHERE i.instrumentID = ?;
    """
SelectTypes = "Select Name, Uri from InstrumentType t JOIN InstrumentInstrumentType it ON t.InstrumentTypeID=it.InstrumentTypeID where it.InstrumentID = ?"

HelpMessage = "export_instrument.py -i instrumentId"

def createExport(id):
    connectionString = 'DRIVER={ODBC Driver 17 for SQL Server};SERVER='+dbconf.server+';DATABASE='+dbconf.database+';UID='+dbconf.username+';PWD='+ dbconf.password
    connectionUrl = sa.engine.URL.create("mssql+pyodbc", query={"odbc_connect": connectionString})
    engine = sa.create_engine(connectionUrl)
    instrument = pd.read_sql(SelectInstrument, engine, params=[id])
    types = pd.read_sql(SelectTypes, engine, params=[id])




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