import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
} from "react-native";

export default function loadingScreen({ image }) {
  return (
    <ImageBackground
      style={styles.background}
      source={{
        uri: image,
      }}
    ></ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    height: Dimensions.get("screen").height,
  },
});
