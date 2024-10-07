/**
 * Artical interprentation detail screen
 * @Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import WebView from 'react-native-webview';
const INJECTEDJAVASCRIPT =
  "const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=0.99, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); ";

export default class ArticleInterprentation extends Component {
  render() {
    const {isUserAllowed, htmlData} = this.props;
    if (!isUserAllowed) {
      return (
        <View style={{flex: 1, alignItems: 'center', padding: 12}}>
          <Text style={{color: 'black'}}>
            Απαιτείται συνδρομή στο Πλήρες πρόγραμμα
          </Text>
        </View>
      );
    }
    return (
      <WebView
        injectedJavaScript={INJECTEDJAVASCRIPT}
        scalesPageToFit={false}
        showsVerticalScrollIndicator={false}
        originWhitelist={['*']}
        source={{html: htmlData}}
        startInLoadingState={true}
        onNavigationStateChange={evt => {
          this.props.onLinkPress(evt.url);
        }}
        style={{flex: 1}}
      />
    );
  }
}

const styles = StyleSheet.create({});
