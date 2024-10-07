/**
 * custom footer for navigation
 * @Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */
import React, {Component} from 'react';
import {TouchableOpacity, StyleSheet, Text, View, Image} from 'react-native';
import fonts from '../styles/fonts';
import Icon2 from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {moderateScale} from 'react-native-size-matters';
// import fonts from '../styles/fonts/fonts';

export default class CustomFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
    };
  }

  /**
   * Function to open and close the modal
   */
  toggleModal() {
    this.setState({isModalVisible: !this.state.isModalVisible});
  }

  render() {
    const {
      isPrevious,
      onPrevious,
      lawNumber,
      noInternet,
      modal,
      isNext,
      onNext,
    } = this.props;
    return (
      <View style={styles.shadow}>
        <View style={styles.view}>
          {isPrevious ? (
            <TouchableOpacity style={{width: '10%'}} onPress={onPrevious}>
              <Icon2
                // style={{}}
                name="ios-arrow-back"
                color="black"
                size={moderateScale(30)}
              />
            </TouchableOpacity>
          ) : (
            <View style={{width: '10%'}} />
          )}
          {/* {!noInternet && lawNumber ? ( */}
          <TouchableOpacity onPress={modal} style={styles.footer}>
            <Text style={[fonts.roboto, styles.Text]}>Επιλογή Άρθρου</Text>
            <Image
              style={{
                // marginLeft: moderateScale(10),
                width: moderateScale(22),
                height: moderateScale(22),
                resizeMode: 'contain',
              }}
              source={require('../assets/edit.png')}
            />
            {/* <MaterialIcons
                style={{marginLeft: moderateScale(10)}}
                name="edit"
                size={moderateScale(22)}
                color="#505050"
              /> */}
          </TouchableOpacity>
          {/* ) : ( */}
          {/* <View style={{width: '80%'}} /> */}
          {/* )} */}
          {isNext ? (
            <TouchableOpacity
              style={{width: '10%'}}
              onPress={this.props.onNext}>
              <Icon2
                onPress={onNext}
                // style={{marginRight: moderateScale(10)}}
                name="ios-arrow-forward"
                color="black"
                size={moderateScale(30)}
              />
            </TouchableOpacity>
          ) : (
            <View style={{width: '10%'}} />
          )}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  view: {
    // marginTop: moderateScale(3),
    backgroundColor: '#fff',
    paddingVertical: moderateScale(8),
    width: '100%',
    marginTop: moderateScale(4),
    paddingBottom: moderateScale(15),
    justifyContent: 'center',
    paddingLeft: moderateScale(18),
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  modal: {
    alignItems: 'center',
  },
  shadow: {
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 2,
    elevation: 4,
    shadowColor: '#000',
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 1,
  },
  Text: {
    color: '#505050',
    fontWeight: 'bold',
    fontSize: moderateScale(18),
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    justifyContent: 'center',
  },
});
