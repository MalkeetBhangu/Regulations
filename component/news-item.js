/**
 * News items for notification
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

export default class NewsItem extends Component {
  /**
   * News List Item Component also used as rulings component
   */

  render() {
    const {news, onPress} = this.props;
    return (
      <TouchableOpacity style={styles.shadow} onPress={onPress}>
        <View style={styles.categoryItem}>
          <Text numberOfLines={2} style={styles.Text}>
            {news}
          </Text>

          <View style={{flexDirection: 'row', marginTop: moderateScale(3)}}>
            <Text
              style={[
                styles.linkText,
                {color: '#016622', lineHeight: moderateScale(20)},
              ]}>
              Περισσότερα
            </Text>
            <Image
              source={require('../assets/forwordicon.png')}
              style={{width: moderateScale(20), height: moderateScale(20)}}
            />
          </View>
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
    paddingHorizontal: moderateScale(12),
    color: '#000',
  },
  linkText: {
    fontSize: moderateScale(12),
    flexDirection: 'row',
    paddingLeft: moderateScale(12),
    paddingRight: moderateScale(3),
    color: '#016622',
  },
});
