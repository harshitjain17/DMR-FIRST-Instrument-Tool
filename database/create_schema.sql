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
    [Phone] varchar(25) null,
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
    [Longitude] float null,
    CONSTRAINT [PK_Location] PRIMARY KEY CLUSTERED (LocationID)
);

CREATE TABLE Institution (
    [InstitutionID] [int] IDENTITY(1, 1) NOT NULL,
    [Name] varchar(255) not null,
    CONSTRAINT [PK_Institution] PRIMARY KEY CLUSTERED (InstitutionID)
);

CREATE TABLE [Instrument] (
    [InstrumentID] int IDENTITY(1, 1) NOT NULL,
    [Doi] varchar(255) NULL,
    [Name] varchar(255) NOT NULL,
	[Manufacturer] varchar(255) NULL,
	[ModelNumber] varchar(255) NULL,
	[SerialNumber] varchar(255) NULL,
	[AcquisitionDate] date NULL,
	[CompletionDate] date NULL,
	[Status] varchar(255) NOT NULL,
	[Description] varchar(max) NOT NULL,
    [LocationID] int not null,
    [RoomNumber] varchar(25) null,
    [InstitutionID] int not null,
    [ReplacedByID] int null,
    CONSTRAINT [PK_Instrument] PRIMARY KEY CLUSTERED (InstrumentID),
    CONSTRAINT [FK_Instrument_Location] FOREIGN KEY (LocationID) REFERENCES Location (LocationID),
    CONSTRAINT [FK_Instrument_Institutiuon] FOREIGN KEY (InstitutionID) REFERENCES Institution (InstitutionID),
    CONSTRAINT [FK_Instrument_Instrument] FOREIGN KEY (ReplacedByID) REFERENCES Instrument (InstrumentID)
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
    [ShortName] varchar(50) not null,
    [Label] varchar(255) not null,
    [Uri] varchar(255) null,
    [CategoryId] int null,
    CONSTRAINT [PK_InstrumentType] PRIMARY KEY CLUSTERED (InstrumentTypeID),
    CONSTRAINT [UK_InstrumentType] UNIQUE NONCLUSTERED (ShortName),
    CONSTRAINT [FK_InstrumentType_InstrumentType] FOREIGN KEY (CategoryId) REFERENCES InstrumentType (InstrumentTypeID)
);

CREATE TABLE InstrumentInstrumentType (
    [InstrumentTypeID] [int] NOT NULL,
    [InstrumentID] [int] NOT NULL,
    CONSTRAINT [PK_InstrumentInstrumentType] PRIMARY KEY CLUSTERED (InstrumentTypeID, InstrumentID),
    CONSTRAINT [FK_InstrumentInstrumentType_InstrumentType] FOREIGN KEY (InstrumentTypeID) REFERENCES InstrumentType (InstrumentTypeID),
    CONSTRAINT [FK_InstrumentInstrumentType_Instrument] FOREIGN KEY (InstrumentID) REFERENCES Instrument (InstrumentID)
);


CREATE TABLE ExpertForInstrumentType (
    [InvestigatorID] [int] NOT NULL,
    [InstrumentTypeID] [int] NOT NULL,
    CONSTRAINT [PK_ExportForInstrumentType] PRIMARY KEY CLUSTERED (InvestigatorID, [InstrumentTypeID]),
    CONSTRAINT [FK_ExportForInstrumentType_Investigator] FOREIGN KEY (InvestigatorID) REFERENCES Investigator (InvestigatorID),
    CONSTRAINT [FK_ExportForInstrumentType_InstrumentType] FOREIGN KEY (InstrumentTypeID) REFERENCES InstrumentType (InstrumentTypeID)
);

CREATE TABLE InstrumentAward (
    [InstrumentID] [int] NOT NULL,
    [AwardID] [int] NOT NULL,
    CONSTRAINT [PK_InstrumentAward] PRIMARY KEY CLUSTERED (InstrumentID, AwardID),
    CONSTRAINT [FK_InstrumentAward_Instrument] FOREIGN KEY (InstrumentID) REFERENCES Instrument (InstrumentID),
    CONSTRAINT [FK_InstrumentAward_Award] FOREIGN KEY (AwardID) REFERENCES Award (AwardID)
);

CREATE TABLE [dbo].[Role](
	[RoleId] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](255) NOT NULL,
 CONSTRAINT [PK_Role] PRIMARY KEY CLUSTERED (RoleId)
);

