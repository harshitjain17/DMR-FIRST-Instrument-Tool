import React, { useState } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
var config = require("../config/config").default();

export function GoogleMap(props) {

  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [activeMarker, setActiveMarker] = useState();
  const [selectedLocation, setSelectedLocation] = useState();
  const [newZoom, setNewZoom] = useState(4);

  const searchResult = props.response.locations || [];

  // Gather all locations, and let google determine which part of the map to show
  // so we see all of them.
  const bounds = new google.maps.LatLngBounds()
  for (const l of searchResult) {
    bounds.extend({
        lat: l.latitude,
        lng: l.longitude
    })
  }

  // Show an info window, and filter the table for instruments at that location
  const onMarkerClick = (p, marker) => {
    if (selectedLocation?.id.toString() === p.label) {
      onMarkerDeselected();
    } else {
      setSelectedLocation(searchResult.find(l => l.id.toString() === p.label));
      setActiveMarker(marker);
      setShowingInfoWindow(true);
      setNewZoom(p.map.zoom); //bug: it sets the new value of zoom but <Map> component is not rendered after setting the value 
      props.onSelectLocation(p.label);
    }
  };

  // Called when the same marker is clicked again, or when the infobox is closed.
  // Table filter is reset and all instruments are shown again.
  const onMarkerDeselected = () => {
    setSelectedLocation(null);
    setActiveMarker(null);
    setShowingInfoWindow(false);
    props.onSelectLocation(null);
  }

  const displayMarkers = () => {
    return searchResult.map((location, index) => {
      return <Marker
        key={index}
        id={index}
        label={location.id.toString()}
        position={{
          lat: location.latitude,
          lng: location.longitude
        }}
        onClick={onMarkerClick}>
      </Marker>
    })
  };

  return (
    <Map
      google={props.google}
      style={{ width: '100%', height: '100%', position: "static" }}
      containerStyle={{ width: "34%", height: "37.5%" }}
      bounds={bounds}
      initialCenter={{lat: 37, lng: -95}}
      zoom={newZoom}
    >
      {displayMarkers()}
      <InfoWindow
        marker={activeMarker}
        visible={showingInfoWindow}
        onClose={onMarkerDeselected}>
        <div>
          <h6>{selectedLocation?.building ?? selectedLocation?.institution}</h6>
          <p>{selectedLocation?.count} instrument(s)</p>
        </div>
      </InfoWindow>
    </Map>
  );
}

export default GoogleApiWrapper({
  apiKey: config.apiKey,
  signature: config.signature
})(GoogleMap)