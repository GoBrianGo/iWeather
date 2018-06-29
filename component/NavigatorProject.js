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
  Easing,
  Animated,
  Modal,
  View
} from 'react-native';

import CityChoose from './CityChoose';

var animationState = 0;// 0 : stop, 1: start
const ChineseDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
const EnDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const EnMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
const weatherState = {
  '100': {
    'text': '晴',
    'english': 'sunny'
  },
  '101': {
    'text': '多云',
    'english': 'cloudy' 
  },
  '102': {
    'text': '少云',
    'english': 'cloudy' 
  },

}

let judegWeatherState = (code) => {
  if (code == '100') {
    return 'sunny';
  }
  if (code > 100 && code < 200) {
    return 'cloudy';
  }
  if (code >= 200 && code < 300) {
    return 'windy';
  }
  if (code >= 300 && code < 400) {
    return 'rainy';
  }
}

let getCorrectWeatherImg = (state) => {
  if (state === 'sunny') {
    return require('./images/sunny.png');
  }

  if (state === 'cloudy') {
    return require('./images/cloudy.png');
  }

  if (state === 'rainy') {
    return require('./images/rainy.png');
  }

  return require('./images/sunny.png');
}

let getCorrectWeatherBg = (state) => {
  if (state === 'sunny') {
    return require('./images/sunny_bg.jpg');
  }

  if (state === 'cloudy') {
    return require('./images/cloudy_bg.jpg');
  }

  if (state === 'rainy') {
    return require('./images/rainy_bg.jpg');
  }

  return require('./images/sunny_bg.jpg');
}

export default class NavigatorProject extends Component {
  async getWeatherMsg(cityCode) {
    try {
      // 注意这里的await语句，其所在的函数必须有async关键字声明
      let response = await fetch('https://free-api.heweather.com/v5/now?city=' + cityCode + '&key=1fd81fa305a444ad97c1e58a5291c405');
      let responseJson = await response.json();
      this.setState({msg: responseJson});
      console.log(responseJson);
      this.getFurtureWeatherMsg(cityCode);
    } catch(error) {
      console.error(error);
    }
  }

  async getFurtureWeatherMsg(cityCode) {
    try {
      // 注意这里的await语句，其所在的函数必须有async关键字声明
      let response = await fetch('https://free-api.heweather.com/v5/forecast?city=' + cityCode + '&key=1fd81fa305a444ad97c1e58a5291c405');
      let responseJson = await response.json();
      this.setState({furtureMsg: responseJson});
      setTimeout(() => {
        animationState = 0;
        this.setState({containerShow: 1});
        this.setState({freshImage: require('./images/refresh.png')});
      }, 300);
      console.log(responseJson);
    } catch(error) {
      console.error(error);
    }
  }

