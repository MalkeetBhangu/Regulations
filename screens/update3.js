/**
 * 
 @author Logicease
 *
 */
import React, {Component} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Image,
  ScrollView,
  DeviceEventEmitter,
  Dimensions,
} from 'react-native';
import Screen from '../screens/screen';
import Loading from '../component/loading';
import CacheService from '../services/cache_service';
import ApiService from '../services/api_service';
import OfflineDatabase from '../services/offlineDatabase';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import fonts from '../styles/fonts';
import BackgroundSync from '../services/articles_background_sync';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
const initialLayout = {width: Dimensions.get('window').width};
const isWeb = Platform.OS === 'web';

export default class Instruction extends Screen {
  constructor(props) {
    super(props);
    this.state = {
      focused: true,
      index: 0,

      routes: [
        {
          key: 'updates',
          title: 'Ενημερώσεις',
        },
        {key: 'history', title: 'Ιστορικό Ενημερώσεων'},
      ],
      userUpdates: [],
      loader: true,
      userId: CacheService.userData.id,
      update_history: [],
      description: '',
      updates: [],
      update: {},
      currentUpdateDetails: [],
      updatingLoader: false,
      // updates: this.props.navigation.state.params.updates,
    };
    this.apiService = new ApiService();
    this.backgroundSync = new BackgroundSync();
  }

  componentDidMount() {
    this.getUpdateHistory();
    // this.getUserUpdates();
  }

  getUserUpdates() {
    this.apiService
      .getUserUpdates(this.state.updates)
      .then(response => {
        console.log('DAT' + JSON.stringify(response));
        if (response.error == 'token_expired') {
          this.logoutUser();
        }
        let userUpdates = [];
        let allUpdates = response.updates;
        let userUpdateHistory = this.state.update_history;
        allUpdates.forEach(item => {
          let index = userUpdateHistory.findIndex(
            update => update.id == item.id,
          );
          if (index == -1) {
            userUpdates.push(item);
          }
        });
        this.setState({userUpdates, loader: false});
      })
      .catch(error => {
        // this.setState({loader: false});
        this.setState({loader: false});
        console.log('ERROR FROM SERVER' + JSON.stringify(error));
      });
  }

  getUpdateHistory() {
    this.apiService
      .getUpdateHistory(this.state.userId)
      .then(response => {
        console.log('story' + JSON.stringify(response));
        if (response.error == 'token_expired') {
          this.logoutUser();
        }
        if (response.length != 0) {
          this.setState({
            update_history: response.update_history.updates,
            description: response.update_history.updates.description,
          });
          console.log('mno' + JSON.stringify(this.state.description));
        }
        this.getUserUpdates();
      })
      .catch(error => {
        this.setState({loader: false});
        console.log('ERROR FROM SERVER' + JSON.stringify(error));
      });
  }

  // onUpdatePress(){
  //   alert(this.state.currentUpdateDetails[0].id);
  // }

  getCurrentUpdateDetails() {
    this.setState({updatingLoader: true});
    this.apiService
      .getCurrentUpdatesDetail(this.state.userUpdates[0].id)
      .then(response => {
        console.log('DATA FROM SERVER' + JSON.stringify(response));
        if (response.error == 'token_expired') {
          this.logoutUser();
        }
        if (response.update) {
          if (response.update.categories) {
            AsyncStorage.removeItem('OFFLINELAWS');
            this.backgroundSync.fetchOfflineLawCategories();
          }
          if (response.update.articles) {
            this.updateOfflineArticles(response.update.articles);
          }
        }

        setTimeout(() => {
          this.updateCompleted(this.state.userUpdates[0].id);
        }, 5000);
      })
      .catch(error => {
        this.setState({updatingLoader: false});
        console.log('ERROR FROM SERVER' + error);
      });
  }

  /**
   * Method called when update gets completed
   */
  updateCompleted(updateId) {
    this.apiService
      .updateCompleted(this.state.userId, updateId)
      .then(response => {
        console.log('DATA FROM SERVER' + JSON.stringify(response));
        if (response.error == 'token_expired') {
          this.logoutUser();
        }
        let userUpdates = this.state.userUpdates;
        userUpdates.splice(0, 1);

        this.setState({userUpdates, updatingLoader: false});
      })
      .catch(error => {
        this.setState({updatingLoader: false});
        console.log('ERROR FROM SERVER' + error);
      });
  }

