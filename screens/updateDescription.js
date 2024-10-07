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
  Dimensions,
} from 'react-native';
import Screen from '../screens/screen';
import Loading from '../component/loading';
import CacheService from '../services/cache_service';
import ApiService from '../services/api_service';
import OfflineDatabase from '../services/offlineDatabase';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import fonts from '../styles/fonts';
import BackgroundSync from '../services/articles_background_sync';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {WebView} from 'react-native-webview';
const initialLayout = {width: Dimensions.get('window').width};
const isWeb = Platform.OS === 'web';
const jsCode =`var x = document.getElementsByTagName("A");
var i;
for (i = 0; i < x.length; i++) {
  x[i].style.color = '#016622';
};`
const INJECTEDJAVASCRIPT =
  "const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=0.99, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);"+ jsCode;

export default class UpdateDescription extends Screen {
  constructor(props) {
    super(props);
    this.state = {
      description: this.props.navigation.state.params.description,
    };
  }
  render() {
    return (
      <View style={{flex: 1}}>
         <WebView
            injectedJavaScript={INJECTEDJAVASCRIPT}
            scalesPageToFit={false}
            originWhitelist={['*']}
            showsVerticalScrollIndicator={false}
            source={{html: this.state.description}}
            onNavigationStateChange={evt => {
              this.openLink(evt.url);
            }}
            startInLoadingState={true}
            // renderLoading={() =>  <ActivityIndicator size="large" color="green" />}
            //onShouldStartLoadWithRequest={evt =>{ console.log(JSON.stringify(evt))}}
            style={{flex: 1, paddingHorizontal: moderateScale(15)}}
          />
        {/* <Text
          style={{
            textAlign: 'center',
            fontSize: moderateScale(15),
            fontWeight: '700',
          }}>
          {this.state.description}
        </Text> */}
      </View>
    );
  }
}
