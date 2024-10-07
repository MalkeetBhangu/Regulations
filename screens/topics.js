/**
 * Tab Screen.
 * @Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  DeviceEventEmitter,
  SafeAreaView,
} from 'react-native';
import Loading from '../component/loading';
import {StackActions, NavigationActions} from 'react-navigation';
import CacheService from '../services/cache_service';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import NetworkError from '../component/network-error';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import CustomArticle from '../component/custom_article';
import ArticleInterprentation from '../component/articleInterprentation';
import Rulings from '../component/rulings';
import ArticleVersions from '../component/article_versions';
import Screen from '../screens/screen';
import StorageUtil from '../utilities/storageUtil';
import NetworkUtility from '../utilities/networkUtil';
import OfflineDatabase from '../services/offlineDatabase';
import CustomFooter from '../component/custom_footer';
import SearchModal from '../component/search_modal';
import Permissions from '../utilities/permissions';
import OfflineManager from '../services/offline_service';

export default class Topics extends Screen {
  hasInterpretation = false;

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      articleId: this.props.navigation.state.params.articleId,
      title: this.props.navigation.getParam('title', ''),
      searchFilter: this.props.navigation.getParam('searchFilter', {}),
      article: '',
      downloadingLoader: false,
      isIconChange: false,
      isFooterShow: true,
      loader: true,
      routes: [],
      searchTerm: '',
      disableButton: true,
      lawNumber: null,
      versions: [],
      notAvailableOffline: false,
      isModalVisible: false,
      isUserAllowed: false,
      showTabs: false,
      noInternet: false,
      user: CacheService.userData,
    };

    this.permissions = new Permissions();

    this.props.navigation.setParams({
      onBackPress: this.onBackPress,
    });
  }

  componentDidMount(id) {
    this.checkIsUserAllowed();
    this.props.navigation.addListener('willBlur', payload => {
      this.networkListener.remove();
    });
    this.networkListener = DeviceEventEmitter.addListener(
      'NoNetwork',
      event => {
        if (!this.state.noNetwork) {
          this.setState({loader: false, noNetwork: true});
        }
      },
    );
    setTimeout(() => {
      if (OfflineManager.isOnline == false) {
        this.setState({noInternet: true});
        this.getArticleOffline(this.state.articleId);
      } else {
        this.getArticle(this.state.articleId);
      }
    }, 100);
  }

  /**Reset tab index to 0 on back press */
  onBackPress = () => {
    if (this.state.index != 0) {
      this.setState({index: 0});
    } else {
      this.props.navigation.goBack();
    }
  };

  /**
   * When User presses refresh on network error screen
   */
  onRefreshPress() {
    this.setState({noNetwork: false}, () => {
      this.setState({loader: true}, () => {
        this.getArticle(this.state.articleId);
      });
    });
  }

  /**
   * Check if user is allowed to view rulings i.e(nomologia) & interprentation
   * on the basis of user.subscription.role_id
   * User's only with subscription ID 1,3 & 5 have full access to contents
   */
  checkIsUserAllowed() {
    const {user} = this.state;
    if (
      user &&
      user.subscription &&
      (user.subscription.role_id === 4 ||
        user.subscription.role_id === 6 ||
        user.subscription.role_id === 7 ||
        user.subscription.role_id === 8 ||
        user.subscription.role_id === 9)
    ) {
      this.setState({isUserAllowed: false});
    } else {
      this.setState({isUserAllowed: true});
    }
  }

  isIconChange = () => {
    this.setState({
      isActive: true,
      // Show: true,
    });
  };

  /**
   * Checks if interpretation Exists in article or not
   */
  interpretationExists(htmlTxt) {
    if (!htmlTxt) {
      return false;
    }
    let interprentation = htmlTxt.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '');
    return interprentation !== '<!DOCTYPE html>';
  }

  /**
   * If user not authorized replace screen with not subscribed screen
   */
  replaceNotSubscribed() {
    const resetAction = StackActions.replace({
      routeName: 'NotSubscribed',
    });
    this.props.navigation.dispatch(resetAction);
  }

  /**
   * Fetch Article from server.
   */
  getArticle(id) {
    this.setState({routes: [], showTabs: false, noInternet: false});
    this.apiService
      .getArticle(id)
      .then(response => {
        if (response.error == 'token_expired') {
          this.logoutUser();
        }
        if (response.error == 'Not authorized.') {
          this.replaceNotSubscribed();
        }
        let article = response.article;

        this.storeArticleOffline(response);
        this.props.navigation.setParams({title: article.title});
        this.hasInterpretation = this.interpretationExists(
          article.interprentation,
        );
        this.setState(
          {
            article: article,
            lawNumber: article.law_category.ancestor_law_number,
            versions: article.article_versions,
          },
          () => {
            if (
              this.hasInterpretation ||
              this.state.versions.length ||
              article.rulings_number
            ) {
              setTimeout(() => {
                this.arrangeTabs();
              }, 300);
            } else {
              this.setState({loader: false});
            }
          },
        );
      })
      .catch(error => {
        if (error == 'No Internet') {
          this.setState({noInternet: true});
          this.getArticleOffline(id);
        } else if (error == 'Not Logged In') {
          this.setState({noInternet: true});
          this.getArticleOffline(id);
        } else {
          this.setState({loader: false});
        }
      });
  }

  getArticleOffline(id) {
    OfflineDatabase.getArticle(id)
      .then(response => {
        console.log('response offline is ' + JSON.stringify(response));
        this.props.navigation.setParams({title: response.title});
        this.setState({
          article: response,
          lawNumber: response.ancestor_law_number,
          loader: false,
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
        }
      });
  }

  /***Arrange Tabs according to the data from server */
  arrangeTabs() {
    let routes = [{key: 'Article', title: 'Αρθρο'}];
    if (this.hasInterpretation == true) {
      routes.push({key: 'Interprentation', title: 'Ερμηνεία'});
    }
    if (this.state.article.rulings_number) {
      routes.push({key: 'Rulings', title: 'Νομολογία'});
    }
    if (this.state.versions.length != 0) {
      routes.push({key: 'Versions', title: 'Ιστορικό'});
    }

    this.setState({
      routes: routes,
      showTabs: true,
      loader: false,
    });
  }

  /**
   * Render active and inactive icon for tab bar
   */
  _getTabBarIcon = props => {
    const {route, focused} = props;
    if (route.key === 'Article') {
      return focused ? (
        <MaterialCommunityIcon
          name="book-open-variant"
          size={moderateScale(30)}
          color="#fff"
        />
      ) : (
        <MaterialCommunityIcon
          name="book-open-variant"
          size={moderateScale(30)}
          color="#bfbfbf"
        />
      );
    } else if (route.key === 'Interprentation') {
      return focused ? (
        <MaterialCommunityIcon
          name="library-books"
          size={moderateScale(30)}
          color="#fff"
        />
      ) : (
        <MaterialCommunityIcon
          name="library-books"
          size={moderateScale(30)}
          color="#bfbfbf"
        />
      );
    } else if (route.key === 'Rulings') {
      return focused ? (
        <MaterialIcons name="gavel" size={moderateScale(30)} color="#fff" />
      ) : (
        <MaterialIcons name="gavel" size={moderateScale(30)} color="#bfbfbf" />
      );
    } else {
      return focused ? (
        <MaterialIcons
          name="access-time"
          size={moderateScale(30)}
          color="#fff"
        />
      ) : (
        <MaterialIcons
          name="access-time"
          size={moderateScale(30)}
          color="#bfbfbf"
        />
      );
    }
  };

  /***
   * Store only following articles offline in database
   * related to these ancestor_law_number
   */
  storeArticleOffline(response) {
    if (
      response.article.law_category.ancestor_law_number ==
        'ΑΣΤΙΚΟΣ ΚΩΔΙΚΑΣ Α.Κ.' ||
      response.article.law_category.ancestor_law_number ==
        'ΚΩΔΙΚΑΣ ΠΟΛΙΤΙΚΗΣ ΔΙΚΟΝΟΜΙΑΣ (Κ.Πολ.Δ.)' ||
      response.article.law_category.ancestor_law_number == '4619 (Ν.Π.Κ.)' ||
      response.article.law_category.ancestor_law_number == '4620 (Ν.Κ.Π.Δ.)'
    ) {
      OfflineDatabase.insertArticle(response.article);
    }
  }

  /**Download Article Pdf */
  downloadArticle() {
    NetworkUtility.checkIsNetwork().then(response => {
      if (response.isConnected) {
        this.permissions
          .requestStoragePermission()
          .then(response => {
            this.setState({downloadingLoader: true});
            StorageUtil.saveToStorage(this.state.article.id)
              .then(response => {
                this.setState({downloadingLoader: false});
              })
              .catch(error => {
                this.setState({downloadingLoader: false});
              });
          })
          .catch(error => {
            alert('Storage permission denied!');
          });
      } else {
        this.setState({downloadingLoader: false, noNetwork: true});
        //this.showNetworkError();
        if (this.state.noNetwork == true) {
          this.props.navigation.navigate('NoNetwork');
          this.onRefreshPress();
          //end
        }
      }
    });
  }

  toggleModal() {
    this.setState({isModalVisible: !this.state.isModalVisible});
  }

  /**
   *Function to get previous article on the basis of id
   */
  getPreviousArticleId = () => {
    this.setState({loader: true}, () => {
      this.getArticle(this.state.article.previousArticleId);
      this.setState({index: 0}); //change by akriti
    });
  };

  /**
   *Function to get next article on the basis of id
   */
  getNextArticleId = () => {
    this.setState({loader: true}, () => {
      this.getArticle(this.state.article.nextArticleId);
      this.setState({index: 0}); //change by akriti
    });
  };

  /**
   * Shows footer on the basis of following
   * @param `previousArticleId` || `nextArticleId` || `lawNumber`
   */
  renderFooter() {
    const {lawNumber, article, noInternet} = this.state;

    if (
      lawNumber != null ||
      article.previousArticleId ||
      article.nextArticleId
    ) {
      return (
        <CustomFooter
          modal={() => this.setState({isModalVisible: true})}
          isPrevious={article.previousArticleId}
          isNext={article.nextArticleId}
          lawNumber={lawNumber}
          noInternet={noInternet}
          onPrevious={() => this.getPreviousArticleId()}
          onNext={() => this.getNextArticleId()}
        />
      );
    }
  }

  render() {
    const {
      loader,
      showTabs,
      lawNumber,
      isModalVisible,
      articleId,
      noNetwork,
      article,
      searchFilter,
      downloadingLoader,
      isUserAllowed,
      versions,
      noInternet,
    } = this.state;

    if (loader) {
      return <Loading />;
    }
    if (!showTabs) {
      return (
        <View style={[styles.scene, {backgroundColor: 'white'}]}>
          <SearchModal
            {...this.props}
            cancel={() => this.toggleModal()}
            lawNumber={lawNumber}
            isModalVisible={isModalVisible}
          />
          {/* <NetworkError
            key={articleId}
            cancel={() => this.dismissNetworkModal()}
            ref={o => (this.NetworkError = o)}
            noNetwork={noNetwork}
            onPress={() => this.onRefreshPress()}
          /> */}
          <CustomArticle
            htmlData={article.body}
            onLinkPress={link => this.openLink(link)}
            searchTerm={searchFilter.term || null}
            extraFilter={searchFilter.extra_filter || null}
            downloadingLoader={downloadingLoader}
            onPress={() => this.downloadArticle()}
          />
          {this.renderFooter()}
        </View>
      );
    }
    return (
      <View style={{flex: 1}}>
        <SearchModal
          {...this.props}
          cancel={() => this.toggleModal()}
          lawNumber={lawNumber}
          isModalVisible={isModalVisible}
        />
        {/* <NetworkError
          key={articleId}
          ref={o => (this.NetworkError = o)}
          cancel={() => this.dismissNetworkModal()}
          noNetwork={noNetwork}
          onPress={() => this.onRefreshPress()}
        /> */}
        <TabView
          navigationState={this.state}
          renderScene={({route}) => {
            switch (route.key) {
              case 'Article':
                return (
                  <SafeAreaView
                    style={[styles.scene, {backgroundColor: 'white'}]}>
                    <CustomArticle
                      htmlData={article.body}
                      onLinkPress={link => this.openLink(link)}
                      searchTerm={searchFilter.term || null}
                      extraFilter={searchFilter.extra_filter || null}
                      downloadingLoader={downloadingLoader}
                      onPress={() => this.downloadArticle()}
                    />
                  </SafeAreaView>
                );
              case 'Interprentation':
                return (
                  <SafeAreaView
                    style={[
                      styles.scene,
                      {
                        backgroundColor: 'white',
                        paddingHorizontal: moderateScale(15),
                      },
                    ]}>
                    <ArticleInterprentation
                      isUserAllowed={isUserAllowed}
                      onLinkPress={link => this.openLink(link)}
                      htmlData={article.interprentation}
                    />
                  </SafeAreaView>
                );
              case 'Rulings':
                return (
                  <SafeAreaView
                    style={[styles.scene, {backgroundColor: 'white'}]}>
                    <Rulings
                      {...this.props}
                      isUserAllowed={isUserAllowed}
                      articleId={article.id}
                    />
                  </SafeAreaView>
                );
              case 'Versions':
                return (
                  <View style={[styles.scene, {backgroundColor: 'white'}]}>
                    <ArticleVersions {...this.props} versions={versions} />
                  </View>
                );
              default:
                return;
            }
          }}
          renderTabBar={props => (
            <TabBar
              {...props}
              renderLabel={this._renderLabel}
              labelStyle={styles.labelStyle}
              renderIcon={props => this._getTabBarIcon(props)}
              getLabelText={({route: {title}}) => title}
              indicatorStyle={{
                backgroundColor: 'green',
                bottom: -4,
              }}
              tabStyle={styles.tabStyle}
              style={styles.tab}
            />
          )}
          onIndexChange={index => this.setState({index})}
          initialLayout={{width: Dimensions.get('window').width}}
        />
        {this.renderFooter()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  labelStyle: {
    fontSize: moderateScale(15),
  },
  indicator: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  tab: {
    backgroundColor: '#016622',
    padding: 0,
  },
  tabStyle: {
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
