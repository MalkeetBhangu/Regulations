/**
 * Api Service to make the network calls with server.
 * @Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import NetworkUtility from '../utilities/networkUtil';
import {DeviceEventEmitter} from 'react-native';
import moment from 'moment';

//const baseUrl = 'http://api.tetravivlos.com/api';

/**
 * Staging URL
 */
const baseUrl = 'https://staging-api.tetravivlos.com/api';

export default class ApiService {
  constructor() {}

  /**
   * Get updates from server
   * @param {*} date
   */
  getUpdates(date) {
    return NetworkUtility.checkIsNetwork().then(response => {
      console.log('is connected' + response.isConnected);
      if (response.isConnected) {
        return AsyncStorage.getItem('accessToken').then(token => {
          console.log('toknen' + token);
          let requestOptions = {
            method: 'GET',
            headers: new Headers({
              Accept: 'application/x.tetravivlos.v1+json',
              Authorization: 'Bearer ' + token,
            }),
          };

          return fetch(baseUrl + `/articles/changes/${date}`, requestOptions)
            .then(response => response.json())
            .then(response => {
              return response;
            });
        });
      } else {
        //DeviceEventEmitter.emit('NoNetwork', true);
        return Promise.reject('Network Error');
      }
    });
  }

  /**
   * Get notifications from server
   * @param {*} newsTime
   */
  getNews(newsTime) {
    return NetworkUtility.checkIsNetwork().then(response => {
      console.log('is connected' + response.isConnected);
      if (response.isConnected) {
        return AsyncStorage.getItem('accessToken').then(token => {
          console.log('toknen' + token);
          let requestOptions = {
            method: 'GET',
            headers: new Headers({
              Accept: 'application/x.tetravivlos.v1+json',
              Authorization: 'Bearer ' + token,
            }),
          };

          return fetch(baseUrl + `/news/list/${newsTime}`, requestOptions)
            .then(response => response.json())
            .then(response => {
              return response;
            });
        });
      } else {
        //DeviceEventEmitter.emit('NoNetwork', true);
        return Promise.reject('Network Error');
      }
    });
  }

  /**
   * Get News details by id from server
   * @param {*} id
   */
  getNewsById(id) {
    return NetworkUtility.checkIsNetwork().then(response => {
      console.log('is connected' + response.isConnected);
      if (response.isConnected) {
        return AsyncStorage.getItem('accessToken').then(token => {
          console.log('toknen' + token);
          let requestOptions = {
            method: 'GET',
            headers: new Headers({
              Accept: 'application/x.tetravivlos.v1+json',
              Authorization: 'Bearer ' + token,
            }),
          };

          return fetch(baseUrl + `/news/${id}`, requestOptions)
            .then(response => response.json())
            .then(response => {
              return response;
            });
        });
      } else {
        DeviceEventEmitter.emit('NoNetwork', true);
        return Promise.reject('Network Error');
      }
    });
  }

  /**
   * Get last updated from server
   */
  getLastUpdated() {
    return NetworkUtility.checkIsNetwork().then(response => {
      console.log('is connected' + response.isConnected);
      if (response.isConnected) {
        return AsyncStorage.getItem('accessToken').then(token => {
          console.log('toknen' + token);
          let requestOptions = {
            method: 'GET',
            headers: new Headers({
              Accept: 'application/x.tetravivlos.v2+json',
              Authorization: 'Bearer ' + token,
            }),
          };

          return fetch(baseUrl + '/sitepage/last_updated', requestOptions)
            .then(response => response.json())
            .then(response => {
              return response;
            });
        });
      } else {
        //DeviceEventEmitter.emit('NoNetwork', true);
        return Promise.reject('Network Error');
      }
    });
  }

