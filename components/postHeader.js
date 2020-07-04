import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function postHeader() {
  return (
    <View>
      <Text style={styles.heading}>Add Your Own Caption</Text>
      <Text style={styles.subheading}>
        Write a caption then post it, show the rest of the world so they can see
        how funny you are about the weather.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontFamily: "Inter_500Medium",
    fontSize: 25,
    textAlign: "center",
    color: "#333",
    width: "90%",
    alignSelf: "center",
    marginBottom: 5,
  },
  subheading: {
    fontFamily: "Inter_300Light",
    width: "80%",
    textAlign: "center",
    alignSelf: "center",
    marginBottom: 20,
    color: "#333",
  },
});