CREATE TABLE [dbo].[RolePrivilege](
    [PrivilegeId] int IDENTITY(1, 1) NOT NULL, 
	[Name] [varchar](255) NOT NULL,
	[RoleID] [int] NOT NULL,
	[Read] [bit] NOT NULL,
	[Create] [bit] NOT NULL,
	[Update] [bit] NOT NULL,
	[Delete] [bit] NOT NULL,
	[Submit] [bit] NOT NULL,
 CONSTRAINT [PK_RolePrivilege] PRIMARY KEY CLUSTERED ([PrivilegeId]),
 CONSTRAINT [UK_RolePrivilege] UNIQUE NONCLUSTERED (Name, RoleId),
 CONSTRAINT [FK_RolePrivilege_Role] FOREIGN KEY (RoleId) REFERENCES Role (RoleId),
);

CREATE TABLE [dbo].[ApiKey](
	[ApiKeyId] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](255) NOT NULL,
	[Hash] [varchar](255) NOT NULL,
	[RoleId] [int] NOT NULL,
	[Created] [datetime] NOT NULL,
	[ValidTo] [datetime] NULL,
	[AllowInternalApi] [bit] NOT NULL,
 CONSTRAINT [PK_ApiKey_ID] PRIMARY KEY CLUSTERED (ApiKeyId),
 CONSTRAINT [UK_ApiKey_Name] UNIQUE NONCLUSTERED (Name),
 CONSTRAINT [FK_ApiKey_Role] FOREIGN KEY (RoleId) REFERENCES Role (RoleId),
);

CREATE TABLE [dbo].[FILE](
    [FileId] [int] IDENTITY(1,1) NOT NULL,
    [Filename] [varchar](255) NOT NULL,
    [Content] [varchar](max) NOT NULL,
    [InstrumentID] [int] NOT NULL,
    CONSTRAINT [PK_File] PRIMARY KEY CLUSTERED (FileID),
    CONSTRAINT [FK_File_Instrument] FOREIGN KEY (InstrumentID) REFERENCES Instrument (InstrumentID)
)

set identity_insert Role on;
insert into Role (RoleID, Name) values (1, 'Community');
insert into Role (RoleID, Name) values (2, 'Admin');
set identity_insert Role off;

insert into RolePrivilege 
(Name, RoleId, [Create], [Read], [Update], [Delete], Submit)
values
('Instrument', 1, 0, 1, 0, 0, 0);

insert into RolePrivilege 
(Name, RoleId, [Create], [Read], [Update], [Delete], Submit)
values
('InstrumentType', 1, 0, 1, 0, 0, 0);

insert into RolePrivilege 
(Name, RoleId, [Create], [Read], [Update], [Delete], Submit)
values
('Award', 1, 0, 1, 0, 0, 0);

insert into RolePrivilege 
(Name, RoleId, [Create], [Read], [Update], [Delete], Submit)
values
('Publication', 1, 0, 1, 0, 0, 0);


insert into RolePrivilege 
(Name, RoleId, [Create], [Read], [Update], [Delete], Submit)
values
('Instrument', 2, 1, 1, 1, 1, 1);

insert into RolePrivilege 
(Name, RoleId, [Create], [Read], [Update], [Delete], Submit)
values
('InstrumentType', 2, 1, 1, 1, 1, 1);

insert into RolePrivilege 
(Name, RoleId, [Create], [Read], [Update], [Delete], Submit)
values
('Award', 2, 1, 1, 1, 1, 1);

insert into RolePrivilege 
(Name, RoleId, [Create], [Read], [Update], [Delete], Submit)
values
('Publication', 2, 1, 1, 1, 1, 1);

insert into RolePrivilege 
(Name, RoleId, [Create], [Read], [Update], [Delete], Submit)
values
('ApiKey', 2, 1, 1, 1, 1, 1);

insert into RolePrivilege 
(Name, RoleId, [Create], [Read], [Update], [Delete], Submit)
values
('Role', 2, 1, 1, 1, 1, 1);

insert into RolePrivilege 
(Name, RoleId, [Create], [Read], [Update], [Delete], Submit)
values
('User', 2, 1, 1, 1, 1, 1);

END TRY BEGIN CATCH IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
THROW;
END CATCH;
IF @@TRANCOUNT > 0 COMMIT TRANSACTION;

