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
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';

export default class Users extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: '',
      headerStyle: {
        height: 50,
        backgroundColor: '#016622',
        elevation: 0, //for android
        shadowOpacity: 0, //for ios
        borderBottomWidth: 0, //for ios
      },
      headerTitleStyle: {
        color: 'white',
        flex: 1,
        textAlign: 'center',
        alignSelf: 'center',
      },
      headerLeft: (
        <View style={styles.iconContainer}>
          <MaterialIcons
            style={{marginLeft: moderateScale(2)}}
            onPress={() => navigation.goBack()}
            name="keyboard-backspace"
            size={30}
            color="#fff"
          />
          <Feather
            style={{marginLeft: moderateScale(5)}}
            onPress={() => navigation.toggleDrawer()}
            name="menu"
            color="#fff"
            size={30}
          />
        </View>
      ),
      headerRight: (
        <View style={styles.iconContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SearchTabs', {index: 1})}>
            <Image
              style={{
                marginRight: moderateScale(10),
                width: moderateScale(23),
                height: moderateScale(23),
              }}
              source={require('../assets/searchicon.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              style={{
                marginRight: moderateScale(10),
                width: moderateScale(23),
                height: moderateScale(23),
              }}
              source={require('../assets/bellicon.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('HeaderHome')}>
            <Image
              style={{
                marginRight: moderateScale(10),
                width: moderateScale(23),
                height: moderateScale(23),
              }}
              source={require('../assets/homeicon.png')}
            />
          </TouchableOpacity>
        </View>
      ),
      //   headerRight: (

      // ),
    };
  };

  render() {
    return (
      <SafeAreaView
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.container}>
          <Text style={styles.text}>COMING SOON</Text>
        </View>
        {/* </ScrollView> */}
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
    // justifyContent:"center",
  },
  text: {
    fontWeight: 'bold',
  },
});
