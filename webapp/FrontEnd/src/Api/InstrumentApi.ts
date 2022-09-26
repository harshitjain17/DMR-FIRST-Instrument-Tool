import log from 'loglevel';
import { Instrument, InstrumentSearchCriteria, InstrumentSearchRespone as InstrumentSearchResponse } from './Model';
import InstoolApi from './InstoolApi';

export default class InstrumentApi {

  static async search(criteria: InstrumentSearchCriteria): Promise<InstrumentSearchResponse> {
    const response = await InstoolApi.post(`/instruments/search`, criteria);
    log.info(`Server returned ${response.data.instruments?.length} instruments, and ${response.data.locations?.length} locations`)
    log.debug(response);
    return response.data as InstrumentSearchResponse;
  }

  static async lookup(criteria: InstrumentSearchCriteria): Promise<Instrument | undefined> {
    try {
      const response = await InstoolApi.post(`/instruments/lookup`, criteria);
      log.debug(response.data);
      return response.data as Instrument;
    } catch (error) {
      log.error(`Fetching instrument details failed: ${error}`);
      return undefined;
    }
  }

  static async get(doi: string): Promise<Instrument | undefined> {
    try {
      const response = await InstoolApi.get(`/instruments/${doi}`)
      log.debug(response.data);
      return response.data as Instrument;
    } catch (error) {
      log.error(`Fetching instrument details failed: ${error}`);
      return undefined;
    }
  }
}