from sqlalchemy import Column, Integer, String, Date, ForeignKey, Float, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Location(Base):
    __tablename__ = "location"

    locationId = Column(Integer, primary_key = True)
    building = Column(String)
    street = Column(String)
    city = Column(String)
    state = Column(String)
    zip = Column(String)
    country = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)


class Institution(Base):
    __tablename__ = "institution"

    institutionId = Column(Integer, primary_key = True)
    name = Column(String)

instrumentInstrumentType = Table('instrumentInstrumentType', Base.metadata,
     Column('InstrumentTypeId', ForeignKey('instrumentType.instrumentTypeId'), primary_key=True),
     Column('instrumentId', ForeignKey('instrument.instrumentId'), primary_key=True)
)

class InstrumentType(Base):
    __tablename__ = "instrumentType"

    instrumentTypeId = Column(Integer, primary_key = True)
    uri = Column(String)
    name = Column(String)
    categoryId = Column(Integer, ForeignKey('instrumentType.instrumentTypeId'))

    category = relationship("InstrumentType")
    instruments = relationship('Instrument', secondary = instrumentInstrumentType, back_populates="types")

class Instrument(Base):
    __tablename__ = "instrument"

    instrumentId = Column(Integer, primary_key = True)
    doi = Column(String)
    name = Column(String)
    manufacturer = Column(String)
    modelNumber = Column(String)
    acquisitionDate = Column(Date)
    completionDate = Column(Date)
    status = Column(String)
    description = Column(String)
    locationId = Column(Integer, ForeignKey('location.locationId'))
    institutionId = Column(Integer, ForeignKey('institution.institutionId'))

    location = relationship("Location")
    institution = relationship("Institution", back_populates="instruments")
    types = relationship('InstrumentType', secondary = instrumentInstrumentType, back_populates="instruments")

Institution.instruments = relationship("Instrument", back_populates="institution")


