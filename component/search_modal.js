/**
 
 *Search modal screen component
 *@Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */
import React, {Component} from 'react';
import {
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import ApiService from '../services/api_service';
import {SafeAreaView} from 'react-navigation';
import NetworkUtility from '../utilities/networkUtil';
import OfflineDatabase from '../services/offlineDatabase';
import OfflineSearch from '../services/offline_search';

export default class SearchModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disableButton: true,
      Name: '',
      searchTerm: '',
      loading: false,
    };
    this.apiService = new ApiService();
  }

  /**
   * Validation check
   */
  enableButton() {
    if (this.state.searchTerm != '') {
      this.setState({
        disableButton: false,
      });
    } else {
      this.setState({
        disableButton: true,
      });
    }
  }

  /**
   *Method which user calls onPress after search in modal
   */
  onSearchButtonPress() {
    Keyboard.dismiss();
    this.setState({loading: true});
    let filter = {
      term: '',
      law: this.props.lawNumber,
      year: '',
      article: this.state.searchTerm,
      fek: '',
    };
    // this.setState({isModalVisible: !this.state.isModalVisible});
    NetworkUtility.checkIsNetwork().then(response => {
      if (response.isConnected) {
        this.searchOnline(filter);
      } else {
        alert(
          'Η εφαρμογή απαιτεί σύνδεση στο διαδίκτυο. Παρακαλώ συνδεθείτε και δοκιμάστε ξανά.',
        );
        //this.searchOffline(filter);
        this.setState({loading: false, searchTerm: ''});
        // this.props.cancel();
      }
    });
  }

  /**
   * Method used to search the articles from offline database
   * @param {*} filter
   */
  searchOffline(filter) {
    OfflineDatabase.getMatchingLawAncestorArticles(filter.article, filter.law)
      .then(response => {
        console.log('articles when internet is off' + JSON.stringify(response));
        let searchResponse = {
          articles: {
            total: 0,
            data: [],
          },
        };

        if (response) {
          OfflineSearch.setSearchedData(response);

          searchResponse.articles['total'] = response.length;
          if (response.length > 10) {
            searchResponse.articles['data'] = response.slice(0, 10);
          } else {
            searchResponse.articles['data'] = response;
          }
        } else {
          OfflineSearch.setSearchedData([]);
        }

        this.setState({loading: false, searchTerm: ''});
        this.props.cancel();

        this.props.navigation.navigate('NomothesiaResults', {
          nomothesiaResult: searchResponse,
          filter: filter,
          isConnected: false,
        });
      })
      .catch(error => {
        this.setState({loading: false, searchTerm: ''});
        this.props.cancel();
        console.log('articles when internet is off error' + error);
      });
  }

  /**
   * Method used to search the articles from server
   * @param {*} filter
   */
  searchOnline(filter) {
    this.apiService
      .searchNomothesia(filter, 0)
      .then(response => {
        console.log('search filter' + JSON.stringify(response));

        this.setState({loading: false, searchTerm: ''});
        this.props.cancel();
        if (
          response.articles &&
          response.articles.data &&
          response.articles.data.length == 1
        ) {
          let id = response.articles.data[0].id;
          this.props.navigation.navigate({
            routeName: 'Topics',
            params: {
              title: response.articles.title,
              articleId: id,
            },
            key: 'Topics' + id,
          });
        } else {
          this.props.navigation.navigate('NomothesiaResults', {
            nomothesiaResult: response,
            filter: filter,
          });
        }
      })
      .catch(error => {
        this.props.cancel();
        console.log('Error' + JSON.stringify(error));
      });
  }

  closeModal() {
    this.setState({searchTerm: ''}, () => {
      this.props.cancel();
    });
  }

  render() {
    console.log(this.props.isModalVisible);
    return (
      <Modal
        key={this.props.key}
        visible={this.props.isModalVisible || false}
        animationType="slide"
        supportedOrientations={[
          'portrait',
          'portrait-upside-down',
          'landscape',
          'landscape-left',
          'landscape-right',
        ]}
        transparent={true}
        onRequestClose={() => {
          this.closeModal();
        }}>
        <SafeAreaView
          style={[styles.Modal, {backgroundColor: '#016622'}]}
          forceInset={{bottom: 'never', left: 'never', right: 'never'}}>
          <View style={styles.Modal}>
            {this.state.loading && (
              <View style={styles.loader}>
                <ActivityIndicator size="large" color="white" />
              </View>
            )}
            <View
              style={{
                backgroundColor: '#016622',
                width: '100%',
                height: moderateScale(40),
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: moderateScale(20),
                  textAlign: 'left',
                  width: '75%',
                  fontWeight: 'bold',
                  marginLeft: moderateScale(20),
                }}>
                Επιλογή άρθρου
              </Text>
              <TouchableOpacity
                style={styles.cancel}
                onPress={() => this.closeModal()}>
                <Text style={{color: '#fff', fontSize: moderateScale(20)}}>
                  Έξοδος
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.textInput}>
              <Text style={styles.Text}>Άρθρο</Text>
              <TextInput
                style={styles.TextInput}
                placeholder=""
                returnKeyType={'search'}
                placeholderTextColor="#828282"
                numberOfLines={2}
                onChangeText={searchTerm =>
                  this.setState({searchTerm}, () => {
                    this.enableButton();
                  })
                }
                onSubmitEditing={() => this.onSearchButtonPress()}
                value={this.state.searchTerm}
              />
            </View>
            {!this.state.loading && (
              <View
                style={{
                  height: moderateScale(1),
                  backgroundColor: '#D6D6D6',
                }}
              />
            )}
            <TouchableOpacity
              disabled={this.state.disableButton}
              style={
                this.state.disableButton
                  ? styles.buttonDisabled
                  : styles.enableButton
              }
              onPress={() => this.onSearchButtonPress()}>
              <Text style={styles.buttonText}>Εύρεση</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
  },
  cancel: {
    width: '25%',
    alignItems: 'flex-end',
    paddingRight: moderateScale(15),
  },
  text: {
    fontWeight: 'bold',
  },
  Modal: {
    backgroundColor: '#fff',
    flex: 1,
  },
  ModalView: {
    height: moderateScale(50),
  },
  textInput: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: moderateScale(50),
  },
  Text: {
    color: '#016622',
    alignItems: 'center',
    marginHorizontal: moderateScale(10),
    width: '30%',
    fontSize: moderateScale(16),
  },
  TextInput: {
    color: '#4A4A4A',
    fontSize: moderateScale(13),
    marginLeft: moderateScale(7),
    width: '60%',
  },
  enableButton: {
    padding: moderateScale(10),
    backgroundColor: '#016622',
    width: '100%',
    marginTop: moderateScale(10),
    borderRadius: moderateScale(5),
    padding: moderateScale(10),
    height: moderateScale(44),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    padding: moderateScale(10),
    backgroundColor: '#99c2a6',
    width: '100%',
    borderRadius: moderateScale(5),
    marginTop: moderateScale(10),
    padding: moderateScale(10),
    height: moderateScale(44),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: moderateScale(20),
  },
  loader: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    left: moderateScale(0),
    right: moderateScale(0),
    bottom: moderateScale(0),
    top: moderateScale(0),
    justifyContent: 'center',
  },
});
