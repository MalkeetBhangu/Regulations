import {
  DeviceEventEmitter,
  NativeAppEventEmitter,
  Platform,
  Alert,
} from 'react-native';
import moment from 'moment';
import BackgroundTimer from 'react-native-background-timer';
import ApiService from '../services/api_service';
import NavigationService from './NavigationService';
import AsyncStorage from '@react-native-community/async-storage';
import OfflineDatabase from '../services/offlineDatabase';
import Toast from 'react-native-simple-toast';
import CacheService from '../services/cache_service';
import CustomAlert from '../component/custom_alert';

class BackgroundSync {
  constructor() {
    this.counter = 1;
    this.apiService = new ApiService();
  }

  // componentDidMount() {
  //
  // }

  /**
   * Fetches all the law categories from the server.
   */
  fetchOfflineLawCategories() {
    AsyncStorage.getItem('OFFLINELAWS')
      .then(response => {
        if (response === null) {
          this.apiService
            .getOfflineLawCategories()
            .then(response => {
              console.log('updating categories');
              let lawCategories = Object.values(response.law_categories);
              console.log(
                'offline law categories are' + JSON.stringify(lawCategories),
              );
              OfflineDatabase.setOfflineLawCategories(lawCategories);
              AsyncStorage.setItem(
                'OFFLINELAWS',
                JSON.stringify(lawCategories),
              );
              this.startFetchingArticles();
            })
            .catch(error => {
              console.log('offline laws error' + error);
            });
        } else {
          //console.log('offline articles are'+ response);
          AsyncStorage.getItem('OFFLINELAWS')
            .then(response => {
              let laws = JSON.parse(response);
              console.log('offline law categories are' + JSON.stringify(laws));
              OfflineDatabase.setOfflineLawCategories(laws);
              this.startFetchingArticles();
            })
            .catch(error => {
              console.log(error);
            });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  /**
   * Checks the current page Upto which all the articles are stored offline
   */
  startFetchingArticles() {
    AsyncStorage.getItem('currentPage')
      .then(currentPage => {
        if (currentPage == null) {
          let page = 1;
          this.fetchOfflineArticles(page);
        } else {
          let page = JSON.parse(currentPage);
          this.fetchOfflineArticles(page + 1);
        }
      })
      .catch(error => console.log(error));
  }

  /**
   * Checks the last page of the offline articles
   * and compares the current page with last page if not equals
   * fetches the offline articles from server
   * @param {*} page
   */
  fetchOfflineArticles(page) {
    AsyncStorage.getItem('lastPage')
      .then(lastPage => {
        if (lastPage != null) {
          lastPage = JSON.parse(lastPage);

          DeviceEventEmitter.emit('syncProgressChange', {
            totalPages: lastPage,
            pagedone: page,
          });
        }

        console.log('last page ' + lastPage);
        console.log('page ' + page);

        if (lastPage == null || page <= lastPage) {
          CacheService.showArticlesLoading = true;
          DeviceEventEmitter.emit('showArticlesLoading', true);

          this.apiService
            .getOfflineLawArticles(page)
            .then(response => {
              AsyncStorage.setItem(
                'currentPage',
                JSON.stringify(response.articles.current_page),
              );
              AsyncStorage.setItem(
                'lastPage',
                JSON.stringify(response.articles.last_page),
              );
              OfflineDatabase.storeArticles(response.articles.data);
              setTimeout(() => {
                this.startFetchingArticles();
                if (page == lastPage - 1) {
                  CacheService.syncError = false;
                  DeviceEventEmitter.emit('showArticlesLoading', false);

                  CacheService.showArticlesLoading = false;

                  //shows alert to user when offline articles syncing is about to end
                  setTimeout(() => {
                    Alert.alert(
                      '',
                      'Η διαδικασία ενημέρωσης των 4 Κωδίκων (Α.Κ., Κ.ΠΟΛ.Δ., Π.Κ., Κ.Π.Δ.) ολοκληρώθηκε με επιτυχία.Το περιεχόμενο τους θα είναι πλέον διαθέσιμο και ΕΚΤΟΣ ΣΥΝΔΕΣΗΣ ΣΕ ΔΙΚΤΥΟ',
                    );
                  }, 8000);
                }
              }, 5000);
            })
            .catch(error => {
              if (page != lastPage) {
                CacheService.syncError = true;
                DeviceEventEmitter.emit('showArticlesLoadingError', true);
                //shows alert to user when offline articles syncing is not complete
                Alert.alert(
                  '',
                  'ΠΡΟΣΟΧΗ - ΔΕΝ ΟΛΟΚΛΗΡΩΘΗΚΕ Η ΔΙΑΔΙΚΑΣΙΑ ΤΗΣ ΕΝΗΜΕΡΩΣΗΣ ΤΩΝ 4 ΚΩΔΙΚΩΝ (Α.Κ., Κ.ΠΟΛ.Δ., Π.Κ., Κ.Π.Δ.) ώστε να είναι διαθέσιμοι και εκτός σύνδεσης. ΠΑΡΑΚΑΛΟΥΜΕ ΠΟΛΥ ΣΥΝΔΕΘΕΙΤΕ ΣΕ ΔΙΚΤΥΟ ΓΙΑ ΝΑ ΟΛΟΚΛΗΡΩΘΕΙ',
                  [
                    {
                      text: 'Προσπαθήστε ξανά',
                      onPress: () => NavigationService.navigate('HeaderHome'),
                    },
                  ],
                );
              }
              // if (error == 'No Internet') {
              //   CacheService.syncError = false;
              //   DeviceEventEmitter.emit('showArticlesLoading', true);
              // }

              CacheService.showArticlesLoading = false;
              DeviceEventEmitter.emit('showArticlesLoading', false);
              console.log('having error from offlinne' + error);
            });
        } else {
          CacheService.showArticlesLoading = false;

          // setTimeout(() => {
          //   Alert.alert(
          //     '',
          //     'Η διαδικασία ενημέρωσης των 4 Κωδίκων (Α.Κ., Κ.ΠΟΛ.Δ., Π.Κ., Κ.Π.Δ.) ολοκληρώθηκε με επιτυχία.Το περιεχόμενο τους θα είναι πλέον διαθέσιμο και ΕΚΤΟΣ ΣΥΝΔΕΣΗΣ ΣΕ ΔΙΚΤΥΟ',
          //   );
          // }, 500);

          DeviceEventEmitter.emit('showArticlesLoading', false);
        }
      })
      .catch(error => console.log(error));
  }

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };
}

export default BackgroundSync;
