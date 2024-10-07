/**
 * Network error
 *@Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Foundation';
import Feather from 'react-native-vector-icons/Feather';
import NetworkUtiliy from '../utilities/networkUtil';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomAlert from '../component/custom_alert';
import {SafeAreaView} from 'react-navigation';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {moderateScale} from 'react-native-size-matters';

export default class NetworkError extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      showAlert: false,
      hideModal: false,
    };
  }

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

  _navigateToSearch() {
    // alert("home")
    // this.props.navigation.navigate('SearchTabs')
  }
  render() {
    const {noNetwork, key, cancel} = this.props;
    return (
      <Modal
        transparent={true}
        key={key}
        visible={noNetwork || false}
        animationType="slide"
        // onRequestClose={cancel)
      >
        <View
          style={{
            height: '9%',
            backgroundColor: '#006621',
            flexDirection: 'row',
          }}>
          <Feather
            style={{
              marginLeft: moderateScale(5),
              justifyContent: 'center',
              alignSelf: 'center',
              width: '70%',
            }}
            // onPress={() => this.props.navigation.navigate.toggleDrawer()}
            // onPress={() =>this.props.search}
            name="menu"
            color="#fff"
            size={30}
          />
          <TouchableOpacity
            style={{justifyContent: 'center', alignSelf: 'center'}}
            onPress={this.props.search}
            //this.props.searchIcon
            // this.props.navigation.navigate('SearchTabs')
            // this.props.navigation.navigate('SearchTabs')
          >
            <Image
              style={{
                marginRight: moderateScale(10),
                width: moderateScale(23),
                height: moderateScale(23),
              }}
              source={require('../assets/searchicon.png')}
            />
          </TouchableOpacity>
          {/* <TouchableOpacity
         style={{justifyContent:"center",alignSelf:'center',}}>
        
        <Image
           style={{marginRight: moderateScale(10), width:moderateScale(23), height:moderateScale(23)}}
          source={require("../assets/bellicon.png")}/>
        </TouchableOpacity>
        <TouchableOpacity
         style={{justifyContent:"center",alignSelf:'center',}}
          onPress={() => this.props.navigation.navigate('HeaderHome')}>
          <Image
           style={{marginRight: moderateScale(10), width:moderateScale(23), height:moderateScale(23)}}
          source={require("../assets/homeicon.png")}/>
        </TouchableOpacity> */}
        </View>

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
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
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
