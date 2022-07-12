import axios from 'axios';
var config = require("../config/config").default();

class GoogleApi {
    static async getCoordinates(address) {
        try {
            if (!address) {
                // center to US
                return [37, -95];
            }
            const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: address,
                    key: config.apiKey,
                }
            })
            var lat = response.data.results[0].geometry.location.lat;
            var lng = response.data.results[0].geometry.location.lng;
            return [lat, lng];
        } catch (error) {
            console.error(error)
            throw error;
        }
    }
}

export default GoogleApi;
