import { Instrument, InstrumentType } from "./Model";

export function getInstrumentTypeLabel(i: InstrumentType) {
    return i.label + (i.abbreviation ? ` (${i.abbreviation})` : "");
}

export function getCategories(instrument: Instrument): string[] {
    const categories = instrument.instrumentTypes?.map(t => t?.category?.category)
        .concat(instrument.instrumentTypes?.map(t => t?.category))
        // Remove null (in case an instrument returns a level 1 or 2 type as it's type, so .category.category is null)
        .filter(type => type !== null && type !== undefined) as InstrumentType[];
        
    return categories
        // We only show the label anyway
        .map(type => type.label)
        // And now remove duplicates
        // In case an instrument is used for two characterization techniques, we want to see Characterization once
        .filter((item, index, list) => list.indexOf(item) === index);
}