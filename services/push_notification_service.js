import firebase from 'react-native-firebase';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NavigationService from './NavigationService';
import CacheService from './cache_service';
import {DeviceEventEmitter} from 'react-native';
import moment from 'moment';

export default class PushNotificationService {
  async enablePushNotifications() {
    this.checkPermission();
    this.createNotificationListeners(); //add this line
  }

  /**
   * check Permission
   */
  async checkPermission() {
    console.log('permission check');
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log('device token ' + fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        console.log('device token ' + fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }

  async createNotificationListeners() {
    firebase.messaging().subscribeToTopic('news');
    firebase.messaging().subscribeToTopic('updates');

    /*
     * Triggered when a particular notification has been received in foreground
     * */
    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        console.log('kk' + notification);
        this.addNewNotification(notification._data);
        // this.showAlert(title, body);
      });

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notification => {
        if (notification) {
          console.log(notification);
          setTimeout(() => {
            this.addNewNotification(notification.notification._data);
          }, 2000);
          NavigationService.navigate('Notification');
        }
      });

    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    const notification = await firebase
      .notifications()
      .getInitialNotification();
    if (notification) {
      console.log(notification);
      setTimeout(() => {
        this.addNewNotification(notification.notification._data);
      }, 2000);

      NavigationService.navigate('Notification');
      //   const {title, body} = notificationOpen.notification;
      //   console.log('push dsd '+JSON.stringify(notificationOpen))
      //   this.showAlert(title, body);
    }
    /*
     * Triggered for data only payload in foreground
     * */
    this.messageListener = firebase.messaging().onMessage(message => {
      //process data message
      console.log(JSON.stringify(message));
    });
  }

  addNewNotification(payload) {
    console.log('an');
    console.log(payload);
    let key = '';
    let notification = {};

    if (payload.update) {
      let updateNotification = JSON.parse(payload.update);
      console.log('opp' + JSON.stringify(updateNotification));
      key = 'newsItem_' + updateNotification.id;
      notification = {
        id: updateNotification.id,
        key: key,
        title: updateNotification.title,
        type: 'update',
        read: false,
      };
      console.log('kkkk' + JSON.stringify(notification));
    }

    if (payload.news) {
      let newNotification = JSON.parse(payload.news);
      console.log('kjh' + JSON.stringify(newNotification));
      key = 'newsItem_' + newNotification.id;
      notification = {
        key: key,
        title: newNotification.title,
        type: 'news',
        read: false,
        id: newNotification.id,
      };
    }

    AsyncStorage.setItem(
      'LAST_NEWS_TIME',
      moment().format('YYYY-MM-DD HH:mm:ss'),
    );

    console.log('notification is ' + JSON.stringify(notification));
    CacheService.clearNotification(key);
    CacheService.addNotification(notification);
    DeviceEventEmitter.emit('RefreshNotifications', true);
  }

  showAlert(title, body) {
    Alert.alert(
      title,
      body,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  }
}
