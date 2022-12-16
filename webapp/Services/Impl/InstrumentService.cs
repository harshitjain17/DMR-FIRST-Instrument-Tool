using Instool.DAL.Helpers;
using Instool.DAL.Models;
using Instool.DAL.Repositories;
using Instool.DAL.Requests;
using Instool.Dto;
using Instool.Helpers;
using Microsoft.Extensions.Logging;

namespace Instool.Services.Impl
{
    internal partial class InstrumentService : IInstrumentService
    {
        private readonly IInstrumentRepository _repo;
        private readonly IInvestigatorRepository _investigatorRepo;
        private readonly IInstrumentTypeRepository _instrumentTypeRepo;
        private readonly ITransactionSupport _transaction;
        private readonly IAwardRepository _awardRepo;

        private readonly ILogger<InstrumentService> _logger;

        public InstrumentService(ITransactionSupport transaction,
            IInstrumentRepository repo,
            IInvestigatorRepository investigatorRepo,
            IInstrumentTypeRepository instrumentTypeRepo,
            ILogger<InstrumentService> logger,
            IAwardRepository awardRepo)
        {
            _transaction = transaction;
            _repo = repo;
            _investigatorRepo = investigatorRepo;
            _instrumentTypeRepo = instrumentTypeRepo;
            _logger = logger;
            _awardRepo = awardRepo;
        }

        public async Task<Instrument> CreateInstrument(
            Instrument entity,
            IEnumerable<InstrumentContact> contacts,
            IEnumerable<InstrumentType> types,
            IEnumerable<Award> awards)
        {
            await _transaction.ExecuteInTransaction(async () =>
            {
                await GetOrCreateInvestigators(entity, contacts);
                await _repo.Create(entity);
                await SetInstrumentTypes(entity, types);
                await SetAwards(entity, awards);
            });
            return (await _repo.GetById(entity.InstrumentId))!;
        }

        private async Task SetInstrumentTypes(Instrument entity, IEnumerable<InstrumentType> types)
        {
            foreach (var type in types)
            {
                var typeEntity = await _instrumentTypeRepo.GetByShortname(type.ShortName);
                if (typeEntity == null)
                {
                    throw new IncompleteDataException("Instrument Type", type.ShortName);
                }
                typeEntity.Instruments.Clear();
                typeEntity.Category = null;
                typeEntity.InverseCategory.Clear();
                await _repo.SetType(entity, typeEntity);
            }
        }

        private async Task SetAwards(Instrument entity, IEnumerable<Award> awards)
        {
            foreach (var award in awards)
            {
                var awardEntity = await _awardRepo.GetByAwardNumber(award.AwardNumber);
                if (awardEntity == null)
                {
                    throw new IncompleteDataException("Instrument Type", award.AwardNumber);
                }
                awardEntity.Instruments.Clear();
                awardEntity.InvestigatorOnAwards.Clear();

                await _repo.SetAward(entity, awardEntity);
            }
        }

        private async Task GetOrCreateInvestigators(Instrument entity, IEnumerable<InstrumentContact> contacts)
        {
            foreach (var contact in contacts)
            {
                var investigatorId = await GetOrCreateInvestigator(contact);

                entity.InstrumentContacts.Add(new InstrumentContact
                {
                    Instrument = entity,
                    InvestigatorId = investigatorId,
                    Role = contact.Role
                });
            }
        }

        private async Task<int> GetOrCreateInvestigator(InstrumentContact contact)
        {
            Investigator? investigator = null;
            if (contact.InvestigatorId != 0)
            {
                investigator = await _investigatorRepo.GetById(contact.InvestigatorId);
            }
            if (investigator == null && contact.Eppn != null)
            {
                investigator = await _investigatorRepo.GetByEppn(contact.Eppn);
            }
            if (contact.Investigator != null && contact.Investigator.InvestigatorId != 0)
            {
                investigator = await _investigatorRepo.GetById(contact.Investigator!.InvestigatorId);
            }
            if (investigator == null && contact.Investigator?.Eppn != null)
            {
                investigator = await _investigatorRepo.GetByEppn(contact.Investigator.Eppn);
            }
            if (investigator != null)
            {
                return investigator.InvestigatorId;
            }
            else if (contact.Investigator == null)
            {
                throw new IncompleteDataException("Investigator", contact.Eppn ?? contact.InvestigatorId.ToString());
            }
            else
            {
                return await _investigatorRepo.Create(contact.Investigator);
            }
        }


