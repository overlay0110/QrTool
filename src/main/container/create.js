import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  Keyboard,
  View,
  Alert,
  Platform
} from 'react-native';
import CHeader from "../component/Header";
import { Button, Text, Container, Content, Textarea, Item, Form, Icon, Body, Left, Thumbnail, Radio, ListItem, Right, Root, Toast, Card, CardItem, StyleProvider, Input, Label } from "native-base";
import Modal from "react-native-modal";
import Share from 'react-native-share';
import RNFetchBlob from "rn-fetch-blob";
const fs1 = RNFetchBlob.fs;
var RNFS = require('react-native-fs');
let imagePath = null;
import { getTimeStamp, baseQrUrl, customAlert } from "../helpers";
import getTheme from '../assets/baseCustome/components';
import material from '../assets/baseCustome/variables/material';

export default class Create extends Component {

    constructor(props){
        super(props);
        this.state = {
            text : '',
            qrcode : false,
            qrurl : baseQrUrl() + 'sample',
            isModalVisible : false,
            downloadStart : false,
            shareStat : 'Image',
            sizeStat : '300',
            cwidth : '300',
            cheight : '300',

        }
    }

    componentDidMount(){

    }

    componentWillUnmount() {
    }

    create(){
        let {text, sizeStat, cwidth, cheight} = this.state;
        let size='300x300';

        if(text.trim().length == 0){
            return false;
        }

        if(sizeStat == '100'){
            size = sizeStat+'x'+sizeStat;
        }
        else if(sizeStat == '200'){
            size = sizeStat+'x'+sizeStat;
        }
        else if(sizeStat == '300'){
            size = sizeStat+'x'+sizeStat;
        }
        else if(sizeStat == '400'){
            size = sizeStat+'x'+sizeStat;
        }
        else if(sizeStat == '500'){
            size = sizeStat+'x'+sizeStat;
        }
        else if(sizeStat == 'etc'){
            if(cwidth > 500){
                customAlert('The width cannot exceed 500.');
                return false;
            }

            if(cheight > 500){
                customAlert('hight cannot exceed 500.');
                return false;
            }

            size = cwidth+'x'+cheight;
        }

        Keyboard.dismiss();

        this.setState({ qrcode: true, qrurl : baseQrUrl(size) + text });
    }

    save(){
        let { text, sizeStat, cwidth, cheight } = this.state;
        let size='300x300';

        if(sizeStat == '100'){
            size = sizeStat+'x'+sizeStat;
        }
        else if(sizeStat == '200'){
            size = sizeStat+'x'+sizeStat;
        }
        else if(sizeStat == '300'){
            size = sizeStat+'x'+sizeStat;
        }
        else if(sizeStat == '400'){
            size = sizeStat+'x'+sizeStat;
        }
        else if(sizeStat == '500'){
            size = sizeStat+'x'+sizeStat;
        }
        else if(sizeStat == 'etc'){
            if(cwidth > 500){
                customAlert('The width cannot exceed 500.');
                return false;
            }

            if(cheight > 500){
                customAlert('hight cannot exceed 500.');
                return false;
            }

            size = cwidth+'x'+cheight;
        }

        this._FileDownload(baseQrUrl(size) + text);
    }

