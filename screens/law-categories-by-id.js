/**
 * Law categories by Id Screen.
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
  AsyncStorage,
} from 'react-native';
import Loading from '../component/loading';
import Toast from 'react-native-simple-toast';
import NetworkError from '../component/network-error';
import LawCategoryItem from '../component/law-category-item';
import {StackActions, NavigationActions} from 'react-navigation';
import Screen from '../screens/screen';
import SearchModal from '../component/search_modal';
import CustomFooter from '../component/custom_footer';
import OfflineDatabase from '../services/offlineDatabase';
import OfflineManager from '../services/offline_service';
import ArticleListItem from '../component/article-list-item';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import {ScrollView} from 'react-native-gesture-handler';
import NetInfo from '@react-native-community/netinfo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class LawCategoriesById extends Screen {
  constructor(props) {
    super(props);

    // this.isAlertShown = false;
    this.state = {
      page: 0,
      loader: true,
      articles: [],
      lawNumber: null,
      lawCategories: [],
      notAvailableOffline: false,
      isModalVisible: false,
      noNetwork: false,
      categoryId: this.props.navigation.state.params.categoryId,
      checkOnline: null,
      // offlineSwitch: OfflineManager.getInstance(),
    };
  }

  componentWillUnmount() {
    console.log('offline name law is unmount called');
    this.unsubscribe();
  }

  componentDidMount() {
    AsyncStorage.getItem('checkOffline').then(value => {
      this.setState({checkOnline: JSON.parse(value)});
    }); //change by akriti
    this.unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        this.refreshCategories();
        //   this.alertShown = false;
        // OfflineManager.isAlertShown = false;
      } else {
        if (
          OfflineManager.isOnline
          //  &&
          //  !OfflineManager.getAlertShown()
        ) {
          this.refreshCategories();
          Toast.show(
            'Λειτουργία εκτός σύνδεσης – Έχετε πρόσβαση μόνο στα άρθρα του Α.Κ. , Κ.Πολ.Δ.  , Π.Κ. , Κ.Π.Δ., ως έχουν βάσει της τελευταίας εγκατάστασης ενημερώσεων που πραγματοποιήσατε?',
            Toast.LONG,
          );
          // Alert.alert('', 'Συναγερμός', [
          //   {
          //     text: 'Εντάξει',
          //     onPress: () => {
          //       // this.resetHomeScreen();
          //     },
          //   },
          //   {
          //     text:
          //       'Λειτουργία εκτός σύνδεσης – Έχετε πρόσβαση μόνο στα άρθρα του Α.Κ. , Κ.Πολ.Δ.  , Π.Κ. , Κ.Π.Δ., ως έχουν βάσει της τελευταίας εγκατάστασης ενημερώσεων που πραγματοποιήσατε?',
          //     onPress: () => {},
          //   },
          // ]);
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
      if (this.state.checkOnline == false) {
        //change by akriti
        this.setState({noInternet: true});
        this.getSubCategoriesOffline(this.state.categoryId);
      } else {
        this.getCategoriesById();
      }
    }, 100);
  }

  /**
   * When User presses refresh on network error screen
   */
  onRefreshPress() {
    this.setState({noNetwork: false}, () => {
      this.setState({loader: true}, () => {
        this.getCategoriesById();
      });
    });
  }

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };

  /**
   * Fetch Law categories from server on the basis of parentID.
   */
  getCategoriesById() {
    this.apiService
      .getLawCategoryById(this.state.categoryId)
      .then(response => {
        if (response.error == 'token_expired') {
          this.logoutUser();
        }
        this.props.navigation.setParams({title: response.parent.title});
        //this.storeOfflineSubCategories(response);
        console.log('categoeries response ' + JSON.stringify(response));
        this.setState({
          lawCategories: response.law_categories,
          noInternet: false,
          lawNumber: response.parent.ancestor_law_number,
        });
        this.getArticlesById();
      })
      .catch(error => {
        if (error == 'No Internet') {
          this.setState({noInternet: true});
          this.getSubCategoriesOffline(this.state.categoryId);
        } else if (error == 'Not Logged In') {
          this.setState({noInternet: true});
          this.getSubCategoriesOffline(this.state.categoryId);
        } else {
          this.setState({loader: false});
        }
      });
  }

  /***
   * Store only following categories offline in database
   * For first time considering parent title when "ancestor_law_number" is null.
   * Then further nesting have the common "ancestor_law_number"
   * So taking "ancestor_law_number" as common storing $param.
   */
  storeOfflineSubCategories(response) {
    if (
      response.parent.title == 'ΑΣΤΙΚΟ ΔΙΚΑΙΟ - ΠΟΛΙΤΙΚΗ ΔΙΚΟΝΟΜΙΑ' ||
      response.parent.title == 'ΠΟΙΝΙΚΟ ΔΙΚΑΙΟ - ΠΟΙΝΙΚΗ ΔΙΚΟΝΟΜΙΑ' ||
      response.parent.ancestor_law_number == 'ΑΣΤΙΚΟΣ ΚΩΔΙΚΑΣ Α.Κ.' ||
      response.parent.ancestor_law_number ==
        'ΚΩΔΙΚΑΣ ΠΟΛΙΤΙΚΗΣ ΔΙΚΟΝΟΜΙΑΣ (Κ.Πολ.Δ.)' ||
      response.parent.ancestor_law_number == '4619 (Ν.Π.Κ.)' ||
      response.parent.ancestor_law_number == '4620 (Ν.Κ.Π.Δ.)'
    ) {
      OfflineDatabase.storeLawSubCategories(response.law_categories);
    }
  }

  getSubCategoriesOffline(categoryId) {
    let ancestor_law_number = this.props.navigation.getParam(
      'ancestor_law_number',
      '',
    );
    // let offlineLawCategories = this.props.navigation.getParam('subLawCategories',[]);
    let offlineLawCategories = [];
    OfflineDatabase.getMatchingOfflineLawCategories(
      categoryId,
      ancestor_law_number,
    ).then(value => {
      if (value && value.children.length > 0) {
        offlineLawCategories = value.children;
        offlineLawCategories.forEach(item => {
          item.accessible = true;
        });
        this.setState({
          lawCategories: offlineLawCategories,
          lawNumber: value.ancestor_law_number,
          loader: false,
        });
      } else {
        setTimeout(() => {
          this.setState({
            loader: false,
            noNetwork: true,
            notAvailableOffline: true,
          });
        }, 1500);
      }
    });

    // OfflineDatabase.getLawSubCategories(categoryId)
    //   .then(response => {
    //     this.setState({lawCategories: response, loader: false});
    //   })
    //   .catch(error => {
    //     if (error == 'No Data Offline') {
    //       //this.setState({loader: false});
    //       // alert('No Data Offline')
    //       setTimeout(() => {
    //         this.setState({
    //           loader: false,
    //           noNetwork: true,
    //           notAvailableOffline: true,
    //         });
    //       }, 1500);
    //     }
    //   });
  }

  /**
   * Fetch Articles from server on the basis of parentID.
   */
  getArticlesById() {
    this.apiService
      .getLawArticlesById(this.state.categoryId)
      .then(response => {
        if (response.error == 'token_expired') {
          this.logoutUser();
        }

        this.setState({articles: response.articles.data, loader: false});
      })
      .catch(error => {
        this.setState({loader: false});
      });
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
        title: item.title,
        // lawNumber: law_category_by_id.ancestor_law_number,
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

  /**
   * Mehtod called when user presses on article
   * @param {*} item
   */
  onArticlePress(item) {
    this.props.navigation.navigate({
      routeName: 'Topics',
      params: {
        title: item.title,
        articleId: item.id,
      },
      key: 'Topics' + item.id,
    });
  }

  /**
   * Shows footer on the basis of following
   * @param  `lawNumber`
   */
  renderFooter() {
    if (this.state.lawNumber != null) {
      return (
        <CustomFooter
          modal={() => this.setState({isModalVisible: true})}
          lawNumber={this.state.lawNumber}
          noInternet={this.state.noInternet}
        />
      );
    }
  }

  render() {
    const {
      loader,
      categoryId,
      noNetwork,
      lawCategories,
      noInternet,
      articles,
      lawNumber,
      isModalVisible,
    } = this.state;
    if (loader) {
      return <Loading />;
    }
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{}}
          showsVerticalScrollIndicator={false}>
          {/* <NetworkError
            key={categoryId}
            cancel={() => this.dismissNetworkModal()}
            ref={o => (this.NetworkError = o)}
            noNetwork={noNetwork}
            onPress={() => this.onRefreshPress()}
          /> */}
          <View>
            <FlatList
              data={lawCategories}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => {
                return (
                  <LawCategoryItem
                    onPress={() => this.onCategoryPress(item)}
                    noInternet={noInternet}
                    item={item}
                  />
                );
              }}
              keyExtractor={(item, index) => index.toString()}
              extraData={lawCategories}
            />
          </View>
          <View style={{flexGrow: 1}}>
            <FlatList
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              data={articles}
              renderItem={({item}) => {
                return (
                  <ArticleListItem
                    onPress={() => this.onArticlePress(item)}
                    article={item}
                  />
                );
              }}
              keyExtractor={(item, index) => index.toString()}
              extraData={articles}
            />
          </View>
        </ScrollView>

        {this.renderFooter()}
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
        <SearchModal
          {...this.props}
          lawNumber={lawNumber}
          cancel={() => this.toggleModal()}
          isModalVisible={isModalVisible}
        />
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
