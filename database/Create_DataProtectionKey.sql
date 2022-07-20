use [2DCC_local]
GO

Begin transaction;
BEGIN TRY

Create Table LiST_DataProtectionKeys (
	ID int IDENTITY(1,1) not null,
	FriendlyName varchar(max) not null,
	Xml varchar(max) not null,
	CONSTRAINT PK_LiST_DataProtectionKey PRIMARY KEY CLUSTERED (ID),
);


END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
    THROW;
END CATCH;

IF @@TRANCOUNT > 0
    COMMIT TRANSACTION;
GO


