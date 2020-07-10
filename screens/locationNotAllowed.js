import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
} from "react-native";
import {
  useFonts,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_500Medium,
} from "@expo-google-fonts/inter";
import { Button } from "react-native-elements";
import LoadingScreen from "../screens/loadingScreen";
import getColor from "../localFunctions/getColor";
import * as IntentLauncher from "expo-intent-launcher";

export default function loadingScreen({ image }) {
  let [fontsLoaded] = useFonts({
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_500Medium,
  });
  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
    <ImageBackground
      style={styles.background}
      source={{
        uri: image,
      }}
    >
      <View style={styles.loadingView}>
        <Text style={styles.header}>Could not Find your Location</Text>
        <Text style={styles.text}>
          Please make sure you have location permissions turned on in order to
          use this application. To do this restart the application and press
          'Allow' when the location prompt appears. If that doesnt work then
          please make sure your device has location services enabled.
        </Text>
        <Text style={styles.text}>
          {"\n"}
          If that doesnt work then please make sure your device has location
          services enabled, you can do this by clicking below.
        </Text>
        <Button
          title="Enable Location Services"
          buttonStyle={{
            width: "100%",
            alignSelf: "center",
            backgroundColor: getColor(),
            borderRadius: 10,
            marginTop: 30,
          }}
          titleStyle={{ fontSize: 20, fontFamily: "Inter_300Light" }}
          onPress={() => {
            IntentLauncher.startActivityAsync(
              IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS
            );
          }}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  loadingIndicator: {
    justifyContent: "center",
  },
  loadingView: {
    justifyContent: "center",
    width: "90%",
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255, 0.8)",
    padding: 20,
    borderRadius: 10,
  },
  header: {
    fontFamily: "Inter_500Medium",
    fontSize: 20,
    textAlign: "center",
    color: "#333",
  },
  text: {
    fontFamily: "Inter_300Light",
    fontSize: 18,
    textAlign: "center",
    width: "90%",
    alignSelf: "center",
    color: "#333",
  },
});
