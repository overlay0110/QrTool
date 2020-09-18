import React, {Component} from 'react';
import {
    View,
    Image,
    Text,
    StatusBar,
} from 'react-native';
import Screen from "./src/main/index";
import LinearGradient from 'react-native-linear-gradient';

// 하단 노란 박스 안나오게 하기
console.disableYellowBox = true;

export default class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            homeScreen : true,
        }
    }

    componentDidMount(){
        setTimeout(() => this.setState({ homeScreen: false }), 1500);
    }

    componentWillUnmount() {
    }


    render() {
        let {homeScreen} = this.state;

        if(homeScreen){
            return (
                <View>
                    <StatusBar translucent={true} backgroundColor={'transparent'} />
                    <Image
                        style={{height:'100%',width:'100%'}}
                        source={require('./src/main/assets/img/1.png')}
                    />
                </View>
            );
        }
        else{
            return (
                <Screen />
            );
        }


    }
}