    // ios 파일 다운로드 함수
    _FileDownload(url){
        var input = {
            url : url
        };

        let date = getTimeStamp();
        date = date.replace(/\s/gi, "_").replace(':','_').replace(':','_');

        let fileName = date+'_QRcode_Qrtool.png';

        //check if have another download
        if (this.state.downloadStart == true) {
            return;
        } else {
            this.setState({ downloadStart: true });
        }

        let directoryFile = '';


        if(Platform.OS == 'ios'){
            directoryFile = RNFS.DocumentDirectoryPath  + '/Download/';
        }
        else{
            directoryFile = RNFS.ExternalStorageDirectoryPath  + '/QrTool/Download/';
        }

        //Creating folder
        if (!RNFS.exists(directoryFile)) {

            RNFS.unlink(directoryFile)
            .then(() => {
                console.log('FOLDER/FILE DELETED');
            })
            // `unlink` will throw an error, if the item to unlink does not exist
            .catch((err) => {
                console.log('CANT DELETE', err.message);
                this.setState({ showError: true })
            });

            RNFS.mkdir(directoryFile)
        }

        //If folder is created
        //Verifing if the url have a .zip file
        const urlDownload = input.url;
        console.log('urlDownload', urlDownload);

        //Downloading the file on a folder
        let dirs = directoryFile + '/' + fileName;
        RNFetchBlob
        .config({
            // response data will be saved to this path if it has access right.
            path: dirs
        })
        .fetch('GET', urlDownload, {
            //some headers ..
        })
        .progress((received, total) => {
            var per = parseInt((received / total) * 100);

            Toast.show({
                text: "Downloading... "+per+"%" ,
                type: "danger"
            });
            console.log('progress', per );
        })
        .then((res) => {
            // the path should be dirs.DocumentDir + 'path-to-file.anything'
            console.log('The file saved to ', res.path());

            Toast.show({
                text: "Download Success",
                buttonText: "Okay",
                type: "success"
            });

            //Acabou o download do arquivo
            this.setState({
                downloadStart: false, showModalLoading: false,
                showFileExplorer: true, startFolder: directoryFile,
            });

        })
        .catch((errorMessage, statusCode) => {
            //Acabou o download do arquivo
            this.setState({
                downloadStart: false, showModalLoading: false,
                showFileExplorer: true, startFolder: directoryFile,
            });

            Alert.alert(
                "Error",
                "There was a problem downloading.",
                [
                    {
                        text: "OK",
                    }
                ],
                {cancelable: false},
            );
            console.log('error : ', errorMessage);
            // error handling
        });
    }

