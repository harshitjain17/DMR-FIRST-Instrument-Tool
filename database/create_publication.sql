USE [instool]
GO

CREATE TABLE [dbo].[Publication](
	[PublicationId] [int] IDENTITY(1, 1) NOT NULL,
	[Doi] [varchar](50) NULL,
	[Title] [varchar](255) NULL,
	[Authors] [varchar](255) NULL,
	[Journal] [varchar](255) NULL,
	[Year] [int] NULL,
	CONSTRAINT PK_Publication PRIMARY KEY CLUSTERED (PublicationId),
)

CREATE TABLE [dbo].[PublicationInstrument](
	[InstrumentId] [int] NOT NULL,
	[PublicationId] [int] NOT NULL,
	CONSTRAINT PK_PublicationInstrument PRIMARY KEY CLUSTERED (InstrumentId, PublicationId),
	CONSTRAINT FK_PublicationInstrument_Publication FOREIGN KEY (PublicationID) REFERENCES Publication(PublicationId) ON DELETE CASCADE,
	CONSTRAINT FK_PublicationInstrument_Instrument FOREIGN KEY (InstrumentId) REFERENCES Instrument(InstrumentId) ON DELETE CASCADE,
) 
GO


