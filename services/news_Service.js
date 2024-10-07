/**
 * Notifications Service to fetch and store notifications
 * @Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */
import ApiService from './api_service';
import CacheService from './cache_service';
import TimerService from './timer_service';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import {DeviceEventEmitter} from 'react-native';

export default class NewsService {
  constructor() {
    this.apiService = new ApiService();
  }

  /**
   * Fetches notifications from server.
   */
  async getNews() {
    let lastNewsTime = await AsyncStorage.getItem('LAST_NEWS_TIME');
    AsyncStorage.setItem(
      'LAST_NEWS_TIME',
      moment().format('YYYY-MM-DD HH:mm:ss'),
    );
    let newsTime = moment().subtract(6, 'months'); //Notifications since 6 months

    this.apiService
      .getNews(newsTime)
      .then(response => {
        // let mno = JSON.parse(response);
        console.log('mno' + JSON.stringify(response.newsitems));
        if (response.error == 'token_expired') {
          this.logoutUser();
        }

        //this.recursiveNotificationsUpdate();

        let news = [];

        response.newsitems.forEach(item => {
          let read = true;
          let key = 'newsItem_' + item.id;
          if (
            lastNewsTime &&
            moment(lastNewsTime).isSameOrBefore(item.updated_at)
          ) {
            read = false;
          }
          let newItem = {
            key: key,
            newsItem: item,
            read: read,
          };

          news.push(newItem);
        });
        CacheService.setNews(news);
        DeviceEventEmitter.emit('RefreshNews', true);
      })
      .catch(error => {
        console.log('ERROR FROM SERVER' + JSON.stringify(error));
      });
  }

  /**
   * Calls latest notifications method after every 2 minutes.
   */
  recursiveNotificationsUpdate() {
    const NOTIFICATIONS_UPDATES_SEC = 120;
    if (!TimerService.getTimer('latest_notifications')) {
      this.notificationInterval = setInterval(() => {
        this.getLatestNotifications();
      }, NOTIFICATIONS_UPDATES_SEC * 1000);

      TimerService.addTimer('latest_notifications', this.notificationInterval);
    }
  }

  /**
   * Fetches latest notifications from server upto current time.
   */
  async getLatestNotifications() {
    //let newsTime = await AsyncStorage.getItem('LAST_NEWS_TIME');
    let newsTime = moment().format('YYYY-MM-DD HH:mm:ss');
    console.log('latest notifications time' + JSON.stringify(newsTime));

    /***sets current time in local storage for next fetch*/
    AsyncStorage.setItem(
      'LAST_NEWS_TIME',
      moment().format('YYYY-MM-DD HH:mm:ss'),
    );
    /************/

    if (newsTime !== null) {
      this.apiService
        .getNews(newsTime)
        .then(response => {
          if (response.error == 'token_expired') {
            this.logoutUser();
          }
          console.log('latest notifications' + JSON.stringify(response));

          response.newsitems.reverse().forEach(item => {
            let key = 'newsItem_' + item.id;

            let notification = {
              key: key,
              newsItem: item,
              read: false,
            };
            CacheService.clearNotification(key);
            CacheService.addNotification(notification);
          });
          DeviceEventEmitter.emit('RefreshNotifications', true);
        })
        .catch(error => {
          console.log('ERROR FROM SERVER' + JSON.stringify(error));
        });
    }
  }
}
