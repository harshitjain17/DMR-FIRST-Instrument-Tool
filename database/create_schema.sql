use [instool];
Begin transaction;
BEGIN TRY 

CREATE TABLE Award (
    [AwardID] [int] IDENTITY(1, 1) NOT NULL,
    [Title] varchar(255) not null,
    [AwardNumber] varchar(25) not null,
    [StartDate] datetime not null,
    [EndDate] datetime null,
    CONSTRAINT [PK_Award] PRIMARY KEY CLUSTERED (AwardID),
    CONSTRAINT [UK_Award_Number] UNIQUE (AwardNumber)
);

CREATE TABLE Investigator (
    [InvestigatorID] [int] IDENTITY(1, 1) NOT NULL,
    [Eppn] varchar(50) null,
    [FirstName] varchar(255) not null,
    [MiddleName] varchar(255) null,
    [LastName] varchar(255) not null,
    [Email] varchar(255) not null,
    [Phone] varchar(25) not null,
    CONSTRAINT [PK_Investigator] PRIMARY KEY CLUSTERED (InvestigatorID),
    CONSTRAINT [UK_Investigator_Eppn] UNIQUE (Eppn)
);

CREATE TABLE InvestigatorOnAward (
    [InvestigatorID] [int] NOT NULL,
    [AwardID] [int] NOT NULL,
    [Role] varchar(1) not null,
    CONSTRAINT [PK_InvestigatorOnAward] PRIMARY KEY CLUSTERED (InvestigatorID, AwardID),
    CONSTRAINT [FK_InvestigatorOnAward_Investigator] FOREIGN KEY (InvestigatorID) REFERENCES Investigator (InvestigatorID),
    CONSTRAINT [FK_InvestigatorOnAward_Award] FOREIGN KEY (AwardID) REFERENCES Award (AwardID)
);

CREATE TABLE [Location] (
    [LocationID] [int] IDENTITY(1, 1) NOT NULL,
    [Building] varchar(255) null,
    [Street] varchar(255) not null,
    [City] varchar(255) not null,
    [State] varchar(255) null,
    [Zip] varchar(255) not null,
    [Country] varchar(255) not null,
    [Latitude] float null,
    [Longitue] float null,
    CONSTRAINT [PK_Location] PRIMARY KEY CLUSTERED (LocationID)
);

CREATE TABLE Institution (
    [InstitutionID] [int] IDENTITY(1, 1) NOT NULL,
    [Name] varchar(255) not null,
    CONSTRAINT [PK_Institution] PRIMARY KEY CLUSTERED (InstitutionID)
);

CREATE TABLE [Instrument] (
    [InstrumentID] int IDENTITY(1, 1) NOT NULL,
    [DOI] varchar(255) NOT NULL,
	[MANUFACTURER] varchar(255) NOT NULL,
	[MODEL NUMBER] varchar(255) NOT NULL,
	[ACQUISITION DATE] date NOT NULL,
	[COMPLETION DATE] date NOT NULL,
	[STATUS] varchar(255) NOT NULL,
	[DESCRIPTION] varchar(max) NOT NULL,
    [LocationID] int not null,
    [RoomNumber] varchar(25) null,
    [InstitutionID] int not null,
    CONSTRAINT [PK_Instrument] PRIMARY KEY CLUSTERED (InstrumentID),
    CONSTRAINT [FK_Instrument_LOCATION] PRIMARY KEY CLUSTERED (LocationID)
)


CREATE TABLE InstrumentContact (
    [InvestigatorID] [int] NOT NULL,
    [InstrumentID] [int] NOT NULL,
    [Role] varchar(1) not null,
    CONSTRAINT [PK_InstrumentContact] PRIMARY KEY CLUSTERED (InvestigatorID, InstrumentID),
    CONSTRAINT [FK_InstrumentContact_Investigator] FOREIGN KEY (InvestigatorID) REFERENCES Investigator (InvestigatorID),
    CONSTRAINT [FK_InstrumentContact_Instrument] FOREIGN KEY (InstrumentID) REFERENCES Instrument (InstrumentID)
);


CREATE TABLE InstrumentType (
    [InstrumentTypeID] [int] IDENTITY(1, 1) NOT NULL,
    [Name] varchar(255) not null,
    [Uri] varchar(255) null,
    [Category] int null,
    CONSTRAINT [PK_InstrumentType] PRIMARY KEY CLUSTERED (InstrumentTypeID),
    CONSTRAINT [FK_InstrumentType_InstrumentType] FOREIGN KEY (Category) REFERENCES InstrumentType (InstrumentTypeID)
);

CREATE TABLE InstrumentInstrumentType (
    [InstrumentTypeID] [int] NOT NULL,
    [InstrumentID] [int] NOT NULL,
    [Role] varchar(1) not null,
    CONSTRAINT [PK_InstrumentInstrumentType] PRIMARY KEY CLUSTERED (InstrumentTypeID, InstrumentID),
    CONSTRAINT [FK_InstrumentInstrumentType_InstrumentType] FOREIGN KEY (InstrumentTypeID) REFERENCES InstrumentType (InstrumentTypeID),
    CONSTRAINT [FK_InstrumentInstrumentType_Instrument] FOREIGN KEY (InstrumentID) REFERENCES Instrument (InstrumentID)
);


END TRY BEGIN CATCH IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
THROW;
END CATCH;
IF @@TRANCOUNT > 0 COMMIT TRANSACTION;