        public Task<Instrument?> GetByDoi(string doi)
        {
            return _repo.GetByDoi(doi);
        }

        public Task<Instrument?> GetById(int id)
        {
            return _repo.GetById(id);
        }

        public Task SetDoi(int id, string doi)
        {
            return _repo.SetDoi(id, doi);
        }

        public async Task<PaginatedList<InstrumentWithDistance>> Search(InstrumentSearchRequest request,
            string? sortColumn, string? sortOrder, int start, int length
            )
        {
            var locationCriteria = request.Location;
            if (locationCriteria == null || locationCriteria.MaxDistance <= 0)
            {
                var instruments = await _repo.List(request, sortColumn, sortOrder, start, length);
                var instrumentsWithDistance = instruments.Select((i) =>
                {
                    var distance = locationCriteria == null ? 0 :
                                   GetDistance(locationCriteria.Latitude, locationCriteria.Longitude, i.Location);
                    return new InstrumentWithDistance(i, distance);
                });
                return new PaginatedList<InstrumentWithDistance>(
                    instrumentsWithDistance,
                    instruments.RecordsTotal,
                    instruments.RecordsFiltered
                );
            }
            else
            {
                return await FilterByDistance(request, locationCriteria, sortColumn, sortOrder, start, length);
            }
        }

        public Task<List<Instrument>> Lookup(InstrumentLookupRequest request)
        {
            return _repo.List(request);
        }

        private async Task<PaginatedList<InstrumentWithDistance>> FilterByDistance(InstrumentSearchRequest request, SearchByLocationRequest locationCriteria, string? sortColumn, string? sortOrder, int start, int length)
        {
            List<InstrumentWithDistance> instrumentsFound = new();
            LocationFrame frame = new(locationCriteria.Latitude, locationCriteria.Longitude, locationCriteria.MaxDistance);
            _logger.LogDebug($"Searching in frame {frame.minLat}/{frame.minLng} and {frame.maxLat}/{frame.maxLng}");

            var found = await _repo.ListWithinFrame(request, sortColumn, sortOrder, frame);
            _logger.LogDebug($"Found {found.Count} instruments");
            // Filter all Institutions by distance
            foreach (var item in found)
            {
                if (item.Location.Longitude != null && item.Location.Latitude != null)
                {
                    int dist = GetDistance(locationCriteria.Latitude, locationCriteria.Longitude,
                                           item.Location);

                    if (dist < locationCriteria.MaxDistance)
                    {
                        var nearby = new InstrumentWithDistance(item, dist);
                        instrumentsFound.Add(nearby);
                    }
                }
            }
            _logger.LogDebug($"Distance filter retained {instrumentsFound.Count} Institutions");
            return new PaginatedList<InstrumentWithDistance>(instrumentsFound,  found.RecordsTotal, instrumentsFound.Count());
        }

        private int GetDistance(double lat1, double long1, Location location)
        {
            if (location == null || location.Latitude == null || location.Longitude == null)
            {
                return 0;
            }
            double long1rad = long1 / 180 * Math.PI;
            double long2rad = location.Longitude.Value / 180 * Math.PI;
            double lat1rad = lat1 / 180 * Math.PI;
            double lat2rad = location.Latitude.Value / 180 * Math.PI;

            double distRad = Math.Acos(
                Math.Sin(lat1rad) * Math.Sin(lat2rad) +
                Math.Cos(lat1rad) * Math.Cos(lat2rad) * Math.Cos(Math.Abs(long1rad - long2rad)));

            double distMiles = distRad * 6371 / 1.609;

            return (int)distMiles;
        }

        public Task<Instrument> UpdateInstrument(
            Instrument entity, 
            IEnumerable<InstrumentContact> contacts, 
            IEnumerable<InstrumentType> types, 
            IEnumerable<Award> awards)
        {
            throw new NotImplementedException();
        }
    }
}
