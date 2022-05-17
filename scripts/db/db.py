import sqlalchemy as sa

def connect(dbconf):
    connectionString = 'DRIVER={ODBC Driver 17 for SQL Server};SERVER='+dbconf.server+';DATABASE='+dbconf.database+';UID='+dbconf.username+';PWD='+ dbconf.password
    connectionUrl = sa.engine.URL.create("mssql+pyodbc", query={"odbc_connect": connectionString})
    return sa.create_engine(connectionUrl)
