import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "native-base";

import { naviga } from "react-navigation";

export default function NotLoggedIn({ navigation }) {
  return (
    <View style={styles.loggedOut}>
      <Text style={styles.header}>Not Logged In</Text>
      <Text style={styles.subheading}>
        Please Log In or Sign Up below to use this feature.
      </Text>
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
});
