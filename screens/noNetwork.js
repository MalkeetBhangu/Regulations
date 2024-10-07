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
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import Screen from '../screens/screen';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {moderateScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Foundation';
import NetworkUtiliy from '../utilities/networkUtil';
import CustomAlert from '../component/custom_alert';

export default class NoNetwork extends Screen {
  constructor(props) {
    super(props);
  }
  /**
   * Function to refresh when device connect to the network
   */
  refresh = () => {
    NetworkUtiliy.checkIsNetwork().then(response => {
      if (response.isConnected) {
        this.props.navigation.pop();
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
    return (
      <SafeAreaView
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <CustomAlert
              ref={o => (this.CustomAlert = o)}
              title={'ΛΑΘΟΣ'}
              message={
                'Η εφαρμογή απαιτεί σύνδεση στο διαδίκτυο. Παρακαλώ συνδεθείτε και δοκιμάστε ξανά.'
              }
            />

            <Image
              source={require('../assets/refresh.png')}
              style={{height: hp(30), aspectRatio: 1}}
            />
            <Text
              style={{
                color: '#006621',
                alignSelf: 'center',
                textAlign: 'center',
                paddingLeft: moderateScale(10),
                fontSize: moderateScale(17),
                marginTop: moderateScale(20),
              }}>
              Αυτό το περιεχόμενο, είναι διαθέσιμο, μόνο όταν υπάρχει σύνδεση
              internet
            </Text>
            <TouchableOpacity
              onPress={() => this.refresh()}
              style={styles.button}>
              <Text style={styles.buttontext}>
                <Icon name="refresh" color="white" size={16} /> Ανανέωση
              </Text>
            </TouchableOpacity>
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

  text: {
    fontWeight: 'bold',
  },
  container: {
    height: hp('100%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
  },
  buttontext: {
    color: 'white',
    fontSize: moderateScale(16),
    textAlign: 'center',
    backgroundColor: '#006621',
    padding: moderateScale(12),
  },

  button: {
    width: '100%',
    marginTop: moderateScale(10),
    padding: moderateScale(10),
    marginTop: moderateScale(20),
  },
});
