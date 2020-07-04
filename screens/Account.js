import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  StatusBar,
  ScrollView,
} from "react-native";

import getColor from "../localFunctions/getColor";
import {
  useFonts,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_500Medium,
} from "@expo-google-fonts/inter";
import AppLoading from "../screens/loadingScreen";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Login from "../components/Login";
import Register from "../components/Register";
import { color } from "react-native-reanimated";
import AccountSettings from "./stacks/Stack";
import firebase from "../firebase";

const Tab = createMaterialTopTabNavigator();

export default function Account() {
  const [signedIn, setSignedIn] = useState(false);

  let [fontsLoaded] = useFonts({
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_500Medium,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  firebase.auth().onAuthStateChanged((user) => {
    //setting if a user is logged in
    if (user) {
      setSignedIn(true);
    } else {
      setSignedIn(false);
    }
  });

  if (signedIn) {
    return <AccountSettings />;
  } else {
    return (
      <React.Fragment>
        <View style={styles.topBar} />
        <Tab.Navigator
          style={styles.container}
          tabBarOptions={{
            labelStyle: { fontSize: 12 },
            activeTintColor: "white",
            style: {
              backgroundColor: getColor(),
            },
            indicatorStyle: {
              backgroundColor: "white",
            },
          }}
        >
          <Tab.Screen name="Login" component={Login} />
          <Tab.Screen name="Sign Up" component={Register} />
        </Tab.Navigator>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  topBar: {
    height: StatusBar.currentHeight,
  },
  container: {
    width: "100%",
    justifyContent: "center",
  },
  loginText: {
    color: "white",
    fontSize: 20,
    fontFamily: "Inter_200ExtraLight",
  },
  textBox: {
    marginTop: 20,
  },
  inputText: {
    fontFamily: "Inter_300Light",
    color: getColor(),
  },
});
