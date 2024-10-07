/**
 * Common header class.
 * @Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Screen from '../screens/screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import CacheService from '../services/cache_service';
const screen = Dimensions.get('window').width;
import {moderateScale} from 'react-native-size-matters';

const advancedLink = `advanced?term=&searchStatus=nomothesia&law=4465&year=&article=40&fek=&fek_date=&legislative_act_type=&courthouse=&area=&ruling_number=&ruling_year=&ruling_law=&law_year=&ruling_article=`;

export default class CommonHeader extends Screen {
  static navigationOptions = ({navigation}) => {
    const notificationCount =
      typeof navigation.state.params === 'undefined' ||
      typeof navigation.state.params.count == 'undefined'
        ? CacheService.unReadNotificationsCount()
        : navigation.state.params.count;
    return {
      title:
        typeof navigation.state.params === 'undefined' ||
        typeof navigation.state.params.title === 'undefined'
          ? navigation.getParam('title', '')
          : navigation.state.params.title,
      headerStyle: {
        height: moderateScale(50),
        backgroundColor: '#016622',
        elevation: 0, //for android
        shadowOpacity: 0, //for ios
        borderBottomWidth: 0, //for ios
      },
      headerTitleContainerStyle: {
        justifyContent: 'flex-start',
        paddingLeft: moderateScale(0),
      },
      headerTitleStyle: {
        textAlign: 'left',
        flex: 1,
        marginLeft: moderateScale(-8),
        left: moderateScale(0),
        fontSize: moderateScale(16),
        color: 'white',
        maxWidth: screen * 0.4,
        justifyContent: 'flex-start',
      },
      headerLeft: (
        <View style={styles.iconContainer}>
          <MaterialIcons
            style={{marginLeft: moderateScale(2)}}
            onPress={() => navigation.goBack()}
            name="keyboard-backspace"
            size={moderateScale(30)}
            color="#fff"
          />
        </View>
      ),
      headerRight: (
        <View style={styles.iconContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SearchTabs', {index: 1})}>
            <EvilIcons
              style={{
                marginRight: moderateScale(9),
              }}
              name="search"
              size={moderateScale(35)}
              color="#fff"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <Image
              style={{
                marginRight: moderateScale(15),
                width: moderateScale(23),
                height: moderateScale(23),
              }}
              source={require('../assets/bellicon.png')}
            />

            {notificationCount != 0 && (
              <View
                style={{
                  position: 'absolute',

                  width: moderateScale(14),
                  height: moderateScale(14),
                  borderRadius: moderateScale(7),

                  left: moderateScale(14),
                  bottom: moderateScale(14),
                  backgroundColor: 'red',
                }}>
                <Text
                  style={{
                    color: '#fff',
                    textAlign: 'center',
                    fontSize: moderateScale(10),
                  }}>
                  {notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('HeaderHome')}>
            <Image
              style={{
                marginRight: moderateScale(15),
                width: moderateScale(23),
                height: moderateScale(23),
              }}
              source={require('../assets/homeicon.png')}
            />
          </TouchableOpacity>
        </View>
      ),
    };
  };
  constructor(props) {
    super(props);
  }
}

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
