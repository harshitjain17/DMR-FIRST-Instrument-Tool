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

export enum InstrumentStatus {
    Active = 'A',
    Retired = 'R',
    InProgress = 'P'
}

export interface Instrument {
    instrumentId: number,
    doi: string,
    manufacturer?: string,
    modelNumber?: string,
    acquisitionDate?: string,
    completionDate?: string,
    status: InstrumentStatus,
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

/**
 * Instrument types with categories, as needed to populate drop downs in the instrument search tool
 */
export interface InstrumentTypeDropdownEntry {
    category: string,
    categoryLabel: string,
    subCategory: string,
    subCategoryLabel: string,
    /** 
     * A textual ID, which is unique and can be used to fetch data for that instrument type.
     * Will also be used part of the instrument type URI
     */
    shortname: string,
    /** 
     * A well-known abbreviation, that is used in the table and shown in paranthesis in the dropdown
     * It's optional, if there is no well-known abbrevation, the label is used.
     */
    abbreviation?: string, 
    /**
     * The official name of the instrument type, not using any abbreviations
     */
    label: string
}

/**
 * The search location, with the user entered address and maximal distance,
 * as well as the geocoordinates returned by google. 
 * 
 */
export interface SearchLocation {
    address: string,
    latitude: number,
    longitude: number,
    maxDistance: number
}

/**
 * Search criteria that the server expectes
 */
export interface InstrumentSearchCriteria {
    /**
     * Filter for instrument nearer than max distance (as the crow flies)
     */
    location?: {
        latitude: number;
        longitude: number;
        maxDistance: number;
    };
    /** Optional, only one of instrumentTypeId and InstrumentType should be used */
    instrumentTypeId?: number;
    /** Optional, only one of instrumentTypeId and InstrumentType should be used */
    instrumentType?: string;
    /** Do an AND-search for all keywords. Keywords can be part of description, capabilities, instrument names, manufacturer, or model */
    keywords: string[];
    /** internal Instool database ID for awards */
    awardId?: number;
    /** The official NSF DRM award number */
    awardNumber: string;
    /** 
     * @deprecated Use keywords only
     * 
     * Search both manufacturer and model field. If several words are entered,
     * an AND-search is performed, where each word has to be found in either manufacturer or model
     */
    manufacturerOrModel?: string;
    includeRetired: boolean;
}

export interface InstrumentSearchRespone {
    instruments: InstrumentRow[],
    locations: LocationResult[]
}

/**
 * Instruments found by a search are grouped by location, 
 * and one locationResult is send per location. 
 * 
 * Used to show one marker on the map per location, with institution, building, and number of instruments
 * in tooltips and info popups.
 */
export interface LocationResult {
    id: number;
    dbId: number,

    institution: string;
    building: string;
    latitude: number,
    longitude: number
    /** nb. of instruments found at this location */
    count: number;
}

/**
 * The server only returns what needs to be shown in the table, which is part of the instrument data model.
 */
export interface InstrumentRow {
    /** database id */
    instrumentId: number,
    label: string,
    doi?: string,
    name: string,
    /** instrument type, abbrevation if available. Could be comma seperated list */
    type: string,
    status: InstrumentStatus,
    institution?: string,
    facility?: string,
    city: string,
    /** 
     * id of location, corresponds to the locations returend together with the instrument rows. 
     * 
     * Used to filter for instruments at one location when a location is selected in the map.
     */
    location: number,
    /**
     * Distance in miles. This in only returned if an search by addres is performed.
     */
    distance?: number,
    state: string,
    award?: string,
    manufacturer?: string,
    model?: string
}

