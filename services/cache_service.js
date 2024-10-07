/**
 * Cache Service is used to store data which can be used throughout the application.
 * @Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */
class CacheService {
  constructor() {
    this.userData = null;
    this.syncError = false;
    this.isFetchingArticles = false;
    this.news = [];
    this.showArticlesLoading = false;
    this.notifications = [
      // {
      //   key: 'newsItem_23',
      //   title: 'You have 2 unread news.',
      //   read: false,
      //   type: 'news',
      // },
      // {
      //   key: 'newsItem_43',
      //   title: ' You have one update waiting to download.',
      //   read: true,
      //   type: 'update',
      // },
      // {
      //   key: 'newsItem_53',
      //   title: 'Your account will expire in 4 days',
      //   read: true,
      //   type: 'account',
      // },
    ];
  }

  /**
   * Stores user profile information
   * @param {*} data
   */
  setUserData(data) {
    this.userData = data;
  }

  /**
   * Stores app news
   * @param {*} data
   */
  setNews(data) {
    this.news = data;
  }

  /**
   * Stores app notifications
   * @param {*} data
   */
  setNotifications(data) {
    this.notifications = data;
  }

  /**
   * removes the notification from the list with the mathcing key
   * @param {*} key
   */
  clearNotification(key) {
    let index = this.notifications.findIndex(item => item.key == key);
    // alert(index);
    if (index != -1) {
      this.notifications.splice(index, 1);
    }
  }

  /**
   * Add new notification on the top on notification list
   * @param {*} item
   */
  addNotification(item) {
    this.notifications.unshift(item);
  }

  /**
   * To show unread notifications count on badge
   */
  unReadNotificationsCount() {
    return this.notifications.filter(item => item.read == false).length;
  }

  /**
   * Mark notification read as true when user opens the notification
   * @param {*} item
   */
  markNotificationAsRead(notificationId) {
    let index = this.notifications.findIndex(
      item => item.key == 'newsItem_' + notificationId,
    );
    if (index != -1) {
      this.notifications[index].read = true;
    }
  }
}
export default new CacheService();