    _share(){
        let { text, shareStat } = this.state;

        if(shareStat == 'Image'){
            RNFetchBlob.config({
                fileCache: true
            })
            .fetch("GET", baseQrUrl() + text)
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
                url : text,
            };
            Share.open(options)
                .then((res) => { console.log(res) })
                .catch((err) => { err && console.log(err); });
        }

    }


    render() {
        let {qrcode, qrurl, shareStat, sizeStat, cwidth, cheight} = this.state;
        let qrview = null;

        let value = 25;

        return (
            <Container>
                <Root>
                <CHeader />
                <StyleProvider style={getTheme(material)}>
                <Content style={{padding: 15, backgroundColor: '#f8f9fc'}} >
                <Card style={{flex: 0, borderRadius: value, }}>
                    <CardItem style={{borderTopLeftRadius: value, borderTopRightRadius: value}}>
                      <Body style={{justifyContent: 'center',alignItems: 'center'}}>
                        <Image source={{ uri : qrurl}} style={{height: 150, width: 150, flex: 1}} />
                      </Body>
                    </CardItem>
                    <CardItem style={{flexDirection: 'column', borderBottomLeftRadius: value, borderBottomRightRadius: value }}>

                      <Body style={{flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}}>
                        <Button transparent textStyle={{color: '#87838B'}} style={{width: 100,}} onPress={this._share.bind(this)}>
                          <Icon name="share" />
                          <Text>Share</Text>
                        </Button>


                          <Button transparent textStyle={{color: '#87838B'}} style={{width: 100,}} onPress={this.save.bind(this)}>
                            <Icon type="FontAwesome5" name="save" />
                            <Text>Save</Text>
                          </Button>
                      </Body>

                      <Body style={{flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}}>
                        <Button transparent textStyle={{color: '#87838B'}} style={{width: 100,}} onPress={()=>this.setState({shareStat : "Image"})}>
                        <Radio
                          color={"#87838B"}
                          selectedColor={"#5cb85c"}
                          selected={shareStat == 'Image'? true : false}
                          onPress={()=>this.setState({shareStat : "Image"})}
                        />
                          <Text>Image</Text>
                        </Button>


                          <Button transparent textStyle={{color: '#87838B'}} style={{width: 100,}} onPress={()=>this.setState({shareStat : "Text"})}>
                          <Radio
                            color={"#87838B"}
                            selectedColor={"#5cb85c"}
                            selected={shareStat == "Text"? true : false}
                            onPress={()=>this.setState({shareStat : "Text"})}
                          />
                            <Text>Text</Text>
                          </Button>
                      </Body>

                    </CardItem>
                  </Card>



                  <Card style={{flex: 0, borderRadius: value, marginTop: 15}}>
                      <CardItem style={{borderTopLeftRadius: value, borderTopRightRadius: value}}>
                      <Textarea rowSpan={5} bordered placeholder="Please enter your details" onChangeText={(text) => this.setState({text})} value={this.state.text} style={{width: '100%'}}/>

                      </CardItem>
                      <CardItem style={{flexDirection: 'column', borderBottomLeftRadius: value, borderBottomRightRadius: value }}>

                        <Right>
                        <Button full rounded success onPress={this.create.bind(this)}>
                            <Text>CREATE</Text>
                        </Button>
                        </Right>

                      </CardItem>
                    </Card>

                    <Card style={{flex: 0, borderRadius: value, marginTop: 15 }}>
                        <CardItem style={{borderTopLeftRadius: value, borderTopRightRadius: value, flexDirection: 'column'}}>
                        <Body>

                            <Button transparent textStyle={{color: '#87838B'}} style={{width: 120,}} onPress={()=>this.setState({sizeStat : "100"})}>
                            <Radio
                              color={"#87838B"}
                              selectedColor={"#5cb85c"}
                              selected={sizeStat == '100'? true: false}
                              onPress={()=>this.setState({sizeStat : "100"})}
                            />
                              <Text>100 X 100</Text>
                            </Button>
                        </Body>
                        <Body>

                            <Button transparent textStyle={{color: '#87838B'}} style={{width: 120,}} onPress={()=>this.setState({sizeStat : "200"})}>
                            <Radio
                              color={"#87838B"}
                              selectedColor={"#5cb85c"}
                              selected={sizeStat == '200'? true: false}
                              onPress={()=>this.setState({sizeStat : "200"})}
                            />
                              <Text>200 X 200</Text>
                            </Button>
                        </Body>
                        <Body>

                            <Button transparent textStyle={{color: '#87838B'}} style={{width: 120,}} onPress={()=>this.setState({sizeStat : "300"})}>
                            <Radio
                              color={"#87838B"}
                              selectedColor={"#5cb85c"}
                              selected={sizeStat == '300'? true: false}
                              onPress={()=>this.setState({sizeStat : "300"})}
                            />
                              <Text>300 X 300</Text>
                            </Button>
                        </Body>
                        <Body>

                            <Button transparent textStyle={{color: '#87838B'}} style={{width: 120,}} onPress={()=>this.setState({sizeStat : "400"})}>
                            <Radio
                              color={"#87838B"}
                              selectedColor={"#5cb85c"}
                              selected={sizeStat == '400'? true: false}
                              onPress={()=>this.setState({sizeStat : "400"})}
                            />
                              <Text>400 X 400</Text>
                            </Button>
                        </Body>
                        <Body>

                            <Button transparent textStyle={{color: '#87838B'}} style={{width: 120,}} onPress={()=>this.setState({sizeStat : "500"})}>
                            <Radio
                              color={"#87838B"}
                              selectedColor={"#5cb85c"}
                              selected={sizeStat == '500'? true: false}
                              onPress={()=>this.setState({sizeStat : "500"})}
                            />
                              <Text>500 X 500</Text>
                            </Button>

                        </Body>

                        <Body style={{flexDirection: 'row'}}>

                            <Button transparent textStyle={{color: '#87838B'}} style={{width: 80,}} onPress={()=>this.setState({sizeStat : "etc"})}>
                            <Radio
                              color={"#87838B"}
                              selectedColor={"#5cb85c"}
                              selected={sizeStat == 'etc'? true: false}
                              onPress={()=>this.setState({sizeStat : "etc"})}
                            />
                              <Text>ETC</Text>
                            </Button>
                            <Item fixedLabel style={{width: 100}}>
                              <Input onChangeText={cwidth => this.setState({cwidth})} value={this.state.cwidth} keyboardType={'numeric'} editable = {sizeStat == 'etc'? true: false} maxLength={3}/>
                            </Item>
                            <Text style={{color: '#87838B', marginTop: 15}}>X</Text>
                            <Item fixedLabel style={{width: 100}}>
                              <Input onChangeText={cheight => this.setState({cheight})} value={this.state.cheight} keyboardType={'numeric'} editable = {sizeStat == 'etc'? true: false} maxLength={3}/>
                            </Item>
                        </Body>


                        </CardItem>
                        <CardItem style={{flexDirection: 'column', borderBottomLeftRadius: value, borderBottomRightRadius: value }}>
                        </CardItem>
                      </Card>




                  <View style={{height: 30}}>
                  </View>


                </Content>
                </StyleProvider>
                </Root>
            </Container>
        );
    }
}
