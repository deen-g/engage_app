// import libraries

import RNLocation from 'react-native-location';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import dispatcher from '../dispatcher/dispatcher';
RNLocation.configure({
  distanceFilter: 5.0,
  desiredAccuracy: {
    android: 'balancedPowerAccuracy',
  },
  androidProvider: 'auto',
  interval: 5000, // Milliseconds
  fastestInterval: 10000, // Milliseconds
  maxWaitTime: 5000,
});

const baseURL = 'http://192.168.1.163:3000/api/';
const api_key = 'AIzaSyCJNdTFqGR-CmUgbTVfG7G2uwPikd1AUFY';

const check_location = async () => {
  //request location permission
  const granted = await RNLocation.requestPermission({
    android: {
      detail: 'coarse', // or 'fine'
      rationale: {
        title: 'ALLOW ENGAGE',
        message:
          'this app will use your location to show where you are writing from',
        buttonPositive: 'OK',
        buttonNegative: 'Cancel',
      },
    },
  });
  //if location permission granted
  if (granted) {
    //get location long and lat
    const current = RNLocation.getLatestLocation({
      timeout: 60000,
      enableHighAccuracy: false,
      maximumAge: 1000,
    });
    //return info

    return current;
  }
};
const get_location = async location => {
  //geo code api key from google account

  const {latitude, longitude} = location;
  //api call to google geocode
  let url =
    'https://maps.googleapis.com/maps/api/geocode/json?result_type=locality&address=' +
    latitude +
    ',' +
    longitude +
    '&key=' +
    api_key;
  const location_data = await axios.get(url);

  //filter city name
  const {address_components} = location_data.data.results[0];
  let city = address_components.find(item => item.types[0] === 'postal_town');
  if (!city) {
    city = address_components.find(
      item => item.types[0] === 'administrative_area_level_1',
    );
  }
  return city.long_name;
};

const check_network = async () => {
  const subscribe = await NetInfo.fetch();
  dispatcher.dispatch({
    type: 'ACTION_UPDATE_CONNECTION',
    data: subscribe.isConnected,
  });

  return subscribe;
};
export {baseURL, check_location, check_network, get_location};
