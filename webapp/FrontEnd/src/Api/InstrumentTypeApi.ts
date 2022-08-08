import InstoolApi from './InstoolApi';
import { InstrumentType, InstrumentTypeDropdownEntry } from './Model';

export default class InstrumentTypeApi {
  static async getCategories(): Promise<InstrumentType[]> {
    const result = await InstoolApi.get(`/instrument-types`);
    type NewType = InstrumentType;

    return result.data as NewType[];
  }

  static async getDropdownEntries(category: string | null): Promise<InstrumentTypeDropdownEntry[]> {
    const result = category ?
      // Case - I (If the user selected the category)
      await InstoolApi.get(`/instrument-types/${category}/dropdown`) :
      // Case - II (If the user did not selected the category)
      await InstoolApi.get(`/instrument-types/dropdown`);
    return result.data as InstrumentTypeDropdownEntry[];
  }
};
