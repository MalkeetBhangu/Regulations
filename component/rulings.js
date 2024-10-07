
/**
 *Ruling screen component
 *@Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */

import React, {Component} from 'react';
import {
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
} from 'react-native';

import ApiService from '../services/api_service';
import Screen from '../screens/screen';
import ArticleListItem from '../component/article-list-item';
import {moderateScale} from 'react-native-size-matters';

export default class Rulings extends Screen {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      loader: true,
      paginationArr: [],
      rulings: [],
      noNetwork: false,
    };
    this.apiService = new ApiService();
    this.onEndReachedCalledDuringMomentum = true;
  }

  componentDidMount() {
    if (this.props.isUserAllowed) {
      this.getRulings();
    } else {
      this.setState({loader: false});
    }
  }

  /**
   * Fetch Rulings from server.
   */
  getRulings() {
    this.apiService
      .getRulings(this.props.articleId, this.state.page)
      .then(response => {
        console.log('rulings data FROM SERVER' + JSON.stringify(response));

        if (response.error == 'token_expired') {
          this.logoutUser();
        }

        let rulings = this.state.rulings;
        let newRulings = response.rulings;

        newRulings.forEach(ruling => {
          rulings.push(ruling);
        });

        this.setState({rulings, loader: false, loading: false});
      })
      .catch(error => {
        this.setState({loader: false, loading: false});
        console.log('ERROR FROM SERVER' + JSON.stringify(error));
      });
  }

  onRefresh() {
    this.setState({loader: true});
    this.getRulings();
  }

  /***
   * Navigate to rulings details screen
   */
  onRulingPress(item) {
    this.props.navigation.navigate('RulingDetails', {
      title: item.title,
      rulingId: item.id,
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
            this.getRulings();
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
   * Loader component for pagination used in flatlist footer
   */
  loader() {
    return (
      <View style={{height: moderateScale(60), justifyContent: 'center'}}>
        {this.state.loading && this.state.rulings.length > 9 && (
          <ActivityIndicator size="small" color="green" />
        )}
      </View>
    );
  }

  render() {
    if (this.state.loader) {
      return (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" color="green" />
        </View>
      );
    }
    if (!this.props.isUserAllowed) {
      return (
        <View style={{flex: 1, alignItems: 'center', padding: 12}}>
          <Text style={{color: 'black'}}>
            Απαιτείται συνδρομή στο Πλήρες πρόγραμμα
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.rulings}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<View style={{height: 20}}></View>}
          ListFooterComponent={this.loader()}
          renderItem={({item}) => {
            return (
              <ArticleListItem
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
          extraData={this.state.articles}
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

  categoryItem: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    padding: 15,
    borderWidth: 0.4,
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
    marginRight: 5,
  },
});
