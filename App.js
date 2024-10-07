/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions,
} from 'react-native';

import NavigationService from './services/NavigationService';
import UpdateDescription from './screens/updateDescription';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
import SideMenu from './screens/side-menu';
import LawCategories from './screens/law-categories';
import LawCategoriesById from './screens/law-categories-by-id';
import Login from './screens/login';
import Setting from './screens/setting';
import Nomothesia from './screens/nomothesia';
import Nomologia from './screens/nomologia';
import Notification from './screens/notification';
import Users from './screens/users';
import Update from './screens/update';
import Contact from './screens/contact';
import HeaderHome from './screens/headerHome';
import NomothesiaResults from './screens/nomothesiaResults';
import NomologiaResults from './screens/nomologiaResults';
import NotSubscribed from './screens/notSubscribed';
import SearchTabs from './screens/searchTabs';
import Topics from './screens/topics';
import BookMark from './screens/BookMark';
import ArticlesList from './screens/articlesList';
import RulingDetails from './screens/rulingDetails';
import Instruction from './screens/instruction';
import New from './screens/new';
import Account from './screens/account';
import ArticleVersionDetail from './screens/articleVersionDetail';
import NewsDetails from './screens/newsDetails';
import Products from './screens/products';
import OfflineSwitch from './screens/offlineSwitch';
import NoNetwork from './screens/noNetwork';
const screen = Dimensions.get('window').width;
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';

// To see all the requests in the chrome Dev tools in the network tab.
// XMLHttpRequest = GLOBAL.originalXMLHttpRequest ?
//     GLOBAL.originalXMLHttpRequest :
//     GLOBAL.XMLHttpRequest;

const exploreNavigator = createStackNavigator(
  {
    HeaderHome: {
      screen: HeaderHome,
    },
    LawCategories: {
      screen: LawCategories,
    },
    LawCategoriesById: {
      screen: LawCategoriesById,
    },
    ArticlesList: {
      screen: ArticlesList,
    },
    Topics: {
      screen: Topics,
    },
    RulingDetails: {
      screen: RulingDetails,
    },
    ArticleVersionDetail: {
      screen: ArticleVersionDetail,
    },
    SearchTabs: {
      screen: SearchTabs,
      // navigationOptions: ({navigation}) => ({
      //   title: 'Αναζήτηση',
      // }),
    },
    Nomothesia: {
      screen: Nomothesia,
    },
    UpdateDescription: {
      screen: UpdateDescription,
    },
    Nomologia: {
      screen: Nomologia,
    },
    NomologiaResults: {
      screen: NomologiaResults,
      navigationOptions: ({navigation}) => ({
        title: 'Αποτελέσματα Αναζήτησης',
      }),
    },
    NomothesiaResults: {
      screen: NomothesiaResults,
      navigationOptions: ({navigation}) => ({
        title: 'Αποτελέσματα Αναζήτησης',
      }),
    },
    Notification: {
      screen: Notification,
      navigationOptions: ({navigation}) => ({
        title: 'Ειδοποιήσεις',
      }),
    },
    Users: {
      screen: Users,
    },
    Setting: {
      screen: Setting,
    },
    NotSubscribed: {
      screen: NotSubscribed,
    },

    BookMark: {
      screen: BookMark,
    },
    Update: {
      screen: Update,
      navigationOptions: ({navigation}) => ({
        title: 'Ενημερώσεις',
      }),
    },

    Contact: {
      screen: Contact,
      navigationOptions: ({navigation}) => ({
        title: 'Επικοινωνία',
      }),
    },
    Products: {
      screen: Products,
      navigationOptions: ({navigation}) => ({
        title: 'Προϊόντα',
      }),
    },
    Instruction: {
      screen: Instruction,
      navigationOptions: ({navigation}) => ({
        title: 'Οδηγίες χρήσης',
      }),
    },

    Account: {
      screen: Account,
      navigationOptions: ({navigation}) => ({
        title: 'Λογαριασμός',
      }),
    },
    New: {
      screen: New,
      navigationOptions: ({navigation}) => ({
        title: 'Νέα',
      }),
    },
    NewsDetails: {
      screen: NewsDetails,
    },
    OfflineSwitch: {
      screen: OfflineSwitch,
    },
    NoNetwork: {
      screen: NoNetwork,
    },
  },
  {
    initialRouteName: 'HeaderHome',
    // initialRouteName:'NotSubscribed',
    defaultNavigationOptions: {
      //drawerLockMode: navigation.state.index > 0 ? 'locked-closed' : 'unlocked',

      headerTitleStyle: {
        textAlign: 'left',
        flexGrow: 1,
        //marginLeft: moderateScale(-30),
        fontSize: moderateScale(20),
        color: 'white',
        maxWidth: screen * 0.45,
      },
    },
  },
);

const HomeNavigator = createDrawerNavigator(
  {
    Home: exploreNavigator,
  },
  {
    contentComponent: SideMenu,
    drawerType: 'back',
    //maxWidth: screen * 200,
    drawerWidth: screen * 0.7,
  },
);

const mainNavigator = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      header: null,
    },
  },
  Home: {
    screen: HomeNavigator,
    navigationOptions: {
      header: null,
    },
  },
});

const Navigator = createAppContainer(mainNavigator);
const App = () => {
  return (
    <Navigator
      ref={navigatorRef => {
        NavigationService.setTopLevelNavigator(navigatorRef);
      }}
    />
  );
};

export default App;
