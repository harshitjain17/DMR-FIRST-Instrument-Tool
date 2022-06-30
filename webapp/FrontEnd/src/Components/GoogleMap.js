import React from 'react';
import './GoogleMap.css';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
var config = require("../config/config").default();

export function GoogleMap (props) { 

  var searchResult = [];
  for (var i = 0; i < props.response.length; i++) {
    var object = {
      latitude: props.response[i].latitude,
      longitude: props.response[i].longitude
    };
    searchResult.push(object);
  };

  const displayMarkers = () => {
    return searchResult.map((store, index) => {
      return <Marker
              key={index}
              id={index}
              position={{
                lat: store.latitude,
                lng: store.longitude
              }}
              onClick={() => console.log("You clicked me!")} />
    })
  };
  return (
      <Map
        google={props.google}
        zoom={8}
        style={{ width: '100%', height: '100%'}}
        initialCenter={{ lat: 47.444, lng: -70.176}}
      >
        {displayMarkers()}
      </Map>
  );
}

export default GoogleApiWrapper({
    apiKey: config.apiKey,
    signature: config.signature
})(GoogleMap)