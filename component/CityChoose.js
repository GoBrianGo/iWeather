/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  NavigatorIOS,
  TouchableHighlight,
  TouchableOpacity,
  ListView,
  SectionList,
  Dimensions,
  View
} from 'react-native';
import CityData from './CityData';
const ScreenWidth = Dimensions.get('window').width;
console.log(ScreenWidth);

export default class CityChoose extends Component {

  constructor(props) {
    super(props);
  }

  setCityCode(data) {
    this.props.route.params.getCityCode(data);
    this.props.navigator.pop();
  }

  renderExpenseItem(data) {
    let rows = Math.ceil(data.section.data.length / 3);
    let currentRow = Math.floor(data.index / 3) + 1;
    let index = data.index % 3;
    var className = 'cityItem' + index;
    if (rows === currentRow) {
      className = 'cityItemLast'
    }
    return (
      <TouchableOpacity onPress = {() => this.setCityCode(data.item)} style ={styles[className]}>
        <Text style={styles.cityText}>
            {data.item.cn}
        </Text>
    </TouchableOpacity>
    );
  }

  renderHeader(section) {
    return (
      <Text style={styles.cityHeader}>{section.section.title}</Text>
    );
  }

  render() {
    return (
        <SectionList
          sections={CityData}
          renderItem={this.renderExpenseItem.bind(this)}
          renderSectionHeader={this.renderHeader} 
          contentContainerStyle={styles.cityList}
          stickySectionHeadersEnabled={true}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    flexDirection: 'column',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  cityList: {
    // flex: 1,
    flexDirection: 'row',
    flexWrap:  'wrap'
  },
  cityHeader: {
    width: ScreenWidth,
    height: 20,
    lineHeight: 20,
    paddingLeft: 5,
    color: '#a7a7a7',
    backgroundColor: '#eeeeee'
  },
  cityItem0: {
    width: (ScreenWidth - 1) / 3,
    height: 40,
    justifyContent: 'center', 
    alignItems: 'center',
    borderColor:'#eeeef0',
    borderBottomWidth: 1,
    borderRightWidth: 1
  },
  cityItem1: {
    width: (ScreenWidth - 1) / 3,
    height: 40,
    justifyContent: 'center', 
    alignItems: 'center',
    borderColor:'#eeeef0',
    borderBottomWidth: 1,
    borderRightWidth: 1
  },
  cityItem2: {
    width: (ScreenWidth - 1) / 3,
    height: 40,
    justifyContent: 'center', 
    alignItems: 'center',
    borderColor:'#eeeef0',
    borderBottomWidth: 1
  },
  cityItemLast: {
    width: (ScreenWidth - 1) / 3,
    height: 40,
    justifyContent: 'center', 
    alignItems: 'center',
    borderColor:'#eeeef0',
    borderRightWidth: 1
  },
  cityText: {
  }
});
// AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
// AppRegistry.registerComponent('NavigatorProject', () => NavigatorProject);
