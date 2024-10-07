/**
 * Nomothesia Results.
 * @Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */
import React, {Component} from 'react';
import {
  FlatList,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
} from 'react-native';
import ApiService from '../services/api_service';
import LawCategoryItem from '../component/law-category-item';
import Screen from '../screens/screen';
import {SearchBar} from 'react-native-elements';
import ArticleListItem from '../component/article-list-item';
import OfflineSearch from '../services/offline_search';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';

export default class NomothesiaResults extends Screen {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      loader: true,
      paginationArr: [],
      laws: [],
      total: 0,
      searchLoader: false,
      extraFilter: '',
      articles: [],
      nomothesiaResult: this.props.navigation.state.params.nomothesiaResult,
      filter: this.props.navigation.state.params.filter,
      isConnected: this.props.navigation.getParam('isConnected', true),
    };
    this.apiService = new ApiService();

    this.onEndReachedCalledDuringMomentum = true;
  }

  componentDidMount() {
    this.getInitialSearchResponse();
  }

  /**
   *  Set initial Search reponse.
   */
  getInitialSearchResponse() {
    const {nomothesiaResult} = this.state;
    if (nomothesiaResult.articles) {
      this.setState({
        articles: nomothesiaResult.articles.data,
        total: nomothesiaResult.articles.total,
        loader: false,
      });
    } else if (nomothesiaResult.laws) {
      console.log('search laws' + JSON.stringify(nomothesiaResult.laws));
      this.setState({
        laws: nomothesiaResult.laws.data,
        total: nomothesiaResult.laws.total,
        loader: false,
      });
    } else {
      this.setState({
        laws: [],
        articles: [],
        total: 0,
        loader: false,
        searchLoader: false,
        loading: false,
      });
    }
  }

  /***
   * ON Search Button Press add extra filter and fetch response from server
   */
  onSearchPress() {
    if (this.state.extraFilter != '') {
      Keyboard.dismiss();
      this.setState({searchLoader: true});
      let filter = this.state.filter;
      filter.extra_filter = this.state.extraFilter;
      this.setState(
        {
          filter,
          page: 1,
          laws: [],
          articles: [],
        },
        () => {
          this.loadMoreSearch();
        },
      );
    }
  }

  /**
   * Fetch Search reponse from server.
   */
  loadMoreSearch() {
    this.apiService
      .searchNomothesia(this.state.filter, this.state.page)
      .then(response => {
        console.log('rulings data FROM SERVER' + JSON.stringify(response));

        if (response.error == 'token_expired') {
          this.logoutUser();
        }
        if (response.articles) {
          let articles = this.state.articles;
          let newArticles = response.articles.data;

          newArticles.forEach(article => {
            articles.push(article);
          });

          this.setState({
            articles,
            total: response.articles.total,
            loader: false,
            searchLoader: false,
            loading: false,
          });
        } else if (response.laws) {
          let laws = this.state.laws;
          let newLaws = response.laws.data;

          newLaws.forEach(law => {
            laws.push(law);
          });

          this.setState({
            laws,
            total: response.laws.total,
            loader: false,
            searchLoader: false,
            loading: false,
          });
        } else {
          this.setState({loader: false, searchLoader: false, loading: false});
          if (this.state.articles.length == 0 && this.state.laws.length == 0) {
            this.setState({total: 0});
          }
          //this.setState({laws:[],articles:[],total:0, loader: false,searchLoader:false, loading: false});
        }
      })
      .catch(error => {
        this.setState({loader: false, loading: false});
        console.log('ERROR FROM SERVER' + JSON.stringify(error));
      });
  }

  updateSearch = extraFilter => {
    this.setState({extraFilter});
  };

  /**
   * If NOT ACCESSIBLE SHOW NOT SUBSCRIBED SCREEN.
   * Else Route User to ArticleList if isLeaf is true else Sub-Category Screen.
   */
  onCategoryPress(item) {
    console.log('categiry item pressed  here');
    if (!item.accessible) {
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

      this.props.navigation.navigate({
        routeName: 'LawCategoriesById',
        params: params,
        key: 'LawCategoriesById' + item.id,
      });
    }
  }

  /**
   * Method called when user presses on article
   * @param {*} item
   */
  onArticlePress(item) {
    console.log('categiry item pressed  here hhahahah');
    this.props.navigation.navigate({
      routeName: 'Topics',
      params: {
        title: item.title,
        articleId: item.id,
        searchFilter: this.state.filter,
      },
      key: 'Topics' + item.id,
    });
  }

  /**
   * Loads more articles from offline data
   */
  loadMoreOffline() {
    OfflineSearch.loadMoreSearchedData(this.state.page)
      .then(response => {
        console.log('data from pagination' + JSON.stringify(response));
        let articles = this.state.articles;
        let newArticles = response.articles.data;

        newArticles.forEach(article => {
          articles.push(article);
        });

        this.setState({
          articles,
          total: response.articles.total,
          loader: false,
          searchLoader: false,
          loading: false,
        });
      })
      .catch(error => {
        console.log('data from pagination' + error);
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
            if (this.state.isConnected) {
              this.loadMoreSearch();
            } else {
              // alert('yes')
              this.loadMoreOffline();
            }

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

  /**
   * render's flatlist item on the basis of articles or law category
   */
  renderItem(item) {
    if (this.state.articles.length) {
      return (
        <ArticleListItem
          searchTerm={this.state.filter.term || null}
          extraFilter={this.state.filter.extra_filter || null}
          onPress={() => this.onArticlePress(item)}
          article={item}
        />
      );
    } else if (this.state.laws.length) {
      return (
        <LawCategoryItem
          searchTerm={this.state.filter.term || null}
          extraFilter={this.state.filter.extra_filter || null}
          onPress={() => this.onCategoryPress(item)}
          item={item}
        />
      );
    }
  }

  /**
   * returns articles or laws whichever came from server
   */
  getData() {
    if (this.state.articles.length) {
      return this.state.articles;
    } else {
      return this.state.laws;
    }
  }

  /**
   * Loader component for pagination used in flatlist footer
   */
  loader() {
    const {loading, total} = this.state;
    return (
      <View style={{height: moderateScale(60), justifyContent: 'center'}}>
        {loading && total > 9 && (
          <ActivityIndicator size="small" color="green" />
        )}
      </View>
    );
  }

  getSearchBar() {
    if (this.state.isConnected) {
      return (
        <View style={styles.textInput}>
          <SearchBar
            placeholder="Εξειδίκευση επί των αποτελεσμάτων"
            containerStyle={{
              flexGrow: 1,
              padding: moderateScale(12),
              backgroundColor: '#fff',
              borderBottomWidth: moderateScale(0),
              borderTopWidth: moderateScale(0),
            }}
            inputContainerStyle={{
              padding: moderateScale(0),
              backgroundColor: '#f2f2f2',
              borderRadius: moderateScale(5),
              height: undefined,
              paddingTop: moderateScale(0),
            }}
            inputStyle={{
              padding: moderateScale(0),
              fontSize: moderateScale(14),
              paddingTop: moderateScale(0),
              minHeight: moderateScale(0),
              marginVertical: moderateScale(0),
              paddingBottom: moderateScale(0),
            }}
            searchIcon={null}
            onChangeText={this.updateSearch}
            value={this.state.extraFilter}
          />
          <TouchableOpacity
            onPress={() => this.onSearchPress()}
            style={styles.searchButton}>
            <Text style={styles.Text}>Αναζήτηση</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  render() {
    const {loader, searchLoader, extraFilter, total, articles} = this.state;

    if (loader) {
      return (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" color="green" />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        {searchLoader && (
          <View style={styles.searchLoader}>
            <ActivityIndicator size="large" color="white" />
          </View>
        )}
        {this.getSearchBar()}
        <View
          style={{
            height: moderateScale(0.7),
            borderColor: '#ececec',
            borderWidth: moderateScale(0.5),
          }}
        />
        <View>
          <Text
            style={{
              padding: moderateScale(7),
              textAlign: 'center',
              color: '#006621',
              fontSize: moderateScale(13),
            }}>
            ΒΡΕΘΗΚΑΝ {total} ΑΠΟΤΕΛΕΣΜΑΤΑ
          </Text>
        </View>
        <View
          style={{
            height: moderateScale(0.7),
            borderColor: '#ececec',
            borderWidth: moderateScale(0.5),
          }}
        />
        <FlatList
          data={this.getData()}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={this.loader()}
          renderItem={({item}) => this.renderItem(item)}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.01}
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false;
          }}
          onEndReached={this.onScrollHandler.bind(this)}
          extraData={articles}
          onEndThreshold={0}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  textInput: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: moderateScale(50),
    marginTop: moderateScale(4),
    marginBottom: moderateScale(4),
  },
  Text: {
    color: '#fff',
    alignItems: 'center',
    marginHorizontal: moderateScale(5),
    fontSize: moderateScale(12),
  },
  searchButton: {
    backgroundColor: '#006621',
    paddingVertical: moderateScale(8),
    marginHorizontal: moderateScale(6),
    justifyContent: 'center',
    borderRadius: moderateScale(5),
  },
  TextInput: {
    color: '#4A4A4A',
    fontSize: moderateScale(13),
    marginLeft: moderateScale(7),
    width: '60%',
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
  searchLoader: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    left: moderateScale(0),
    right: moderateScale(0),
    bottom: moderateScale(0),
    top: moderateScale(0),
    zIndex: moderateScale(2),
    justifyContent: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: moderateScale(5),
  },
});
