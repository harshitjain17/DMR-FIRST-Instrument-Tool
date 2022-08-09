import log from 'loglevel';
import { Instrument, InstrumentSearchCriteria, InstrumentSearchRespone } from './Model';
import InstoolApi from './InstoolApi';


export default class InstrumentApi {
  static async search(criteria: InstrumentSearchCriteria): Promise<InstrumentSearchRespone> {
    const response = await InstoolApi.post(`/instruments/search`, criteria);
    log.info(`Server returned ${response.data.instruments?.length} instruments, and ${response.data.locations?.length} locations`)
    log.debug(response);
    return response.data as InstrumentSearchRespone;
  }

  static async get(doi: string): Promise<Instrument | undefined> {
    try {
      var response = await InstoolApi.get(`/instruments/${doi}`)
      log.debug(response.data);
      return response.data as Instrument;
    } catch (error) {
      log.error(`Fetching instrument details failed: ${error}`);
      return undefined;
    }
  }
}