/**
 * Artical version detail Screen.
 * @Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */

import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  DeviceEventEmitter,
  Dimensions,
  Text,
} from 'react-native';
import Loading from '../component/loading';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import {moderateScale} from 'react-native-size-matters';
import {WebView} from 'react-native-webview';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import Screen from '../screens/screen';
import INJECTEDJAVASCRIPT from '../component/injectedJavascript';

export default class ArticleVersionDetail extends Screen {
  hasInterpretation = false;
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      loader: true,
      htmlData: '',
      showTabs: false,
      noNetwork: false,
      visible: false,
      showAlert: false,
      hideModal: false,
      routes: [
        {key: 'Article', title: 'Αρθρο'},
        {key: 'Interprentation', title: 'Ερμηνεία'},
      ],
      versionId: this.props.navigation.state.params.versionId,
      comment: this.props.navigation.state.params.comment,
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
          this.props.navigation.navigate('NoNetwork');
          this.onRefreshPress();
        }
      },
    );
    setTimeout(() => {
      this.getArticleVersion();
    }, 100);
  }

  /**
   * When User presses refresh on network error screen
   */
  onRefreshPress() {
    this.setState({noNetwork: false}, () => {
      this.setState({loader: true}, () => {
        this.getArticleVersion();
      });
    });
  }

  /**
   * Checks if interpretation Exists in article or not
   */
  interpretationExists(htmlTxt) {
    if (!htmlTxt) {
      return false;
    }
    let interprentation = htmlTxt.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '');
    return interprentation !== '<!DOCTYPE html>';
  }

  /**
   * Fetch Rulings from server on the basis of ruling ID.
   */
  getArticleVersion() {
    this.apiService
      .getArticleVersion(this.state.versionId)
      .then(response => {
        if (response.error == 'token_expired') {
          this.logoutUser();
        }
        this.hasInterpretation = this.interpretationExists(
          response.article_version.interprentation,
        );
        this.props.navigation.setParams({
          title: response.article_version.title,
        });
        this.setState({version: response.article_version}, () => {
          if (this.hasInterpretation) {
            this.setState({showTabs: true, loader: false});
          } else {
            this.setState({loader: false});
          }
        });
      })
      .catch(error => {
        this.setState({loader: false});
      });
  }

  /**
   * Render active and inactive icon for tab bar
   */
  _getTabBarIcon = props => {
    const {route, focused} = props;
    if (route.key === 'Article') {
      return focused ? (
        <MaterialCommunityIcon
          name="book-open-variant"
          size={30}
          color="#fff"
        />
      ) : (
        <MaterialCommunityIcon
          name="book-open-variant"
          size={30}
          color="#bfbfbf"
        />
      );
    } else if (route.key === 'Interprentation') {
      return focused ? (
        <MaterialCommunityIcon name="library-books" size={30} color="#fff" />
      ) : (
        <MaterialCommunityIcon name="library-books" size={30} color="#bfbfbf" />
      );
    }
  };

  /**
   * Function to refresh when device connect to the network
   */
  refresh = () => {
    NetworkUtiliy.checkIsNetwork().then(response => {
      if (response.isConnected) {
        this.props.onPress();
      } else {
        this.CustomAlert.toggleModal();
      }
    });
  };

  /**
   * Function to check that device is connect to network or not
   */
  checkNetwork = () => {
    NetworkUtiliy.checkIsNetwork().then(response => {
      if (response.isConnected) {
        this._cancel();
      } else {
        alert('Network Error');
      }
    });
  };
  render() {
    if (this.state.loader) {
      return <Loading />;
    }
    if (!this.state.showTabs) {
      return (
        <View style={{flex: 1, paddingHorizontal: moderateScale(15)}}>
          {/* <NetworkError
            ref={o => (this.NetworkError = o)}
            cancel={() => this.dismissNetworkModal()}
            noNetwork={this.state.noNetwork}
            onPress={() => this.onRefreshPress()}
          /> */}

          <Text
            style={{
              marginTop: 10,
              color: 'black',
              marginHorizontal: 10,
              fontSize: 12,
            }}>
            {this.state.comment}
          </Text>

          <WebView
            injectedJavaScript={INJECTEDJAVASCRIPT}
            scalesPageToFit={false}
            originWhitelist={['*']}
            showsVerticalScrollIndicator={false}
            source={{html: this.state.version.body}}
            onNavigationStateChange={evt => {
              this.openLink(evt.url);
            }}
            startInLoadingState={true}
            // renderLoading={() =>  <ActivityIndicator size="large" color="green" />}
            //onShouldStartLoadWithRequest={evt =>{ console.log(JSON.stringify(evt))}}
            style={{flex: 1, paddingHorizontal: moderateScale(15)}}
          />
        </View>
      );
    }
    return (
      <View style={{flex: 1}}>
        {/* <NetworkError
          ref={o => (this.NetworkError = o)}
          noNetwork={this.state.noNetwork}
          onPress={() => this.onRefreshPress()}
        /> */}
        <TabView
          navigationState={this.state}
          renderScene={({route}) => {
            switch (route.key) {
              case 'Article':
                return (
                  <View style={[styles.scene, {backgroundColor: 'white'}]}>
                    <WebView
                      injectedJavaScript={INJECTEDJAVASCRIPT}
                      scalesPageToFit={false}
                      originWhitelist={['*']}
                      source={{html: this.state.version.body}}
                      onNavigationStateChange={evt => {
                        this.openLink(evt.url);
                      }}
                      //onShouldStartLoadWithRequest={evt =>{ console.log(JSON.stringify(evt))}}
                      style={{flex: 1, padding: moderateScale(15)}}
                    />
                  </View>
                );
              case 'Interprentation':
                return (
                  <View style={[styles.scene, {backgroundColor: 'white'}]}>
                    <WebView
                      injectedJavaScript={INJECTEDJAVASCRIPT}
                      scalesPageToFit={false}
                      originWhitelist={['*']}
                      source={{html: this.state.version.interprentation}}
                      onNavigationStateChange={evt => {
                        this.openLink(evt.url);
                      }}
                      //onShouldStartLoadWithRequest={evt =>{ console.log(JSON.stringify(evt))}}
                      style={{flex: 1, padding: moderateScale(15)}}
                    />
                  </View>
                );
              default:
                return;
            }
          }}
          renderTabBar={props => (
            <TabBar
              {...props}
              renderLabel={this._renderLabel}
              renderIcon={props => this._getTabBarIcon(props)}
              getLabelText={({route: {title}}) => title}
              indicatorContainerStyle={{borderTopColor: '#fff'}}
              indicatorStyle={styles.indicator}
              tabStyle={styles.tabStyle}
              style={styles.tab}
            />
          )}
          onIndexChange={index => this.setState({index})}
          initialLayout={{width: Dimensions.get('window').width}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  indicator: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  tab: {
    backgroundColor: '#016622',
    padding: 0,
  },
  tabStyle: {
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
