/**
 * Contact screen.
 * @Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import Screen from '../screens/screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {moderateScale} from 'react-native-size-matters';

export default class Contact extends Screen {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between',
            padding: moderateScale(25),
          }}>
          <View>
            <Text style={styles.text}>ΤΕΤΡΑΒΙΒΛΟΣ ΝΟΜΟΠΑΙΔΕΙΑ</Text>
            <View style={styles.address}>
              <MaterialIcons
                style={styles.Icon}
                name="store-mall-directory"
                size={moderateScale(22)}
                color="#016622"
              />
              <Text style={styles.textAddress}>
                Γ’ ΣΕΠΤΕΜΒΡΙΟΥ 77, Τ.Κ. 10434, ΑΘΗΝΑ
              </Text>
            </View>
            <View
              style={{
                height: moderateScale(1),
                borderBottomColor: '#dedede',
                borderBottomWidth: moderateScale(1),
              }}
            />
            <View style={styles.number}>
              <Ionicons
                style={styles.Icon}
                name="ios-call"
                size={moderateScale(22)}
                color="#016622"
              />
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  width: '90%',
                  paddingLeft: moderateScale(8),
                  paddingRight: moderateScale(12),
                }}>
                <Text
                  onPress={() => Linking.openURL('tel:+30 210 82 53 032')}
                  style={styles.textPhone}>
                  +30 210 82 53 032{' '}
                </Text>
                <Text
                  onPress={() => Linking.openURL('tel:+30 210 82 53 033')}
                  style={styles.textPhone}>
                  +30 210 82 53 033
                </Text>
              </View>
            </View>
            <View
              style={{
                height: moderateScale(1),
                borderBottomColor: '#dedede',
                borderBottomWidth: moderateScale(1),
              }}
            />
            <View style={styles.fax}>
              <MaterialCommunityIcons
                style={styles.Icon}
                name="fax"
                size={moderateScale(22)}
                color="#016622"
              />
              <Text style={styles.textFax}>+30 210 82 53 035</Text>
            </View>
            <View
              style={{
                height: moderateScale(1),
                borderBottomColor: '#dedede',
                borderBottomWidth: moderateScale(1),
              }}
            />
            <View style={styles.email}>
              <FontAwesome
                style={styles.Icon}
                name="envelope"
                size={moderateScale(20)}
                color="#016622"
              />
              <Text
                onPress={() =>
                  Linking.openURL(
                    'mailto:info@tetravivlos.gr?subject=Τετράβιβλος - Επικοινωνία',
                  )
                }
                style={styles.textEmail}>
                info@tetravivlos.gr
              </Text>
            </View>
            <View
              style={{
                height: moderateScale(1),
                borderBottomColor: '#dedede',
                borderBottomWidth: moderateScale(1),
              }}
            />
          </View>
          <Image source={require('../assets/icon.png')} style={styles.logo} />
        </ScrollView>
        {/* {this.state.showLoginWithoutInternet && ( <View
          style={{
            width: '100%',
            paddingBottom: moderateScale(25),
            shadowOffset: {
              width: 0,
              height: -3,
            },
            shadowOpacity: 0.29,
            shadowRadius: 2,
            elevation: 4,
            shadowColor: '#000',
            backgroundColor: '#fff',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: moderateScale(15),
              paddingLeft: moderateScale(10),
              width: '90%',
              fontWeight: 'bold',
            }}>
            Για εναλλαγή εντός - εκτός δικτύου πατήστε το στο πάνω μέρος της
            οθόνης
          </Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('OfflineSwitch')}>
            <MaterialIcons
              name="tap-and-play"
              color="#016622"
              size={30}
              style={{marginLeft: 0}}
            />
          </TouchableOpacity>
        </View>)} */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textAddress: {
    color: '#000000',
    fontSize: moderateScale(15),
    paddingLeft: moderateScale(8),
    width: '90%',
    flexWrap: 'wrap',
    overflow: 'scroll',
  },
  logo: {
    height: hp('25%'),
    aspectRatio: 1,
    alignSelf: 'center',
    marginTop: hp('8%'),
    marginBottom: hp('8%'),
  },
  text: {
    fontWeight: 'bold',
    color: '#016622',
    fontSize: moderateScale(20),
  },
  address: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(15),
    paddingTop: moderateScale(22),
    width: '100%',
  },
  number: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(15),

    width: '100%',
  },
  email: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(15),

    width: '100%',
  },
  fax: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(15),

    width: '100%',
  },
  Icon: {
    width: '10%',
    marginRight: moderateScale(8),
  },
  textPhone: {
    color: '#016622',
    fontSize: moderateScale(15),
    textDecorationLine: 'underline',
  },
  textEmail: {
    color: '#016622',
    fontSize: moderateScale(15),
    paddingLeft: moderateScale(8),
    width: '90%',
    textDecorationLine: 'underline',
  },
  textFax: {
    color: '#000000',
    fontSize: moderateScale(15),
    paddingLeft: moderateScale(8),
    width: '90%',
  },
});
