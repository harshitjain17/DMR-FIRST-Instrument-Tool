import log from 'loglevel';
import { InstrumentSearchCriteria, InstrumentSearchRespone } from '../Utils/InstrumentSearchTypes';
import InstoolApi from './InstoolApi';

export default class InstrumentApi {
  static async search(criteria: InstrumentSearchCriteria): Promise<InstrumentSearchRespone> {
    const result = await InstoolApi.post(`/instruments/search`, criteria);
    log.info(`Server returned ${result.data.instruments?.length} instruments, and ${result.data.locations?.length} locations`)
    log.debug(result);
    return result.data as InstrumentSearchRespone;
  }
}