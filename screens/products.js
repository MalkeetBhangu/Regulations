/**
 * 
 @author Logicease
 *
 */
import React, {Component} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Image,
  ScrollView,
  DeviceEventEmitter,
  Alert,
  BackHandler,
} from 'react-native';
import Loading from '../component/loading';
import ApiService from '../services/api_service';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import Screen from '../screens/screen';
import OfflineManager from '../services/offline_service';
import NetworkError from '../component/network-error';
import AsyncStorage from '@react-native-community/async-storage';
import {StackActions, NavigationActions} from 'react-navigation';
import {WebView} from 'react-native-webview';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import INJECTEDJAVASCRIPT from '../component/injectedJavascript';
import NetInfo from '@react-native-community/netinfo';

export default class Products extends Screen {
  constructor(props) {
    super(props);
    this.state = {
      loader: true,
      products: '',
      noNetwork: false,
      noInternet: false,
      notAvailableOffline: false,
      checkOnline: null,
      // offlineSwitch: OfflineManager.getInstance(),
    };
    this.apiService = new ApiService();
    // alert(this.state.noNetwork)
    {
      this.state.noInternet == true
        ? this.getProductsOffline()
        : this.getProducts();
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('checkOffline').then(value => {
      this.setState({checkOnline: JSON.parse(value)});
    }); //change by akriti
    // alert(OfflineManager.isOnline)
    this.unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        this.refreshCategories();
      } else {
        if (OfflineManager.isOnline) {
          this.setState({noNetwork: true});
          this.resetHomeScreen();
          // Alert.alert('', 'Συναγερμός', [
          //   {
          //     text: 'Εντάξει',
          //     onPress: () => {
          //       this.props.navigation.navigate('HeaderHome', {
          //         isOfflineAlert: true,
          //       });
          //     },
          //   },
          //   {
          //     text:
          //       'Λειτουργία εκτός σύνδεσης – Έχετε πρόσβαση μόνο στα άρθρα του Α.Κ. , Κ.Πολ.Δ.  , Π.Κ. , Κ.Π.Δ., ως έχουν βάσει της τελευταίας εγκατάστασης ενημερώσεων που πραγματοποιήσατε?',
          //     onPress: () => {},
          //   },
          // ]);
        } else {
          this.refreshCategories();
        }
      }
    });
  }
  resetHomeScreen() {
    // alert('Your token has expired. Please login with online mode.');
    // this.authService.resetUserCredentials();
    OfflineManager.setOnline(false);
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName: 'Home'})],
    });
    this.props.navigation.dispatch(resetAction);
  }
  /**
   * Method used to refresh categories
   */
  refreshCategories() {
    setTimeout(() => {
      //change by akriti
      if (!this.state.checkOnline) {
        this.setState({noNetwork: true});

        this.getProductsOffline();
      } else {
        this.getProducts();
      }
    }, 100);
  }

  /**
   * When User presses refresh on network error screen
   */
  onRefreshPress() {
    this.setState({noNetwork: false}, () => {
      this.getProducts();
    });
  }

  // /**
  //  * When User presses back on network error screen dismiss the modal
  //  */
  // dismissNetworkModal() {
  //   this.setState({noNetwork: false});
  // }

  /**
   * Fetch
   */
  getProducts() {
    this.apiService
      .getProducts()
      .then(response => {
        if (response.error == 'token_expired') {
          this.logoutUser();
        }
        AsyncStorage.setItem(
          'products',
          JSON.stringify(response.mobile_page.body),
        );
        this.setState({products: response.mobile_page.body, loader: false});
      })
      .catch(error => {
        if (error == 'No Internet') {
          this.getProductsOffline();
        } else if (error == 'Not Logged In') {
          this.getProductsOffline();
        } else {
          this.setState({loader: false});
        }

        console.log('ERROR FROM SERVER' + JSON.stringify(error));
      });
  }

  /**
   * Get Instructions Offline if user is not connected to internet
   */
  getProductsOffline() {
    AsyncStorage.getItem('products').then(response => {
      if (response !== null) {
        let products = JSON.parse(response);
        this.setState({products, loader: false});
      } else {
        setTimeout(() => {
          this.setState({
            loader: false,
            noNetwork: true,
            noInternet: true,
            notAvailableOffline: true,
          });
        }, 1500);
        if (this.state.noNetwork == true) {
          this.props.navigation.navigate('NoNetwork');
          this.onRefreshPress();
          //end
        }
      }
    });
  }

  onShouldStartLoadWithRequest(event) {
    if (event.url && event.url !== 'about:blank') {
      this.openLink(event.url);
      this.webview.stopLoading();
      return false;
    }

    return true;
  }

  render() {
    if (this.state.loader) {
      return <Loading />;
    }
    return (
      <View style={{flex: 1}}>
        {/* <NetworkError
          cancel={() => this.dismissNetworkModal()}
          ref={o => (this.NetworkError = o)}
          noNetwork={this.state.noNetwork}
          onPress={() => this.onRefreshPress()}
        /> */}
        <WebView
          ref={webview => {
            this.webview = webview;
          }}
          injectedJavaScript={INJECTEDJAVASCRIPT}
          scalesPageToFit={false}
          showsVerticalScrollIndicator={false}
          originWhitelist={[
            '*',
            'https://*',
            'http://*',
            'file://*',
            'sms://*',
            'mailto:',
          ]}
          // originWhitelist={['*']}
          source={{html: this.state.products}}
          startInLoadingState={true}
          //renderLoading={() =>  <ActivityIndicator size="large" color="green" />}
          //onNavigationStateChange={evt =>{ this.openLink(evt.url)}}
          onShouldStartLoadWithRequest={event =>
            this.onShouldStartLoadWithRequest(event)
          }
          style={{flex: 1, marginHorizontal: moderateScale(12)}}
        />
        {/* {this.state.showLoginWithoutInternet && (
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
        )} */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
  },
});
