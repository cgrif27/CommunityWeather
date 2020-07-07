import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function loadingScreen({ image }) {
  return (
    <ImageBackground
      style={styles.background}
      source={{
        uri: image,
      }}
    >
      <View style={styles.loadingView}>
        <ActivityIndicator
          size="large"
          style={styles.loadingIndicator}
          color="white"
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    height: Dimensions.get("screen").height,
  },
  loadingIndicator: {
    justifyContent: "center",
  },
  loadingView: {
    flex: 1,
    justifyContent: "center",
  },
});
