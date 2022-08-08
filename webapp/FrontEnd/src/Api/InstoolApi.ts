import axios from 'axios';
import { config } from '../config/config';

export const Api = axios.create({
  baseURL: `${config.url}/api/v1`
});

export default Api;


