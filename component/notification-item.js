/**
 * Notification items
 *@Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
const screen = Dimensions.get('window').width;

export default class NotificationItem extends Component {
  /**
   * Notification List Item Component also used as rulings component
   */

  getIcon() {
    if (this.props.type == 'news') {
      return (
        <Image
          source={require('../assets/libra.png')}
          style={{
            width: moderateScale(50),
            height: moderateScale(50),
            alignSelf: 'center',
            resizeMode: 'contain',
          }}
        />
      );
    } else if (this.props.type == 'update') {
      return (
        <Image
          source={require('../assets/download.png')}
          style={{
            width: moderateScale(40),
            height: moderateScale(40),
            margin: moderateScale(10),
            alignSelf: 'center',
            resizeMode: 'contain',
          }}
        />
      );
    } else {
      return (
        <Image
          source={require('../assets/person.png')}
          style={{
            width: moderateScale(40),
            height: moderateScale(40),
            margin: moderateScale(10),
            alignSelf: 'center',
            resizeMode: 'contain',
          }}
        />
      );
    }
  }

  render() {
    const {notification, onPress} = this.props;
    return (
      <TouchableOpacity style={styles.shadow} onPress={onPress}>
        <View style={styles.categoryItem}>
          <View style={{width: '100%', flexDirection: 'row'}}>
            <View style={{width: '20%', justifyContent: 'center'}}>
              {this.getIcon()}
            </View>
            <View style={{width: '80%', justifyContent: 'center'}}>
              <Text numberOfLines={2} style={styles.Text}>
                {notification}
              </Text>
            </View>
          </View>

          <Text
            style={{
              color: '#6c6c6c',
              alignSelf: 'flex-end',
              marginRight: moderateScale(10),
              fontSize: moderateScale(10),
              fontWeight: 'bold',
            }}>
            2:30 pm
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
  },
  categoryItem: {
    backgroundColor: '#fff',

    paddingVertical: moderateScale(8),
    maxWidth: '100%',

    borderColor: '#D9DBDA',
    borderRadius: moderateScale(8),
  },
  shadow: {
    marginTop: moderateScale(2),
    marginBottom: moderateScale(15),
    marginHorizontal: moderateScale(10),
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    shadowColor: '#000',
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 1,
  },
  Text: {
    fontSize: moderateScale(14),
    flexDirection: 'row',
    // fontWeight: 'bold',
    paddingHorizontal: moderateScale(12),
    color: '#000',
  },
  linkText: {
    paddingLeft: moderateScale(12),
    paddingRight: moderateScale(3),
    color: '#016622',
  },
});
