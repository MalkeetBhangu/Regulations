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
} from 'react-native';
import Loading from '../component/loading';
import Icon from 'react-native-vector-icons/Entypo';
import NetworkError from '../component/network-error';
import HTMLView from 'react-native-htmlview';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import {WebView} from 'react-native-webview';
import HTML from 'react-native-render-html';
import Screen from '../screens/screen';
import NetInfo from '@react-native-community/netinfo';
import CustomHighlighter from '../utilities/customHighlighter';
import INJECTEDJAVASCRIPT from '../component/injectedJavascript';

export default class RulingDetails extends Screen {
  constructor(props) {
    super(props);
    this.state = {
      loader: true,
      htmlData: '',
      searchFilter: this.props.navigation.getParam('searchFilter', {}),
      // searchFilter:this.props.navigation.getParam('searchFilter',[]),
      rulingId: this.props.navigation.state.params.rulingId,
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('willBlur', payload => {
      this.networkListener.remove();
    });
    this.networkListener = DeviceEventEmitter.addListener(
      'NoNetwork',
      event => {
        if (!this.state.noNetwork) {
          this.setState({loader: false, noNetwork: true});
        }
      },
    );
    setTimeout(() => {
      this.getRulingsById();
    }, 100);
  }

  /**
   * When User presses refresh on network error screen
   */
  onRefreshPress() {
    this.setState({noNetwork: false}, () => {
      this.setState({loader: true}, () => {
        this.getRulingsById();
      });
    });
  }

  /*
   * Highlights the search terms provided by user
   */
  highlightTerms() {
    if (this.state.searchFilter.term || this.state.searchFilter.extra_filter) {
      return CustomHighlighter.doHighlight(
        this.state.htmlData,
        this.state.searchFilter.term,
        this.state.searchFilter.extra_filter,
      );
    } else {
      return this.state.htmlData;
    }
  }

  /**
   * Fetch Rulings from server on the basis of ruling ID.
   */
  getRulingsById() {
    this.apiService
      .getRuling(this.state.rulingId)
      .then(response => {
        console.log('DATA FROM SERVER' + JSON.stringify(response));
        if (response.error == 'token_expired') {
          this.logoutUser();
        }
        this.props.navigation.setParams({title: response.ruling.title});
        this.setState({htmlData: response.ruling.body, loader: false});
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
      <View style={{flex: 1, paddingHorizontal: moderateScale(15)}}>
        {/* <NetworkError
          ref={o => (this.NetworkError = o)}
          noNetwork={this.state.noNetwork}
          cancel={() => this.dismissNetworkModal()}
          onPress={() => this.onRefreshPress()}
        /> */}
        <WebView
          injectedJavaScript={INJECTEDJAVASCRIPT}
          scalesPageToFit={false}
          originWhitelist={['*']}
          showsVerticalScrollIndicator={false}
          source={{html: this.highlightTerms()}}
          onNavigationStateChange={evt => {
            this.openLink(evt.url);
          }}
          startInLoadingState={true}
          //renderLoading={() =>  <ActivityIndicator size="large" color="green" />}
          //onShouldStartLoadWithRequest={evt =>{ console.log(JSON.stringify(evt))}}
          style={{flex: 1, paddingHorizontal: moderateScale(15)}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  icon: {},
});
