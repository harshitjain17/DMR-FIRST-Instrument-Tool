use instool;

delete from InstrumentAward where instrumentId in (select instrumentId from instrument where name = 'TBF');
delete from InstrumentInstrumentType where instrumentId in (select instrumentId from instrument where name = 'MBE2');
delete from InstrumentContact where instrumentId in (select instrumentId from instrument where name = 'MBE2');
delete from InstrumentCapability where instrumentId in (select instrumentId from instrument where name = 'MBE2');
delete from [file] where instrumentId in (select instrumentId from instrument where name = 'MBE2');
delete from instrument where instrumentId in (select instrumentId from instrument where name = 'MBE2');


delete from InstrumentAward where instrumentId in (select instrumentId from instrument where name = 'Double Crucible Vertical Bridgman');
delete from InstrumentInstrumentType where instrumentId in (select instrumentId from instrument where name = 'Double Crucible Vertical Bridgman');
delete from InstrumentContact where instrumentId in (select instrumentId from instrument where name = 'Double Crucible Vertical Bridgman');
delete from InstrumentCapability where instrumentId in (select instrumentId from instrument where name = 'Double Crucible Vertical Bridgman');
delete from [file] where instrumentId in (select instrumentId from instrument where name = 'Double Crucible Vertical Bridgman');
delete from instrument where instrumentId in (select instrumentId from instrument where name = 'Double Crucible Vertical Bridgman');

--delete from InstrumentType;
