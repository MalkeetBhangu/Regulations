/**
 * 
 @author Logicease
 *
 */
import React, {Component} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Linking,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import Screen from '../screens/screen';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const screen = Dimensions.get('window').width;

import {scale, verticalScale, moderateScale} from 'react-native-size-matters';

export default class NotSubscribed extends Screen {
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView>
          <View style={styles.container}>
            <Image
              source={require('../assets/lock.png')}
              style={{height: hp(30), aspectRatio: 1}}
            />

            <Text
              style={{
                color: '#006621',
                alignSelf: 'center',
                textAlign: 'center',
                fontSize: moderateScale(17),
                marginTop: moderateScale(40),
                marginHorizontal:moderateScale(25)
              }}>
              Το πρόγραμμά σας, δεν παρέχει επαρκή δικαιώματα για να δείτε αυτό
              το περιεχόμενο
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    height: hp('100%'),
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: moderateScale(80),
  },
  text: {
    color: '#000000',
    marginBottom: moderateScale(15),
  },
  link: {
    color: '#044c27',
    textDecorationLine: 'underline',
    marginBottom: moderateScale(15),
  },
  lastText: {
    color: '#000000',
  },
});
