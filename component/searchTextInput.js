/**
 *Search text input component for Search
 *@Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */

import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

export default class SearchTextInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focused: false,
    };
  }

  _handleOnChangeText(event) {
    this.props.onChangeText(event);
  }

  _handleOnSubmitEditing(event) {
    this.props.onSubmitEditing();
  }

  _handleOnBlur() {
    this.setState({focused: false});
  }

  _handleOnFocus() {
    this.setState({focused: true});
  }

  focus() {
    this._textInput.focus();
  }

  blur() {
    this._textInput.blur();
  }

  render() {
    return (
      <View style={[this.props.style, styles.container]}>
        <Text style={styles.customTextInputLabel}>{this.props.label}</Text>
        <View style={styles.shadowbox}>
          <TextInput
            ref={textInput => {
              this._textInput = textInput;
            }}
            placeholder={this.props.placeholder}
            keyboardType={this.props.keyboardType}
            returnKeyType={this.props.returnKeyType}
            placeholderTextColor={'#545454'}
            onChangeText={this._handleOnChangeText.bind(this)}
            secureTextEntry={this.props.secureTextEntry}
            style={styles.customTextInputTextInput}
            underlineColorAndroid="transparent"
            onSubmitEditing={this._handleOnSubmitEditing.bind(this)}
            value={this.props.value}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  customTextInputLabel: {
    backgroundColor: 'white',
    color: '#016622',
    paddingRight: moderateScale(14),
    paddingLeft: moderateScale(19),
    fontSize: moderateScale(15),
  },
  shadowbox: {
    shadowOffset: {width: 0, height: 2},
    shadowColor: '#000',
    shadowOpacity: 0.2,
    elevation: moderateScale(8),
    marginTop: moderateScale(5),
    marginBottom: moderateScale(15),
    marginHorizontal: moderateScale(10),
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    shadowColor: '#000',
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 1,
  },
  customTextInputTextInput: {
    margin: moderateScale(0),
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(10),
    borderRadius: moderateScale(4),
    color: '#000',
    fontSize: moderateScale(15),
    overflow: 'hidden',
    backgroundColor: 'white',
  },
});
