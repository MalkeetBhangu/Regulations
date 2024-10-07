/**
 * @author Logicease
 */
import React, {Component} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Platform,
  DeviceEventEmitter,
  SafeAreaView,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import Octicons from 'react-native-vector-icons/Octicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CacheService from '../services/cache_service';
import Screen from '../screens/screen';
import {StackActions, NavigationActions} from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NetInfo from '@react-native-community/netinfo';

export default class SideMenu extends Screen {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      notificationCount: CacheService.unReadNotificationsCount(),
    };
    this.getUserProfile();
    this.openedMenu = false;
  }

  notificationListener() {
    this.listener = DeviceEventEmitter.addListener(
      'RefreshNotifications',
      () => {
        this.setState({
          notificationCount: CacheService.unReadNotificationsCount(),
        });
      },
    );
  }

  componentWillUpdate = nextProps => {
    if (
      nextProps &&
      nextProps.navigation &&
      nextProps.navigation.state &&
      !nextProps.navigation.state.isDrawerOpen &&
      !this.openedMenu
    ) {
      this.openedMenu = true;
      let isDrawerOpen = nextProps.navigation.state.isDrawerOpen;
      DeviceEventEmitter.emit('DrawerUpdated', isDrawerOpen);

      setTimeout(() => {
        this.openedMenu = false;
      }, 1000);
    }
  };

  componentDidMount = () => {
    this.notificationListener();
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._handleConnectivityChange,
    );
  };

  _handleConnectivityChange = isConnected => {
    if (isConnected == true) {
      this.getUserProfile();
    }
  };

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this._handleConnectivityChange,
    );
  }

  /**
   * Fetches user profile from server
   */
  getUserProfile() {
    this.apiService
      .loadUser()
      .then(response => {
        if (response.error == 'token_expired') {
          this.logoutUser();
        }
        console.log('DATA FROM SERVER User' + JSON.stringify(response));
        AsyncStorage.setItem('USERPROFILE', JSON.stringify(response.user));
        this.earlyExpirationReminder(response.user.valid_to);
        CacheService.setUserData(response.user);
        let username = response.user.name + ' ' + response.user.surname;
        this.setState({username});
      })
      .catch(error => {
        if (error == 'No Internet') {
          AsyncStorage.getItem('USERPROFILE')
            .then(response => {
              console.log('user data' + response);
              if (response !== null) {
                let user = JSON.parse(response);
                this.earlyExpirationReminder(user.valid_to);
                CacheService.setUserData(user);
                let username = user.name + ' ' + user.surname;
                this.setState({username});
              }
            })
            .catch(error => {
              console.log(error);
            });
        } else if (error == 'Not Logged In') {
          AsyncStorage.getItem('USERPROFILE')
            .then(response => {
              console.log('user data' + response);
              if (response !== null) {
                let user = JSON.parse(response);
                this.earlyExpirationReminder(user.valid_to);
                CacheService.setUserData(user);
                let username = user.name + ' ' + user.surname;
                this.setState({username});
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
        console.log('ERROR FROM SERVER' + JSON.stringify(error));
      });
  }

  /**
   * Navigates user to screen and toggles the drawer
   * @param {*} screen
   */
  navigateUserToScreen(screen) {
    this.props.navigation.toggleDrawer();
    setTimeout(() => {
      const resetAction = StackActions.reset({
        index: 1,
        key: undefined,
        actions: [
          NavigationActions.navigate({routeName: 'HeaderHome'}),
          NavigationActions.navigate({routeName: screen}),
        ],
      });
      this.props.navigation.dispatch(resetAction);
    }, 0.0001);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerView}>
            <Text style={styles.header}>{this.state.username}</Text>
          </View>

          <TouchableOpacity
            style={{
              paddingVertical: moderateScale(14),
              flexDirection: 'row',
              alignItems: 'center',
              position: 'relative',
              width: '100%',
            }}
            // onPress={() => this.navigateUserToScreen('New')}
            onPress={() => {
              this.props.navigation.toggleDrawer();
              this.props.navigation.navigate('New', {hideBackButton: true});
            }}>
            <Octicons
              style={{
                marginLeft: moderateScale(9),
                color: '#000',
                width: '20%',
              }}
              name="law"
              size={moderateScale(32)}
            />
            <View
              style={{
                width: '80%',
                flexDirection: 'row',
              }}>
              <Text style={styles.text}>Νέα</Text>
              {this.state.notificationCount > 0 && (
                <View
                  style={{
                    width: moderateScale(14),
                    height: moderateScale(14),
                    borderRadius: moderateScale(7),
                    left: moderateScale(8),
                    justifyContent: 'flex-start',
                    //backgroundColor: 'red',
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      textAlign: 'center',
                      fontSize: moderateScale(10),
                    }}>
                    {this.state.notificationCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              paddingVertical: moderateScale(14),
              flexDirection: 'row',
              alignItems: 'center',
              position: 'relative',
              width: '100%',
            }}
            //onPress={() => this.navigateUserToScreen('Update')}
            onPress={() => {
              this.props.navigation.toggleDrawer();
              this.props.navigation.navigate('Update', {hideBackButton: true});
            }}>
            <View
              style={{
                width: '20%',
                alignItems: 'flex-start',
              }}>
              <MaterialCommunityIcon
                style={{
                  marginLeft: moderateScale(9),
                  color: '#000',
                }}
                name="download-outline"
                size={moderateScale(32)}
              />
            </View>
            <View
              style={{
                width: '80%',
                flexDirection: 'row',
                paddingLeft: moderateScale(9),
              }}>
              <Text style={styles.badgeText}>Ενημερώσεις</Text>
              <View
                style={{
                  width: moderateScale(14),
                  height: moderateScale(14),
                  borderRadius: moderateScale(7),
                  left: moderateScale(8),
                  // backgroundColor: 'red',
                }}>
                {/* <Text style={{color:"#fff", textAlign:"center", fontSize:10,}}>14</Text> */}
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingVertical: moderateScale(14),
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              // paddingHorizontal:moderateScale(8)
            }}
            //onPress={() => this.navigateUserToScreen('Contact')}
            onPress={() => {
              this.props.navigation.toggleDrawer();
              this.props.navigation.navigate('Contact', {hideBackButton: true});
            }}>
            {/* <MaterialIcons
              style={{
                marginLeft: moderateScale(9),
                color: '#016521',
                width: '20%',
              }}
              name="perm-phone-msg"
              //  color="#fff"
              size={moderateScale(25)}
            /> */}
            <View style={{width: '20%', paddingLeft: moderateScale(9)}}>
              <Image
                source={require('../assets/phonemsg.png')}
                style={{height: moderateScale(32), width: moderateScale(32)}}
              />
            </View>
            <Text style={[styles.text, {paddingLeft: moderateScale(9)}]}>
              Επικοινωνία
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingVertical: moderateScale(14),
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              // paddingHorizontal:moderateScale(8)
            }}
            onPress={() => {
              this.props.navigation.toggleDrawer();
              this.props.navigation.navigate('Account', {
                hideBackButton: true,
              });
            }}>
            <MaterialIcons
              style={{
                marginLeft: moderateScale(8),
                color: '#000',
                width: '20%',
              }}
              name="person-outline"
              size={moderateScale(32)}
            />
            <Text style={styles.text}>Λογαριασμός</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingVertical: moderateScale(14),
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              // paddingHorizontal:moderateScale(8)
            }}
            // onPress={() => this.navigateUserToScreen('Products')}
            onPress={() => {
              this.props.navigation.toggleDrawer();
              this.props.navigation.navigate('Products', {
                hideBackButton: true,
              });
            }}>
            <MaterialIcons
              style={{
                marginLeft: moderateScale(9),
                color: '#000',
                width: '20%',
              }}
              name="label-outline"
              //  color="#fff"
              size={moderateScale(32)}
            />
            <Text style={styles.text}>Προϊόντα</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingVertical: moderateScale(14),
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              // paddingHorizontal:moderateScale(8)
            }}
            //onPress={() => this.navigateUserToScreen('Instruction')}
            onPress={() => {
              this.props.navigation.toggleDrawer();
              this.props.navigation.navigate('Instruction', {
                hideBackButton: true,
              });
            }}>
            <Foundation
              style={{
                marginLeft: moderateScale(9),
                color: '#000',
                width: '20%',
              }}
              name="info"
              //  color="#fff"
              size={moderateScale(32)}
            />
            <Text style={styles.text}>Οδηγίες χρήσης</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingVertical: moderateScale(14),
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              // paddingHorizontal:moderateScale(8)
            }}
            onPress={() => this.logoutUser()}>
            <View style={{width: '20%'}}>
              <MaterialCommunityIcon
                style={{
                  marginLeft: moderateScale(9),
                  color: '#000',
                }}
                name="logout"
                //  color="#fff"
                size={moderateScale(32)}
              />
            </View>
            <Text style={styles.textLogout}>Έξοδος</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // maxWidth: '100%',
    marginLeft: moderateScale(10),
    // paddingLeft:moderateScale(10)
    //justifyContent:'center',
    //alignItems:'center',
  },
  textLogout: {
    marginLeft: moderateScale(10),
    color: '#000',
    width: '80%',
    fontSize: moderateScale(20),
  },
  text: {
    marginLeft: moderateScale(5),
    color: '#000',
    width: '80%',
    position: 'relative',
    fontSize: moderateScale(20),
  },
  badgeText: {
    marginLeft: moderateScale(5),
    color: '#000',
    fontSize: moderateScale(20),
  },
  header: {
    color: '#016521',
    fontWeight: 'bold',
    fontSize: moderateScale(25),
    marginLeft: moderateScale(10),
  },
  headerView: {
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    height: moderateScale(100),
    // width:moderateScale(250),
    // padding:moderateScale(10)
  },
  imageStyle: {
    width: '100%',
    height: moderateScale(180),
  },
  iconStyle: {
    width: moderateScale(17),
    height: moderateScale(17),
    marginRight: moderateScale(10),
  },
  iconStyle2: {
    width: moderateScale(30),
    height: moderateScale(30),
    marginRight: moderateScale(10),
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(10),
  },
  textStyle: {
    fontSize: moderateScale(13),
    color: '#929292',
    fontWeight: 'bold',
  },
});
