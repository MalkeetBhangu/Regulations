/**
 * 
 @author Logicease
 *
 */
import React, {Component} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Image,
  DeviceEventEmitter,
  ActivityIndicator,
} from 'react-native';
import Screen from '../screens/screen';
import CacheService from '../services/cache_service';
import HTML from 'react-native-render-html';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NewsItem from '../component/news-item';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';

export default class News extends Screen {
  constructor(props) {
    super(props);
    this.state = {
      news: CacheService.news,
      loader: true,
    };
  }

  componentDidMount() {
    // alert(this.state.news.newsItem.id);
    this.listener = DeviceEventEmitter.addListener('RefreshNews', () => {
      this.setState({loader: false, news: CacheService.news});
    });
  }

  onNewsPress(item) {
    this.props.navigation.navigate('NewsDetails', {
      newsId: item.newsItem.id,
    });
  }

  render() {
    if (this.state.news.length == 0) {
      return (
        <View style={{flex: 1, alignItems: 'center', padding: 12}}>
          <Text style={{color: 'black'}}>
            {' '}
            Δεν υπάρχουν διαθέσιμες ειδοποιήσεις
          </Text>
        </View>
      );
    }
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <SafeAreaView
        // style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        />
        <ActivityIndicator size="small" color="white" />
        <View style={styles.container}>
          <FlatList
            data={this.state.news}
            ListHeaderComponent={<View style={{height: 20}} />}
            ListFooterComponent={<View style={{height: 40}} />}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
              return (
                <NewsItem
                  onPress={() => this.onNewsPress(item)}
                  news={item.newsItem.title}
                />
              );
            }}
            keyExtractor={(item, index) => index.toString()}
            extraData={this.state.articles}
          />
        </View>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
  },
});
