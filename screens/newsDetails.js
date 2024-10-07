import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  DeviceEventEmitter,
  ScrollView,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import Loading from '../component/loading';
import NetworkError from '../component/network-error';
import HTMLView from 'react-native-htmlview';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import {WebView} from 'react-native-webview';
import HTML from 'react-native-render-html';
import Screen from '../screens/screen';
import CacheService from '../services/cache_service';
import OfflineManager from '../services/offline_service';
import NetInfo from '@react-native-community/netinfo';
import INJECTEDJAVASCRIPT from '../component/injectedJavascript';
import AsyncStorage from '@react-native-community/async-storage';

export default class NewsDetails extends Screen {
  WEBVIEW_REF = null;
  constructor(props) {
    super(props);
    this.state = {
      loader: true,
      htmlData: '',
      newsId: this.props.navigation.state.params.newsId,
      //  newsItem: this.props.navigation.state.params.newsItem,
      checkOnline: null,
    };
  }

  toggleDrawer = () => {
    this.props.navigation.dispatch(DrawerActions.toggleDrawer());
  };

  componentDidMount() {
    // console.log('notify' + JSON.stringify(this.state.newsItem));
    AsyncStorage.getItem('checkOffline').then(value => {
      this.setState({checkOnline: JSON.parse(value)});
    }); //change by akriti
    this.markNotificationAsRead();
    this.unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        this.refreshCategories();
      } else {
        if (OfflineManager.isOnline) {
          Alert.alert('Do you want to go offline', 'Are you sure ?', [
            {text: 'Cancel', onPress: () => {}},
            {
              text: 'OK',
              onPress: () => {
                this.props.navigation.navigate('OfflineSwitch');
              },
            },
          ]);
        } else {
          this.refreshCategories();
        }
      }
    });

    // this.markNotificationAsRead();
    // this.props.navigation.addListener('willBlur', payload => {
    //   this.networkListener.remove();
    // });
    // this.networkListener = DeviceEventEmitter.addListener(
    //   'NoNetwork',
    //   event => {
    //     if (!this.state.noNetwork) {
    //       this.setState({loader: false, noNetwork: true});
    //     }
    //   },
    // );
    // setTimeout(() => {
    //   this.getNewsById();
    // }, 100);
  }

  /**
   * Method used to refresh categories
   */
  refreshCategories() {
    setTimeout(() => {
      //change by akriti
      if (this.state.checkOnline == false) {
        this.setState({loader: false, noNetwork: true});
        if (this.state.noNetwork == true) {
          this.props.navigation.navigate('NoNetwork');
          this.onRefreshPress();
          //end
        }
      } else {
        this.getNewsById();
      }
    }, 100);
  }

  /**
   * Mark notification as read when user opens the news detail
   */
  markNotificationAsRead() {
    // if (this.state.newsItem.read == false) {
    CacheService.markNotificationAsRead(this.state.newsId);
    DeviceEventEmitter.emit('RefreshNotifications');
    // }
  }

  /**
   * When User presses refresh on network error screen
   */
  onRefreshPress() {
    this.setState({noNetwork: false}, () => {
      this.setState({loader: true}, () => {
        this.getNewsById();
      });
    });
  }

  /**
   * Fetch News from server on the basis of news ID.
   */
  getNewsById() {
    this.apiService
      // .getNewsById(this.state.newsItem.newsItem.id)
      .getNewsById(this.state.newsId)
      .then(response => {
        console.log('abc' + JSON.stringify(response));
        if (response.error == 'token_expired') {
          this.logoutUser();
        }
        this.props.navigation.setParams({title: response.newsitem.title});
        this.setState({htmlData: response.newsitem.body}, () => {
          this.setState({loader: false});
        });
        //this.setState({ loader: false});
      })
      .catch(error => {
        this.setState({loader: false});
        console.log('ERROR FROM SERVER' + JSON.stringify(error));
      });
  }

  render() {
    if (this.state.loader) {
      return <Loading />;
    }
    return (
      <View style={{flex: 1, paddingHorizontal: 15, overflow: 'hidden'}}>
        {/* <NetworkError
          ref={o => (this.NetworkError = o)}
          cancel={() => this.dismissNetworkModal()}
          noNetwork={this.state.noNetwork}
          onPress={() => this.onRefreshPress()}
        /> */}

        <WebView
          ref={o => (this.WEBVIEW_REF = o)}
          injectedJavaScript={INJECTEDJAVASCRIPT}
          scalesPageToFit={false}
          showsVerticalScrollIndicator={false}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          renderError={e => {
            console.log(e);
            if (e === 'WebKitErrorDomain') {
              return;
            }
          }}
          source={{html: this.state.htmlData}}
          onNavigationStateChange={evt => {
            console.log(JSON.stringify(evt));
            this.openLink(evt.url);
            return false;
          }}
          renderError={e => {
            if (e === 'WebKitErrorDomain') {
              return;
            }
          }}
          onError={syntheticEvent => {
            const {nativeEvent} = syntheticEvent;
            console.log('WebView error: ', nativeEvent);
          }}
          startInLoadingState={true}
          //renderLoading={() =>  <ActivityIndicator size="large" color="green" />}
          style={{
            flex: 1,
            paddingHorizontal: moderateScale(15),
            justifyContent: 'center',
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  icon: {},
});