  /**
   * Updates new articles in offline storage
   * @param {*} articles
   */
  updateOfflineArticles(articles) {
    articles.forEach(article => {
      OfflineDatabase.updateArticle(article);
    });
  }

  getupdateListView() {
    return (
      <FlatList
        data={this.state.userUpdates}
        contentContainerStyle={{paddingBottom: moderateScale(30)}}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('UpdateDescription', {
                  description: this.state.description,
                })
              }
              style={{
                padding: moderateScale(10),
                shadowColor: '#787878',
                borderWidth: moderateScale(1),
                borderColor: '#fff',
                shadowOpacity: 1,
                shadowRadius: 4,
                backgroundColor: '#fff',
                shadowOffset: {width: 0, height: 4},
                elevation: 0,
                margin: moderateScale(8),
                borderRadius: moderateScale(8),
              }}>
              <Text>{item.title}</Text>
            </TouchableOpacity>
          );
        }}
      />
    );
  }

  getupdateHistoryList() {
    return (
      <FlatList
        data={this.state.update_history}
        contentContainerStyle={{paddingBottom: moderateScale(30)}}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              style={{
                padding: moderateScale(10),
                shadowColor: '#787878',
                borderWidth: moderateScale(1),
                borderColor: '#fff',
                shadowOpacity: 1,
                shadowRadius: 4,
                backgroundColor: '#fff',
                shadowOffset: {width: 0, height: 4},
                elevation: 0,
                margin: moderateScale(8),
                borderRadius: moderateScale(8),
              }}>
              <Text>{item.title}</Text>
            </TouchableOpacity>
          );
        }}
      />
    );
  }

  render() {
    const {index, routes} = this.state;
    if (this.state.loader) {
      return <Loading />;
    }
    return (
      <View style={{flex: 1}}>
        {this.state.updatingLoader && (
          <View key={'loader'} style={styles.overlay}>
            <ActivityIndicator size="small" color="white" />
          </View>
        )}

        <TabView
          swipeEnabled={false}
          tabBarPosition={'top'}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          navigationState={{index, routes}}
          renderTabBar={props => (
            <TabBar
              {...props}
              renderLabel={({route, focused, color}) => (
                <Text style={focused ? styles.focusedLabel : styles.blurLabel}>
                  {route.title}
                </Text>
              )}
              indicatorContainerStyle={{
                padding: 2,
              }}
              indicatorStyle={styles.indicator}
              style={{
                backgroundColor: 'white',
                borderColor: '#787878',

                shadowColor: '#787878',

                shadowOpacity: 1,
                shadowRadius: 4,

                shadowOffset: {width: 0, height: 4},
                elevation: 0,
              }}
            />
          )}
          renderScene={({route}) => {
            switch (route.key) {
              case 'updates':
                return this.state.userUpdates.length > 0 ? (
                  this.getupdateListView()
                ) : (
                  <Text>No update</Text>
                );

              case 'history':
                return this.state.update_history.length > 0 ? (
                  this.getupdateHistoryList()
                ) : (
                  <Text
                    style={{
                      // justifyContent: 'center',
                      textAlign: 'center',
                      color: '#016622',
                      fontWeight: '700',
                      fontSize: moderateScale(18),
                      marginTop: moderateScale(20),
                    }}>
                    No update History
                  </Text>
                );
              default:
                return null;
            }
          }}
          onIndexChange={index => this.setState({index})}
          initialLayout={initialLayout}
        />
        <TouchableOpacity
          style={{backgroundColor: '#016622', padding: moderateScale(15)}}>
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
              fontWeight: '700',
              fontSize: moderateScale(15),
              marginBottom: moderateScale(10),
            }}>
            Εγκατάσταση Όλων
          </Text>
        </TouchableOpacity>
        {/* <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}>
          {this.state.userUpdates.length > 0 && (
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              colors={['#5b7a49', '#48733e', '#426642']}
              style={styles.LinearGradientStyle}>
              <View style={styles.LinearGradientShadowBox}>
                <View style={styles.LinearGradientBox}>
                  <Text style={styles.LinearGradientText}>
                    {this.state.userUpdates[0].ndescription}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => this.getCurrentUpdateDetails()}
                style={styles.updateNowButtonShadow}>
                <View style={styles.updateNowButton}>
                  <Text style={[fonts.myriad, styles.updateNowButtonText]}>
                    Ενημέρωση τώρα
                  </Text>
                </View>
              </TouchableOpacity>
            </LinearGradient>
          )}

          {this.state.update_history.length > 0 ? (
            <View>
              <Text style={[fonts.myriad, styles.updateHistoryText]}>
                Ιστορικό Ενημερώσεων
              </Text>
              <FlatList
                data={this.state.update_history}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.shadow}
                    delayPressOut={0}
                    onPress={this.props.onPress}>
                    <View style={styles.categoryItem}>
                      <Text style={styles.title}>
                        {item.ntitle}
                        <AntDesign
                          name="circledown"
                          size={moderateScale(18)}
                          color="#016622"
                        />
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
              />
            </View>
          ) : (
            <View style={{flexGrow: 1, justifyContent: 'center'}}>
              <Text style={[fonts.myriad, styles.updateHistoryText]}>
                Sorry, No update history.
              </Text>
            </View>
          )}
        </ScrollView>
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
        </View> */}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 2,
  },
  blurLabel: {
    color: '#000',
    fontWeight: '600',
    fontSize: moderateScale(15),
  },
  focusedLabel: {
    color: '#016622',
    fontWeight: '600',
    fontSize: moderateScale(15),
  },
  categoryItem: {
    backgroundColor: '#fff',
    paddingVertical: moderateScale(12),
    maxWidth: '100%',
    flexDirection: 'row',
    paddingHorizontal: moderateScale(10),
    borderColor: '#D9DBDA',
    borderRadius: moderateScale(8),
  },
  shadow: {
    shadowOffset: {width: 0, height: 2},
    shadowColor: '#000',
    shadowOpacity: 0.2,
    elevation: moderateScale(8),
    marginTop: moderateScale(2),
    marginBottom: moderateScale(15),
    marginHorizontal: moderateScale(10),
    borderRadius: moderateScale(7),
    backgroundColor: 'rgba(0,0,0,0.1)',
    // paddingHorizontal: moderateScale(1),
    // paddingVertical: moderateScale(1),
  },
  indicator: {
    borderWidth: 2,
    borderColor: '#016622',
    // bottom: -6,
    width: '25%',
    left: '13%',
  },
  title: {
    fontSize: moderateScale(15),
    color: '#000000',
  },
  LinearGradientStyle: {
    // height: '30%',
    // width: '100%',
    // marginVertical: moderateScale(10),
  },
  LinearGradientText: {
    fontSize: moderateScale(15),
    color: '#000',
    lineHeight: moderateScale(20),
    marginHorizontal: moderateScale(5),
  },
  LinearGradientShadowBox: {
    shadowOffset: {width: 0, height: 2},
    shadowColor: '#000',
    shadowOpacity: 0.2,
    elevation: moderateScale(10),
    borderRadius: moderateScale(10),
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: moderateScale(1),
    marginLeft: moderateScale(12),
    marginRight: moderateScale(12),
    marginBottom: moderateScale(15),
    marginTop: moderateScale(30),
  },
  LinearGradientBox: {
    backgroundColor: '#fff',
    // paddingVertical: moderateScale(12),
    // maxWidth: '100%',
    height: moderateScale(150),
    // paddingHorizontal: moderateScale(10),
    borderColor: '#D9DBDA',
    borderRadius: moderateScale(8),
  },
  updateNowButton: {
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    justifyContent: 'center',
    height: moderateScale(55),
    width: '60%',
  },
  updateNowButtonText: {
    color: '#016622',
    fontSize: moderateScale(18),
    alignSelf: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  updateNowButtonShadow: {
    shadowOffset: {width: 1, height: 1},
    shadowColor: '#000',
    // justifyContent: 'center',
    shadowOpacity: 0.2,
    elevation: moderateScale(5),
    marginVertical: moderateScale(10),
    // marginHorizontal: moderateScale(10),
    // borderRadius: moderateScale(7),
    // marginTop: moderateScale(30),
    // backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: moderateScale(4),
    paddingVertical: moderateScale(4),
  },
  updateHistoryText: {
    color: '#016622',
    fontWeight: 'bold',
    fontSize: moderateScale(18),
    textAlign: 'center',
    margin: moderateScale(15),
  },
});
