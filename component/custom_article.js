/**
 * custom article
 * @Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import WebView from 'react-native-webview';
import INJECTEDJAVASCRIPT from './injectedJavascript';
import CustomHighlighter from '../utilities/customHighlighter';
import {StackActions, NavigationActions} from 'react-navigation';

export default class CustomArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      htmlData: '',
      backButtonEnabled: false,
      forwardButtonEnabled: false,
    };
  }

  /*
   * Highlights the search terms provided by user
   */
  highlightTerms() {
    const {searchTerm, extraFilter, htmlData} = this.props;
    if (searchTerm || extraFilter) {
      return CustomHighlighter.doHighlight(htmlData, searchTerm, extraFilter);
    } else {
      return htmlData;
    }
  }

  render() {
    const {downloadingLoader, onPress} = this.props;
    return (
      <View style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.container}>
          {downloadingLoader && (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="white" />
            </View>
          )}
          <View style={styles.ImageView}>
            <TouchableOpacity onPress={onPress}>
              <Image
                style={styles.Image}
                source={require('../assets/pdf.png')}
              />
            </TouchableOpacity>
          </View>

          <WebView
            injectedJavaScript={INJECTEDJAVASCRIPT}
            scalesPageToFit={false}
            ref={ref => {
              this.webview = ref;
            }}
            originWhitelist={['*']}
            showsVerticalScrollIndicator={false}
            source={{html: this.highlightTerms()}}
            startInLoadingState={true}
            onNavigationStateChange={evt => {
              // this.props.navigation('topic');
              this.props.onLinkPress(evt.url);
              this.webview.stopLoading();
              // this.setState({
              //   backButtonEnabled: evt.canGoBack,
              // });
            }}
            style={{flexGrow: 1, marginHorizontal: moderateScale(10)}}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  ImageView: {
    flexDirection: 'row-reverse',
    marginLeft: moderateScale(5),
    marginTop: moderateScale(5),
  },
  Image: {
    marginRight: moderateScale(5),
    marginTop: moderateScale(5),
    height: moderateScale(35),
    width: moderateScale(25),
  },
  loader: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    left: moderateScale(0),
    right: moderateScale(0),
    bottom: moderateScale(0),
    top: moderateScale(0),
    zIndex: 1,
    justifyContent: 'center',
  },
});
