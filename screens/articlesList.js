/**
 * Artical list Screen.
 * @Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */
import React, {Component} from 'react';
import {
  FlatList,
  StyleSheet,
  ActivityIndicator,
  View,
  DeviceEventEmitter,
  ScrollView,
  Alert,
  AsyncStorage,
} from 'react-native';
import Loading from '../component/loading';
import Screen from '../screens/screen';
import CustomFooter from '../component/custom_footer';
import {StackActions, NavigationActions} from 'react-navigation';
import SearchModal from '../component/search_modal';
import NetworkError from '../component/network-error';
import ArticleListItem from '../component/article-list-item';
import {moderateScale} from 'react-native-size-matters';
import OfflineDatabase from '../services/offlineDatabase';
import OfflineManager from '../services/offline_service';
import NetInfo from '@react-native-community/netinfo';

export default class ArticlesList extends Screen {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      loader: true,
      article: '',
      isModalVisible: false,
      paginationArr: [],
      articles: [],
      disableButton: true,
      lawNumber: null,
      noNetwork: false,
      notAvailableOffline: false,
      isModalVisible: false,
      noInternet: false,
      categoryId: this.props.navigation.state.params.categoryId,
      checkOnline: null,
      // offlineSwitch: OfflineManager.getInstance(),
    };
    this.onEndReachedCalledDuringMomentum = true;
  }

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };

  componentDidMount() {
    AsyncStorage.getItem('checkOffline').then(value => {
      this.setState({checkOnline: JSON.parse(value)});
    }); //change by akriti

    // this.unsubscribe = NetInfo.addEventListener(state => {
    //   if (state.isConnected) {
    //   this.refreshCategories();
    // } else {
    // console.log('offline name is ' + this.props.navigation.state.routeName);
    // if (OfflineManager.isOnline) {
    // Alert.alert(
    //   '',
    //   'Εντάξει',
    //   [
    //     {
    //       text: 'Εντάξει',
    //       onPress: () => {
    //         // this.props.navigation.navigate('HeaderHome');
    //         this.props.navigation.navigate('HeaderHome', {
    //           isOfflineAlert: true,
    //         });
    //       },
    //     },
    //     {
    //       text:
    //         'Λειτουργία εκτός σύνδεσης – Έχετε πρόσβαση μόνο στα άρθρα του Α.Κ. , Κ.Πολ.Δ.  , Π.Κ. , Κ.Π.Δ., ως έχουν βάσει της τελευταίας εγκατάστασης ενημερώσεων που πραγματοποιήσατε?',
    //       onPress: () => {},
    //     },
    //   ],
    //   {cancelable: true},
    // );
    // } else {
    this.refreshCategories();
    // }
  }
  // });

  resetHomeScreen() {
    // alert('Your token has expired. Please login with online mode.');
    // this.authService.resetUserCredentials();
    OfflineManager.setOnline(false);
    // this.props.navigation.pop('3');
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
      if (!this.state.checkOnline) {
        this.setState({noInternet: true});
        this.getArticlesOffline();
      } else {
        this.getArticlesById();
      }
    }, 100);
  }

  enableButton() {
    if (this.state.userName != '' && this.state.password != '') {
      this.setState({
        disableButton: false,
      });
    } else {
      this.setState({
        disableButton: true,
      });
    }
  }

  /**
   * When User presses refresh on network error screen
   */
  onRefreshPress() {
    this.setState({noNetwork: false}, () => {
      this.setState({loader: true}, () => {
        this.getArticlesById();
      });
    });
  }

  getFooter() {
    if (inLawNumber == true) {
      this.setState({
        showFooter: true,
      });
    }
  }

  /**
   * Fetch Articles from server on the basis of parentID.
   */
  getArticlesById() {
    this.apiService
      .getLawArticlesById(this.state.categoryId, this.state.page)
      .then(response => {
        console.log('articleTitleOnline' + JSON.stringify(response));
        if (response.error == 'token_expired') {
          this.logoutUser();
        }

        console.log('response is ' + JSON.stringify(response));

        let articles = this.state.articles;
        let newArticles = response.articles.data;
        this.props.navigation.setParams({title: response.category.title});
        newArticles.forEach(article => {
          articles.push(article);
        });

        this.setState({
          articles,
          lawNumber: response.category.ancestor_law_number,
          loader: false,
          loading: false,
        });
      })
      .catch(error => {
        if (error == 'No Internet') {
          this.setState({noInternet: true});
          this.getArticlesOffline();
        } else if (error == 'Not Logged In') {
          this.setState({noInternet: true});
          this.getArticlesOffline();
        } else {
          this.setState({loader: false, loading: false});
        }
      });
  }

  getArticlesOffline() {
    OfflineDatabase.getArticles(this.state.categoryId, this.state.page)
      .then(response => {
        console.log('responseArticlesOffline' + JSON.stringify(response));
        this.setState({
          articles: response,
          loader: false,
          loading: false,
        });
      })
      .catch(error => {
        if (error == 'No Data Offline') {
          setTimeout(() => {
            this.setState({
              loader: false,
              noNetwork: true,
              notAvailableOffline: true,
            });
          }, 1500);
          //change by akriti
          if (this.state.noNetwork == true) {
            this.props.navigation.navigate('NoNetwork');
            this.onRefreshPress();
            //end
          }
        }
      });
  }

  onArticlePress(item) {
    let id = item.id;
    if (item.articleId) {
      id = item.articleId; //to get articleId when fetching from offline
    }
    this.props.navigation.navigate({
      routeName: 'Topics',
      params: {
        title: item.title,
        articleId: id,
      },
      key: 'Topics' + id,
    });
  }

  /**
   * Function that fires when user reaches to list end while scrolling.
   */
  onScrollHandler = () => {
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (!this.onEndReachedCalledDuringMomentum) {
        this.setState(
          {
            loading: true,
            page: this.state.page + 1,
          },
          () => {
            this.getArticlesById();
            this.onEndReachedCalledDuringMomentum = true;
          },
        );
      } else {
        this.setState({
          loading: false,
        });
      }
    }, 200);
  };

  LoadMoreRandomData = () => {
    this.setState(
      {
        loading: true,
        page: this.state.page + 1,
      },
      () => {
        this.getArticlesById();
        // this.onEndReachedCalledDuringMomentum = true;
      },
    );

    // this.setState({
    // page:this.state.page+1
    // },()=>this.LoadRandomData())
  };

  /**
   * Shows footer on the basis of following
   */
  renderFooter() {
    // if (this.state.lawNumber != null) {
    return (
      <CustomFooter
        modal={() => this.setState({isModalVisible: true})}
        lawNumber={this.state.lawNumber}
        noInternet={false}
      />
    );
    // }
  }

  /**
   * Loader component for pagination used in flatlist footer
   */
  loader() {
    return (
      <View style={{height: moderateScale(60), justifyContent: 'center'}}>
        {this.state.loading && this.state.articles.length > 9 && (
          <ActivityIndicator size="small" color="green" />
        )}
      </View>
    );
  }

  render() {
    const {
      loader,
      articleId,
      articles,
      noNetwork,
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
            key={articleId}
            cancel={() => this.dismissNetworkModal()}
            ref={o => (this.NetworkError = o)}
            noNetwork={noNetwork}
            onPress={() => this.onRefreshPress()}
          /> */}
          <View style={{flexGrow: 1}}>
            <FlatList
              data={articles}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={<View style={{height: 10}} />}
              ListFooterComponent={this.loader()}
              renderItem={({item}) => {
                return (
                  <ArticleListItem
                    onPress={() => this.onArticlePress(item)}
                    article={item}
                  />
                );
              }}
              keyExtractor={(item, index) => index.toString()}
              // onEndReachedThreshold={0}
              onEndReached={this.LoadMoreRandomData}
              // onMomentumScrollBegin={() => {
              //   this.onEndReachedCalledDuringMomentum = false;
              // }}
              // onEndReached={this.onScrollHandler.bind(this)}
              // onEndThreshold={0}
              // onEndReachedThreshold={0.01}
              extraData={articles}
            />
          </View>
        </ScrollView>

        {this.renderFooter()}
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

  categoryItem: {
    flexDirection: 'row',
    paddingHorizontal: moderateScale(8),
    padding: moderateScale(15),
    borderWidth: moderateScale(0.4),
    width: '100%',
    borderColor: '#D9DBDA',
    alignItems: 'center',
  },
  image: {
    width: '10%',
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
