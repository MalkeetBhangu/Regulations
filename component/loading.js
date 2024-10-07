/**
 * loading loader for data fetching
 * @Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */
import React, {Component} from 'react';
import {View, ActivityIndicator} from 'react-native';

export default class Loading extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator size="small" color="green" />
      </View>
    );
  }
}

