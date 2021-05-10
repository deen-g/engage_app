//import libraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import instance from '../utils/axios';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk';
import {remove_object, save_object} from './action';
import {push} from '../../../RootNavigation';
//exported functions
const check_account = async () => {
  // initialise account details and set the default login to false
  let account = {is_login: false};
  // try get local storage account details
  try {
    // for testing
    // await action.remove_object('@storage_account');
    const value = await AsyncStorage.getItem('@storage_account');
    //if value exist return JSON format to account screen
    if (value !== null) {
      account = JSON.parse(value);
      //set is_login to true
      return account;
    } else {
      //return default data with is_login false
      return account;
    }
  } catch (e) {
    // error reading value
    //todo:close app or phone not supported
  }
};
const set_account = async data => {
  // try set local storage account details
  try {
    // store data to local storage
    await remove_object('@storage_account');
    const obj = await save_object('@storage_account', data);
    return obj;
    //if value exist return JSON format to account screen
  } catch (e) {
    // error reading value
    console.log(e);
    //todo:close app or phone not supported
  }
};
const user_login = async input => {
  //collect account data from account screen as object
  /**
   * #1: try http request to backend for user account
   * #3: return response data
   * @params: email, password
   * @response: confirmation- new, success, failed
   * @response: data- account [JSON]
   */
  // todo: validation check: type is empty or too short
  try {
    const response = await instance.post('/users/account', input);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};
const user_create = async input => {
  /**
   * try return http request to backend to create account
   * return response data
   * @params: email, password
   * @response: confirmation- success, failed
   * @response: data- account [JSON]
   */
  try {
    const response = await instance.post('/users/create', input);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};
const user_fb_login = async () => {
  /**
   * try return http request to backend to create account
   * return response data
   * @params: email, public_profile
   * @response: data- account [JSON]
   */
  try {
    LoginManager.setLoginBehavior('web_only');
    const response = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);
    if (!response.isCancelled) {
      const _token = await AccessToken.getCurrentAccessToken();
      const access_token = _token.accessToken;
      let infoRequest = new GraphRequest(
        '/me',
        {
          accessToken: access_token,
          parameters: {
            fields: {
              string: 'id,first_name,last_name,email,picture',
            },
          },
        },
        async (err, res) => {
          if (err) {
            console.log(err);
            return;
          }
          const resp = await instance.post('/fb_users/register', res);
          let account = resp.data.data;
          account.is_login = true;
          set_account(account).then(obj => {
            console.log(obj);
            if (obj) {
              push('Start');
            }
          });
        },
      );
      new GraphRequestManager().addRequest(infoRequest).start();
    }
  } catch (e) {
    console.log(e);
  }
};

export {check_account, set_account, user_login, user_fb_login, user_create};
