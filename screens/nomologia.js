/**
 * Nomologia Class.
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
import CacheService from '../services/cache_service';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import SearchTextInput from '../component/searchTextInput';
const screen = Dimensions.get('window').width;

export default class Nomologia extends Screen {
  constructor(props) {
    super(props);
    this.state = {
      term: '',
      rulingNo: '',
      rulingYear: '',
      rulingLaw: '',
      lawYear: '',
      rulingArticle: '',
      nomologiaResult: '',
      validated: false,
      user: CacheService.userData,
      isUserAllowed: false,
      emptyFilter: false,
    };
  }

  componentDidMount() {
    this.checkIsUserAllowed();
  }

  /**
   * Check if user is allowed to view or search rulings i.e(nomologia)
   * on the basis of user.subscription.role_id
   * User's only with subscription ID 1,3 & 5 have full access to contents
   */
  checkIsUserAllowed() {
    const {user} = this.state;
    if (
      user &&
      user.subscription &&
      (user.subscription.role_id === 4 ||
        user.subscription.role_id === 6 ||
        user.subscription.role_id === 7 ||
        user.subscription.role_id === 8 ||
        user.subscription.role_id === 9)
    ) {
      this.setState({isUserAllowed: false});
    } else {
      this.setState({isUserAllowed: true});
    }
  }

  /**
   * Check atleast one input should be entered On Search Button Press
   */
  onSearchPress() {
    const {
      term,
      rulingNo,
      rulingYear,
      rulingLaw,
      lawYear,
      rulingArticle,
    } = this.state;
    if (
      term == '' &&
      rulingNo == '' &&
      rulingYear == '' &&
      lawYear == '' &&
      rulingLaw == '' &&
      rulingArticle == ''
    ) {
      this.setState({emptyFilter: true}, () => {
        setTimeout(() => {
          this.scrollView.scrollToEnd({animated: true});
        }, 0.5);
      });
    } else {
      this.setState({emptyFilter: false});
      this.searchNomologia();
    }
  }

  /**
   * Calls apiservice for nomologia
   */
  searchNomologia() {
    const {
      term,
      rulingNo,
      rulingYear,
      rulingLaw,
      lawYear,
      rulingArticle,
    } = this.state;
    this.props.showLoader();
    let filter = {
      term: term,
      ruling_number: rulingNo,
      ruling_year: rulingYear,
      ruling_law: rulingLaw,
      law_year: lawYear,
      ruling_article: rulingArticle,
    };
    console.log('filter' + JSON.stringify(filter));

    this.apiService
      .searchNomologia(filter, 0)
      .then(response => {
        console.log('search filter' + JSON.stringify(response));
        this.setState({nomologiaResult: response}, () => {
          this.props.hideLoader();
        });

        let articleData = response.rulings.data;

        console.log('aricle lenght is ' + articleData.length);

        if (articleData.length == 1) {
          this.props.navigation.navigate('RulingDetails', {
            title: articleData[0].title,
            rulingId: articleData[0].id,
            searchFilter: filter,
          });
        } else {
          this.props.navigation.navigate('NomologiaResults', {
            nomologiaResult: response,
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
    const {
      isUserAllowed,
      term,
      rulingNo,
      rulingYear,
      rulingLaw,
      lawYear,
      rulingArticle,
      emptyFilter,
    } = this.state;

    if (!isUserAllowed) {
      return (
        <View
          style={{flex: 1, alignItems: 'center', padding: moderateScale(12)}}>
          <Text style={{color: 'black'}}>
            Απαιτείται συνδρομή στο Πλήρες πρόγραμμα
          </Text>
        </View>
      );
    }
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          keyboardShouldPersistTaps={'always'}
          showsVerticalScrollIndicator={false}
          ref={ref => (this.scrollView = ref)}>
          <View style={styles.container}>
            <SearchTextInput
              ref={o => (this.termInput = o)}
              onSubmitEditing={() => this.rulingNoInput.focus()}
              returnKeyType={'next'}
              label={'Όρος Αναζήτησης'}
              placeholder="Εισαγάγετε όρο αναζήτησης"
              placeholderTextColor="#545454"
              onChangeText={term => this.setState({term})}
              value={term}
            />
            <SearchTextInput
              ref={o => (this.rulingNoInput = o)}
              onSubmitEditing={() => this.rulingYearInput.focus()}
              label={'Αριθμός Απόφασης'}
              returnKeyType={'next'}
              placeholder="Αριθμός Απόφασης"
              placeholderTextColor="#545454"
              onChangeText={rulingNo => this.setState({rulingNo})}
              value={rulingNo}
            />
            <SearchTextInput
              ref={o => (this.rulingYearInput = o)}
              onSubmitEditing={() => this.rulingLawInput.focus()}
              label={'Έτος Αποφασης'}
              returnKeyType={'next'}
              keyboardType={'numeric'}
              placeholder="Έτος Αποφασης"
              placeholderTextColor="#545454"
              onChangeText={rulingYear => this.setState({rulingYear})}
              value={rulingYear}
            />
            <SearchTextInput
              ref={o => (this.rulingLawInput = o)}
              onSubmitEditing={() => this.lawYearInput.focus()}
              label={'Νόμος'}
              returnKeyType={'next'}
              placeholder="Νόμος"
              placeholderTextColor="#545454"
              onChangeText={rulingLaw => this.setState({rulingLaw})}
              value={rulingLaw}
            />
            <SearchTextInput
              ref={o => (this.lawYearInput = o)}
              onSubmitEditing={() => this.rulingArticleInput.focus()}
              label={'Έτος Νόμου'}
              returnKeyType={'next'}
              keyboardType={'numeric'}
              placeholder="Έτος Νόμου"
              placeholderTextColor="#545454"
              onChangeText={lawYear => this.setState({lawYear})}
              value={lawYear}
            />
            <SearchTextInput
              ref={o => (this.rulingArticleInput = o)}
              onSubmitEditing={() => this.onSearchPress()}
              label={'Άρθρο'}
              returnKeyType={'done'}
              placeholder="Άρθρο"
              placeholderTextColor="#545454"
              onChangeText={rulingArticle => this.setState({rulingArticle})}
              value={rulingArticle}
            />
            <TouchableOpacity
              onPress={() => this.onSearchPress()}
              style={styles.button}>
              <Text style={styles.buttonText}> Αναζήτηση </Text>
            </TouchableOpacity>
            {emptyFilter && (
              <Text
                style={{
                  paddingHorizontal: moderateScale(15),
                  marginVertical: moderateScale(15),
                  fontSize: moderateScale(13),
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
    paddingBottom: moderateScale(25),
  },
  button: {
    shadowOffset: {width: 0, height: 2},
    shadowColor: '#000',
    shadowOpacity: 0.2,
    elevation: moderateScale(5),
    borderRadius: moderateScale(10),
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: moderateScale(1),
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
  secondTextInput: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: moderateScale(50),
  },
});
