use [instool];
Begin transaction;
BEGIN TRY 

CREATE TABLE Award (
    [ID] [int] IDENTITY(1, 1) NOT NULL,
    [Titles] varchar(255) not null,
    [AwardNumber] varchar(25) not null,
    [StartDate] datetime not null,
    [EndDate] datetime null,
    CONSTRAINT [PK_Award] PRIMARY KEY CLUSTERED (ID)
);

END TRY BEGIN CATCH IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
THROW;
END CATCH;
IF @@TRANCOUNT > 0 COMMIT TRANSACTION;

