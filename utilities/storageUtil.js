/**
 * Class is used to download,save and open the pdf of laws and articles.
 * @Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

const baseUrl = 'http://api.tetravivlos.com/api';

class StorageUtil {
  /**
   * First creates directory if not exists and then saves the pdf in tetravivlos folder
   */
  checkDirectory() {
    let folderPath = `${
      Platform.OS == 'android'
        ? RNFS.ExternalStorageDirectoryPath
        : RNFS.DocumentDirectoryPath
    }/tetravivlos`;
    return new Promise(function(resolve, reject) {
      RNFS.exists(folderPath)
        .then(response => {
          if (response == true) {
            resolve('FOLDEREXISTS');
          } else {
            RNFS.mkdir(folderPath)
              .then(response => {
                resolve('FOLDERCREATED');
              })
              .catch(error => {
                reject(error);
              });
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  saveToStorage(articleId) {
    let pdfPath =
      `${
        Platform.OS == 'android'
          ? RNFS.ExternalStorageDirectoryPath
          : RNFS.DocumentDirectoryPath
      }/tetravivlos/` +
      'article_' +
      articleId +
      '.pdf';
    let self = this;
    return new Promise(function(resolve, reject) {
      self
        .checkDirectory()
        .then(response => {
          if (response == 'FOLDEREXISTS' || response == 'FOLDERCREATED') {
            AsyncStorage.getItem('accessToken').then(token => {
              RNFS.downloadFile({
                fromUrl: baseUrl + '/articles/' + articleId + '/pdf/download',
                // fromUrl:
                //   'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                toFile: pdfPath,
                headers: {
                  Accept: 'application/x.tetravivlos.v1+json',
                  Authorization: 'Bearer ' + token,
                },
              })
                .promise.then(respoonse => {
                  FileViewer.open(pdfPath)
                    .then(() => {
                      resolve('Successful Download');
                    })
                    .catch(error => {
                      console.log('error' + JSON.stringify(error));
                      reject(error);
                    });
                })
                .catch(error => {
                  console.log('error  111' + JSON.stringify(error));
                  reject(error);
                });
            });
          } else {
            console.log('error 222' + JSON.stringify(error));
            reject('NO FOLDER FOUND');
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}
export default new StorageUtil();
