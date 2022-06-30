import axios from 'axios';

class GoogleApi {
    static async getCoordinates(address) {
        try {
            const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: address,
                    key: 'AIzaSyBWAhdwQk6dpFAjF4QcTfUo_pZH0n0Xgxk'
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
