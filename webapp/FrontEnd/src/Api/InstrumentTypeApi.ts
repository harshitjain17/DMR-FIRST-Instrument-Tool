import InstoolApi from './InstoolApi';

export interface IDropdownEntry {
  category: string,
  categoryLabel: string,
  subCategory: string,
  subCategoryLabel: string,
  value: string,
  label: string
}

export interface IInstrumentType {
  instrumentTypeId: number,
  name: string,
  label: string,
  uri: string,
  category: string
}

export const InstrumentTypeApi = {
  async getCategories(): Promise<IInstrumentType[]> {
    const result = await InstoolApi.get(`/instrument-types`);
    return result.data as IInstrumentType[];
  },

  async getDropdownEntries(category?: string): Promise<IDropdownEntry[]> {
    const result = category ?
      // Case - I (If the user selected the category)
      await InstoolApi.get(`/instrument-types/${category}/dropdown`) :
      // Case - II (If the user did not selected the category)
      await InstoolApi.get(`/instrument-types/dropdown`);
    return result.data as IDropdownEntry[];
  }
};
