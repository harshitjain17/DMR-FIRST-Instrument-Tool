from asyncio.windows_events import NULL
import pyodbc
import config.db as dbconf
import csv

cnxn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER='+dbconf.server+';DATABASE='+dbconf.database+';UID='+dbconf.username+';PWD='+ dbconf.password)
cursor = cnxn.cursor()

insertTopLevel = "Insert into InstrumentType (Name) values (?)"
insert = "Insert into InstrumentType (Name, Category) (select ?, InstrumentTypeId from InstrumentType where Name = ?)"

with open('data/types.csv', encoding='utf-8-sig') as csvfile:
    reader = csv.reader(csvfile, dialect='excel')
    currentCategories = [None] * 5
    for row in reader:
        level, name = next((x, val) for x, val in enumerate(row) if val)
        currentCategories[level] = name
        print("{level}: {name}".format(level=level, name=name))
        # That's a top-level category
        if (level == 0): 
            cursor.execute(insertTopLevel, name)
        else:
            cursor.execute(insert, name, currentCategories[level -1 ])
       
    cnxn.commit()

cursor.close()
cnxn.close()