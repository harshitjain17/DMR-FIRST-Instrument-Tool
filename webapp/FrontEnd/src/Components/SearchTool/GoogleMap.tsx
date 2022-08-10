import React, { Fragment, useState } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow, IGoogleApiOptions, markerEventHandler, IProvidedProps } from 'google-maps-react';
import { config } from '../../config/config';
import useMediaQuery from '@mui/material/useMediaQuery';
import 'google.maps';

import { ILocationResult } from '../../Api/InstrumentApi';

interface MapProps {
  onSelectLocation: (address: string | undefined | null) => void,
  locations: ILocationResult[],
  googleApiOptions: IGoogleApiOptions
}

export function GoogleMap({ locations, onSelectLocation, googleApiOptions }: MapProps) {

  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [activeMarker, setActiveMarker] = useState<google.maps.Marker>();
  const [selectedLocation, setSelectedLocation] = useState<ILocationResult>();
  const [zoom, setZoom] = useState(4);
  const [center, setCenter] = useState<google.maps.LatLngLiteral | undefined>({ lat: 37, lng: -95 });
  const [bounds, setBounds] = useState<google.maps.LatLngBounds | undefined>(undefined);
  const [map, setMap] = useState<google.maps.Map | undefined>(undefined);

  // Watch locations, whenever a new search is done, we set bounds again.
  // Bounds get removed once users start to zoom or drag the map around.
  React.useEffect(() => {
    // array is undefined or empty -> show map of usa
    if (!locations?.length) {
      setBounds(undefined);
      setCenter({ lat: 37, lng: -95 });
      setZoom(4);
      // Center if only one location, zoom in
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

  }, [locations]);

  // Show an info window, and filter the table for instruments at that location
  const onMarkerClick: markerEventHandler = (props, marker) => {
    if (!marker || selectedLocation?.id.toString() === marker.getLabel()?.text) {
      onMarkerDeselected();
    } else {
      setSelectedLocation(locations?.find(l => l.id.toString() === marker.getLabel()?.text));
      setActiveMarker(marker);
      setShowingInfoWindow(true);
      onSelectLocation(marker.getLabel()?.text);
    }
  };

  // Called when the same marker is clicked again, or when the infobox is closed.
  // Table filter is reset and all instruments are shown again.
  const onMarkerDeselected = () => {
    setSelectedLocation(undefined);
    setActiveMarker(undefined);
    setShowingInfoWindow(false);
    onSelectLocation(undefined);
  }

  const displayMarkers = () => {
    return locations?.map((location, index) => {
      return <Marker
        key={index}
        label={location.id.toString()}
        title={`${location.building ? location.building + " @ " : ""}${location.institution}, ${location.count} instrument(s)`}
        position={{
          lat: location.latitude,
          lng: location.longitude
        }}
        onClick={onMarkerClick} />
    })
  };

  // breakpoints for responsiveness
  const xlargeScreen = useMediaQuery('(min-width:2560px)');

  return (
    <Fragment>
      <Map
        google={google}
        style={{ width: '100%', height: '100%', position: "static", border: xlargeScreen ? '8px solid white' : '5px solid white' }}
        containerStyle={{ width: "35vw", height: xlargeScreen ? '46vh' : '41vh' }}
        bounds={bounds}
        center={center}
        zoom={zoom}
        onZoomChanged={(mapProps, map, event) => {
          // Remove bounds once user interacts with the map. We keep whatever they wanted to see then
          setBounds(undefined);
          setZoom(event.zoom);
        }}
        onDragend={(mapProps, map, event) => {
          // Remove bounds once user interacts with the map. We keep whatever they wanted to see then
          setBounds(undefined);
          setZoom(event.zoom);
          setCenter(event.center);
        }}
        onReady={(mapProps, map) => { setMap(map); }}
      >
        {displayMarkers()}
        {
          map && activeMarker &&
          <InfoWindow
            map={map}
            marker={activeMarker as google.maps.Marker}
            visible={showingInfoWindow}
            onClose={onMarkerDeselected}>
            <div>
              <h6>{selectedLocation?.building ?? selectedLocation?.institution}</h6>
              <p>{selectedLocation?.count} instrument(s)</p>
            </div>
          </InfoWindow>
        }
      </Map>
    </Fragment>
  );
}

export default GoogleApiWrapper(
  () => ({
    apiKey: config.apiKey,
    signature: config.signature
  }))<MapProps & IProvidedProps>(GoogleMap)