/**
 * Home Screen which comes after login screen.
 * @Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */
import React, {Component} from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  View,
  DeviceEventEmitter,
  ActivityIndicator,
  Switch,
  Alert,
  Platform,
  Button,
  AppState,
} from 'react-native';
import {useState, useEffect} from 'react';
import NetworkUtiliy from '../utilities/networkUtil';
import BackgroundTimer from 'react-native-background-timer';
import NetworkError from '../component/network-error';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Orientation from 'react-native-orientation';
import SplashScreen from 'react-native-splash-screen';
import {moderateScale} from 'react-native-size-matters';
import * as Progress from 'react-native-progress';
import PushNotificationService from '../services/push_notification_service';
import DeviceInfo from 'react-native-device-info';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CacheService from '../services/cache_service';
import Screen from '../screens/screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import OfflineManager from '../services/offline_service';
import {ScrollView} from 'react-native-gesture-handler';
import BackgroundSync from '../services/articles_background_sync';
import AsyncStorage from '@react-native-community/async-storage';
import PercentageProgressbar from '../component/percentageProgressbar';
import NetInfo from '@react-native-community/netinfo';
import offlineDatabase from '../services/offlineDatabase';

export default class HeaderHome extends Screen {
  /**
   * Header for Home Screen
   */
  static navigationOptions = ({navigation}) => {
    const notificationCount =
      typeof navigation.state.params === 'undefined' ||
      typeof navigation.state.params.count == 'undefined'
        ? CacheService.unReadNotificationsCount()
        : navigation.state.params.count;

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

    const isSyncingComplete =
      typeof navigation.state.params === 'undefined' ||
      typeof navigation.state.params.showLoginWithoutInternet === 'undefined'
        ? false
        : navigation.state.params.showLoginWithoutInternet;

    return {
      title: '',
      headerStyle: {
        height: moderateScale(50),
        backgroundColor: '#016622',
        elevation: 0, //for android
        shadowOpacity: 0, //for ios
        borderBottomWidth: 0, //for ios
      },
      headerTitleStyle: {
        color: 'white',
        flex: 1,
        textAlign: 'center',
        alignSelf: 'center',
      },
      headerLeft: (
        <View style={styles.iconContainer}>
          {isDrawerOpen ? (
            <MaterialCommunityIcons
              // onPress={alert("drawer")}
              style={{marginLeft: 10}}
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
                // onPress={() => navigation.toggleDrawer()}
                style={{marginLeft: 10}}
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
                style={{marginLeft: 15}}
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
                marginRight: moderateScale(15),
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
          <TouchableOpacity onPress={() => navigation.navigate('Update')}>
            <MaterialCommunityIcons
              style={{marginRight: moderateScale(15)}}
              size={moderateScale(30)}
              color="#fff"
              name="download-outline"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('HeaderHome')}>
            <Image
              style={{
                marginRight: moderateScale(15),
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
    this.state = {
      appVersion: DeviceInfo.getReadableVersion(),
      lastUpdated: '',
      noNetwork: false,
      showArticlesLoading: false,
      showArticlesLoadingError: false,
      isEnabled: false,
      setIsEnabled: false,
      taskCreated: '',
      showLoginWithoutInternet: false,
      seconds: 0,
      scnd: 0,
      noInternet: false,

      progressValue: 3,
      isOfflineAlert: this.props.navigation.getParam('isOfflineAlert', ''),
    };

    this.pushNotificationService = new PushNotificationService();
    this.backgroundSync = new BackgroundSync();
    this.drawerCallBack();
    // this.unsubscribe = NetInfo.addEventListener(state => {
    //   if (state.isConnected) {
    //     alert('hello');
    //   } else {
    //     alert('bye');
    //   }
    // });
  }

  onChangeFunction(value) {
    // alert(value);
    this.setState({taskCreated: value}, () => {
      this.checkOfline();
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

  checkOfline() {
    AsyncStorage.getItem('accessToken').then(token => {
      if (token != null) {
        OfflineManager.setOnline(this.state.taskCreated);
      } else {
        setTimeout(() => {
          alert('Your token has expired. Please login with online mode.');
          this.logoutUser();
        }, 300);
      }
    }),
      console.log('sing' + OfflineManager.isOnline);
  }

  componentDidMount() {
    NetInfo.fetch().then(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      if (state.isConnected == false) {
        // Alert.alert('', 'Συναγερμός', [
        //   {
        //     text: 'Εντάξει',
        //     // onPress: () => {
        //     //   this.resetHomeScreen();
        //     // },
        //   },
        //   {
        //     text:
        //       'Λειτουργία εκτός σύνδεσης – Έχετε πρόσβαση μόνο στα άρθρα του Α.Κ. , Κ.Πολ.Δ.  , Π.Κ. , Κ.Π.Δ., ως έχουν βάσει της τελευταίας εγκατάστασης ενημερώσεων που πραγματοποιήσατε?',
        //     onPress: () => {},
        //   },
        // ]);
      }
    });
    this.checkNetwork();
    this.isOfflineSyncComplete();
    this.networkListener();
    this.startFetchingOfflineData();
    this.newsService.getNews();
    this.updateService.loadUpdates();
    this.pushNotificationService.enablePushNotifications();

    // if (OfflineManager.getOnline() == false) {
    //  this.showSwitchOption();
    //}

    AsyncStorage.getItem('checkOffline').then(value => {
      if (value == 'false') {
        OfflineManager.setOnline(false);
      } else {
        OfflineManager.setOnline(true);
      }
    });

    setTimeout(() => {
      AppState.addEventListener('change', this._handleAppStateChange);
    }, 3000);

    setTimeout(() => {
      SplashScreen.hide();
      Orientation.unlockAllOrientations();
    }, 2000);

    this.props.navigation.addListener('willBlur', payload => {
      this.networkListener.remove();
    });

    this.listeningProgressSleepChanges();

    this.syncErrorListener = DeviceEventEmitter.addListener(
      'showArticlesLoadingError',
      () => {
        //alert('error')
        this.setState({showArticlesLoadingError: CacheService.syncError});
      },
    );

    setTimeout(() => {
      this.getLastUpdated();
    }, 100);
  }
  checkNetwork() {
    NetworkUtiliy.checkIsNetwork().then(response => {
      if (response.isConnected) {
        // alert('hi');
        AsyncStorage.getItem('checkOffline').then(value => {
          if (value !== 'true') {
            // alert(value);
            // alert('hi');
            AsyncStorage.getItem('isMOdalOpen').then(value => {
              if (!value) {
                setTimeout(() => {
                  Alert.alert(
                    '',
                    'Έχει βρεθεί σύνδεση internet. Θέλετε να συνεχίσετε σε online mode;',
                    [
                      {
                        text: 'Ok',
                        onPress: () => {
                          AsyncStorage.setItem('isMOdalOpen', 'true');
                          this.props.navigation.navigate('OfflineSwitch');
                        },
                      },
                      {
                        text: 'cancel',
                        onPress: () => {
                          AsyncStorage.setItem('isMOdalOpen', 'true');
                        },
                      },
                    ],
                  );
                }, 3000);
              }
            });

            DeviceEventEmitter.emit('isDeviceOnline');
          }
        });
      }
    });
  }

  showSwitchOption() {
    // offlineDatabase.getToggleOfflineTime();
    return false;
    // alert(OfflineManager.getOnline());
    let intervalId = '';
    if (OfflineManager.getOnline() == false) {
      console.log('offline mode on.');
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
      }, 30000);
    } else {
      console.log('online mode on.');
      BackgroundTimer.clearInterval(intervalId);
    }
    //console.log('seconds with backgroundTimer' + this.state.scnd);
    return false;
    this.interval = setInterval(() => {
      // alert(this.state.noInternet);
      if (this.state.seconds == 4350) {
        console.log('sec1111' + this.state.seconds);
        // alert('kkklll');
        // AsyncStorage.getItem('isOfflineLoggedIn').then(value => {
        //   alert(value);
        if (this.state.seconds == 4350) {
          //  alert('null');
          //   // alert(this.state.seconds)
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
        clearInterval(this.interval);
        return;
        // });
      }
      console.log('sec' + this.state.seconds);
      let sec = this.state.seconds;
      let percent = 5;
      sec = sec + percent;
      this.setState({seconds: sec});
    }, 1000);
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
   * Listens when user is offline
   */
  networkListener() {
    this.networkListener = DeviceEventEmitter.addListener(
      'NoNetwork',
      event => {
        if (!this.state.noNetwork) {
          this.setState({noNetwork: true});
          //change by akriti
          if (this.state.noNetwork == true) {
            this.props.navigation.navigate('NoNetwork');
            this.onRefreshPress();
            //end
          }
        }
      },
    );
  }

  listeningProgressSleepChanges = () => {
    DeviceEventEmitter.addListener('syncProgressChange', e =>
      this.handleProgressSyncEvent(e),
    );
  };

  handleProgressSyncEvent = event => {
    console.log('event emitter ', JSON.stringify(event));
    //let babyid = event.babyid;

    let progress = Number(event.pagedone / event.totalPages) * 100;

    console.log('progress is ' + progress);

    this.setState({
      progressValue: Math.floor(progress),
    });
  };

  componentWillUnmount() {
    this.articleLoadingListener.remove();
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  /**
   * Starts Fetching offline Articles from server
   */
  startFetchingOfflineData() {
    if (!CacheService.isFetchingArticles) {
      CacheService.isFetchingArticles = true;
      this.backgroundSync.fetchOfflineLawCategories();
      //this.backgroundSync.startFetchingArticles();
    }
  }

  /**
   * When User presses refresh on network error screen
   */
  onRefreshPress() {
    this.setState({noNetwork: false}, () => {
      this.getLastUpdated();
    });
  }

  /**
   * Navigates user to law categories screen.
   */
  gotoMultipleLaws() {
    this.props.navigation.navigate('LawCategories');
  }

  /**
   * Navigates user to search screen.
   */
  gotoNomologia() {
    // this.props.navigation.navigate('SearchTabs');
    this.props.navigation.navigate('SearchTabs', {index: 1});
  }

  /**
   * Get Last updated from server
   */
  getLastUpdated() {
    this.apiService
      .getLastUpdated()
      .then(response => {
        if (response.error == 'token_expired') {
          this.logoutUser();
        }
        this.setState({lastUpdated: response.page.body, noInternet: false});

        if (OfflineManager.isOnline == null) OfflineManager.setOnline(true);
      })
      .catch(error => {
        if (error == 'Network Error') {
          this.setState({noInternet: true});
          if (OfflineManager.isOnline == null) OfflineManager.setOnline(false);
          if (!this.state.noNetwork) {
            //this.setState({noNetwork: true});
          }
        }
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.titleView}>
            <Text style={styles.title}>ΤΕΤΡΑΒΙΒΛΟΣ ΝΟΜΟΠΑΙΔΕΙΑ</Text>
          </View>

          {/* <NetworkError
            ref={o => (this.NetworkError = o)}
            cancel={() => this.dismissNetworkModal()}
            noNetwork={this.state.noNetwork}
            onPress={() => this.onRefreshPress()}
          /> */}
          {/* {this.state.showLoginWithoutInternet && (
           
          )} */}

          <TouchableOpacity
            onPress={() => this.gotoMultipleLaws()}
            style={styles.shadowbox}>
            <View style={[styles.touchable]}>
              <Text style={styles.text}>Νομοθεσία</Text>
              <View
                style={{
                  width: '10%',
                  alignItems: 'flex-end',
                  paddingRight: moderateScale(15),
                }}>
                <Image
                  style={{
                    width: moderateScale(20),
                    height: moderateScale(20),
                  }}
                  source={require('../assets/right-arrow.png')}
                />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.gotoNomologia()}
            style={styles.shadowbox}>
            <View style={styles.touchable}>
              <Text style={styles.text}>Νομολογία</Text>
              <View
                style={{
                  width: '10%',
                  alignItems: 'flex-end',
                  paddingRight: moderateScale(15),
                }}>
                <Image
                  style={{
                    width: moderateScale(20),
                    height: moderateScale(20),
                  }}
                  source={require('../assets/right-arrow.png')}
                />
              </View>
            </View>
          </TouchableOpacity>

          {this.state.lastUpdated != '' && (
            <View style={styles.shadowbox}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>{this.state.lastUpdated}</Text>
              </View>
            </View>
          )}
          <Text
            style={{
              fontSize: moderateScale(13),
              color: '#000000',
              paddingRight: moderateScale(8),
              textAlign: 'right',
            }}>
            Τρέχουσα έκδοση: {this.state.appVersion}
          </Text>

          {this.state.showArticlesLoading && (
            <View
              style={{
                paddingVertical: moderateScale(10),
                paddingHorizontal: moderateScale(10),
              }}>
              <Text
                style={{
                  color: '#000',
                  marginBottom: moderateScale(10),
                  fontWeight: 'bold',
                  fontSize: moderateScale(18),
                }}>
                Διαδικασία Ενημέρωσης των 4 Κωδίκων (Α.Κ., Κ.ΠΟΛ.Δ., Π.Κ.,
                Κ.Π.Δ.) ώστε να είναι διαθέσιμοι και εκτός σύνδεσης σε δίκτυο. Η
                διαδικασία αυτή θα διαρκέσει μερικά λεπτά. Παρακαλούμε πολύ
                ΠΑΡΑΜΕΙΝΕΤΕ ΣΥΝΔΕΔΕΜΕΝΟΙ εωσότου ολοκληρωθεί
              </Text>
              {/* <Progress.Bar
                color={'#016622'}
                useNativeDriver={true}
                indeterminate={true}
                indeterminateAnimationDuration={2000}
                width={null}
                progress={5}
              /> */}
              <Text />
              <PercentageProgressbar
                complete={this.state.isSyncingComplete}
                progressStatus={this.state.progressValue}
              />
            </View>
          )}

          {this.state.showArticlesLoadingError && !this.showArticlesLoading && (
            <TouchableOpacity
              onPress={() => {
                this.setState({showArticlesLoadingError: false});
                this.backgroundSync.startFetchingArticles();
              }}
              style={{
                paddingVertical: moderateScale(10),
                paddingHorizontal: moderateScale(10),
                alignItems: 'center',
                marginTop: moderateScale(10),
              }}>
              <Text
                style={{
                  color: '#000',
                  fontSize: moderateScale(20),
                  fontWeight: 'bold',
                  marginRight: moderateScale(10),
                }}>
                Προσπαθήστε Ξανά
              </Text>
              <Ionicons
                style={{
                  marginTop: moderateScale(9),
                }}
                name="ios-refresh-circle"
                size={moderateScale(35)}
                color="green"
              />
            </TouchableOpacity>
          )}
          {!OfflineManager.isOnline && (
            <View style={{justifyContent: 'center'}}>
              <Text
                style={{
                  color: '#000',
                  textAlign: 'center',
                  fontSize: moderateScale(15),
                  // position: 'absolute',
                  // bottom: -180,
                  fontWeight: 'bold',
                  padding: moderateScale(15),
                }}>
                Λειτουργία εκτός σύνδεσης - Έχετε πρόσβαση μόνο στα άρθρα του
                Α.Κ., Κ.Πολ.Δ., Π.Κ., Κ.Π.Δ., ως έχουν βάσει της τελευταίας
                εγκατάστασης ενημερώσεων που πραγματοποιήσατε
              </Text>
            </View>
          )}
        </ScrollView>

        {this.state.showLoginWithoutInternet && (
          <View
            style={{
              width: '100%',
              paddingBottom: moderateScale(25),
              shadowOffset: {
                width: 0,
                height: -3,
              },
              shadowOpacity: 0.29,
              shadowRadius: 2,
              elevation: 4,
              shadowColor: '#000',
              backgroundColor: '#fff',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: moderateScale(15),
                paddingLeft: moderateScale(10),
                width: '90%',
                fontWeight: 'bold',
              }}>
              Για εναλλαγή εντός - εκτός δικτύου πατήστε το στο πάνω μέρος της
              οθόνης
            </Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('OfflineSwitch')}>
              <MaterialIcons
                name="tap-and-play"
                color="#016622"
                size={30}
                style={{marginLeft: 0}}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: moderateScale(18),
    marginTop: moderateScale(10),
    padding: moderateScale(5),
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#016622',
  },
  text: {
    padding: moderateScale(12),
    fontSize: moderateScale(18),
    width: '90%',
    color: '#000',
  },
  touchable: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: moderateScale(8),
  },
  shadowbox: {
    shadowOffset: {width: 0, height: 2},
    shadowColor: '#000',
    shadowOpacity: 0.2,
    elevation: moderateScale(10),
    borderRadius: moderateScale(10),
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: moderateScale(1),
    marginLeft: moderateScale(12),
    marginRight: moderateScale(12),
    marginBottom: moderateScale(15),
  },
  titleView: {
    width: '100%',
    marginBottom: moderateScale(10),
  },

  button: {
    borderRadius: moderateScale(8),
    alignItems: 'flex-start',
    padding: moderateScale(5),
    paddingLeft: moderateScale(12),
    minWidth: '100%',
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#000',
    fontSize: moderateScale(14),
    textAlign: 'left',
    lineHeight: moderateScale(20),
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
