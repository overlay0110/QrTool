import React, { Component } from "react";
import QrScan from "./container/qrScan";
import ScanInfo from "./container/scanInfo";
import Create from "./container/create";
import Decode from "./container/decode";
import { createBottomTabNavigator, createAppContainer  } from "react-navigation";
import { Button, Text, Icon, Footer, FooterTab, StyleProvider } from "native-base";
import getTheme from './assets/baseCustome/components';
import material from './assets/baseCustome/variables/material';

const MainScreenNavigator = createBottomTabNavigator(
    {
        QrScan: { screen: QrScan },
        Create: { screen: Create },
        Decode: { screen: Decode },
        ScanInfo: { screen: ScanInfo }
    },
    {
    initialRouteName: 'QrScan',
      tabBarPosition: "bottom",
      tabBarComponent: props => {
        return (
            <StyleProvider style={getTheme(material)}>
          <Footer>
            <FooterTab>
              <Button
                vertical
                active={props.navigation.state.index === 0}
                onPress={() => props.navigation.navigate("QrScan")}>
                <Icon name="camera" />
                <Text>Scanner</Text>
              </Button>
              <Button
                vertical
                active={props.navigation.state.index === 1}
                onPress={() => props.navigation.navigate("Create")}>
                <Icon type="FontAwesome5" name="save" />
                <Text>Create</Text>
              </Button>
              <Button
                vertical
                active={props.navigation.state.index === 2}
                onPress={() => props.navigation.navigate("Decode")}>
                <Icon type="FontAwesome5" name="search" />
                <Text>Decode</Text>
              </Button>
            </FooterTab>
          </Footer>
          </StyleProvider>
        );
      }
    }
);

export default createAppContainer(MainScreenNavigator);
