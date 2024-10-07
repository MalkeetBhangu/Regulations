import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Animated} from 'react-native';

export default class ProgressBar extends Component {
  state = {
    progressStatus: 0,
  };

  anim = new Animated.Value(0);
  componentDidMount() {
    this.onAnimate();
  }
  onAnimate = () => {
    if (this.props.complete == true) {
      setTimeout(() => {
        this.anim.setValue(100);
      }, 10000);
    }
    // this.anim.addListener(({value}) => {
    //   this.setState({progressStatus: parseInt(value)});
    // });
    // Animated.timing(this.anim, {
    //   toValue: 100,
    //   duration: 400000,
    // }).start();
  };
  render() {
    this.props.complete ? this.setState({progressStatus: 100}) : null;
    return (
      <View style={styles.container}>
        <Animated.View
          style={[styles.inner, {width: this.props.progressStatus + '%'}]}>
          <Animated.Text style={styles.label}>
            {this.props.progressStatus}%
          </Animated.Text>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    padding: 3,
    backgroundColor: 'grey',
    // borderColor: '#FAA',
    // borderWidth: 3,
    borderRadius: 30,
    justifyContent: 'center',
  },
  inner: {
    width: '100%',
    height: 18,
    borderRadius: 10,
    backgroundColor: '#016622',
  },
  label: {
    fontSize: 10,
    color: '#fff',
    alignSelf: 'flex-end',
  },
});
