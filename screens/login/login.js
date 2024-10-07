/**
 * 
 @author Logicease
 *
 */
import React, {Component} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Platform,
  TextInput,
  Image,
  ImageBackground,
  Dimensions,
  ScrollView,
  Linking,
  KeyboardAvoidingView,
  DeviceEventEmitter,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import AuthService from '../services/auth_service';
import ApiService from '../services/api_service';
import Modal from 'react-native-modal';
import Feather from 'react-native-vector-icons/Feather';
import SplashScreen from 'react-native-splash-screen';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import AsyncStorage from '@react-native-community/async-storage';
import {StackActions, NavigationActions} from 'react-navigation';
import Screen from '../screens/screen';
import Orientation from 'react-native-orientation';
import CustomAlert from '../component/custom_alert';
import NetworkError from '../component/network-error';
import {SafeAreaView} from 'react-navigation';
import OfflineManager from '../services/offline_service';
import BackgroundSync from '../services/articles_background_sync';
import CacheService from '../services/cache_service';
import moment from 'moment';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
const invalidEmailText = 'Λανθασμένη εισαγωγή στοιχείων εισόδου';
// const simultaneousText =
//   'Είστε ήδη συνδεδεμένος από άλλη συσκευή. Παρακαλούμε αποσυνδεθείτε πριν μπορέσετε να συνδεθείτε ξανά.';
const {width, height} = Dimensions.get('screen');

