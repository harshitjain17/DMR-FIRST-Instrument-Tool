// Entities

export interface Award {
    awardId: number,
    title: string,
    awardNumber: string,
    startDate: string,
    endDate: string
}


export interface Location {
    locationId: number,
    building?: string,
    street: string,
    city: string,
    state: string,
    zip: string,
    country: string,
    latitude?: number,
    longitude?: number
}

export interface Institution {
    institutionId: number,
    name: string,
    facility: string
}



export interface Instrument {
    instrumentId: number,
    doi: string,
    manufacturer?: string,
    modelNumber?: string,
    acquisitionDate?: string,
    completionDate?: string,
    status: string,
    description: string,
    capabilities?: string,
    roomNumber?: string,
    name: string,
    serialNumber?: string,
    location?: Location,
    institution: Institution,
    awards: Award[],
    instrumentTypes: InstrumentType[],
    contacts: Investigator[],
    images: string[]
}


export interface InstrumentType {
    instrumentTypeId: number,
    abbreviation?: string,
    name: string,
    label: string,
    uri?: string,
    category?: InstrumentType
}

export interface Investigator {
    investigatorId: number,
    eppn: string,
    firstName: string,
    middleName: string,
    lastName: string,
    email: string,
    phone: string,
    role: string
}

// Instrument types with categories, as need to populate drop downs in the instrument search tool
export interface InstrumentTypeDropdownEntry {
    category: string,
    categoryLabel: string,
    subCategory: string,
    subCategoryLabel: string,
    value: string,
    label: string
}


export interface SearchLocation {
    address: string,
    latitude: number,
    longitude: number,
    maxDistance: number
}

export interface InstrumentSearchCriteria {
    location?: {
        latitude: number;
        longitude: number;
        maxDistance: number;
    };
    instrumentTypeId?: number;
    instrumentType?: string;
    keywords: string[];
    awardId?: number;
    awardNumber: string;
    manufacturer: string;
    manufacturerOrModel?: string;
    includeRetired: boolean;
}

export interface InstrumentSearchRespone {
    instruments: InstrumentRow[],
    locations: LocationResult[]
}


export interface LocationResult {
    id: number;
    dbId: number,

    institution: string;
    building: string;
    latitude: number,
    longitude: number

    count: number;
}


export interface InstrumentRow {
    instrumentId: number,
    label: string,
    doi?: string,
    name: string,
    type: string,
    status: string,
    institution?: string,
    facility?: string,
    city: string,
    location: number,
    distance?: number,
    state: string,
    award?: string,
    manufacturer?: string,
    model?: string
}

