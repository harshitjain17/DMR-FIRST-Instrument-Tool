import axios from 'axios';

export default axios.create({
  baseURL: `https://m4-instool.vmhost.psu.edu/api/v1`  
});