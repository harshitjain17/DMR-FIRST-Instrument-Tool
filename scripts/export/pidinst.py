from lxml import etree as ET

def write_xml_file(xml, filename):
    with open(filename + ".xml", "wb") as writer:
        writer.write(
            ET.tostring(xml,
                        pretty_print=True,
                        xml_declaration=True,
                        encoding="UTF8"))


def add_content(xml, name, content, type_attribute="", type=""):
    sub = ET.SubElement(xml, name)
    sub.text = content if content is not None else "n/a"
    if (type_attribute):
        sub.attrib[type_attribute] = type


def create_xml(instrument):
        xml = ET.Element("instrument")
        add_content(xml, "identifier", instrument.doi, "identifierType", "DOI")
        add_content(xml, "landingPage", "https://m4-instool/instrument/{}".format(instrument.instrumentId))
        add_content(xml, "name", instrument.name)
        if (instrument.institution):
            owners = ET.SubElement(xml, "owners")
            owner = ET.SubElement(owners, "owner")
            add_content(owner, "ownerName", instrument.institution.name)
            #addContent(owner, "ownerIdentifier", i.institution.ID, "ownerIdentifierType", "?")
        if (instrument.manufacturer):
            manufacturers = ET.SubElement(xml, "manufacturers")
            manufacturer = ET.SubElement(manufacturers, "manufacturer")
            add_content(manufacturer, "manufacturerName", instrument.manufacturer)
            #addContent(manufacturer, "manufacturerIdentifier", i.manufacturerID, "manufacturerIdentifierType", "?")
        if (instrument.modelNumber):
            model = ET.SubElement(xml, "model")
            add_content(model, "modelName", instrument.modelNumber)
        add_content(xml, "description", instrument.description)
        types = ET.SubElement(xml, "instrumentTypes")
        for t in instrument.types:
            type = ET.SubElement(types, "instrumentType")
            add_content(type, "instrumentTypeName", t.name)
            if (t.uri):
                add_content(type, "instrumentTypeIdentifier", t.uri,
                            "instrumentTypeIdentifierType", "category")
        dates = ET.SubElement(xml, "dates")
        add_content(dates, "date", str(instrument.completionDate), "dateType",
                    "Commissioned")
        relatedIdentifiers = ET.SubElement(xml, "relatedIdentifiers")
        if (instrument.isReplacedBy):
            add_content(relatedIdentifiers, "relatedIdentifier",
                        instrument.isReplacedBy.doi, "relatedIdentifierType",
                        "IsPreviousVersionOf")
        for old in instrument.replaces:
            add_content(relatedIdentifiers, "relatedIdentifier", old.doi,
                        "relatedIdentifierType", "IsNewVersionOf")
        if (instrument.serialNumber):
            alternateIdentifiers = ET.SubElement(xml, "alternateIdentifiers")
            add_content(alternateIdentifiers, "alternateIdentifier",
                        instrument.serialNumber, "alternateIdentifierType",
                        "SerialNumber")
        return xml
