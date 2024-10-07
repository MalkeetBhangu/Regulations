import React, {Component} from 'react';
import {
  StyleSheet,
  DeviceEventEmitter,
  Image,
  View,
  Text,
  AppState,
  TouchableOpacity,
  Linking,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import AuthService from '../services/auth_service';
import {StackActions, NavigationActions} from 'react-navigation';
import ApiService from '../services/api_service';
import NewsService from '../services/news_Service';
import UpdatesService from '../services/updates_service';
import NetworkError from '../component/network-error';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CacheService from '../services/cache_service';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const width = Dimensions.get('screen').width;
import moment from 'moment';
import NetworkUtiliy from '../utilities/networkUtil';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import AsyncStorage from '@react-native-community/async-storage';
import OfflineManager from '../services/offline_service';
import offlineDatabase from '../services/offlineDatabase';
import BackgroundTimer from 'react-native-background-timer';

const advancedLink = `advanced?term=&searchStatus=nomothesia&law=4465&year=&article=40&fek=&fek_date=&legislative_act_type=&courthouse=&area=&ruling_number=&ruling_year=&ruling_law=&law_year=&ruling_article=`;

export default class Screen extends Component {
  static navigationOptions = ({navigation}) => {
    const notificationCount =
      typeof navigation.state.params === 'undefined' ||
      typeof navigation.state.params.count == 'undefined'
        ? CacheService.unReadNotificationsCount()
        : navigation.state.params.count;

    const hideBackButton =
      typeof navigation.state.params === 'undefined' ||
      typeof navigation.state.params.hideBackButton == 'undefined'
        ? false
        : navigation.state.params.hideBackButton;

    const showArticlesLoading =
      typeof navigation.state.params === 'undefined' ||
      typeof navigation.state.params.showArticlesLoading == 'undefined'
        ? CacheService.showArticlesLoading
        : navigation.state.params.showArticlesLoading;

    const isDrawerOpen =
      typeof navigation.state.params === 'undefined' ||
      typeof navigation.state.params.isDrawerOpen === 'undefined'
        ? false
        : navigation.state.params.isDrawerOpen;

    const onBackPress =
      typeof navigation.state.params === 'undefined' ||
      typeof navigation.state.params.onBackPress == 'undefined'
        ? navigation.goBack
        : navigation.state.params.onBackPress;

    const isSyncingComplete =
      typeof navigation.state.params === 'undefined' ||
      typeof navigation.state.params.showLoginWithoutInternet === 'undefined'
        ? false
        : navigation.state.params.showLoginWithoutInternet;

    return {
      title:
        typeof navigation.state.params === 'undefined' ||
        typeof navigation.state.params.title === 'undefined'
          ? navigation.getParam('title', '')
          : navigation.state.params.title,
      headerStyle: {
        height: moderateScale(50),
        backgroundColor: '#016622',
        elevation: 0, //for android
        shadowOpacity: 0, //for ios
        borderBottomWidth: 0, //for ios
        justifyContent: 'flex-start',
      },
      headerTitleContainerStyle: {
        justifyContent: 'flex-start',
        paddingLeft: moderateScale(15),
      },
      headerTitleContainerStyle: {
        justifyContent: 'flex-start',
        paddingLeft: moderateScale(0),
      },
      headerTitleStyle: {
        flex: 1,
        left: moderateScale(35),
        fontSize: moderateScale(15),
        color: 'white',
        maxWidth: width * 0.4,
        justifyContent: 'flex-start',
      },
      headerLeft: (
        <View style={styles.iconContainer}>
          {!hideBackButton && (
            <MaterialIcons
              style={{marginLeft: moderateScale(2)}}
              onPress={() => onBackPress()}
              name="keyboard-backspace"
              size={moderateScale(33)}
              color="#fff"
            />
          )}
          {isDrawerOpen ? (
            <MaterialCommunityIcons
              onPress={() => {
                navigation.setParams({isDrawerOpen: true});
                navigation.toggleDrawer();
              }}
              style={{marginLeft: 5}}
              color="#fff"
              size={38}
              name="menu-open"
            />
          ) : (
            <TouchableOpacity
              onPress={() => {
                navigation.setParams({isDrawerOpen: true});
                navigation.toggleDrawer();
              }}>
              <Ionicons
                style={{marginLeft: 5}}
                name="md-menu"
                color="#fff"
                size={38}
              />
            </TouchableOpacity>
          )}
          {isSyncingComplete && (
            <TouchableOpacity
              onPress={() => navigation.navigate('OfflineSwitch')}>
              <MaterialIcons
                name="tap-and-play"
                color="#fff"
                size={30}
                style={{marginLeft: 10}}
              />
            </TouchableOpacity>
          )}
        </View>
      ),
      headerRight: (
        <View style={styles.iconContainer}>
          {showArticlesLoading && (
            <ActivityIndicator color="white" size="small" />
          )}
          <TouchableOpacity
            onPress={() => navigation.navigate('SearchTabs', {index: 1})}>
            <EvilIcons
              style={{
                marginRight: moderateScale(9),
              }}
              name="search"
              size={moderateScale(35)}
              color="#fff"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <Image
              style={{
                marginRight: moderateScale(11),
                width: moderateScale(23),
                height: moderateScale(23),
              }}
              source={require('../assets/bellicon.png')}
            />

            {notificationCount != 0 && (
              <View
                style={{
                  position: 'absolute',
                  width: moderateScale(14),
                  height: moderateScale(14),
                  borderRadius: moderateScale(7),
                  left: moderateScale(14),
                  bottom: moderateScale(14),
                  backgroundColor: 'red',
                }}>
                <Text
                  style={{
                    color: '#fff',
                    textAlign: 'center',
                    fontSize: moderateScale(10),
                  }}>
                  {notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('HeaderHome')}>
            <Image
              style={{
                marginRight: moderateScale(5),
                width: moderateScale(23),
                height: moderateScale(23),
              }}
              source={require('../assets/homeicon.png')}
            />
          </TouchableOpacity>
        </View>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.authService = new AuthService();
    this.apiService = new ApiService();
    this.updateService = new UpdatesService();
    this.newsService = new NewsService();
    this.notificationListener();
    this.getOffLineTime();
    this.isOfflineSyncComplete();
    // this.saveOffLineTime();
    // this.showMessage();
    this.state = {
      showLoginWithoutInternet: false,
      alertDuration: 1000,
      isModalOpen: false,
    };
    this.articlesListener();
    this.checkNetwork();
    this.props.navigation.setParams({
      count: CacheService.unReadNotificationsCount(),
    });

    this.props.navigation.setParams({
      showArticlesLoading: CacheService.showArticlesLoading,
    });
    this.drawerCallBack();

    this.alertShown = false;
  }

  /**
   * Function to check that device is connect to network or not
   */
  checkNetwork() {
    NetworkUtiliy.checkIsNetwork().then(response => {
      if (!response.isConnected) {
        console.log('listener' + OfflineManager.isOnline);
        OfflineManager.setOnline(false);
        DeviceEventEmitter.emit('isDeviceOnline');
      } else if (response.isConnected) {
        AsyncStorage.getItem('checkOffline').then(value => {
          if (value !== 'true') {
            OfflineManager.setOnline(false);

            DeviceEventEmitter.emit('isDeviceOnline');
          } else {
            OfflineManager.setOnline(true);
            DeviceEventEmitter.emit('isDeviceOnline');
          }
        });
      } else {
        OfflineManager.setOnline(true);
        DeviceEventEmitter.emit('isDeviceOnline');
      }
    });
  }

  /**
   * Methos to call back drawer navigator.
   */

  drawerCallBack() {
    this.drawerListner = DeviceEventEmitter.addListener('DrawerUpdated', e => {
      if (
        this.props.navigation.state &&
        this.props.navigation.state.params &&
        this.props.navigation.state.params.isDrawerOpen != e
      ) {
        this.props.navigation.setParams({isDrawerOpen: e});
      }
    });
    this.props.navigation.addListener('willBlur', () => {
      this.drawerListner.remove();
    });
  }

  componentWillUnmount() {
    // AppState.removeEventListener('change', this._handleAppStateChange());
  }

  startTimer() {
    intervalId = BackgroundTimer.setInterval(() => {
      // this will be executed every 200 ms
      // even when app is the the background
      Alert.alert(
        '',
        // 'Η εφαρμογή εντόπισε την ύπαρξη δικτύου internet. Πώς επιθυμείτε να συνεχίσετε?',
        'Ηεφαρμογήεντόπισετηνύπαρξηδικτύουinternet. Πώςεπιθυμείτε να συνεχίσετε;',
        [
          {
            // text: 'Συνέχεια εκτός Δικτύου με πρόσβαση στους 4 Κώδικες',
            text:
              // 'Λειτουργία εκτός σύνδεσης - Έχετε πρόσβαση μόνο στα άρθρα του Α.Κ., Κ.Πολ.Δ., Π.Κ., Κ.Π.Δ., ωςέχουνβάσειτηςτελευταίαςεγκατάστασηςενημερώσεωνπουπραγματοποιήσατε”',
              'Θέλετε να συνεχίσετε εκτός σύνδεσης',
            // 'offline',
            onPress: () => {
              this.props.navigation.navigate('HeaderHome');
            },
          },
          {
            text:
              // 'Σύνδεση στο δίκτυο με πρόσβαση στο σύνολο του περιεχομένου',
              ' Θέλετε να συνεχίσετε στο διαδίκτυο',
            // 'online',
            onPress: () => {
              this.props.navigation.navigate('OfflineSwitch');
            },
          },
        ],
      );
      console.log('sec' + this.state.seconds);
      let sec = this.state.seconds;
      let percent = 5;
      sec = sec + percent;
      this.setState({seconds: sec});
    }, 900000);
  }
  _handleAppStateChange = nextAppState => {
    let intervalId = '';
    let diffTime = '';
    // let appstate = AppState.currentState;
    //alert('next app aasesstate' + appstate);
    if (nextAppState == 'background') {
      // Do something here on app background.

      //clear interval of timer
      BackgroundTimer.clearInterval(intervalId);

      console.log('App is in Background Mode.' + nextAppState);
    } else if (nextAppState == 'active') {
      console.log('App is in Active Foreground Mode 11.');

      if (!OfflineManager.isOnline) {
        // Do something here on app active foreground mode.
        console.log('App is in Active Foreground Mode.' + nextAppState);

        let curTime = new Date().toLocaleString();
        let currentFormatTime = moment(curTime).format('hh:mm');
        console.log('currnt format Time' + currentFormatTime);

        //X=current time get;

        let y = OfflineManager.getOfflineToggleTime();

        console.log('currnt format jahjahjaja' + y);

        // let differenceTime = x - y;

        let differenceTime = moment(currentFormatTime, 'hh:mm').diff(
          moment(y, 'hh:mm'),
        );
        console.log('jjkjkljdskjfzgf' + differenceTime);
        let d = moment.duration(differenceTime);

        this.setState({alertDuration: d});

        differenceTime = d.minutes();
        console.log('klkl22222' + differenceTime);

        if (differenceTime >= 15) {
          console.log('hello here enter');
          OfflineManager.setOfflineCurrentTime(currentFormatTime);
          //show alert
          this.showAlert();
          this.startTimer();
          //AKRITI START THE TIMER HERE
        } else {
          console.log('hello here enter 1111111111');
          // alert(differenceTime);
          let totalDifference = 15 - differenceTime;

          console.log('totaldiff' + totalDifference);
          let seconds = Number(totalDifference) * 60000;

          console.log('elseklkl222222222--' + totalDifference);

          setTimeout(() => {
            let time = new Date().toLocaleString();
            let formattedTime = moment(time).format('hh:mm');

            OfflineManager.setOfflineCurrentTime(formattedTime);
            this.showAlert();
            this.startTimer();
          }, seconds);
        }
      }
    } else {
      console.log('Inactive' + nextAppState);
    }
  };

  showAlert() {
    Alert.alert(
      '',
      // 'Η εφαρμογή εντόπισε την ύπαρξη δικτύου internet. Πώς επιθυμείτε να συνεχίσετε?',
      'Ηεφαρμογήεντόπισετηνύπαρξηδικτύουinternet. Πώςεπιθυμείτε να συνεχίσετε;',
      [
        {
          // text: 'Συνέχεια εκτός Δικτύου με πρόσβαση στους 4 Κώδικες',
          text:
            // 'Λειτουργία εκτός σύνδεσης - Έχετε πρόσβαση μόνο στα άρθρα του Α.Κ., Κ.Πολ.Δ., Π.Κ., Κ.Π.Δ., ωςέχουνβάσειτηςτελευταίαςεγκατάστασηςενημερώσεωνπουπραγματοποιήσατε”',
            'Θέλετε να συνεχίσετε εκτός σύνδεσης',
          // 'offline',
          onPress: () => {
            this.props.navigation.navigate('HeaderHome');
          },
        },
        {
          text:
            // 'Σύνδεση στο δίκτυο με πρόσβαση στο σύνολο του περιεχομένου',
            ' Θέλετε να συνεχίσετε στο διαδίκτυο',
          // 'online',
          onPress: () => {
            this.props.navigation.navigate('OfflineSwitch');
          },
        },
      ],
    );
  }

  startTimeInterval() {
    //start after 15 mins.
  }

  /**
   * Shows loader when syncing the articles in offline storage.
   */
  articlesListener() {
    this.articleLoadingListener = DeviceEventEmitter.addListener(
      'showArticlesLoading',
      event => {
        this.setState({showArticlesLoading: event});
        this.isOfflineSyncComplete();
        this.props.navigation.setParams({
          showArticlesLoading: CacheService.showArticlesLoading,
        });
      },
    );
  }

  notificationListener() {
    this.listener = DeviceEventEmitter.addListener(
      'RefreshNotifications',
      () => {
        this.props.navigation.setParams({
          count: CacheService.unReadNotificationsCount(),
        });
      },
    );
  }

  // showMessage() {
  //   let timerId = setInterval(() => alert('tick'), 60 * 60);
  //   return timerId;
  // }

  componentWillUnmount() {
    this.articleLoadingListener.remove();
  }

  saveOffLineTime() {
    // return false;
    let offlineTime = OfflineManager.getOfflineToggleTime();
    //  alert('geeeeeee' + offlineTime);
    // Async storage save offline time
    // get time using moment current time
  }

  getOffLineTime() {
    //ASync storage get offline time
    // let offlineAsyncTime = offlineDatabase.getToggleOfflineTime();
    // alert('seeeeee' + offlineAsyncTime);
    let curTime = new Date().toLocaleString();
    let currentFormatTime = moment(curTime).format('mm:ss');
    console.log('currnt format Time111' + currentFormatTime);

    // compare with current time using moment.

    //if diiff%15==0, show alert
  }

  componentDidMount() {
    // alert('');
    this.isOfflineSyncComplete();
    let date = moment()
      .add(1, 'months')
      .format('MMM Do YY');
    console.log('time' + date);

    // AppState.addEventListener('change', this._handleAppStateChange());
  }

  async isOfflineSyncComplete() {
    let currentPage = await AsyncStorage.getItem('currentPage');
    let lastPage = await AsyncStorage.getItem('lastPage');
    if (currentPage != null && lastPage != null) {
      if (currentPage == lastPage) {
        this.setState({showLoginWithoutInternet: true});
        this.props.navigation.setParams({showLoginWithoutInternet: true});
      } else {
        this.setState({showLoginWithoutInternet: false});
        this.props.navigation.setParams({showLoginWithoutInternet: false});
      }
    } else {
      this.setState({showLoginWithoutInternet: false});
      this.props.navigation.setParams({showLoginWithoutInternet: false});
    }
  }

  /**
   * Opens URL or routes user to Law categories or Articles list or Tabs Page(Topics) or Search
   * on the basis of href link in HTML
   * normal link = `https://www.xyz.com`
   * article link = `#/article/articleId`
   * articles link = `#/articles/articleId`
   * category link = `#/categories/categoryId`
   * advanced search link = `advanced?term=&searchStatus=nomothesia&law=4465&year=&article=40&fek=&fek_date=&legislative_act_type=&courthouse=&area=&ruling_number=&ruling_year=&ruling_law=&law_year=&ruling_article=`
   */
  openLink(link) {
    console.log(JSON.stringify(link));
    let expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    let regex = new RegExp(expression);
    if (link == 'about:blank') {
      //DO NOTHING
      //alert(link)
      //this.WEBVIEW_REF.stopLoading();
      //return false;
    } else if (regex.test(link)) {
      Linking.openURL(link);
    } else if (link == 'mailto:info@tetravivlos.gr') {
      console.log(JSON.stringify(link));
      Linking.openURL(
        'mailto:info@tetravivlos.gr?subject=Τετράβιβλος - Επικοινωνία',
      );
    } else if (
      link.indexOf('nomothesia') != -1 ||
      link.indexOf('nomologia') != -1
    ) {
      this.getSearchParams(link);
    } else {
      console.log(JSON.stringify(link));
      let isArticle = link.indexOf('article');
      let isCategory = link.indexOf('categories');
      let isArticles = link.indexOf('articles');
      //console.log(index);
      if (isArticle != -1 && isArticles == -1) {
        let articleId = link.slice(link.lastIndexOf('/') + 1);
        this.navigateUser(articleId, true);
      } else if (isCategory != -1) {
        //categoryId for category page
        let categoryId = link.slice(link.lastIndexOf('/') + 1);
        this.navigateUser(categoryId, false);
      } else if (isArticles != -1) {
        let articlesId = link.slice(link.lastIndexOf('/') + 1);
        this.navigateToArticlesList(articlesId);
      }
    }
  }

  /**
   * This method routes user to search page on press
   * @param {*} link
   */
  getSearchParams(link) {
    // let url = advancedLink
    let url = link;
    let regex = /[?&]([^=#]+)=([^&#]*)/g;
    let filter = {};
    let match;
    while ((match = regex.exec(url))) {
      filter[match[1]] = match[2];
    }
    //console.log(params)
    console.log('advanced search link ' + JSON.stringify(filter)); // 123
    if (filter.searchStatus == 'nomologia') {
      this.routeToNomologia(filter);
    } else {
      this.routeToNomothesia(filter);
    }
  }

  /**
   * Routes user to nomothesia when presses on advanced search link
   * @param {*} filter
   */
  routeToNomothesia(filter) {
    console.log('nomothesia' + JSON.stringify(filter));
    this.apiService
      .searchNomothesia(filter, 0)
      .then(response => {
        console.log('search filter' + JSON.stringify(response));
        this.props.navigation.navigate('NomothesiaResults', {
          nomothesiaResult: response,
          filter: filter,
        });
      })
      .catch(error => {
        this.props.hideLoader();
        console.log('Error' + JSON.stringify(error));
      });
  }

  /**
   * Routes user to nomologia when presses on advanced search link
   * @param {*} filter
   */
  routeToNomologia(filter) {
    console.log('nomologia' + JSON.stringify(filter));
    this.apiService
      .searchNomologia(filter, 0)
      .then(response => {
        console.log('search filter' + JSON.stringify(response));
        this.props.navigation.navigate('NomologiaResults', {
          nomologiaResult: response,
          filter: filter,
        });
      })
      .catch(error => {
        this.props.hideLoader();
        console.log('Error' + JSON.stringify(error));
      });
  }

  /**
   * Navigate user to articles list when presses on link
   * @param {*} id
   */
  navigateToArticlesList(id) {
    this.props.navigation.navigate('ArticlesList', {
      title: '',
      categoryId: id,
    });
  }

  /**
   * When User presses back on network error screen dismiss the modal
   */
  dismissNetworkModal() {
    this.setState({noNetwork: false}, () => {
      if (this.state.noInternet && this.state.notAvailableOffline) {
        console.log('go backk to previous page');
        this.props.navigation.goBack();
      }
    });
  }

  /**
   * Routes user to Law categories or Tabs Page(Topics)
   */
  navigateUser(Id, isArticle) {
    console.log(Id);
    if (isArticle) {
      this.props.navigation.navigate({
        routeName: 'Topics',
        params: {
          title: this.state.title,
          articleId: Id,
        },
        key: 'Topics' + Id,
      });
    } else {
      this.props.navigation.navigate({
        routeName: 'LawCategoriesById',
        params: {
          title: this.state.title,
          categoryId: Id,
        },
        key: 'LawCategoriesById' + Id,
      });
    }
  }

  /**
   * Shows notification to user for early expiration reminder
   * @param {*} days
   */
  earlyExpirationReminder(valid_to) {
    let validUptoDate = moment(valid_to);
    //let validUptoDate = moment("2020-01-31 20:12:34");
    let currentTime = moment();

    let days = validUptoDate.diff(currentTime, 'days');
    console.log('user expiration days please check' + days);

    let notification = {
      key: 'newsItem_12121',
      title: '',
      read: false,
      type: 'account',
    };
    if (days <= 0) {
      //SAGAR
      // alert('Hurray Alert hhhhh');
      this.authService.resetUserCredentials();
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: 'Login'})],
      });
      this.props.navigation.dispatch(resetAction);
    } else if (days == 4) {
      (notification.title = 'Ο λογαριασμός σας θα λήξει σε 4 ημέρες'),
        CacheService.clearNotification(notification.key);
      CacheService.addNotification(notification);
      DeviceEventEmitter.emit('RefreshNotifications', true);
    } else if (days == 11) {
      (notification.title = 'Ο λογαριασμός σας θα λήξει σε 11 ημέρες'),
        CacheService.clearNotification(notification.key);
      CacheService.addNotification(notification);
      DeviceEventEmitter.emit('RefreshNotifications', true);
    }
  }

  /**Logs out user when token expires */
  onTokenExpire() {
    this.logoutUser();
  }

  /**Logs out user and routes user to login screen */
  logoutUser() {
    AsyncStorage.removeItem('isOfflineLoggedIn');
    this.authService
      .logout()
      .then(response => {
        console.log('DATA FROM SERVER logout' + JSON.stringify(response.token));
        AsyncStorage.setItem('offlineToken', response.token);
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({routeName: 'Login'})],
        });
        this.props.navigation.dispatch(resetAction);
      })
      .catch(error => {
        console.log('ERROR FROM SERVER' + JSON.stringify(error));
      });
  }
}

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
