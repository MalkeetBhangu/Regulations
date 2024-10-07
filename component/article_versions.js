/**
 * Artical versions detail screen
 * @Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */
import React, {Component} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import Screen from '../screens/screen';
import ArticleListItem from '../component/article-list-item';

export default class ArticleVersions extends Screen {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      loader: true,
      paginationArr: [],
      rulings: [],
    };
  }

  onVersionPress(version) {
    this.props.navigation.navigate('ArticleVersionDetail', {
      versionId: version.id,
      title: version.title,
      comment: version.comment,
    });
  }

  render() {
    const {versions} = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          data={versions}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => {
            return (
              <ArticleListItem
                onPress={() => this.onVersionPress(item)}
                article={item}
                isArticleVersion={true}
              />
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          extraData={versions}
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
});
