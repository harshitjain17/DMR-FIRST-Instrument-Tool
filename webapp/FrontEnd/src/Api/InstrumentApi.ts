import InstoolApi from './InstoolApi';

export interface ILocationResult {
    id: number;

    institution: string;
    building: string;
    latitude: number,
    longitude: number

    count: number;
  }