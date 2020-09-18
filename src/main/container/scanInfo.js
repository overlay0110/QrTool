import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Clipboard,
  BackHandler,
  View,
} from 'react-native';
import { Button, Text, Container, Card, CardItem, Body, Content, Root, Toast, Icon, Grid, Col, Row, Radio  } from "native-base";
import CHeader from "../component/Header";
import styles from "../assets/css/CustomCss";
import Share from 'react-native-share';
import {handleAndroidBackButton, removeAndroidBackButtonHandler} from "../component/BackButtonEvent";
import Modal from "react-native-modal";

import RNFetchBlob from "rn-fetch-blob";
const fs = RNFetchBlob.fs;
let imagePath = null;
import { baseQrUrl, customAlert } from "../helpers";

export default class App extends Component {

    _didFocusSubscription;
    _willBlurSubscription;

    constructor(props){
        super(props);

        let { scanData } = this.props.navigation.state.params;
        this.state = {
            scanData : scanData,
            isModalVisible : false,
            shareStat : 'Image',
        }

        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton2)
        );
    }

    componentDidMount(){
        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
          BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton2)
        );
    }

    componentWillUnmount() {
        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();
    }

    handleBackButton2 = () => {
        console.log('handleBackButton2');
        removeAndroidBackButtonHandler();
        this.props.navigation.navigate("QrScan");
        return true;
    }

    _copy(){
        let { scanData } = this.props.navigation.state.params;

        Clipboard.setString(scanData);
        console.log('copy');

        Toast.show({
            text: 'Copied to Clipboard!',
            buttonText: 'Okay',
            type: "success"
        });
    }

    checkUrlForm(strUrl) {
        var expUrl = /^http[s]?\:\/\//i;
        return expUrl.test(strUrl);
    }


    _goSite(e){
        let { scanData } = this.props.navigation.state.params;

        if(!this.checkUrlForm(scanData)){
            customAlert('It is not in url format.');
            return false;
        }

        console.log('_goSite');
        Linking
          .openURL(scanData)
          .catch(err => console.error('An error occured', err));
    }

    _search(){
        let { scanData } = this.props.navigation.state.params;
        let base = 'https://www.google.com/search?q=';
        console.log('_search');

        Linking
          .openURL(base + scanData)
          .catch(err => console.error('An error occured', err));
    }

    _share(){
        let { scanData, shareStat } = this.state;

        if(shareStat == 'Image'){
            RNFetchBlob.config({
                fileCache: true
            })
            .fetch("GET", baseQrUrl() + scanData)
            // the image is now dowloaded to device's storage
            .then(resp => {
                // the image path you can use it directly with Image component
                imagePath = resp.path();
                return resp.readFile("base64");
            })
            .then(base64Data => {
                // here's base64 encoded image
                console.log(base64Data);

                const options = {
                    title: 'Share',
                    url : 'data:image/png;base64,' + base64Data,
                };
                Share.open(options)
                    .then((res) => { console.log(res) })
                    .catch((err) => { err && console.log(err); });

                // remove the file from storage
                return fs1.unlink(imagePath);
            });
        }
        else{
            const options = {
                title: 'Share',
                url : scanData,
            };
            Share.open(options)
                .then((res) => { console.log(res) })
                .catch((err) => { err && console.log(err); });
        }
    }

    render() {
        let { scanData } = this.props.navigation.state.params;
        let { shareStat } = this.state;

        let value = 25;

        return (
            <Root>
            <Container>
                <CHeader navigation={this.props.navigation} />
                <Content style={{padding: 15, backgroundColor: '#f8f9fc'}}>

                <Card style={{flex: 0, borderRadius: value, }}>
                    <CardItem style={{borderTopLeftRadius: value, borderTopRightRadius: value}}>
                      <Body style={{justifyContent: 'center',alignItems: 'center'}}>
                          <Card style={{width: '100%'}}>
                              <CardItem>
                                  <Body style={styles.cardh}>
                                      <Text>
                                        {scanData}
                                      </Text>
                                  </Body>
                              </CardItem>
                          </Card>
                      </Body>
                    </CardItem>
                    <CardItem style={{flexDirection: 'column', borderBottomLeftRadius: value, borderBottomRightRadius: value }}>

                      <Body style={{flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}}>
                        <Button full rounded success iconLeft style={{width: 160, }} onPress={this._copy.bind(this)}>
                          <Icon type="FontAwesome5" name="copy" style={{margin:0}}/>
                          <Text style={{padding: 0}}>Copy</Text>
                        </Button>


                          <Button full rounded success iconLeft style={{width: 160,marginLeft: 15}} onPress={this._goSite.bind(this)}>
                            <Icon type="FontAwesome5" name="link" />
                            <Text>Web site</Text>
                          </Button>
                      </Body>

                      <Body style={{flexDirection: 'row',justifyContent: 'center',alignItems: 'center', marginTop: 15}}>
                        <Button full rounded success iconLeft style={{width: 160, }} onPress={this._search.bind(this)}>
                          <Icon type="FontAwesome5" name="globe" style={{margin:0}}/>
                          <Text style={{padding: 0}}>Browse search</Text>
                        </Button>


                          <Button full rounded success iconLeft style={{width: 160,marginLeft: 20}} onPress={this._share.bind(this)}>
                            <Icon name="share" />
                            <Text>Share</Text>
                          </Button>
                      </Body>

                      <Body style={{flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}}>
                        <Button transparent textStyle={{color: '#87838B'}} style={{width: 100,}} onPress={()=>this.setState({shareStat : "Image"})}>
                        <Radio
                          color={"#87838B"}
                          selectedColor={"#5cb85c"}
                          selected={shareStat=='Image'?true:false}
                          onPress={()=>this.setState({shareStat : "Image"})}
                        />
                          <Text>Image</Text>
                        </Button>


                          <Button transparent textStyle={{color: '#87838B'}} style={{width: 100,}} onPress={()=>this.setState({shareStat : "Text"})}>
                          <Radio
                            color={"#87838B"}
                            selectedColor={"#5cb85c"}
                            selected={false}
                            selected={shareStat == "Text"? true : false}
                            onPress={()=>this.setState({shareStat : "Text"})}
                          />
                            <Text>Text</Text>
                          </Button>
                      </Body>


                    </CardItem>
                  </Card>

                </Content>
            </Container>
            </Root>
        );
    }
}
