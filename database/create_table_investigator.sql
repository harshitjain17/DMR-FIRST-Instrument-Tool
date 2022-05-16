use [instool];
Begin transaction;
BEGIN TRY 

CREATE TABLE Investigator (
    [ID] [int] IDENTITY(1, 1) NOT NULL,
    [Eppn] varchar(50) null,
    [FirstName] varchar(255) not null,
    [MiddleName] varchar(255) null,
    [LastName] varchar(255) not null,
    [Email] varchar(255) not null,
    [Phone] varchar(25) not null,
    CONSTRAINT [PK_Investigator] PRIMARY KEY CLUSTERED (ID),
    CONSTRAINT [UK_Investigator_Eppn] UNIQUE (Eppn)
);

END TRY BEGIN CATCH IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
THROW;
END CATCH;
IF @@TRANCOUNT > 0 COMMIT TRANSACTION;

