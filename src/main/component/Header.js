import React from "react";
import {TouchableOpacity, Image, StyleSheet, StatusBar, Text, View, Platform} from "react-native";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem, StyleProvider } from "native-base";
import getTheme from '../assets/baseCustome/components';
import material from '../assets/baseCustome/variables/material';
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from "react-native-status-bar-height";
import { isIphoneX, getBottomSpace } from "react-native-iphone-x-helper";

// 아이폰 상단바 높이 설정
const Height = () => {
    if (isIphoneX()) {
        return getBottomSpace();
    } else {
        return getStatusBarHeight(true);
    }
};

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? Height() : 20;

export default class LayoutHeader extends React.Component {
    render() {
          let {navigation, lightPress, lightstate} = this.props;
          let button = (
              <Image
                    style={{height:50,width:50}}
                  source={require('../assets/img/Icon_add.png')}
              />
          );
          let color = {color : 'gray'};

          if(lightstate){
              color = {color : '#fff'};
          }

          let light = (
              <Button transparent onPress={lightPress}>
                  <Icon name="bolt" type="FontAwesome5" style={color} />
              </Button>
          );

          if(navigation != null || navigation != undefined){
              button = (
                  <TouchableOpacity onPress={() => this.props.navigation.navigate("QrScan")} style={{height:50,width:50}}>
                      <Icon name="arrow-back" style={{color : '#fff', paddingLeft: 15, paddingTop: 10}}/>
                  </TouchableOpacity>
              )
          }

          if(lightPress == undefined || lightPress == null){
              light = null;
          }

        return (
            <View>
            <LinearGradient colors={['#6eca7a', '#b7f1cf']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.statbar}>
                <StatusBar translucent={true} backgroundColor={'transparent'} />
            </LinearGradient>
            <LinearGradient colors={['#6eca7a', '#b7f1cf']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.linearGradient}>
                <View style={styles.header_item}>
                  <Left>
                    {button}
                  </Left>
                  <Body>
                    <Title>QR Tool</Title>
                  </Body>
                  <Right>
                      {light}
                  </Right>
                 </View>
            </LinearGradient>
            </View>
        );
    }
}

// Later on in your styles..
var styles = StyleSheet.create({
    statbar : {
        height : STATUS_BAR_HEIGHT,
    },
  linearGradient: {
    height : 56,
    width:'100%',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  header_item : {
      paddingTop : 5,
      flexDirection: 'row',
  },

});
