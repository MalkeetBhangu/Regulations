/**
 * Updates Service to fetch and delete updated articles in offline storage
 * @Author Logicease
 */
import ApiService from './api_service';
import CacheService from './cache_service';
import TimerService from './timer_service';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import OfflineDatabase from '../services/offlineDatabase';
import {DeviceEventEmitter} from 'react-native';

export default class UpdatesService {
  constructor() {
    this.apiService = new ApiService();
  }

  /**
   * Fetches updates from server.
   */
  async loadUpdates() {
    let lastUpdateTime = await AsyncStorage.getItem('LAST_UPDATE_TIME');
    AsyncStorage.setItem(
      'LAST_UPDATE_TIME',
      moment().format('YYYY-MM-DD HH:mm:ss'),
    );

    if (lastUpdateTime !== null) {
      this.apiService
        .getUpdates(lastUpdateTime)
        .then(response => {
          if (response.error == 'token_expired') {
            this.logoutUser();
          }

          this.recursiveLoadUpdates();
          response.forEach(articleId=>{
            OfflineDatabase.deleteArticle(articleId);
          })
       
        })
        .catch(error => {
          console.log('ERROR FROM SERVER' + JSON.stringify(error));
        });
    }
  }

  /**
   * Calls load updates method after every 5 minutes.
   */
  recursiveLoadUpdates() {
    const ARTICLE_UPDATES_SEC = 300;
    if (!TimerService.getTimer('latest_update_interval')) {
      this.updateInterval = setInterval(() => {
        this.loadUpdates();
      }, ARTICLE_UPDATES_SEC * 1000);

      TimerService.addTimer('latest_update_interval', this.updateInterval);
    }
  }
}