  goChooseCity () {
    this.props.navigator.push({
      title: '选择城市',
      component: CityChoose,
      params: {
          getCityCode: (data) => {
            this.state.cityData = data;
            this.getWeatherByCity();
          }
      }
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      cityData: {
        key: '6-0',
        cn: '广州',
        en: 'guangzhou',
        code: 'CN101280101'
      }, 
      msg: '', 
      furtureMsg: '',
      containerShow: 0,
      spinValue: new Animated.Value(0),
      freshImage: require('./images/loading.png'),
      currentWeatherImg: require('./images/sunny.png'),
      currentWeatherBg: require('./images/sunny_bg.jpg')
    };

  }

  startRotate() {
    this.state.spinValue.setValue(0);
    Animated.timing(
      this.state.spinValue,
      {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear
      }
    ).start(() => {
      animationState ? this.startRotate() : '';
    })
  }

  getWeatherByCity () {
    let cityCode = this.state.cityData.code;
    this.state.freshImage = require('./images/loading.png');
    animationState = 1;
    this.startRotate();
    this.getWeatherMsg(cityCode);
  }

  componentDidMount() {
    // alert('load finish');
    this.getWeatherByCity();
  }

  render() {
    let freshImage = this.state.freshImage;
    let city = this.state.cityData.cn;
    let day = ChineseDay[new Date().getDay()];
    let date = new Date().getDate();
    let enDay = EnDay[new Date().getDay()];
    let enMonth = EnMonth[new Date().getMonth()]
    let tmp = this.state.msg ? this.state.msg.HeWeather5[0].now.tmp : '';
    let dir = this.state.msg ? this.state.msg.HeWeather5[0].now.wind.dir : '';
    let sc = this.state.msg ? this.state.msg.HeWeather5[0].now.wind.sc : '';
    let state = this.state.msg ? judegWeatherState(this.state.msg.HeWeather5[0].now.cond.code) : '';
    let currentWeatherImg = this.state.msg ? getCorrectWeatherImg(state) : this.state.currentWeatherImg;
    let currentWeatherBg = this.state.msg ? getCorrectWeatherBg(state) : this.state.currentWeatherBg;
    let furtureMsg = this.state.furtureMsg ? this.state.furtureMsg.HeWeather5[0].daily_forecast : [];
    let containerShow = this.state.containerShow;
    var content = '';
    var weatherList = [];

    for (let i = 0; i < furtureMsg.length; i++) {
      let msg = furtureMsg[i];
      let _day = ChineseDay[new Date(msg.date).getDay()];
      let _state = judegWeatherState(msg.cond.code_d);
      let _currentWeatherImg = getCorrectWeatherImg(_state);
      let _tmpMin = msg.tmp.min;
      let _tmpMax = msg.tmp.max;
      msg.key = i;
      weatherList.push(
        <View style={styles.weatherList} key = {i}>
            <Text>
            {_day}
            </Text>
            <Image
              style={styles.weatherListIcon}
              source={_currentWeatherImg}/>
            <Text>{_tmpMin}-{_tmpMax}°C</Text>
          </View>
        );
    }

    return (
      <Image
          style={styles.bgImg}
          source={currentWeatherBg}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={this.goChooseCity.bind(this)} style = {styles.textTouchableStyle} >
              <Text style = {styles.chooseCityBtn} >[更换]</Text>
            </TouchableOpacity>
            <View style = {styles.btnWrapper}>
              <TouchableOpacity onPress={this.getWeatherByCity.bind(this)}>
                <Animated.Image                      // 可动画化的视图组件>
                    style={[styles.refreshIcon, {transform: [{  
                        rotate: this.state.spinValue.interpolate({  
                         inputRange: [0, 1],  
                         outputRange: ['0deg', '360deg']  
                        })
                      }]}
                    ]}
                    source={freshImage}/>
              </TouchableOpacity>
            </View>
          </View>
          <View style = {{flex: 1, opacity: containerShow}}>
            <View style={styles.contentTop}>
              <Text>
               {city}<Text style={styles.day}>{day}</Text>
              </Text>
              <Text style={styles.date}>
               {enDay} {enMonth} {date}
              </Text>
            </View>
            <View style={styles.contentMiddle}>
              <Image
                style={styles.icon}
                source={currentWeatherImg}/>
              <Text style={styles.currentTmp}>{tmp}<Text style={styles.currentTmpUnit}>°C</Text></Text>
              <Text>{dir} 风力{sc}级</Text>
              <Text>A {state} day</Text>
            </View>
            <View style={styles.contentBottom}>
              {weatherList}
            </View>
          </View>
        </View>
      </Image>
    );
  }
}

const styles = StyleSheet.create({
  bgImg: {
    flex: 1,
    width: undefined, 
    height: undefined
  },
  textTouchableStyle: {
  },
  chooseCityBtn: {
    color: '#ffffff',
    width: 50,
    height: 30,
    lineHeight: 30,
    fontSize: 16,
    marginLeft: 5,
    textAlign: 'center',
    alignSelf: 'flex-start'
  },
  btnWrapper: {
    flex: 1
  },
  refreshIcon: {
    width: 24,
    height: 24,
    marginTop: 6,
    marginRight: 5,
    alignSelf: 'flex-end'
  },
  container: {
    flex: 1, 
    flexDirection: 'column',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  header: {
    marginTop: 20,
    flexDirection: 'row'
  },
  contentTop: {
    alignItems: 'center',
    marginTop: 20
  },
  contentMiddle: {
    alignItems: 'center',
    marginTop: 50
  },
  contentBottom: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  weatherList: {
    flex: 1,
    alignItems: 'center'
  },
  currentTmp: {
    fontSize: 50
  },
  currentTmpUnit: {
    fontSize: 16
  },
  weatherListIcon: {
    width: 50,
    height: 50
  },
  day: {
    fontSize: 10
  },
  date: {
    marginTop: 5
  }
});
// AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
// AppRegistry.registerComponent('NavigatorProject', () => NavigatorProject);
