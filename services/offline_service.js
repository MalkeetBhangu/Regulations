import {TouchableNativeFeedbackBase} from 'react-native';

class OfflineManager {
  constructor() {
    this.isOnline = null;
    this.isAlertShown = false;
  }
  getOnline() {
    return this.isOnline;
  }

  setOnline(value) {
    this.isOnline = value;
  }

  getAlertShown() {
    return this.isAlertShown;
  }

  setOfflineCurrentTime(currentFormatTime) {
    let currentOfflineTime = null;
    /// alert('ggggg' + currentFormatTime);
    console.log('offlineCurrent time' + currentFormatTime);
    currentOfflineTime = currentFormatTime;
    // return currentFormatTime;

    //let x = null;
    //get current time

    //x=currentTime;

    this.offlineToggleTime = currentOfflineTime;
  }

  getOfflineToggleTime() {
    return this.offlineToggleTime;
  }
}
export default new OfflineManager();
