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
} from 'react-native';
import Screen from '../screens/screen';
import CacheService from '../services/cache_service';
import NotificationItem from '../component/notification-item';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';

export default class Notification extends Screen {
  constructor(props) {
    super(props);
    this.state = {
      loader: true,
      notifications: CacheService.notifications.filter(
        item => item.read == false,
      ),
    };
  }

  componentDidMount() {
    console.log('notification' + JSON.stringify(CacheService.notifications));
    this.listener = DeviceEventEmitter.addListener(
      'RefreshNotifications',
      () => {
        this.setState({
          notifications: CacheService.notifications,
        });
      },
    );
  }

  /**
   * Used to navigate user on the base of notification type
   * @param {*} item
   */
  onNewsPress(item) {
    if (item.type == 'update') {
      this.props.navigation.navigate('Update', {
        updateId: item.id,
        previousScreen: 'Notification',
      });
    } else if (item.type == 'news') {
      this.props.navigation.navigate('NewsDetails', {
        newsId: item.id,
      });
      // this.props.navigation.navigate('New');
    } else {
      this.props.navigation.navigate('Account');
    }
  }

  render() {
    if (this.state.notifications.length == 0) {
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
      <FlatList
        data={this.state.notifications}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<View style={{height: 20}} />}
        ListFooterComponent={<View style={{height: 40}} />}
        renderItem={({item}) => (
          <NotificationItem
            onPress={() => this.onNewsPress(item)}
            type={item.type}
            notification={item.title}
          />
        )}
        keyExtractor={item => item.id}
      />
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
