import React, { Component } from 'react';
import { Map, Marker, InfoWindow, GoogleApiWrapper } from 'google-maps-react';

export class MapContainer extends Component {
    state = {
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {},
    };
    
    onMarkerClick = (props, marker, e) =>
        this.setState({
        selectedPlace: props,
        activeMarker: marker,
        showingInfoWindow: true
        });
    
    onMapClicked = (props) => {
        if (this.state.showingInfoWindow) {
        this.setState({
            showingInfoWindow: false,
            activeMarker: null
        })
        }
    };
    
    render() {
        return (
        <Map
            google={this.props.google} 
            style = {{width: "50%", height: "50%", margin: "10px auto"}}
            zoom = {10}
            initialCenter = {
                {
                    lat: 40.816170,
                    lng: -77.856911
                }
            }
            onClick={this.onMapClicked}>
            <Marker onClick={this.onMarkerClick}
                    name={'Current location'}/>
            <InfoWindow
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}>
                    <div>
                        <h1>{this.state.selectedPlace.name}</h1>
                    </div>
            </InfoWindow>
        </Map>
        );
    };
};

export default GoogleApiWrapper({
    apiKey: 'AIzaSyBpBSoUVpBiDRhaTZu1fY6_LcSHhZEp2I4'
  })(MapContainer)




