import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  TouchableOpacity,
  Linking,
  View,
  BackHandler,
  ToastAndroid,
  Dimensions
} from 'react-native';

import { Button, Text, Container } from "native-base";
import QRCodeScanner from 'react-native-qrcode-scanner';
import CHeader from "../component/Header";
import {handleAndroidBackButton, removeAndroidBackButtonHandler} from "../component/BackButtonEvent";
import { getTimeStamp } from "../helpers";
import { RNCamera } from "react-native-camera";


export default class App extends Component {

    _didFocusSubscription;
    _willBlurSubscription;

    constructor(props){
        super(props);
        this.state = {
            unique: '',
            focusedScreen: false,
            flash : false,
        }

        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
        );
    }

    componentDidMount(){
        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
          BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton)
        );

        const { navigation } = this.props;
        navigation.addListener('willFocus', () =>
            this.setState({ focusedScreen: true })
        );
        navigation.addListener('willBlur', () =>
            this.setState({ focusedScreen: false })
        );

    }

    componentWillUnmount() {
        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();
        this.exitApp = false;
    }

    handleBackButton = () => {
        // 2000(2초) 안에 back 버튼을 한번 더 클릭 할 경우 앱 종료
        if (this.exitApp == undefined || !this.exitApp) {
            ToastAndroid.show("Press again to exit.", ToastAndroid.SHORT);
            this.exitApp = true;
            this.timeout = setTimeout(
                () => {
                    this.exitApp = false;
                },
                2000    // 2초
            );
        } else {
            clearTimeout(this.timeout);
            BackHandler.exitApp();  // 앱 종료
        }

        return true;
    }

    onSuccess = (e) => {
        // e.data = 'http://www.google.com';
        this.props.navigation.navigate("ScanInfo",{ scanData: e.data })
    }

    _flash(){
        this.setState({ flash: !this.state.flash })
    }



    render() {
        const { focusedScreen, flash } = this.state;
        const SCREEN_HEIGHT = Dimensions.get("window").height;
        let fmode;

        if(flash){
            fmode = RNCamera.Constants.FlashMode.torch;
        }
        else{
            fmode = RNCamera.Constants.FlashMode.off;
        }
        if (focusedScreen){
            return (
                <Container>
                    <CHeader lightPress={this._flash.bind(this)} lightstate={flash}/>
                    <QRCodeScanner
                      onRead={this.onSuccess.bind(this)}
                      showMarker={true}
                      reacctivate={true}
                      reactivateTimeout={1}
                      fadeIn={false}
                      topViewStyle={{backgroundColor : '#000000'}}
                      bottomViewStyle={{backgroundColor: '#000000'}}
                      flashMode={fmode}
                    />

                </Container>

            );
        } else {
            return <View />;
        }
    }
}



// <QRCodeScanner
//   onRead={this.onSuccess.bind(this)}
//   showMarker={true}
//   reacctivate={true}
//   reactivateTimeout={1}
//   fadeIn={false}
//   topViewStyle={{backgroundColor : '#000000'}}
//   bottomViewStyle={{backgroundColor: '#000000'}}
//   flashMode={fmode}
// />

// <Button onPress={this.onSuccess.bind(this)}>
// <Text>scan</Text>
// </Button>
