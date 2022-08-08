export interface SearchLocation {
    address: string,
    latitude: number,
    longitude: number,
    maxDistance: number
}

export interface ILocationResult {
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

export interface InstrumentSearchRespone {
    instruments: InstrumentRow[],
    locations: ILocationResult[]
}

export interface InstrumentSearchCriteria {
    location?: {
        latitude: number,
        longitude: number,
        maxDistance: number
    },
    instrumentTypeId?: number,
    instrumentType?: string,
    keywords: string[],
    awardId?: number,
    awardNumber: string,
    manufacturer: string,
    manufacturerOrModel?: string,
    includeRetired: boolean
}