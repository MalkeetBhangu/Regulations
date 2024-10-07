/**
 * Law Categories Screen.
 * @Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */
import React, {Component} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  DeviceEventEmitter,
  Alert,
  Text,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Loading from '../component/loading';
import NetworkError from '../component/network-error';
import {StackActions, NavigationActions} from 'react-navigation';
import LawCategoryItem from '../component/law-category-item';
import NavigationService from '../services/NavigationService';
import CacheService from '../services/cache_service';
import Screen from '../screens/screen';
import OfflineDatabase from '../services/offlineDatabase';
import OfflineManager from '../services/offline_service';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
// import AlertSwitch from '../component/alert_switch';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';

export default class LawCategories extends Screen {
  constructor(props) {
    super(props);
    console.log(
      'user data in home class' + JSON.stringify(CacheService.userData),
    );

    this.state = {
      page: 0,
      loader: true,
      noInternet: false,
      lawCategories: [],
      noNetwork: false,
      notAvailableOffline: false,
      checkOnline: null,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('checkOffline').then(value => {
      this.setState({checkOnline: JSON.parse(value)});
      // alert(this.state.checkOnline);
    }); //change by akriti
    // alert(this.state.checkOnline);
    this.unsubscribe = NetInfo.addEventListener(state => {
      console.log('state.isConnected' + state.isConnected);
      if (state.isConnected) {
        // alert(state.isConnected);
        //this.fetchLawCategories(); // change by akriti
        this.refreshCategories();
        //  OfflineManager.isAlertShown = false;
      } else {
        if (
          OfflineManager.isOnline
          // && !OfflineManager.getAlertShown()
        ) {
          this.refreshCategories();
          Toast.show(
            'Λειτουργία εκτός σύνδεσης – Έχετε πρόσβαση μόνο στα άρθρα του Α.Κ. , Κ.Πολ.Δ.  , Π.Κ. , Κ.Π.Δ., ως έχουν βάσει της τελευταίας εγκατάστασης ενημερώσεων που πραγματοποιήσατε?',
            Toast.LONG,
          );
          // Toast.show(
          //   'This is nicely visible even if you call this when an Alert is shown',
          //   Toast.SHORT,
          //   ['UIAlertController'],
          // );
          // OfflineManager.isAlertShown = true;
          // this.resetHomeScreen();
          // Alert.alert('', 'Συναγερμός', [
          //   {
          //     text: 'Εντάξει',
          //     onPress: () => {
          //       this.props.navigation.navigate('HeaderHome', {
          //         isOfflineAlert: true,
          //       });
          //       // this.resetHomeScreen();
          //     },
          //   },
          //   {
          //     text:
          //       'Λειτουργία εκτός σύνδεσης – Έχετε πρόσβαση μόνο στα άρθρα του Α.Κ. , Κ.Πολ.Δ.  , Π.Κ. , Κ.Π.Δ., ως έχουν βάσει της τελευταίας εγκατάστασης ενημερώσεων που πραγματοποιήσατε?',
          //     onPress: () => {},
          //   },
          // ]);
          // setTimeout(() => {
          //   // alert('Your token has expired. Please login with online mode.');
          //   // this.authService.resetUserCredentials();
          //   OfflineManager.setOnline(false);
          //   const resetAction = StackActions.reset({
          //     index: 0,
          //     actions: [NavigationActions.navigate({routeName: 'Home'})],
          //   });
          //   this.props.navigation.dispatch(resetAction);
          // }, 300);
        } else {
          this.refreshCategories();
        }
      }
    });
  }
  resetHomeScreen() {
    // alert('Your token has expired. Please login with online mode.');
    // this.authService.resetUserCredentials();
    OfflineManager.setOnline(false);
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName: 'Home'})],
    });
    this.props.navigation.dispatch(resetAction);
  }
  /**
   * Method used to refresh categories
   */
  refreshCategories() {
    setTimeout(() => {
      //change by akriti
      if (this.state.checkOnline == false) {
        this.setState({noInternet: true});
        this.getCategoriesOffline();
      } else {
        this.setState({noInternet: false});
        this.fetchLawCategories();
      }
    }, 100);
  }

  _handleConnectivityChange = isConnected => {
    if (isConnected == true) {
      this.fetchLawCategories();
    }
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  /**
   * When User presses refresh on network error screen
   */
  onRefreshPress() {
    this.setState({noNetwork: false}, () => {
      this.setState({loader: true}, () => {
        this.fetchLawCategories();
      });
    });
  }

  /**
   * Fetches Law categories from server.
   */
  fetchLawCategories() {
    this.apiService
      .getLawCategories()
      .then(response => {
        console.log('responseLawCategory' + JSON.stringify(response));
        if (response.error == 'token_expired') {
          this.logoutUser();
        }
        //OfflineDatabase.storeLawCategories(response.law_categories);
        this.setState({
          lawCategories: response.law_categories,
          loader: false,
          noInternet: false,
        });
      })
      .catch(error => {
        if (error == 'No Internet') {
          // Alert.alert('', 'Please switch the mode.', [
          //   {
          //     text: 'ok',
          //     onPress: () => NavigationService.navigate('HeaderHome'),
          //   },
          // ]);

          this.setState({noInternet: true});
          // this.AlertSwitch.toggleModal();
          this.getCategoriesOffline();
        } else if (error == 'Not Logged In') {
          this.setState({noInternet: true});
          this.getCategoriesOffline();
        } else {
          this.setState({loader: false});
        }
        console.log('ERROR FROM SERVER' + JSON.stringify(error));
      });
  }

  /**
   * Fetches law categories from offline storage
   */
  getCategoriesOffline() {
    let offlineLawCategories = OfflineDatabase.getAllOfflineLawCategories();

    console.log('offline Categories' + JSON.stringify(offlineLawCategories));
    if (offlineLawCategories.length != 0) {
      this.setState({lawCategories: offlineLawCategories, loader: false});
    } else {
      this.setState({
        loader: false,
        noNetwork: true,
        notAvailableOffline: true,
      });
    }

    // OfflineDatabase.getLawCategories()
    //   .then(response => {
    //     this.setState({lawCategories: response, loader: false});
    //   })
    //   .catch(error => {
    //     if (error == 'No Data Offline') {
    //       this.setState({
    //         loader: false,
    //         noNetwork: true,
    //         notAvailableOffline: true,
    //       });
    //     }
    //   });
  }

  /**
   * If NOT ACCESSIBLE SHOW NOT SUBSCRIBED SCREEN.
   * Else Route User to ArticleList if isLeaf is true else Sub-Category Screen.
   */
  onCategoryPress(item) {
    //if (this.state.noInternet && !item.isAvailable) {
    if (this.state.noInternet && item.offline == 0) {
      this.setState({noNetwork: true});
    } else if (!item.accessible) {
      this.props.navigation.navigate('NotSubscribed');
    } else if (item.is_leaf) {
      this.props.navigation.navigate('ArticlesList', {
        categoryId: item.id,
      });
    } else {
      let params = {
        title: item.title,
        ancestor_law_number: item.ancestor_law_number,
        categoryId: item.id,
      };

      if (this.state.noInternet) {
        params.subLawCategories = item.children;
      }
      this.props.navigation.navigate({
        routeName: 'LawCategoriesById',
        params: params,
        key: 'LawCategoriesById' + item.id,
      });
    }
  }

  render() {
    const {noNetwork, lawCategories, noInternet} = this.state;

    if (this.state.loader) {
      return <Loading />;
    }
    return (
      <View style={styles.container}>
        {/* <NetworkError
          ref={o => (this.NetworkError = o)}
          cancel={() => this.dismissNetworkModal()}
          noNetwork={noNetwork}
          onPress={() => this.onRefreshPress()}
        /> */}
        {/* <AlertSwitch
          ref={o => (this.AlertSwitch = o)}
          title={'ΛΑΘΟΣ'}
          message={
            'Η εφαρμογή απαιτεί σύνδεση στο διαδίκτυο. Παρακαλώ συνδεθείτε και δοκιμάστε ξανά.'
          }
        /> */}
        <FlatList
          data={lawCategories}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => {
            return (
              <LawCategoryItem
                noInternet={noInternet}
                onPress={() => this.onCategoryPress(item)}
                item={item}
              />
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          extraData={lawCategories}
        />
        {/* {this.state.showLoginWithoutInternet && (
          <View
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
          </View>
        )} */}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: moderateScale(7),
    backgroundColor: 'white',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: moderateScale(5),
  },
});
