/**
 * Nomologia Results.
 * @Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */
import React, {Component} from 'react';
import {
  AppRegistry,
  FlatList,
  TouchableOpacity,
  Image,
  Keyboard,
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
  TextInput,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Entypo';
import ApiService from '../services/api_service';
import CacheService from '../services/cache_service';
import Screen from '../screens/screen';
import {SearchBar} from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ArticleListItem from '../component/article-list-item';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import NetInfo from '@react-native-community/netinfo';

export default class NomologiaResults extends Screen {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      loader: true,
      total: 0,
      searchLoader: false,
      extraFilter: '',
      rulings: [],
      nomologiaResult: this.props.navigation.state.params.nomologiaResult,
      filter: this.props.navigation.state.params.filter,
    };
    this.apiService = new ApiService();

    this.onEndReachedCalledDuringMomentum = true;
  }

  componentDidMount() {
    this.getInitialSearchResponse();
  }

  /**
   * Set initial Search reponse.
   */
  getInitialSearchResponse() {
    const {nomologiaResult} = this.state;
    if (nomologiaResult.rulings) {
      this.setState({
        rulings: nomologiaResult.rulings.data,
        total: nomologiaResult.rulings.total,
        loader: false,
      });
    } else {
      this.setState({rulings: [], total: 0, loader: false, loading: false});
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
          rulings: [],
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
      .searchNomologia(this.state.filter, this.state.page)
      .then(response => {
        console.log('rulings data FROM SERVER' + JSON.stringify(response));

        if (response.error == 'token_expired') {
          this.logoutUser();
        }
        if (response.rulings) {
          let rulings = this.state.rulings;
          let newRulings = response.rulings.data;

          newRulings.forEach(ruling => {
            rulings.push(ruling);
          });

          this.setState({
            rulings,
            total: response.rulings.total,
            loader: false,
            searchLoader: false,
            loading: false,
          });
        } else {
          this.setState({loader: false, searchLoader: false, loading: false});
          if (this.state.rulings.length == 0) {
            this.setState({total: 0});
          }
        }
      })
      .catch(error => {
        this.setState({loader: false, loading: false});
        console.log('ERROR FROM SERVER' + JSON.stringify(error));
      });
  }

  /**
   * Updates the value of extra filter.
   */
  updateSearch = extraFilter => {
    this.setState({extraFilter});
  };

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
            this.loadMoreSearch();
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

  /***
   * Navigate to rulings details screen
   */
  onRulingPress(item) {
    this.props.navigation.navigate('RulingDetails', {
      title: item.title,
      rulingId: item.id,
      searchFilter: this.state.filter,
    });
  }

  /**
   * Loader component for pagination used in flatlist footer
   */
  loader() {
    return (
      <View style={{height: moderateScale(60), justifyContent: 'center'}}>
        {this.state.loading && this.state.total > 9 && (
          <ActivityIndicator size="small" color="green" />
        )}
      </View>
    );
  }

  render() {
    const {
      loader,
      searchLoader,
      extraFilter,
      total,
      rulings,
      filter,
      articles,
    } = this.state;

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
            returnKeyType={'search'}
            onChangeText={this.updateSearch}
            onSubmitEditing={() => this.onSearchPress()}
            value={extraFilter}
          />
          <TouchableOpacity
            onPress={() => this.onSearchPress()}
            style={styles.searchButton}>
            <Text style={styles.Text}>Αναζήτηση</Text>
          </TouchableOpacity>
        </View>
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
        <FlatList
          data={rulings}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={this.loader()}
          renderItem={({item}) => {
            return (
              <ArticleListItem
                searchTerm={filter.term || null}
                extraFilter={filter.extra_filter || null}
                onPress={() => this.onRulingPress(item)}
                article={item}
              />
            );
          }}
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
  },
  Text: {
    color: '#fff',
    alignItems: 'center',
    marginHorizontal: moderateScale(10),

    fontSize: moderateScale(14),
  },
  searchButton: {
    backgroundColor: '#006621',
    paddingHorizontal: moderateScale(2),
    paddingVertical: moderateScale(4),
    margin: moderateScale(4),
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
