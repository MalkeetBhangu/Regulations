/**
 * Book mark Screen.
 * @Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Screen from '../screens/screen';

export default class BookMark extends Screen {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <SafeAreaView
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.container}>
          <Text style={styles.text}>COMING SOON</Text>
        </View>
    
      </SafeAreaView>
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
