import React, { useState, useRef } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
var config = require("../config/config").default();

export function GoogleMap (props) { 

  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [activeMarker, setActiveMarker] = useState();
  const [selectedPlace, setSelectedPlace] = useState();

  var searchResult = [];
  for (var i = 0; i < props.response.length; i++) {
    var object = {
      id: i+1,
      location: props.response[i].location,
      latitude: props.response[i].latitude,
      longitude: props.response[i].longitude
    };
    searchResult.push(object);
  };

  const onMarkerClick = (props, marker, e) => {
    setSelectedPlace(props);
    setActiveMarker(marker);
    setShowingInfoWindow(true);
  };
  
  const onMapClicked = (props) => {
    if (showingInfoWindow) {
      setActiveMarker(null);
      setShowingInfoWindow(false);
    }
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
        onClick={onMarkerClick}
        name={'Current location'}>
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
        zoom={3}
        onClick={onMapClicked}
        style={{ width: '100%', height: '100%'}}
        containerStyle={{width: "40%", height: "29%", position: "fixed"}}
        initialCenter={{
          lat: 40.854885,
          lng: -88.081807
        }}
      >
        {displayMarkers()}
        
      </Map>
  );
}

export default GoogleApiWrapper({
    apiKey: config.apiKey,
    signature: config.signature
})(GoogleMap)