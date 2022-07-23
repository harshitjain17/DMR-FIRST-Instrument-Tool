import React, { useState } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
import { config } from '../../config/config';

export function GoogleMap({locations, onSelectLocation, google}) {

  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [activeMarker, setActiveMarker] = useState();
  const [selectedLocation, setSelectedLocation] = useState();
  const [zoom, setZoom] = useState(4);
  const [center, setCenter] = useState({ lat: 37, lng: -95 });
  const [bounds, setBounds] = useState(undefined);

  // Watch locations, whenever a new search is done, we set bounds again.
  // Bounds get removed once users start to zoom or drag the map around.
  React.useEffect(() => {
    // array is undefined or empty
    if (!locations?.length) {
      setBounds(undefined);
      setCenter({ lat: 37, lng: -95 });
      setZoom(4);
    // Center if only one location
    } else if (locations.length === 1) {
      setBounds(undefined);
      setCenter({ lat: locations[0].latitude, lng: locations[0].longitude });
      setZoom(8);
    // And only set bounds to show all markers if there are more than 2
    } else {
      // Gather all locations, and let google determine which part of the map to show
      // so we see all of them.
      const boundsCalc = new google.maps.LatLngBounds()
      for (const l of (locations ?? [])) {
        boundsCalc.extend({
          lat: l.latitude,
          lng: l.longitude
        })
      }
      setBounds(boundsCalc);
    }
  // For some reaseon, eslint is complaining about the dependency on google.maps.LatLngBounds.
  // That is a class we use here, it won't change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations]);

  // Show an info window, and filter the table for instruments at that location
  const onMarkerClick = (p, marker) => {
    if (selectedLocation?.id.toString() === p.label) {
      onMarkerDeselected();
    } else {
      setSelectedLocation(locations?.find(l => l.id.toString() === p.label));
      setActiveMarker(marker);
      setShowingInfoWindow(true);
      onSelectLocation(p.label);
    }
  };

  // Called when the same marker is clicked again, or when the infobox is closed.
  // Table filter is reset and all instruments are shown again.
  const onMarkerDeselected = () => {
    setSelectedLocation(null);
    setActiveMarker(null);
    setShowingInfoWindow(false);
    onSelectLocation(null);
  }

  const displayMarkers = () => {
    return locations?.map((location, index) => {
      return <Marker
        key={index}
        id={index}
        label={location.id.toString()}
        title={`${location.building ? location.building + " @ ":""}${location.institution}, ${location.count} instrument(s)`}
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
      google={google}
      style={{ width: '100%', height: '100%', position: "static" }}
      containerStyle={{ width: "34%", height: "37.5%" }}
      bounds={bounds}
      center={center}
      zoom={zoom}
      onZoomChanged={(mapProps, event) => {
        // Remove bounds once user interacts with the map. We keep whatever they wanted to see then
        setBounds(undefined);
        setZoom(event.zoom);
      }}
      onDragend={(mapProps, event) => {
        // Remove bounds once user interacts with the map. We keep whatever they wanted to see then
        setBounds(undefined);
        setZoom(event.zoom);
        setCenter(event.center);
      }}
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