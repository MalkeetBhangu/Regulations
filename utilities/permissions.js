/**
 * Class used to prompt user for storage permission.
 * @Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */
import {PermissionsAndroid} from 'react-native';

export default class Permissions {
  requestStoragePermission() {
    return new Promise(function(resolve, reject) {
      PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ],
        {
          title: 'Storage Permission',
          message:
            'Tetravivlos App needs access to your storage' +
            'so you can store pdf.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      )
        .then(granted => {
          if (granted) {
            resolve('You can download');
          } else {
            reject('Storage permission denied');
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}
