/**
 * Custom alert pop-up
 * @Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */
import React, {Component} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import {moderateScale} from 'react-native-size-matters';

export default class CustomAlert extends Component {
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
    const {title, message} = this.props;
    return (
      <Modal
        style={styles.Modal}
        transparent
        isVisible={this.state.isModalVisible}>
        {this.state.isModalVisible && (
          <View style={styles.ModalView}>
            <Text style={styles.Title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            <TouchableOpacity
              onPress={() => this.toggleModal()}
              style={styles.button}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  Modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ModalView: {
    width: Dimensions.get('window').width * 0.7,
    backgroundColor: '#FFF',
  },
  Title: {
    color: '#000000',
    margin: moderateScale(7),
    fontSize: moderateScale(15),
    textAlign: 'center',
  },
  message: {
    color: '#000000',
    textAlign: 'left',
    margin: moderateScale(10),
    marginTop: moderateScale(12),
    fontSize: moderateScale(13),
  },
  button: {
    backgroundColor: '#016622',
    alignItems: 'center',
    padding: moderateScale(11),
    margin: moderateScale(5),
    borderRadius: moderateScale(2),
  },
  buttonText: {
    color: '#ffffff',
    fontSize: moderateScale(16),
  },
});
