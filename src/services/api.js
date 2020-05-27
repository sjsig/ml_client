import axios from "axios";

/**
 * A wrapper around Axios API call that format errors, etc
 * @param {string} method the HTTP verb you want to use
 * @param {string} path the route path / endpoint
 * @param {object} data {optional} data in JSON form for POST requests
 */

 const BASE_URL = 'https://landlord-app-backend.herokuapp.com'

export function apiCall(method, path, data) {
  return new Promise((resolve, reject) => {
    return axios({
      method: method.toLowerCase(),
      url: BASE_URL + path,
      data
    })
    .then((res) => {
        return resolve(res.data);
      })
      .catch((err) => {
        return reject(err.response.data.error);
      });
  });
}

export function setTokenHeader(token) {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
}
