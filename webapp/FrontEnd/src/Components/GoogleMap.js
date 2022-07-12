import React, { useState } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
var config = require("../config/config").default();

export function GoogleMap(props) {

  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [activeMarker, setActiveMarker] = useState();
  const [setSelectedPlace] = useState();

  const searchResult = [];
  const location = props.response.location;
  // Might be '0', so using == intentionally
  // eslint-disable-next-line eqeqeq
  const zoom = !location?.maxDistance || location.maxDistance == 0 ? 4 : location?.maxDistance > 100 ? 7 : 8
  
  const center = {
    lat: location?.latitude ?? 37,
    lng: location?.longitude ?? -95
  }

  if (props.response.data) {
    for (const instrument of props.response?.data) {
      const object = {
        id: instrument.label,
        latitude: instrument.latitude,
        longitude: instrument.longitude
      };
      searchResult.push(object);
    };
  }

  const onMarkerClick = (props, marker, e) => {
    setSelectedPlace(props);
    setActiveMarker(marker);
    setShowingInfoWindow(true);
  };

  const displayMarkers = () => {
    return searchResult.map((store, index) => {
      return <Marker
        key={index}
        id={index}
        label={store.id.toString()}
        position={{
          lat: store.latitude,
          lng: store.longitude
        }}
        onClick={onMarkerClick}>
        <InfoWindow
          marker={activeMarker}
          visible={showingInfoWindow}>
          <div>
            <h1>{store.location}</h1>
          </div>
        </InfoWindow>
      </Marker>

    })
  };

  return (
    <Map
      google={props.google}
      zoom={zoom}
      // onClick={onMapClicked}
      style={{ width: '100%', height: '100%', position: "static" }}
      containerStyle={{ width: "34%", height: "37.5%" }}
      center = {center}
      initialCenter = {center}
    >
      {displayMarkers()}

    </Map>
  );
}

export default GoogleApiWrapper({
  apiKey: config.apiKey,
  signature: config.signature
})(GoogleMap)