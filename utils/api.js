// api/axiosClient.js
const axios = require("axios");
const queryString =  require("query-string");
const axiosClient = axios.create({
  baseURL: 'https://oauth.casso.vn/v1',
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
  // Handle token here ...
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Handle errors
    throw error;
  }
);

module.exports =  axiosClient;