  /**
   * Login user api
   * @param {*} username
   * @param {*} password
   */
  login(username, password) {
    return NetworkUtility.checkIsNetwork().then(response => {
      if (response.isConnected) {
        let uniqueID = DeviceInfo.getUniqueId();
        let myHeaders = new Headers();
        myHeaders.append('Accept', 'application/x.tetravivlos.v2+json');

        let formdata = new FormData();
        formdata.append('username', username);
        formdata.append('password', password);
        formdata.append('device_uuid', uniqueID);

        let requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: formdata,
          redirect: 'follow',
        };

        return fetch(baseUrl + '/user/login', requestOptions)
          .then(response => response.json())
          .then(response => {
            console.log('res is ' + JSON.stringify(response));
            return response;
          });
      } else {
        DeviceEventEmitter.emit('NoNetwork', true);
        return Promise.reject('Network Error');
      }
    });
  }

  /**
   * Logout user api
   */
  async logout() {
    let data = await AsyncStorage.getItem('LOCAL_USER_CREDS');
    let user = JSON.parse(data);
    //let password = await AsyncStorage.getItem('LOCAL_PASS');
    return NetworkUtility.checkIsNetwork().then(response => {
      if (response.isConnected) {
        console.log(
          'details' +
            JSON.stringify(user.email) +
            JSON.stringify(user.password),
        );

        let myHeaders = new Headers();
        myHeaders.append('Accept', 'application/x.tetravivlos.v2+json');

        let formdata = new FormData();
        formdata.append('username', user.email);
        formdata.append('password', user.password);

        let data = {
          method: 'POST',
          headers: myHeaders,
          body: formdata,
          redirect: 'follow',
        };
        return fetch(baseUrl + '/user/logout', data)
          .then(response => response.json())
          .then(response => {
            return response;
          });
      } else {
        DeviceEventEmitter.emit('NoNetwork', true);
        return Promise.reject('Network Error');
      }
    });
  }

  /**
   * Getting user data from load user api
   */
  loadUser() {
    return NetworkUtility.checkIsNetwork().then(response => {
      if (response.isConnected) {
        return AsyncStorage.getItem('accessToken').then(token => {
          if (token === null) {
            return Promise.reject('Not Logged In');
          } else {
            let requestOptions = {
              method: 'GET',
              headers: new Headers({
                Accept: 'application/x.tetravivlos.v1+json',
                Authorization: 'Bearer ' + token,
              }),
            };

            return fetch(baseUrl + '/user', requestOptions)
              .then(response => response.json())
              .then(response => {
                //resolve(response);
                return response;
              });
          }
        });
      } else {
        //DeviceEventEmitter.emit('NoNetwork', true);
        return Promise.reject('No Internet');
      }
    });
  }

  /**
   * Getting Law Categories from Server
   */
  getLawCategories() {
    return NetworkUtility.checkIsNetwork().then(response => {
      if (response.isConnected) {
        return AsyncStorage.getItem('accessToken').then(token => {
          if (token === null) {
            return Promise.reject('Not Logged In');
          } else {
            let requestOptions = {
              method: 'GET',
              headers: new Headers({
                Accept: 'application/x.tetravivlos.v1+json',
                Authorization: 'Bearer ' + token,
              }),
            };

            return fetch(baseUrl + '/lawcategories', requestOptions)
              .then(response => response.json())
              .then(response => {
                return response;
              });
          }
        });
      } else {
        //DeviceEventEmitter.emit('NoNetwork', true);
        return Promise.reject('No Internet');
      }
    });
  }

  /**
   * Getting Law Categories by id from Server
   * @param {*} categoryId
   */
  getLawCategoryById(categoryId) {
    return NetworkUtility.checkIsNetwork().then(response => {
      if (response.isConnected) {
        return AsyncStorage.getItem('accessToken').then(token => {
          if (token === null) {
            return Promise.reject('Not Logged In');
          } else {
            let requestOptions = {
              method: 'GET',
              headers: new Headers({
                Accept: 'application/x.tetravivlos.v1+json',
                Authorization: 'Bearer ' + token,
              }),
            };

            return fetch(
              baseUrl + `/lawcategories/${categoryId}`,
              requestOptions,
            )
              .then(response => response.json())
              .then(response => {
                return response;
              });
          }
        });
      } else {
        //DeviceEventEmitter.emit('NoNetwork', true);
        return Promise.reject('No Internet');
      }
    });
  }

  /**
   * Getting Law Articls by category id from Server
   * @param {*} categoryId
   * @param {*} currentPage
   */
  getLawArticlesById(categoryId, currentPage) {
    console.log(currentPage);
    return NetworkUtility.checkIsNetwork().then(response => {
      if (response.isConnected) {
        return AsyncStorage.getItem('accessToken').then(token => {
          if (token === null) {
            return Promise.reject('Not Logged In');
          } else {
            let requestOptions = {
              method: 'GET',
              headers: new Headers({
                Accept: 'application/x.tetravivlos.v1+json',
                Authorization: 'Bearer ' + token,
              }),
            };

            return fetch(
              baseUrl +
                `/lawcategories/${categoryId}/articles?page=${currentPage}`,
              requestOptions,
            )
              .then(response => response.json())
              .then(response => {
                return response;
              });
          }
        });
      } else {
        //DeviceEventEmitter.emit('NoNetwork', true);
        return Promise.reject('No Internet');
      }
    });
  }

  getOfflineLawCategories() {
    return NetworkUtility.checkIsNetwork().then(response => {
      if (response.isConnected) {
        return AsyncStorage.getItem('accessToken').then(token => {
          let requestOptions = {
            method: 'GET',
            headers: new Headers({
              Accept: 'application/x.tetravivlos.v1+json',
              Authorization: 'Bearer ' + token,
            }),
          };

          return fetch(baseUrl + `/lawcategories/offline`, requestOptions)
            .then(response => response.json())
            .then(response => {
              return response;
            });
        });
      } else {
        //DeviceEventEmitter.emit('NoNetwork', true);
        return Promise.reject('No Internet');
      }
    });
  }

  /**
   * Getting Law Articles by category id from Server to store offline
   * @param {*} currentPage
   */
  getOfflineLawArticles(currentPage) {
    console.log(currentPage);
    return NetworkUtility.checkIsNetwork().then(response => {
      if (response.isConnected) {
        return AsyncStorage.getItem('accessToken').then(token => {
          let requestOptions = {
            method: 'GET',
            headers: new Headers({
              Accept: 'application/x.tetravivlos.v1+json',
              Authorization: 'Bearer ' + token,
            }),
          };

          return fetch(
            baseUrl + `/articles/offline?page=${currentPage}&pageSize=150`,
            requestOptions,
          )
            .then(response => response.json())
            .then(response => {
              return response;
            });
        });
      } else {
        //DeviceEventEmitter.emit('NoNetwork', true);
        return Promise.reject('No Internet');
      }
    });
  }

  /**
   * Getting Law Articls by id from Server
   * @param {*} articleId
   */
  getArticle(articleId) {
    console.log(articleId);

    return NetworkUtility.checkIsNetwork().then(response => {
      if (response.isConnected) {
        return AsyncStorage.getItem('accessToken').then(token => {
          if (token === null) {
            return Promise.reject('Not Logged In');
          } else {
            let requestOptions = {
              method: 'GET',
              headers: new Headers({
                Accept: 'application/x.tetravivlos.v2+json',
                Authorization: 'Bearer ' + token,
              }),
            };

            console.log('token is ' + token);
            return fetch(baseUrl + '/articles/' + articleId, requestOptions)
              .then(response => response.json())
              .then(response => {
                return response;
              });
          }
        });
      } else {
        //DeviceEventEmitter.emit('NoNetwork', true);
        return Promise.reject('No Internet');
      }
    });
  }

  /**
   * Get Instructions from the server
   */
  getInstructions() {
    return NetworkUtility.checkIsNetwork().then(response => {
      if (response.isConnected) {
        return AsyncStorage.getItem('accessToken').then(token => {
          if (token === null) {
            return Promise.reject('Not Logged In');
          } else {
            let requestOptions = {
              method: 'GET',
              headers: new Headers({
                Accept: 'application/x.tetravivlos.v1+json',
                Authorization: 'Bearer ' + token,
              }),
            };
            return fetch(baseUrl + '/page/instructions', requestOptions)
              .then(response => response.json())
              .then(response => {
                return response;
              });
          }
        });
      } else {
        //DeviceEventEmitter.emit('NoNetwork', true);
        return Promise.reject('No Internet');
      }
    });
  }

  /**
   * Get Products from the server
   */
  getProducts() {
    return NetworkUtility.checkIsNetwork().then(response => {
      if (response.isConnected) {
        return AsyncStorage.getItem('accessToken').then(token => {
          if (token === null) {
            return Promise.reject('Not Logged In');
          } else {
            let requestOptions = {
              method: 'GET',
              headers: new Headers({
                Accept: 'application/x.tetravivlos.v1+json',
                Authorization: 'Bearer ' + token,
              }),
            };
            return fetch(baseUrl + '/page/publications', requestOptions)
              .then(response => response.json())
              .then(response => {
                return response;
              });
          }
        });
      } else {
        //DeviceEventEmitter.emit('NoNetwork', true);
        return Promise.reject('No Internet');
      }
    });
  }

  /**
   * Getting Search results for nomologia on the basis of filter's from Server
   * @param {*} filter
   * @param {*} currentPage
   */
  searchNomologia(filter, currentPage) {
    console.log(currentPage);
    return NetworkUtility.checkIsNetwork().then(response => {
      if (response.isConnected) {
        return AsyncStorage.getItem('accessToken').then(token => {
          let formdata = new FormData();
          for (var key in filter) {
            formdata.append(key, filter[key]);
          }

          let requestOptions = {
            method: 'POST',
            headers: new Headers({
              Accept: 'application/x.tetravivlos.v2+json',
              Authorization: 'Bearer ' + token,
            }),
            body: formdata,
          };

          return fetch(
            baseUrl + `/search/nomologia?page=${currentPage}`,
            requestOptions,
          )
            .then(response => response.json())
            .then(response => {
              return response;
            });
        });
      } else {
        //DeviceEventEmitter.emit('NoNetwork', true);
        return Promise.reject('No Internet');
      }
    });
  }

  /**
   * Getting Search results for nomothesia on the basis of filter's from Server
   * @param {*} filter
   * @param {*} currentPage
   */
  searchNomothesia(filter, currentPage) {
    console.log(currentPage + JSON.stringify(filter));
    return NetworkUtility.checkIsNetwork().then(response => {
      if (response.isConnected) {
        return AsyncStorage.getItem('accessToken').then(token => {
          let formdata = new FormData();
          formdata.append('term', filter.term);
          formdata.append('law', filter.law);
          formdata.append('article', filter.article);
          formdata.append('year', filter.year);
          formdata.append('fek', filter.fek);
          if (filter.extra_filter) {
            formdata.append('extra_filter', filter.extra_filter);
          }

          let requestOptions = {
            method: 'POST',
            headers: new Headers({
              Accept: 'application/x.tetravivlos.v1+json',
              Authorization: 'Bearer ' + token,
            }),
            body: formdata,
            redirect: 'follow',
          };

          return fetch(
            baseUrl + `/search/nomothesia?page=${currentPage}`,
            requestOptions,
          )
            .then(response => response.json())
            .then(response => {
              return response;
            });
        });
      } else {
        //DeviceEventEmitter.emit('NoNetwork', true);
        return Promise.reject('No Internet');
      }
    });
  }

  /**
   * Getting Article version by version id from Server
   * @param {*} versionId
   */
  getArticleVersion(versionId) {
    return NetworkUtility.checkIsNetwork().then(response => {
      if (response.isConnected) {
        return AsyncStorage.getItem('accessToken').then(token => {
          let requestOptions = {
            method: 'GET',
            headers: new Headers({
              Accept: 'application/x.tetravivlos.v2+json',
              Authorization: 'Bearer ' + token,
            }),
          };

          return fetch(
            baseUrl + `/articles/version/${versionId}`,
            requestOptions,
          )
            .then(response => response.json())
            .then(response => {
              return response;
            });
        });
      } else {
        DeviceEventEmitter.emit('NoNetwork', true);
        return Promise.reject('Network Error');
      }
    });
  }

  /**
   * Getting Ruling Detail by ruling id from Server
   * @param {*} rulingId
   */
  getRuling(rulingId) {
    return NetworkUtility.checkIsNetwork().then(response => {
      if (response.isConnected) {
        return AsyncStorage.getItem('accessToken').then(token => {
          let requestOptions = {
            method: 'GET',
            headers: new Headers({
              Accept: 'application/x.tetravivlos.v2+json',
              Authorization: 'Bearer ' + token,
            }),
          };

          return fetch(baseUrl + `/rulings/${rulingId}`, requestOptions)
            .then(response => response.json())
            .then(response => {
              return response;
            });
        });
      } else {
        DeviceEventEmitter.emit('NoNetwork', true);
        return Promise.reject('Network Error');
      }
    });
  }

  /**
   * Getting Article rulings by article id from Server
   * @param {*} articleId
   * @param {*} currentPage
   */
  getRulings(articleId, currentPage) {
    return NetworkUtility.checkIsNetwork().then(response => {
      if (response.isConnected) {
        return AsyncStorage.getItem('accessToken').then(token => {
          let requestOptions = {
            method: 'GET',
            headers: new Headers({
              Accept: 'application/x.tetravivlos.v2+json',
              Authorization: 'Bearer ' + token,
            }),
          };

          return fetch(
            baseUrl + `/articles/${articleId}/rulings?page=${currentPage}`,
            requestOptions,
          )
            .then(response => response.json())
            .then(response => {
              return response;
            });
        });
      } else {
        DeviceEventEmitter.emit('NoNetwork', true);
        return Promise.reject('Network Error');
      }
    });
  }

  getUserUpdates(device_uuid) {
    return NetworkUtility.checkIsNetwork().then(response => {
      if (response.isConnected) {
        return AsyncStorage.getItem('accessToken').then(token => {
          let requestOptions = {
            method: 'GET',
            headers: new Headers({
              Accept: 'application/x.tetravivlos.v2+json',
              Authorization: 'Bearer ' + token,
            }),
          };

          return fetch(
            baseUrl + `/updates/me?device_uuid=${device_uuid}`,
            requestOptions,
          )
            .then(response => response.json())
            .then(response => {
              console.log('mnop' + JSON.stringify(response));
              return response;
            });
        });
      } else {
        DeviceEventEmitter.emit('NoNetwork', true);
        return Promise.reject('Network Error');
      }
    });
  }

  getUpdateHistory(userId, device_uuid) {
    console.log(userId);
    return NetworkUtility.checkIsNetwork().then(response => {
      if (response.isConnected) {
        // let uniqueID = DeviceInfo.getUniqueId();
        return AsyncStorage.getItem('accessToken').then(token => {
          let requestOptions = {
            method: 'GET',
            headers: new Headers({
              Accept: 'application/x.tetravivlos.v2+json',
              Authorization: 'Bearer ' + token,
            }),
            // let formdata = new FormData();
          };

          return fetch(
            baseUrl +
              `/updates/history?user_id=${userId}&device_uuid=${device_uuid}`,
            requestOptions,
          )
            .then(response => response.json())
            .then(response => {
              // alert(baseUrl);
              console.log('response' + JSON.stringify(response));
              return response;
            });
        });
      } else {
        DeviceEventEmitter.emit('NoNetwork', true);
        return Promise.reject('Network Error');
      }
    });
  }

  getCurrentUpdatesDetail(updateId) {
    return NetworkUtility.checkIsNetwork().then(response => {
      if (response.isConnected) {
        return AsyncStorage.getItem('accessToken').then(token => {
          let requestOptions = {
            method: 'GET',
            headers: new Headers({
              Accept: 'application/x.tetravivlos.v2+json',
              Authorization: 'Bearer ' + token,
            }),
          };

          return fetch(
            baseUrl + `/updates/${updateId}/categories`,
            requestOptions,
          )
            .then(response => response.json())
            .then(response => {
              return response;
            });
        });
      } else {
        DeviceEventEmitter.emit('NoNetwork', true);
        return Promise.reject('Network Error');
      }
    });
  }

  updateCompleted(userId, updateId, version) {
    return NetworkUtility.checkIsNetwork().then(response => {
      if (response.isConnected) {
        return AsyncStorage.getItem('accessToken').then(token => {
          let uniqueID = DeviceInfo.getUniqueId();
          // alert(uniqueID);
          let currentTime = moment().format('YYYY-MM-DD hh:mm:ss');

          console.log('current time' + version);
          let formdata = new FormData();
          formdata.append('user_id', userId);
          formdata.append('update_id', updateId);
          formdata.append('device_uuid', uniqueID);
          formdata.append('downloaded_at', currentTime);
          formdata.append('version', version);
          console.log('form' + JSON.stringify(formdata));
          let requestOptions = {
            method: 'POST',
            headers: new Headers({
              Accept: 'application/x.tetravivlos.v2+json',
              Authorization: 'Bearer ' + token,
            }),
            body: formdata,
            redirect: 'follow',
          };

          return fetch(baseUrl + '/updates/history', requestOptions)
            .then(response => response.json())
            .then(response => {
              return response;
            });
        });
      } else {
        DeviceEventEmitter.emit('NoNetwork', true);
        return Promise.reject('Network Error');
      }
    });
  }
}
