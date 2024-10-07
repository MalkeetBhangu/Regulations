/**
 * Search Screen.
 * @Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import Screen from '../screens/screen';
import NetworkError from '../component/network-error';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import Nomologia from './nomologia'; //rulings
import Nomothesia from './nomothesia'; //articles & laws

export default class SearchTabs extends Screen {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      noNetwork: false,
      // index: 1,
      index: this.props.navigation.getParam('index', 0), //change by akriti
      routes: [
        {key: 'nomothesia', title: 'Νομοθεσία'},
        {key: 'nomologia', title: 'Νομολογία'},
      ],
      isNomologia: this.props.navigation.getParam('nomologia', false),
    };
  }

  componentDidMount() {
    let newIndex = this.props.navigation.getParam('index', 0);
    this.setState({index: newIndex});
    if (this.state.isNomologia) {
      this.setState({index: 1});
    }
  }

  render() {
    const {loader, noNetwork, index, routes} = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        {loader && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="white" />
          </View>
        )}
        {/* <NetworkError
          ref={o => (this.NetworkError = o)}
          cancel={() => this.dismissNetworkModal()}
          noNetwork={noNetwork}
          onPress={() => this.dismissNetworkModal()}
        /> */}
        <TabView
          // navigationState={this.state}
          navigationState={{index, routes}}
          renderScene={({route}) => {
            switch (route.key) {
              case 'nomothesia':
                return (
                  <View style={[styles.scene, {backgroundColor: 'white'}]}>
                    <Nomothesia
                      hideLoader={() => this.setState({loader: false})}
                      showLoader={() => this.setState({loader: true})}
                      showNetworkError={() => {
                        this.setState({noNetwork: true});
                        if (this.state.noNetwork == true) {
                          this.props.navigation.navigate('NoNetwork');
                          this.onRefreshPress();
                          //end
                        }
                      }}
                      {...this.props}
                    />
                  </View>
                );
              case 'nomologia':
                return (
                  <View style={[styles.scene, {backgroundColor: 'white'}]}>
                    <Nomologia
                      {...this.props}
                      hideLoader={() => this.setState({loader: false})}
                      showNetworkError={() => {
                        this.setState({noNetwork: true});
                        if (this.state.noNetwork == true) {
                          this.props.navigation.navigate('NoNetwork');
                          this.onRefreshPress();
                          //end
                        }
                      }}
                      showLoader={() => this.setState({loader: true})}
                    />
                  </View>
                );
              default:
                return;
            }
          }}
          renderTabBar={props => (
            <TabBar
              {...props}
              renderIndicator={({route}) => {
                return null;
              }}
              renderLabel={({route}) => {
                return (
                  <View
                    style={
                      route.key === props.navigationState.routes[index].key
                        ? styles.tabActive
                        : styles.tabInactive
                    }>
                    <Text
                      style={
                        route.key === props.navigationState.routes[index].key
                          ? styles.selectedTabTextStyle
                          : styles.label
                      }>
                      {route.title}
                    </Text>
                  </View>
                );
              }}
              contentContainerStyle={{}}
              indicatorContainerStyle={{borderTopColor: '#fff'}}
              indicatorStyle={styles.indicator}
              tabStyle={styles.tabStyle}
              style={styles.tab}
            />
          )}
          // onIndexChange={index => this.setState({index})}
          onIndexChange={index => this.setState({index})}
          initialLayout={{width: Dimensions.get('window').width}}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  tab: {
    backgroundColor: '#016622',
    padding: 0,
    width: Dimensions.get('window').width * 0.7,
    alignSelf: 'center',
    margin: moderateScale(15),
  },
  tabActive: {
    backgroundColor: '#016622',
    padding: moderateScale(0),
    width: Dimensions.get('window').width * 0.35,
    alignSelf: 'center',
    //margin:15,
    borderColor: '#016622',
    borderWidth: moderateScale(3),
    padding: moderateScale(12),
    alignItems: 'center',
  },
  tabInactive: {
    backgroundColor: '#fff',
    padding: moderateScale(12),
    borderWidth: moderateScale(3),
    borderColor: '#016622',
    width: Dimensions.get('window').width * 0.35,
    alignSelf: 'center',
    //margin:15,

    alignItems: 'center',
  },

  selectedTabTextStyle: {
    color: '#fff',
    fontSize: moderateScale(15),
  },
  label: {
    color: '#016622',
    fontSize: moderateScale(15),
  },
  indicator: {
    backgroundColor: '#016622',
    borderColor: '#016622',
  },
  tabStyle: {
    padding: moderateScale(0),
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    padding: moderateScale(8),
    flexGrow: moderateScale(1),
  },
  loader: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    left: moderateScale(0),
    right: moderateScale(0),
    bottom: moderateScale(0),
    top: moderateScale(0),
    zIndex: moderateScale(2),
    justifyContent: 'center',
  },
});
