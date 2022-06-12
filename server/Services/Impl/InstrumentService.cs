using Instool.DAL.Helpers;
using Instool.DAL.Models;
using Instool.DAL.Repositories;
using Instool.DAL.Requests;
using Instool.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Instool.Services.Impl
{
    internal class InstrumentService : IInstrumentService
    {
        private readonly IInstrumentRepository _repo;
        private readonly IInvestigatorRepository _investigatorRepository;
        private readonly ITransactionSupport _transaction;

        public InstrumentService(ITransactionSupport transaction, IInstrumentRepository repo, IInvestigatorRepository investigatorRepository)
        {
            _transaction = transaction;
            _repo = repo;
            _investigatorRepository = investigatorRepository;
        }

        public async Task<Instrument> CreateInstrument(
            Instrument entity, 
            IEnumerable<InstrumentContact> contacts)
        {
            await _transaction.ExecuteInTransaction(async () =>
            {
                await GetOrCreateInvestigators(entity, contacts);
                await _repo.Create(entity);
            });
            return (await _repo.GetById(entity.InstrumentId))!;
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
                investigator = await _investigatorRepository.GetById(contact.InvestigatorId);
            }
            if (investigator == null && contact.Eppn != null)
            {
                investigator = await _investigatorRepository.GetByEppn(contact.Eppn);
            }
            if (contact.Investigator?.InvestigatorId != 0)
            {
                investigator = await _investigatorRepository.GetById(contact.Investigator!.InvestigatorId);
            }
            if (investigator == null && contact.Investigator?.Eppn != null)
            {
                investigator = await _investigatorRepository.GetByEppn(contact.Investigator.Eppn);
            }
            if (investigator != null)
            {
                return investigator.InvestigatorId;
            }
            else if (contact.Investigator == null)
            {
                throw new IncompleteDataException("Investigator", contact.Eppn ?? contact.InvestigatorId.ToString());
            } else { 
                return await _investigatorRepository.Create(contact.Investigator);
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

        public Task<PaginatedList<Instrument>> Search(InstrumentSearchRequest request,
            string sortColumn, string sortOrder, int start, int length
            )
        {
            return _repo.InstrumentSearchRequest(request, sortColumn, sortOrder, start, length);
        }
    }
}
