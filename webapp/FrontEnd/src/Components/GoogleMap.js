import React, { useState } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
var config = require("../config/config").default();

export function GoogleMap (props) { 

  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [activeMarker, setActiveMarker] = useState();
  const [setSelectedPlace] = useState();

  var searchResult = [];
  for (var i = 0; i < props.response.length; i++) {
    var object = {
      id: parseInt(props.response[i].label)+1,
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
  
  // const onMapClicked = (props) => {
  //   if (showingInfoWindow) {
  //     setActiveMarker(null);
  //     setShowingInfoWindow(false);
  //   }
  // };

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
        zoom={4}
        // onClick={onMapClicked}
        style={{ width: '100%', height: '100%', position: "static"}}
        containerStyle={{width: "34%", height: "32%"}}
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