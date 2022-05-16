use [instool];
Begin transaction;
BEGIN TRY 

CREATE TABLE InvestigatorOnAward (
    [InvestigatorID] [int] NOT NULL,
    [AwardID] [int] NOT NULL,
    [Role] varchar(1) not null,
    CONSTRAINT [PK_InvestigatorOnAward] PRIMARY KEY CLUSTERED (InvestigatorID, AwardID),
    CONSTRAINT [FK_InvestigatorOnAward_Investigator] FOREIGN KEY (InvestigatorID) REFERENCES Investigator (ID),
    CONSTRAINT [FK_InvestigatorOnAward_Award] FOREIGN KEY (AwardID) REFERENCES Award (ID)
);

END TRY BEGIN CATCH IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
THROW;
END CATCH;
IF @@TRANCOUNT > 0 COMMIT TRANSACTION;

