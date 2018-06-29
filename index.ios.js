/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NavigatorProject from './component/NavigatorProject';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  NavigatorIOS,
  View
} from 'react-native';

export default class iWeather extends Component {
  render() {
    return (
        <NavigatorIOS ref="nav" 
            style = {styles.container}
            initialRoute = {
                {
                    component: NavigatorProject,
                    title: 'iWeather',
                    navigationBarHidden: true
                }
            } />
    );
  }
};
const styles = StyleSheet.create({
  container: {
    flex: 1, 
  }
});

AppRegistry.registerComponent('iWeather', () => iWeather);
