import InstoolApi from './InstoolApi';

export interface ILocation {
  latitude: number,
  longitude: number
}

export const LocationApi = {
  async getAddress(coordinates: GeolocationCoordinates): Promise<string> {
    const result = await InstoolApi.get(`/locate/address?lat=${coordinates.latitude}&lng=${coordinates.longitude}`);
    return result.data as string;
  },

  async getCoordinates(address: string) {
    const result = await InstoolApi.get(`/locate?address=${address}`);
    return result.data as ILocation;
  }
};
