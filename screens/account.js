/**
 *Account screen
 *@Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Screen from '../screens/screen';
import DeviceInfo from 'react-native-device-info';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CacheService from '../services/cache_service';
import moment from 'moment';
import 'moment/locale/el';
import {moderateScale} from 'react-native-size-matters';

export default class Account extends Screen {
  constructor(props) {
    super(props);
    this.state = {
      userExpired: false,
      user: CacheService.userData,
      appVersion: DeviceInfo.getReadableVersion(),
    };

    moment.locale('el'); //converts moment language to greek
  }
  componentDidMount() {
    this.checkExpiryDate();
  }

  /**
   * Checks if user subscription is valid or expired.
   * Also notifies user 4 and 11 days prior to account expiration.
   */
  checkExpiryDate() {
    // let date1 = moment('2020-05-01 18:35:00');
    let validUptoDate = moment(this.state.user.valid_to);
    let currentTime = moment();

    let days = validUptoDate.diff(currentTime, 'days');
    console.log('difference in days' + days);

    if (days < 12) {
      this.setState({userExpired: true});
    } else {
      this.setState({userExpired: false});
    }
  }

  render() {
    const heightOfDeviceScreen = Dimensions.get('window').height;

    const {userExpired, user, appVersion} = this.state;
    return (
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        colors={['#6f9358', '#628950', '#416642']}
        style={styles.LinearGradientStyle}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: moderateScale(25)}}>
          <View style={styles.imageView}>
            <Image
              style={styles.image}
              source={require('../assets/account.png')}
            />
          </View>
          <Text style={styles.titleText}>ΤΕΤΡΑΒΙΒΛΟΣ {'\n'}ΝΟΜΟΠΑΙΔΕΙΑ</Text>
          <View style={{position: 'relative', width: '100%'}}>
            <View style={styles.detailViewBackground}>
              <View style={styles.userDetailsView}>
                {userExpired ? (
                  <View style={{width: '10%', margin: moderateScale(15)}}>
                    <Image
                      style={{
                        height: moderateScale(22),
                        width: moderateScale(22),
                      }}
                      source={require('../assets/userIcon.png')}
                    />
                  </View>
                ) : (
                  <View style={{width: '10%', margin: moderateScale(15)}}>
                    <Image
                      style={{
                        height: moderateScale(22),
                        width: moderateScale(22),
                      }}
                      source={require('../assets/userIconGreen.png')}
                    />
                  </View>
                )}
                <View style={{justifyContent: 'space-between', width: '90%'}}>
                  <Text
                    style={{
                      color: '#016521',
                      fontSize: moderateScale(10),
                      marginTop: moderateScale(5),
                    }}>
                    Όνομα Χρήστη
                  </Text>
                  <Text
                    style={{
                      color: '#016521',
                      fontSize: moderateScale(14),
                      marginBottom: moderateScale(5),
                    }}>
                    {user.username}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  height: moderateScale(1),
                  backgroundColor: '#016521',
                  marginHorizontal: 12,
                }}
              />

              <View style={styles.userDetailsView}>
                <View style={{margin: moderateScale(15), width: '10%'}} />

                <View style={{justifyContent: 'space-between', width: '90%'}}>
                  <Text
                    style={{
                      color: '#016521',
                      fontSize: moderateScale(10),
                      marginTop: moderateScale(5),
                      marginBottom: moderateScale(7),
                    }}>
                    Όνομα
                  </Text>
                  <Text
                    style={{
                      color: '#016521',
                      fontSize: moderateScale(14),
                      marginBottom: moderateScale(5),
                      marginTop: moderateScale(7),
                    }}>
                    {user.name}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  height: moderateScale(1),
                  backgroundColor: '#016521',
                  marginHorizontal: 12,
                }}
              />
              <View style={styles.userDetailsView}>
                <View style={{margin: moderateScale(15), width: '10%'}} />

                <View style={{justifyContent: 'space-between', width: '90%'}}>
                  <Text
                    style={{
                      color: '#016521',
                      fontSize: moderateScale(10),
                      marginTop: moderateScale(5),
                      marginBottom: moderateScale(7),
                    }}>
                    Επίθετο
                  </Text>
                  <Text
                    style={{
                      color: '#016521',
                      marginTop: moderateScale(7),
                      fontSize: moderateScale(14),
                      marginBottom: moderateScale(5),
                    }}>
                    {user.surname}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  height: moderateScale(1),
                  backgroundColor: '#016521',
                  marginHorizontal: 12,
                }}
              />
              <View style={styles.userDetailsView}>
                <Fontisto
                  style={{margin: moderateScale(15), width: '10%'}}
                  name="stopwatch"
                  size={moderateScale(22)}
                  color="#016521"
                />
                <View style={{justifyContent: 'space-between', width: '90%'}}>
                  <Text
                    style={{
                      color: '#016521',
                      fontSize: moderateScale(10),
                      marginTop: moderateScale(5),
                    }}>
                    Έναρξη Συνδρομής
                  </Text>
                  <Text
                    style={{
                      color: '#016521',
                      fontSize: moderateScale(14),
                      marginBottom: moderateScale(5),
                    }}>
                    {moment(user.valid_from).format('ddd,ll')}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  height: moderateScale(1),
                  backgroundColor: '#016521',
                  marginHorizontal: 12,
                }}
              />
              <View style={styles.userDetailsView}>
                <MaterialCommunityIcons
                  style={{margin: moderateScale(15), width: '10%'}}
                  name="timer-off"
                  size={moderateScale(22)}
                  color="#016521"
                />
                <View style={{width: '75%', justifyContent: 'space-between'}}>
                  <Text
                    style={{
                      color: '#016521',
                      fontSize: moderateScale(10),
                      marginTop: moderateScale(5),
                    }}>
                    Λήξη Συνδρομής
                  </Text>
                  <Text
                    style={{
                      color: '#016521',
                      fontSize: moderateScale(14),
                      marginBottom: moderateScale(5),
                    }}>
                    {moment(user.valid_to).format('ddd,ll')}
                  </Text>
                </View>
                {userExpired && (
                  <Entypo
                    style={{
                      justifyContent: 'flex-start',
                      marginTop: moderateScale(20),
                      width: '15%',
                    }}
                    color="#ff1b1b"
                    name="warning"
                    size={moderateScale(22)}
                  />
                )}
              </View>
              <View
                style={{
                  height: moderateScale(1),
                  backgroundColor: '#016521',
                  marginHorizontal: 12,
                }}
              />
              <View style={styles.userDetailsView}>
                <MaterialCommunityIcons
                  style={{margin: moderateScale(15), width: '10%'}}
                  name="filter-variant"
                  size={moderateScale(22)}
                  color="#016521"
                />
                <View style={{justifyContent: 'space-between', width: '90%'}}>
                  <Text
                    style={{
                      color: '#016521',
                      fontSize: moderateScale(10),
                      marginTop: moderateScale(5),
                    }}>
                    Συνδρομή
                  </Text>
                  <Text
                    style={{
                      color: '#016521',
                      fontSize: moderateScale(14),
                      marginBottom: moderateScale(5),
                    }}>
                    {user.subscription.title}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  height: moderateScale(1),
                  backgroundColor: '#016521',
                  marginHorizontal: 12,
                }}
              />
              <View style={styles.userDetailsView}>
                <FontAwesome
                  style={{margin: moderateScale(15), width: '10%'}}
                  name="envelope"
                  size={moderateScale(21)}
                  color="#016521"
                />
                <View style={{justifyContent: 'space-between', width: '90%'}}>
                  <Text
                    style={{
                      color: '#016521',
                      fontSize: moderateScale(10),
                      marginTop: moderateScale(5),
                    }}>
                    Διεύθυνση Email
                  </Text>
                  <Text
                    style={{
                      color: '#016521',
                      fontSize: moderateScale(14),
                      marginBottom: moderateScale(5),
                    }}>
                    {user.email}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  height: moderateScale(1),
                  backgroundColor: '#016521',
                  marginHorizontal: 12,
                }}
              />
              <View style={styles.userDetailsView}>
                <MaterialIcons
                  style={{margin: moderateScale(15), width: '10%'}}
                  name="date-range"
                  size={moderateScale(23)}
                  color="#016521"
                />
                <View style={{justifyContent: 'space-between', width: '90%'}}>
                  <Text
                    style={{
                      color: '#016521',
                      fontSize: moderateScale(10),
                      marginTop: moderateScale(5),
                    }}>
                    Ημερομηνία Εγγραφής
                  </Text>
                  <Text
                    style={{
                      color: '#016521',
                      fontSize: moderateScale(14),
                      marginBottom: moderateScale(5),
                    }}>
                    {moment(user.created_at).format('ddd,ll')}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  height: moderateScale(1),
                  backgroundColor: '#016521',
                  marginHorizontal: 12,
                }}
              />
              <View style={styles.userDetailsView}>
                <FontAwesome
                  style={{margin: moderateScale(15), width: '10%'}}
                  name="refresh"
                  size={moderateScale(21)}
                  color="#016521"
                />
                <View
                  style={{
                    justifyContent: 'space-between',
                    width: '90%',
                  }}>
                  <Text
                    style={{
                      color: '#016521',
                      fontSize: moderateScale(10),
                      marginTop: moderateScale(5),
                    }}>
                    Τρέχουσα έκδοση
                  </Text>
                  <Text
                    style={{
                      color: '#016521',
                      fontSize: moderateScale(14),
                      marginBottom: moderateScale(5),
                    }}>
                    {appVersion}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  height: moderateScale(1),
                  backgroundColor: '#016521',
                  marginHorizontal: 12,
                }}
              />
            </View>
            <View style={styles.userDetailsFirstShadow} />
            <View style={styles.userDetailsSecondShadow} />
          </View>
        </ScrollView>
        {/* {this.state.showLoginWithoutInternet && (<View
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
      </LinearGradient>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  LinearGradientStyle: {
    flex: 1,
  },
  image: {
    width: moderateScale(50),
    height: moderateScale(50),
  },
  imageView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateScale(25),
    marginBottom: moderateScale(5),
  },
  titleText: {
    color: '#3d5741',
    fontWeight: 'bold',
    fontSize: moderateScale(15),
    textAlign: 'center',
  },
  userDetailsView: {
    flexDirection: 'row',
    width: '90%',
    marginTop: moderateScale(2),
  },
  userDetailsFirstShadow: {
    zIndex: moderateScale(-1),
    bottom: moderateScale(30),
    top: moderateScale(15),
    right: moderateScale(8),
    left: moderateScale(50),
    opacity: moderateScale(0.2),
    backgroundColor: '#fff',
    marginTop: moderateScale(30),
    borderRadius: moderateScale(10),
    position: 'absolute',
  },
  userDetailsSecondShadow: {
    zIndex: moderateScale(-2),
    bottom: moderateScale(15),
    top: moderateScale(0),
    right: moderateScale(16),
    left: moderateScale(50),
    opacity: moderateScale(0.4),
    backgroundColor: '#fff',
    marginTop: moderateScale(25),
    borderRadius: moderateScale(10),
    position: 'absolute',
  },
  detailViewBackground: {
    zIndex: 2,
    backgroundColor: '#fff',
    marginTop: moderateScale(10),
    borderRadius: moderateScale(10),
    marginHorizontal: moderateScale(25),
    paddingBottom: moderateScale(15),
  },
});
