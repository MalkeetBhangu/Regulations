/**
 * Nomothesia Class.
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
  ScrollView,
  Dimensions,
} from 'react-native';

import Screen from '../screens/screen';
const screen = Dimensions.get('window').width;
import SearchTextInput from '../component/searchTextInput';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';

export default class Nomothesia extends Screen {
  constructor(props) {
    super(props);
    this.state = {
      term: '',
      law: '',
      year: '',
      article: '',
      fek: '',
      nomothesiaResult: '',
      validated: false,
      loader: false,
    };
  }

  /**
   * Validate atleast one field should be entered On Search Button Press
   */
  onSearchPress() {
    const {term, law, year, article, fek} = this.state;
    if (term == '' && law == '' && year == '' && article == '' && fek == '') {
      this.setState({emptyFilter: true}, () => {
        setTimeout(() => {
          this.scrollView.scrollToEnd({animated: true});
        }, 0.5);
      });
    } else {
      this.setState({emptyFilter: false});
      this.searchNomothesia();
    }
  }

  /**
   * Calls apiservice for nomothesia
   */
  searchNomothesia() {
    const {term, law, year, article, fek} = this.state;
    this.props.showLoader();
    let filter = {
      term: term,
      law: law,
      year: year,
      article: article,
      fek: fek,
    };

    this.apiService
      .searchNomothesia(filter, 0)
      .then(response => {
        console.log('search filter1111' + JSON.stringify(response));
        this.setState({nomothesiaResult: response}, () => {
          this.props.hideLoader();
        });

        if (
          response.articles &&
          response.articles.data &&
          response.articles.data.length == 1
        ) {
          let articleDetails = response.articles.data[0];

          this.props.navigation.navigate({
            routeName: 'Topics',
            params: {
              title: articleDetails.title,
              articleId: articleDetails.id,
              searchFilter: filter,
            },
            key: 'Topics' + articleDetails.id,
          });
        } else if (
          response.laws &&
          response.laws.data &&
          response.laws.data.length == 1
        ) {
          let lawDetails = response.laws.data[0];

          if (!lawDetails.accessible) {
            this.props.navigation.navigate('NotSubscribed');
          } else if (lawDetails.is_leaf) {
            this.props.navigation.navigate('ArticlesList', {
              title: lawDetails.title,
              // lawNumber: law_category_by_id.ancestor_law_number,
              categoryId: lawDetails.id,
            });
          } else {
            let params = {
              title: lawDetails.title,
              ancestor_law_number: lawDetails.ancestor_law_number,
              categoryId: lawDetails.id,
            };

            this.props.navigation.navigate({
              routeName: 'LawCategoriesById',
              params: params,
              key: 'LawCategoriesById' + lawDetails.id,
            });
          }
        } else {
          this.props.navigation.navigate('NomothesiaResults', {
            nomothesiaResult: response,
            filter: filter,
          });
        }
      })
      .catch(error => {
        this.props.hideLoader();
        if (error == 'No Internet') {
          this.props.showNetworkError();
        }
        console.log('Error' + JSON.stringify(error));
      });
  }

  render() {
    const {term, law, year, article, fek, emptyFilter} = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          keyboardShouldPersistTaps={'always'}
          showsVerticalScrollIndicator={false}
          ref={ref => (this.scrollView = ref)}>
          <View style={styles.container}>
            <SearchTextInput
              ref={o => (this.termInput = o)}
              onSubmitEditing={() => this.lawInput.focus()}
              label={'Όρος Αναζήτησης'}
              returnKeyType={'next'}
              placeholder="Εισαγάγετε όρο αναζήτησης"
              placeholderTextColor="#545454"
              onChangeText={term => this.setState({term})}
              value={term}
            />

            <SearchTextInput
              ref={o => (this.lawInput = o)}
              onSubmitEditing={() => this.yearInput.focus()}
              label={'Νόμος'}
              returnKeyType={'next'}
              placeholder="Νόμος"
              placeholderTextColor="#545454"
              onChangeText={law => this.setState({law})}
              value={law}
            />
            <SearchTextInput
              ref={o => (this.yearInput = o)}
              onSubmitEditing={() => this.articleInput.focus()}
              label={'Έτος'}
              returnKeyType={'next'}
              keyboardType={'numeric'}
              placeholder="Έτος Νόμου"
              placeholderTextColor="#545454"
              onChangeText={year => this.setState({year})}
              value={year}
            />

            <SearchTextInput
              ref={o => (this.articleInput = o)}
              onSubmitEditing={() => this.fekInput.focus()}
              label={'Άρθρο'}
              returnKeyType={'next'}
              placeholder="Άρθρο"
              placeholderTextColor="#545454"
              onChangeText={article => this.setState({article})}
              value={article}
            />

            <SearchTextInput
              ref={o => (this.fekInput = o)}
              onSubmitEditing={() => this.onSearchPress()}
              label={'ΦΕΚ'}
              returnKeyType={'done'}
              placeholder="ΦΕΚ"
              placeholderTextColor="#545454"
              onChangeText={fek => this.setState({fek})}
              value={fek}
            />

            <TouchableOpacity
              onPress={() => this.onSearchPress()}
              style={styles.button}>
              <Text style={styles.buttonText}>Αναζήτηση</Text>
            </TouchableOpacity>
            {emptyFilter && (
              <Text
                style={{
                  paddingHorizontal: 15,
                  marginVertical: 15,
                }}>
                ΠΑΡΑΚΑΛΩ ΣΥΜΠΛΗΡΩΣΤΕ ΤΟΥΛΑΧΙΣΤΟΝ ΕΝΑ ΠΕΔΙΟ.
              </Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    paddingBottom: 25,
  },
  button: {
    shadowOffset: {width: 0, height: 2},
    shadowColor: '#000',
    shadowOpacity: 0.2,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 1,
    margin: moderateScale(8),
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(8),
    backgroundColor: '#006621',
    alignItems: 'center',
    borderColor: '#006621',
    padding: moderateScale(15),
    marginTop: moderateScale(20),
    marginHorizontal: moderateScale(8),
    minWidth: '80%',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: moderateScale(19),
  },
});
