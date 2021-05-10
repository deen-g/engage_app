import {Toast} from 'native-base';
import dispatcher from '../dispatcher/dispatcher';
import {baseURL} from './index';

const axios = require('axios');
const instance = axios.create({
  baseURL: baseURL,
  timeout: 3000,
  headers: {Accept: 'application/json'},
});
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    console.log(error);
    // Do something with request error
    return Promise.reject(error);
  },
);
// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // console.log(response);
    let {message, confirmation} = response.data;
    if (message) {
      Toast.show({
        text: message,
        duration: 3500,
        type: confirmation === 'success' ? 'success' : 'danger',
      });
      // dispatcher.dispatch({type: 'TRIGGER_TOAST', data: response.data});
    }
    return response;
  },
  function (error) {
    console.log(error);
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  },
);
export default instance;
