import React, {Component} from 'react';
import ApiService from '../services/api_service';
import OfflineDatabase from '../services/offlineDatabase';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

export default class AuthService extends Component {
  constructor(props) {
    super(props);
    this.apiService = new ApiService();
  }

  /****Storing user name, password & token in local storage */
  storeUserCredentials(token, username, password) {
    let user = {
      email: username,
      password: password,
      savetime: moment(),
      token: token,
    };

    console.log('responseee' + JSON.stringify(user));
    AsyncStorage.setItem('LOCAL_USER_CREDS', JSON.stringify(user));
    //AsyncStorage.setItem('LOCAL_USER', username);
    //AsyncStorage.setItem('LOCAL_PASS', password);
    AsyncStorage.setItem('accessToken', token);
  }

  /****Resetting user name, password & token in local storage */
  resetUserCredentials(token, username, password) {
    // const keys = ['LOCAL_USER', 'LOCAL_PASS','accessToken','REMEMBERLOGIN']
    const keys = ['accessToken'];
    AsyncStorage.multiRemove(keys);
  }

  /********** Login user and  store user access token & info */
  login(username, password) {
    return this.apiService
      .login(username, password)
      .then(result => {
        console.log('token' + JSON.stringify(result));
        if (result.token) {
          OfflineDatabase.initializeTables();
          this.storeUserCredentials(result.token, username, password);
          //console.log('token'+result.msg)
          return result;
        } else {
          throw result.error;
        }
      })
      .then(result => {
        return result;
      });
  }

  /********** Logout user and  remove user access token & info */
  logout() {
    return this.apiService
      .logout()
      .then(result => {
        if (result.token) {
          this.resetUserCredentials();
          return result;
        } else {
          throw result.error;
        }
      })
      .then(result => {
        return result;
      });
  }
}
