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
  DeviceEventEmitter,
  Switch,
} from 'react-native';
import {StackActions, NavigationActions} from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import OfflineManager from '../services/offline_service';
import AuthService from '../services/auth_service';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import offlineDatabase from '../services/offlineDatabase';
import NetworkUtiliy from '../utilities/networkUtil';
import Screen from '../screens/screen';

export default class OfflineSwitch extends Screen {
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
          {/* <MaterialIcons
            style={{marginLeft: moderateScale(2)}}
            onPress={() => navigation.goBack()}
            name="keyboard-backspace"
            size={30}
            color="#fff"
          /> */}
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

  constructor(props) {
    super(props);
    this.authService = new AuthService();
    this.state = {
      isEnabled: false,
      setIsEnabled: false,
      taskCreated: true,
      seconds: 0,
    };
  }
  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener(
      'isDeviceOnline',
      this.setState({taskCreated: OfflineManager.isOnline}),
    );
    // this.checkNetwork();
    // AsyncStorage.getItem('isOfflineLoggedIn').then(value => {
    //   if (value != 'true') {
    //     // alert(value);
    //     console.log('anm' + this.state.taskCreated);
    //     this.setState({taskCreated: OfflineManager.isOnline});
    //   } else {
    //     console.log('mno' + this.state.taskCreated);
    //   }
    // });
    // this.setState({taskCreated: !OfflineManager.isOnline});
    // OfflineManager.isOnline;
  }

  /**
   * Function to check that device is connect to network or not
   */

  // componentDidMount() {

  //   //alert('jjjjjjj' + OfflineManager.isOnline);
  //   this.getOfflineToggle();
  // }
  onChangeFunction(value) {
    if (!OfflineManager.isOnline == false) {
      let curTime = new Date().toLocaleString();
      let currentFormatTime = moment(curTime).format('hh:mm');
      console.log('currnt format Time111' + currentFormatTime);
      // offlineDatabase.setToggelOfflineTime(currentFormatTime);
      OfflineManager.setOfflineCurrentTime(currentFormatTime);
    }
    this.setState({taskCreated: value}, () => {
      // this.showSwitchOption();
      this.checkOfline();
    });
  }

  checkOfline() {
    /// OfflineManager.setOfflineToggleTime();
    console.log('');
    // this.showSwitchOption();
    AsyncStorage.getItem('accessToken').then(token => {
      console.log('accessToken1111' + token);
      console.log('accessToken5555' + this.state.taskCreated);
      if (token != null) {
        OfflineManager.setOnline(this.state.taskCreated);
        AsyncStorage.setItem(
          'checkOffline',
          JSON.stringify(OfflineManager.isOnline),
        );
        // alert(OfflineManager.isOnline);
        console.log('accessToken222' + token);
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({routeName: 'Home'})],
        });
        this.props.navigation.dispatch(resetAction);
      } else {
        console.log('accessToken3333' + token);

        setTimeout(() => {
          alert('Your token has expired. Please login with online mode.');
          this.authService.resetUserCredentials();

          //SAGAR
          // alert('Hurray Alert offleinsnnsnsnsn');
          const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'Login'})],
          });
          this.props.navigation.dispatch(resetAction);
        }, 300);
      }
    }),
      console.log('sing' + OfflineManager.isOnline);
  }

  // getOfflineToggle() {
  //   AsyncStorage.getItem('checkOffline').then(value => {
  //     if (value != null) {
  //       alert(value);
  //       this.setState({taskCreated: JSON.parse(value)});
  //     }
  //   });
  // }
  showSwitchOption() {
    console.log('akriti');

    this.interval = setInterval(() => {
      // alert(this.state.noInternet);
      if (this.state.seconds == 200) {
        console.log('sec1111' + this.state.seconds);
        // alert('kkklll');
        // AsyncStorage.getItem('isOfflineLoggedIn').then(value => {
        //   alert(value);
        if (this.state.seconds == 200) {
          //  alert('null');
          //   // alert(this.state.seconds)
          // Alert.alert(
          //   '',
          //   // 'Η εφαρμογή εντόπισε την ύπαρξη δικτύου internet. Πώς επιθυμείτε να συνεχίσετε?',
          //   'Ηεφαρμογήεντόπισετηνύπαρξηδικτύουinternet. Πώςεπιθυμείτε να συνεχίσετε;',
          //   [
          //     {
          //       // text: 'Συνέχεια εκτός Δικτύου με πρόσβαση στους 4 Κώδικες',
          //       text:
          //         // 'Λειτουργία εκτός σύνδεσης - Έχετε πρόσβαση μόνο στα άρθρα του Α.Κ., Κ.Πολ.Δ., Π.Κ., Κ.Π.Δ., ωςέχουνβάσειτηςτελευταίαςεγκατάστασηςενημερώσεωνπουπραγματοποιήσατε”',
          //         'Θέλετε να συνεχίσετε εκτός σύνδεσης',
          //       onPress: () => {},
          //     },
          //     {
          //       text:
          //         // 'Σύνδεση στο δίκτυο με πρόσβαση στο σύνολο του περιεχομένου',
          //         ' Θέλετε να συνεχίσετε στο διαδίκτυο',
          //       onPress: () => {
          //         this.props.navigation.navigate('HeaderHome');
          //       },
          //     },
          //   ],
          // );
        }
        clearInterval(this.interval);
        return;
        // });
      }
      console.log('sec' + this.state.seconds);
      let sec = this.state.seconds;
      let percent = 5;
      sec = sec + percent;
      this.setState({seconds: sec});
    }, 1000);
  }

  render() {
    return (
      <SafeAreaView
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            // flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: moderateScale(20),
            marginBottom: moderateScale(10),
          }}>
          {this.state.taskCreated ? (
            <Text
              style={{
                fontSize: moderateScale(20),
                color: '#016622',
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              Εντός Δικτύου (Πρόσβαση σε ολόκληρο το περιεχόμενο του
              προγράμματός σας)
            </Text>
          ) : (
            <Text
              style={{
                fontSize: moderateScale(20),
                color: '#6c6c6c',
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              Εκτός Δικτύου (Πρόσβαση μόνο στα άρθρα των 4 Κωδίκων)
            </Text>
          )}
          <Switch
            style={{
              alignSelf: 'center',
              transform: [{scaleX: 2}, {scaleY: 2}],
              marginTop: moderateScale(25),
            }}
            trackColor={{false: '#767577', true: '#016622'}}
            thumbColor={this.state.taskCreated ? '#fff' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={value => this.onChangeFunction(value)}
            value={this.state.taskCreated}
          />
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