export default class Login extends Screen {
  // static navigationOptions = ({navigation}) => {
  //   const showArticlesLoading =
  //     typeof navigation.state.params === 'undefined' ||
  //     typeof navigation.state.params.showArticlesLoading == 'undefined'
  //       ? CacheService.showArticlesLoading
  //       : navigation.state.params.showArticlesLoading;
  //       return
  // };
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: '',
      isModalVisible: false,
      isRememberPress: false,
      isOfflineLogin: true,
      email: '',
      isPasswordVisible: false,
      disableButton: true,
      loginLoader: false,
      invalidEmail: false,
      noNetwork: false,
      isKeyboardOpen: true,
      OrientationStatus: 'Portrait Mode',
      showLoginWithoutInternet: false,
    };
    this.backgroundSync = new BackgroundSync();
    this.authService = new AuthService();
    this.apiService = new ApiService();
    this.simultaneousText =
      'Είστε ήδη συνδεδεμένος από άλλη συσκευή. Παρακαλούμε αποσυνδεθείτε πριν μπορέσετε να συνδεθείτε ξανά.';
  }

  componentDidMount() {
    SplashScreen.hide();
    this.isOfflineSyncComplete();
    // this unlocks any previous locks to all Orientations
    Orientation.addOrientationListener(this._orientationDidChange);
    this.DetectOrientation();
    // this.checkUserToken();
    this.isMoreThan6Months();
    this.isOfflineLoggedIn();
    this.props.navigation.addListener('willBlur', payload => {
      this.networkListener.remove();
    });
    this.networkListener = DeviceEventEmitter.addListener(
      'NoNetwork',
      event => {
        if (!this.state.noNetwork) {
          this.setState({loader: false, noNetwork: true});
          if (this.state.noNetwork == true) {
            this.props.navigation.navigate('NoNetwork');
            this.onRefreshPress();
            //end
          }
        }
      },
    );
  }
  /**
   * Starts Fetching offline Articles from server
   */
  startFetchingOfflineData() {
    this.props.navigation.navigate('HeaderHome');
    if (!CacheService.isFetchingArticles) {
      CacheService.isFetchingArticles = true;
      this.backgroundSync.fetchOfflineLawCategories();

      //this.backgroundSync.startFetchingArticles();
    }
  }

  loginWithoutInternet() {
    this.backgroundSync.fetchOfflineLawCategories();
    this.props.navigation.navigate('HeaderHome');
  }

  async isOfflineSyncComplete() {
    let currentPage = await AsyncStorage.getItem('currentPage');
    let lastPage = await AsyncStorage.getItem('lastPage');
    if (currentPage != null && lastPage != null) {
      if (currentPage == lastPage) {
        this.setState({showLoginWithoutInternet: true});
      } else {
        this.setState({showLoginWithoutInternet: false});
      }
    } else {
      this.setState({showLoginWithoutInternet: false});
    }
  }

  _orientationDidChange = orientation => {
    if (orientation === 'LANDSCAPE') {
      // do something with landscape layout
      if (this.state.OrientationStatus != 'Landscape Mode') {
        this.setState(
          {
            OrientationStatus: 'Landscape Mode',
          },
          () => {
            //alert('change')
          },
        );
      }
    } else {
      // do something with portrait layout
      if (this.state.OrientationStatus != 'Portrait Mode') {
        this.setState(
          {
            OrientationStatus: 'Portrait Mode',
          },
          () => {
            //alert('change')
          },
        );
      }
    }
  };

  componentWillUnmount() {
    Orientation.removeOrientationListener(this._orientationDidChange);
  }

  /**
   * When User presses refresh on network error screen
   */
  onRefreshPress() {
    this.setState({noNetwork: false, loginLoader: false});
  }

  isOfflineLoggedIn() {
    // AsyncStorage.setItem('offlineLoginDetails',{
    //   isOfflineLogin:true,
    //   offlineTime:currentTime
    // });

    AsyncStorage.getItem('offlineLoginDetails').then(value => {
      console.log('offline time is ' + JSON.stringify(value));
      let details = JSON.parse(value);
      console.log('time is ' + details.offlineTime);
      console.log('time is ' + this.isMoreThan6Months(details.offlineTime));

      if (!this.isMoreThan6Months(details.offlineTime)) {
        console.log('sav' + details.offlineTime);
        SplashScreen.hide();
      } else {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({routeName: 'Home'})],
        });
        this.props.navigation.dispatch(resetAction);
      }

      // isOfflineLogin:true,
      // offlineTime:currentTime

      // if (this.isMoreThan6Months(value)) {
      //   SplashScreen.hide();
      // } else {
      //   const resetAction = StackActions.reset({
      //     index: 0,
      //     actions: [NavigationActions.navigate({routeName: 'Home'})],
      //   });
      //   this.props.navigation.dispatch(resetAction);
      // }
    });
  }

  /**
   * Logs user in if access token present in local storage
   */
  checkUserToken() {
    AsyncStorage.getItem('accessToken')
      .then(token => {
        if (token != null) {
          this.isOfflineLoggedIn();
        } else {
          this.fetchUserLoginDetails();
        }
      })
      .catch(error => {
        this.fetchUserLoginDetails();
      });
  }

  /**
   *Check login credentials save time
   * if save time is more than 20 days.
   * dont show username and password
   */
  isLessThan20Days(savetime) {
    console.log('difference in days savetime' + savetime);
    let credsSaveTime = moment(savetime);
    let currentTime = moment();
    let days = currentTime.diff(credsSaveTime, 'days');
    console.log('difference in days savetime' + days);

    if (days < 20) {
      return true;
    } else {
      return false;
    }
  }

  isMoreThan6Months(savetime) {
    const credsSaveTime = moment(savetime).format('DD/MM/YYYY');
    const currentTime = moment().format('DD/MM/YYYY');
    let date = moment(currentTime).format('DD/MM/YYYY');
    // alert(date)
    console.log('difff' + credsSaveTime);
    const diffTime = Math.abs(currentTime - credsSaveTime);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log(diffTime + ' milliseconds');
    // console.log(diffDays + " days");
    // console.log('difference in days savetime' + savetime);
    // let credsSaveTime = moment(savetime).format("MMM Do YY");
    // let currentTime =moment().format("MMM Do YY");
    // console.log('cur'+credsSaveTime)
    // console.log('current'+currentTime)
    // let days = currentTime.diff(credsSaveTime, 'days');

    console.log('difference in days savetime' + diffDays);

    // if (days > 180) {
    //   return true;
    // } else {
    //   return false;
    // }
  }

  /**
   * Fetches user login id and password if user has pressed remember me
   */
  fetchUserLoginDetails() {
    AsyncStorage.getItem('REMEMBERLOGIN').then(value => {
      if (value !== null && value == 'YES') {
        AsyncStorage.getItem('LOCAL_USER_CREDS').then(data => {
          // AsyncStorage.getItem('LOCAL_PASS').then(password => {
          let user = JSON.parse(data);
          if (
            user.email &&
            user.password &&
            this.isLessThan20Days(user.savetime)
          ) {
            this.setState(
              {
                userName: user.email,
                password: user.password,
                isRememberPress: true,
              },
              () => {
                this.enableButton();
                SplashScreen.hide();
                Orientation.unlockAllOrientations();
              },
            );
          } else {
            SplashScreen.hide();
            Orientation.unlockAllOrientations();
          }
          // });
        });
      } else {
        setTimeout(() => {
          SplashScreen.hide();
          Orientation.unlockAllOrientations();
        }, 2000);
      }
    });
  }

  validate() {
    var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (pattern.test(this.state.userName)) {
      this.loginUser();
    } else {
      this.setState({invalidEmail: true}, () => {
        this.CustomAlert.toggleModal();
      });
    }
  }

  loginUser() {
    //  alert('username '+this.state.userName + " password "+this.state.password)
    this.setState({loginLoader: true});
    this.authService
      .login(this.state.userName, this.state.password)
      .then(response => {
        this.setState({loginLoader: false});
        if (response.error == 'simultaneous_login') {
          this.simultaneousText =
            'Είστε ήδη συνδεδεμένος από άλλη συσκευή. Παρακαλούμε αποσυνδεθείτε πριν μπορέσετε να συνδεθείτε ξανά.';
          this.setState({invalidEmail: false}, () => {
            this.CustomAlert.toggleModal();
          });
        }
        if (response.error == 'expired_subscription') {
          console.log('222');
          this.simultaneousText =
            'Η συνδρομή σας έχει λήξει. Παρακαλώ επικοινωνήστε στο 2108253032 ή 2108253033 για περισσότερες πληροφορίες';

          this.setState({invalidEmail: false}, () => {
            this.CustomAlert.toggleModal();
          });
        }

        if (this.state.isRememberPress) {
          AsyncStorage.setItem('REMEMBERLOGIN', 'YES');
        } else {
          AsyncStorage.setItem('REMEMBERLOGIN', 'NO');
        }

        console.log('DATA FROM SERVER' + JSON.stringify(response));
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({routeName: 'Home'})],
        });
        this.props.navigation.dispatch(resetAction);
      })
      .catch(error => {
        if (error == 'simultaneous_login') {
          this.setState({invalidEmail: false}, () => {
            this.CustomAlert.toggleModal();
            this.setState({loginLoader: false});
          });

          this.simultaneousText =
            'Είστε ήδη συνδεδεμένος από άλλη συσκευή. Παρακαλούμε αποσυνδεθείτε πριν μπορέσετε να συνδεθείτε ξανά.';
        }
        if (error == 'expired_subscription') {
          console.log('111');
          this.simultaneousText =
            'Η συνδρομή σας έχει λήξει. Παρακαλώ επικοινωνήστε στο 2108253032 ή 2108253033 για περισσότερες πληροφορίες';

          this.setState({invalidEmail: false}, () => {
            this.CustomAlert.toggleModal();
            this.setState({loginLoader: false});
          });
        }
        if (error == 'invalid_credentials') {
          console.log('expire' + JSON.stringify(error));
          this.setState({invalidEmail: true}, () => {
            this.CustomAlert.toggleModal();
            this.setState({loginLoader: false});
          });
        }
        console.log('ERROR FROM SERVER' + JSON.stringify(error));
      });
    // this.props.navigation.navigate('Home')
  }

  onRefresh() {
    //this.loginUser();
    console.log('login page refresh');
  }

  passwordToggle() {
    this.setState({
      isPasswordVisible: !this.state.isPasswordVisible,

      // Show: true,
    });
  }

  enableButton() {
    if (this.state.userName != '' && this.state.password != '') {
      this.setState({
        disableButton: false,
      });
    } else {
      this.setState({
        disableButton: true,
      });
    }
  }

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };

  ButtonPressed = () => {
    Keyboard.dismiss();
    this.setState({
      isRememberPress: !this.state.isRememberPress,
      // Show: true,
    });
  };
  //sagar
  isLoginOffline() {
    //  AsyncStorage.setItem('isOfflineLoggedIn', 'True');

    let currentTime = moment();

    let offlineDetails = {
      isOfflineLogin: true,
      offlineTime: currentTime,
    };
    AsyncStorage.setItem('offlineLoginDetails', JSON.stringify(offlineDetails));

    console.log('time of tim');
    this.props.navigation.navigate('Home');
  }

  DetectOrientation() {
    if (Dimensions.get('window').width > Dimensions.get('window').height) {
      //if (Dimensions.get('screen').width > Dimensions.get('screen').height) {
      // Write Your own code here, which you want to execute on Landscape Mode.
      if (this.state.OrientationStatus != 'Landscape Mode') {
        this.setState(
          {
            OrientationStatus: 'Landscape Mode',
          },
          () => {
            //alert('change')
          },
        );
      }
    } else {
      // Write Your own code here, which you want to execute on Portrait Mode.
      if (this.state.OrientationStatus != 'Portrait Mode') {
        this.setState(
          {
            OrientationStatus: 'Portrait Mode',
          },
          () => {
            //alert('change')
          },
        );
      }
    }
  }

  showDimensions() {
    alert(`device width : ${Dimensions.get('window').width}
    device height : ${Dimensions.get('window').height}`);
  }

  render() {
    const heightOfDeviceScreen = Dimensions.get('window').height;
    return (
      <SafeAreaView
        style={[{flex: 1}, {backgroundColor: '#fff'}]}
        forceInset={{bottom: 'never', left: 'never', right: 'never'}}>
        <ScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            {
              width: '100%',
            },
            this.state.OrientationStatus == 'Portrait Mode'
              ? {height: hp('100%')}
              : {aspectRatio: 0.5625},
          ]}>
          <ImageBackground
            style={[
              {
                flexGrow: 1,
                width: '100%', // applied to Image
                justifyContent: 'center',
              },
              this.state.OrientationStatus == 'Portrait Mode'
                ? {height: hp('100%')}
                : {aspectRatio: 0.5625},
            ]}
            resizeMode="cover"
            source={{uri: 'login_3'}}>
            {/* <NetworkError
              ref={o => (this.NetworkError = o)}
              cancel={() => this.dismissNetworkModal()}
              noNetwork={this.state.noNetwork}
              onPress={() => this.onRefreshPress()}
            /> */}
            {this.state.loginLoader && (
              <View style={styles.loader}>
                <ActivityIndicator size="large" color="white" />
              </View>
            )}
            <CustomAlert
              ref={o => (this.CustomAlert = o)}
              title={'ΛΑΘΟΣ'}
              message={
                this.state.invalidEmail
                  ? invalidEmailText
                  : this.simultaneousText
              }
            />
            <View
              style={{
                marginTop: '15%',
                paddingHorizontal: moderateScale(20),
                paddingTop:
                  this.state.OrientationStatus == 'Portrait Mode'
                    ? hp('9%')
                    : hp('2%'),
              }}>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Ον. Χρήστη"
                  placeholderTextColor="#353535"
                  onChangeText={text => {
                    this.setState({userName: text}, () => {
                      this.enableButton();
                    });
                  }}
                  // onFocus={Keyboard.dismiss}
                  autoFocus={() => this.ButtonPressed()}
                  value={this.state.userName}
                  style={styles.emailInput}
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Κωδικός"
                  placeholderTextColor="#353535"
                  onChangeText={text => {
                    this.setState({password: text}, () => {
                      this.enableButton();
                    });
                  }}
                  // autoFocus={() => this.passwordToggle()}
                  value={this.state.password}
                  style={styles.passwordInput}
                  secureTextEntry={!this.state.isPasswordVisible}
                />
                {this.state.isPasswordVisible ? (
                  <TouchableOpacity
                    onPress={() => this.passwordToggle()}
                    style={{position: 'absolute', zIndex: -5, right: 10}}>
                    <Icon
                      name="eye-with-line"
                      color="#b0b0b0"
                      size={moderateScale(20)}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{position: 'absolute', zIndex: -5, right: 10}}
                    onPress={() => this.passwordToggle()}>
                    <Icon name="eye" color="#b0b0b0" size={moderateScale(20)} />
                  </TouchableOpacity>
                )}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}>
                <TouchableOpacity onPress={() => this.ButtonPressed(false)}>
                  {this.state.isRememberPress ? (
                    <Feather
                      name="check-square"
                      size={moderateScale(25)}
                      color="#fff"
                    />
                  ) : (
                    <Feather
                      name="square"
                      color="#fff"
                      size={moderateScale(25)}
                    />
                  )}
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: moderateScale(18),
                    width: '70%',
                    padding: moderateScale(5),
                    marginLeft: moderateScale(10),
                    color: '#ffffff',
                  }}>
                  Να με θυμάσαι
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'flex-start',
                  width: '100%',
                }}>
                <Text style={styles.sublines}>
                  Συμπληρώστε το όνομα χρήστη και τον κωδικό που ήδη
                  χρησιμοποιείτε για την σύνδεσή σας στην Νομοπαίδεια
                </Text>
              </View>

              <View
                style={{
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  width: '100%',
                  marginVertical: moderateScale(10),
                }}>
                <Text style={styles.sublines}>
                  Αν δεν έχετε κωδικούς:
                  <Text
                    onPress={() =>
                      Linking.openURL('http://www.tetravivlos.gr/news/152')
                    }
                    style={styles.sublines}>
                    {' '}
                    Αποκτήστε κωδικούς πρόσβασης στην Νομοπαίδεια.
                  </Text>{' '}
                </Text>
              </View>

              <TouchableOpacity
                disabled={this.state.disableButton}
                style={styles.button}
                onPress={() => this.loginUser()}>
                <Text
                  style={
                    this.state.disableButton
                      ? styles.buttonDisabled
                      : styles.enableButton
                  }>
                  Σύνδεση
                </Text>
              </TouchableOpacity>
              {/* {this.state.showLoginWithoutInternet && ( */}
              <TouchableOpacity
                // disabled={this.state.disableButton}
                style={styles.button}
                onPress={() => this.isLoginOffline()}>
                <Text style={styles.enableButton}>Σύνδεση χωρίς internet</Text>
              </TouchableOpacity>
              {/* )} */}
            </View>
          </ImageBackground>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
  },

  title: {
    color: '#006621',
    fontSize: moderateScale(11),
  },

  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: moderateScale(25),
    width: '100%',
    //position: 'relative',
    // paddingTop:moderateScale(40)
  },

  mainheading: {
    color: '#006621',
    fontSize: moderateScale(36),
    fontWeight: 'bold',
    marginBottom: moderateScale(20),
  },

  emailInput: {
    width: '100%',
    fontSize: moderateScale(17),
    padding: 0,
  },
  passwordInput: {
    width: '85%',
    fontSize: moderateScale(17),
    padding: 0,
  },

  button: {
    padding: moderateScale(10),
    borderRadius: moderateScale(5),
    backgroundColor: '#ffffff',
    width: '100%',
    justifyContent: 'center',
    marginTop: moderateScale(10),
    height: moderateScale(50),
  },

  sublines: {
    fontSize: moderateScale(13.5),
    lineHeight: moderateScale(20),
    // justifyContent: 'flex-start',
    // padding: moderateScale(5),
    // marginLeft: moderateScale(10),
    color: '#ffffff',
  },
  link1: {
    fontStyle: 'italic',
    paddingTop: moderateScale(15),
    padding: moderateScale(4),
    fontSize: moderateScale(13.5),
    color: '#ffffff',
    textDecorationLine: 'underline',
  },
  link2: {
    padding: moderateScale(4),
    fontSize: moderateScale(13.5),
    color: '#ffffff',
  },
  inputContainer: {
    position: 'relative',

    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: moderateScale(8),
    borderRadius: moderateScale(5),
    marginTop: moderateScale(10),
    borderColor: 'white',
    borderWidth: moderateScale(1),
    borderBottomColor: '#dddddd',
    backgroundColor: 'white',
    padding: moderateScale(5),
    maxHeight: 60,
  },
  enableButton: {
    color: '#006621',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: moderateScale(18),
  },
  buttonDisabled: {
    color: '#4c7941',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: moderateScale(18),
  },
  loader: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    zIndex: 2,
    justifyContent: 'center',
  },
  remember: {
    borderWidth: moderateScale(2),
    backgroundColor: '#ffffff',
    height: moderateScale(20),
    borderColor: 'white',
    width: moderateScale(20),
    borderRadius: moderateScale(5),
  },
  notRemember: {
    borderWidth: moderateScale(2),
    height: moderateScale(20),
    borderColor: 'white',
    width: moderateScale(20),
    borderRadius: moderateScale(5),
  },
});
