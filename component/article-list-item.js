/**
 * Article List Item Component also used as rulings component
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
  Image,
  SafeAreaView,
} from 'react-native';
import CustomHighlighter from '../utilities/customHighlighter';
import {moderateScale} from 'react-native-size-matters';

export default class ArticleListItem extends Component {
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
    const {article, onPress, isArticleVersion} = this.props;
    return (
      <SafeAreaView>
        <TouchableOpacity style={styles.shadow} onPress={this.props.onPress}>
          <View style={styles.categoryItem}>
            <Text numberOfLines={1} style={styles.Text}>
              {this.getHighlightedText(article.title)}
              {/* <TouchableOpacity style={styles.shadow} onPress={onPress}>
        <View style={styles.categoryItem}>
          <Text numberOfLines={1} style={styles.Text}>
            {this.getHighlightedText(article.title)}
          </Text>
          <Text numberOfLines={1} style={styles.introText}>
            {this.getHighlightedText(article.introduction)}
          </Text>

          {isArticleVersion && (
            <Text numberOfLines={1} style={styles.introText}>
              {article.comment} */}
            </Text>
            <Text numberOfLines={1} style={styles.introText}>
              {this.getHighlightedText(article.introduction)}
            </Text>

            {this.props.isArticleVersion && (
              <Text numberOfLines={1} style={styles.introText}>
                {article.comment}
              </Text>
            )}
            <View style={{flexDirection: 'row'}}>
              <Text
                numberOfLines={1}
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
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  categoryItem: {
    backgroundColor: '#fff',
    paddingVertical: moderateScale(8),
    maxWidth: '100%',
    borderColor: '#D9DBDA',
    borderRadius: 8,
  },
  shadow: {
    margin: moderateScale(8),
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
    fontSize: moderateScale(16),
    flexDirection: 'row',
    fontWeight: 'bold',
    paddingHorizontal: moderateScale(12),
    color: '#016622',
  },
  introText: {
    fontSize: moderateScale(13),
    flexDirection: 'row',
    lineHeight: moderateScale(25),
    paddingHorizontal: moderateScale(12),
    color: '#000000',
  },
  linkText: {
    fontSize: moderateScale(12),
    flexDirection: 'row',
    paddingLeft: moderateScale(12),
    paddingRight: moderateScale(3),
    color: '#016622',
  },
});
