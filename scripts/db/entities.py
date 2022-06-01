from sqlalchemy import Column, Integer, String, Date, ForeignKey, Float, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, backref

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

    def get_address(self):
        return f"{self.building}, {self.street}, {self.city}, {self.state} {self.zip}, {self.country}"

class Institution(Base):
    __tablename__ = "institution"

    institutionId = Column(Integer, primary_key = True)
    name = Column(String)

instrumentInstrumentType = Table('instrumentInstrumentType', Base.metadata,
     Column('instrumentTypeId', ForeignKey('instrumentType.instrumentTypeId'), primary_key=True),
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

instrumentAward = Table('instrumentAward', Base.metadata,
     Column('awardId', ForeignKey('award.awardId'), primary_key=True),
     Column('instrumentId', ForeignKey('instrument.instrumentId'), primary_key=True)
)

class Award(Base):
    __tablename__ = "award"

    awardId = Column(Integer, primary_key = True)
    title = Column(Integer)
    awardNumber = Column(Integer)
    startDate = Column(String)
    endDate = Column(String)

    instruments = relationship('Instrument', secondary = instrumentAward, back_populates="awards")


class Instrument(Base):
    __tablename__ = "instrument"

    instrumentId = Column(Integer, primary_key = True)
    doi = Column(String)
    name = Column(String)
    manufacturer = Column(String)
    modelNumber = Column(String)
    serialNumber = Column(String)
    acquisitionDate = Column(Date)
    completionDate = Column(Date)
    status = Column(String)
    description = Column(String)
    locationId = Column(Integer, ForeignKey('location.locationId'))
    institutionId = Column(Integer, ForeignKey('institution.institutionId'))
    replacedById = Column(Integer, ForeignKey('instrument.instrumentId'))

    location = relationship("Location")
    replaces = relationship("Instrument", backref=backref("isReplacedBy", remote_side=instrumentId))
    institution = relationship("Institution", back_populates="instruments")
    types = relationship("InstrumentType", secondary = instrumentInstrumentType, back_populates="instruments")
    awards = relationship("Award", secondary = instrumentAward, back_populates="instruments")


Institution.instruments = relationship("Instrument", back_populates="institution")


