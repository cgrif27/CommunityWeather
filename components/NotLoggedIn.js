import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import getColor from "../localFunctions/getColor";

export default function NotLoggedIn({ navigation }) {
  const iconSize = 30;

  return (
    <View style={styles.loggedOut}>
      <Text style={styles.header}>Not Logged In</Text>
      <Text style={styles.subheading}>
        Please Log In or if you dont have an account, please create one below.
      </Text>
      <View style={styles.scrollDown}>
        <AntDesign name="arrowdown" size={iconSize} color={getColor()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loggedOut: {
    width: "100%",
    alignSelf: "center",
  },
  header: {
    fontFamily: "Inter_500Medium",
    fontSize: 25,
    textAlign: "center",
    color: "#333",
  },
  subheading: {
    textAlign: "center",
    fontFamily: "Inter_300Light",
    fontSize: 15,
    color: "#333",
  },
  instructions: {
    textAlign: "center",
    fontFamily: "Inter_300Light",
    fontSize: 16,
  },
  or: {
    textAlign: "center",
    margin: 15,
    fontFamily: "Inter_300Light",
    fontSize: 16,
  },
  scrollDown: {
    flexDirection: "row",
    alignSelf: "center",
    paddingTop: 15,
  },
});
