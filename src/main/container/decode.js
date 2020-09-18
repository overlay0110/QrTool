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
  Platform,
} from 'react-native';
import CHeader from "../component/Header";
import { Button, Text, Container, Content, Textarea, Item, Form, Icon, Body, Left, Thumbnail, Radio, ListItem, Right, Root, Toast, Card, CardItem } from "native-base";
import FilePickerManager from 'react-native-file-picker';
import DocumentPicker from 'react-native-document-picker';
import { customAlert, isExist } from "../helpers";

export default class Decode extends Component {

    constructor(props){
        super(props);
        this.state = {
        }
    }

    componentDidMount(){
    }

    componentWillUnmount() {
    }

    componentDidUpdate() {

    }

    qrRead(response){
        return new Promise(function (resolve, reject) {
            let body = new FormData();

            let para = {uri: response.uri,name: 'file.png', filename : Platform.OS != 'ios' ? response.fileName : response.name, type: response.type};
            // para = {uri: response.base64,name: 'file.png', filename : response.name, type: response.type};
            console.log(para);

            body.append('file', para);
            body.append('Content-Type', 'image/png');

            fetch('http://api.qrserver.com/v1/read-qr-code/',{ method: 'POST',headers:{
                "Content-Type": "multipart/form-data",
                "otherHeader": "foo",
            } , body :body} )
            .then((res) => res.json())
            .then(json => resolve(json) )
            .catch((e) => { console.log('qrRead_Error',e); resolve('error');});
        });
    }

    async selectOneFile() {
        //Opening Document Picker for selection of one file
        try {
          const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.allFiles],
          });

          console.log(res);

          var checkEx = isExist( res.name, ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG']);

          if(!checkEx){
              customAlert('Extensions can only be JPG, JPEG, or PNG.','Error');
              return false;
          }

          console.log(res.uri.replace('file://', ''));

          let path = res.uri.replace('file://', '');

          res.uri = decodeURIComponent(res.uri);

          this.qrRead(res).then(res => {
              if(res == 'error'){
                  customAlert('QRcode Decode fail!!','Error');
                  return false;
              }

              if(res[0].symbol[0].data == null){
                  customAlert('QRcode Decode fail!!','Error');
                  return false;
              }

              this.props.navigation.navigate("ScanInfo",{ scanData: res[0].symbol[0].data });
          });


          //Setting the state to show single file attributes
          // this.setState({ singleFile: res });
        } catch (err) {
          //Handling any exception (If any)
          if (DocumentPicker.isCancel(err)) {
            // console.log('point2');
            //If user canceled the document selection
            alert('Canceled from single doc picker');
          } else {
            //For Unknown Error
            // console.log('point3');
            alert('Unknown Error: ' + JSON.stringify(err));
            throw err;
          }
        }
      }

    decode(){
        FilePickerManager.showFilePicker(null, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled file picker');
            }
            else if (response.error) {
                console.log('FilePickerManager Error: ', response.error);
            }
            else {
                var checkEx = isExist( response.fileName, ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG']);

                if(!checkEx){
                    customAlert('Extensions can only be JPG, JPEG, or PNG.','Error');
                    return false;
                }

                this.qrRead(response).then(res => {
                    if(res == 'error'){
                        customAlert('QRcode Decode fail!!','Error');
                        return false;
                    }

                    if(res[0].symbol[0].data == null){
                        customAlert('QRcode Decode fail!!','Error');
                        return false;
                    }

                    this.props.navigation.navigate("ScanInfo",{ scanData: res[0].symbol[0].data });

                });

            }
        });

    }

    render() {
        let value = 25;
        return (
            <Container>
                <CHeader />
                <Content style={{padding: 15, backgroundColor: '#f8f9fc'}} >

                <Card style={{flex: 0, borderRadius: value, marginTop: 15}}>
                    <CardItem style={{borderTopLeftRadius: value, borderTopRightRadius: value}}>


                    <Card style={{width: '100%', height: 150, backgroundColor: '#6eca7a'}}>
                        <TouchableOpacity onPress={Platform.OS == 'ios' ? this.selectOneFile.bind(this) : this.decode.bind(this)}>
                        <CardItem style={{backgroundColor: '#6eca7a'}}>
                            <Body style={{flexDirection: 'column',justifyContent: 'center',alignItems: 'center'}}>
                                <Icon type="FontAwesome5" name="upload" style={{color: '#fff', width: 100, height: 100, fontSize: 100}} />
                                <Text style={{color: '#fff',marginTop: 10}}>
                                  QR decode Image Select!!
                                </Text>
                            </Body>
                        </CardItem>
                        </TouchableOpacity>
                    </Card>


                    </CardItem>
                    <CardItem style={{flexDirection: 'column', borderBottomLeftRadius: value, borderBottomRightRadius: value }}>

                    </CardItem>
                  </Card>

                </Content>
            </Container>
        );
    }
}

// <Button onPress={Platform.OS == 'ios' ? this.selectOneFile.bind(this) : this.decode.bind(this)}>
//     <Text>decode</Text>
// </Button>
