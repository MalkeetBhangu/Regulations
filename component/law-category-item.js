/**
 * law category items screen
 * @Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {moderateScale} from 'react-native-size-matters';

export default class LawCategoryItem extends Component {
  /**
   * Law Category List Item Component
   */

  getIcon() {
    const {item, noInternet} = this.props;
    //if (noInternet && !item.isAvailable) {
    if (noInternet && item.offline == 0) {
      return <MaterialIcons name="signal-wifi-off" size={20} color="#c2c2c2" />;
    } else if (this.props.item.accessible) {
      return (
        <Image
          style={{
            width: moderateScale(20),
            height: moderateScale(20),
            paddingVertical: moderateScale(10),
          }}
          source={require('../assets/forward-arrow.png')}
        />
      );
    } else {
      return (
        <MaterialIcons
          style={{marginLeft: moderateScale(2)}}
          name="lock"
          size={20}
          color="#c2c2c2"
        />
      );
    }
  }

  showGreyText() {
    const {item, noInternet} = this.props;
    //if (!item.accessible || (noInternet && !item.isAvailable)) {
    if (!item.accessible || (noInternet && item.offline == 0)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Highlights the search terms provided by user.
   * @param {*} text
   */
  getHighlightedText(text) {
    if (this.props.searchTerm || this.props.extraFilter) {
      return CustomHighlighter.doHighlight(
        text,
        this.props.searchTerm,
        this.props.extraFilter,
      );
    } else {
      return text;
    }
  }

  render() {
    const {item, onPress} = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          delayPressOut={0}
          style={styles.shadow}
          onPress={onPress}>
          <View style={styles.categoryItem}>
            <Text
              style={[styles.Text, this.showGreyText() && {color: '#c2c2c2'}]}>
              {this.getHighlightedText(item.title)}
            </Text>
            <View style={styles.image}>{this.getIcon()}</View>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: moderateScale(7),
    marginBottom: moderateScale(10),
    marginHorizontal: moderateScale(10),
  },
  categoryItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingVertical: moderateScale(5),
    maxWidth: '100%',
    borderColor: '#D9DBDA',
    alignItems: 'center',
    borderRadius: 8,
  },
  Text: {
    fontSize: moderateScale(14),
    flexDirection: 'row',
    width: '90%',
    paddingHorizontal: moderateScale(10),
    color: '#016622',
  },
  shadow: {
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
  image: {
    width: '10%',
    paddingRight: moderateScale(15),
    alignItems: 'flex-end',
  },
  offline: {
    width: '10%',
  },
});
