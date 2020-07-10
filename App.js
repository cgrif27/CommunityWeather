import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  YellowBox,
  AsyncStorage,
} from "react-native";
import Home from "./screens/homeScreen";
import firebase from "./firebase";
import Post from "./screens/addPost";
import Account from "./screens/Account";
import Vote from "./screens/Vote";
import Settings from "./screens/Settings";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { NavigationContainer } from "@react-navigation/native";
import _ from "lodash";
import "react-native-gesture-handler";
import getColor from "./localFunctions/getColor";
import GlobalContext from "./SortingContext";
import { Button } from "react-native-paper";
import { AdMobBanner } from "expo-ads-admob";

YellowBox.ignoreWarnings(["Setting a timer"]);
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};

const db = firebase.firestore();
const Tab = createMaterialBottomTabNavigator();

export default function App() {
  //setting the color of the bar
  const barColor = getColor();
  let hourTime = new Date().getHours();

  AsyncStorage.getItem("captionType").then((result) => {
    if (result == null) {
      AsyncStorage.setItem("captionType", "random").then(() =>
        console.log("Caption type set")
      );
    }
  });

  return (
    <React.Fragment>
      <GlobalContext>
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName="Home"
            activeColor="white"
            barStyle={{ backgroundColor: barColor }}
          >
            <Tab.Screen
              name="Home"
              component={Home}
              options={{
                tabBarLabel: "Home",
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="home" color={color} size={26} />
                ),
              }}
            />

            <Tab.Screen
              name="Vote"
              component={Vote}
              options={{
                tabBarLabel: "Vote",

                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="vote" color={color} size={26} />
                ),
              }}
            />
            <Tab.Screen
              name="Posts"
              component={Post}
              options={{
                tabBarLabel: "Add Caption",
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons
                    name="plus-circle"
                    color={color}
                    size={26}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Account"
              component={Account}
              options={{
                tabBarLabel: "Account",

                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons
                    name="account"
                    color={color}
                    size={26}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Settings"
              component={Settings}
              options={{
                tabBarLabel: "Settings",

                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons
                    name="settings"
                    color={color}
                    size={26}
                  />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </GlobalContext>
      {/* <AdMobBanner
        bannerSize="smartBannerPortrait"
        adUnitID="ca-app-pub-3940256099942544/6300978111"
        onDidFailToReceiveAdWithError={(e) => alert(e)}
      /> */}
    </React.Fragment>
  );
}

const styles = StyleSheet.create({});
