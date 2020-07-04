import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import {
  useFonts,
  Inter_200ExtraLight,
  Inter_300Light,
} from "@expo-google-fonts/inter";

export default function ForecastList({ iconImage, temp, day, info }) {
  let [fontsLoaded] = useFonts({
    Inter_200ExtraLight,
    Inter_300Light,
  });
  const [newInfo, setNewInfo] = useState(info);

  //changing the default weather text
  useEffect(() => {
    if (info === "Clear") {
      setNewInfo("Sunny");
    }
  }, []);

  return (
    <View style={styles.border}>
      <View style={styles.container}>
        <Text style={styles.data}>{day}</Text>
        <View style={styles.iconView}>
          <Image
            source={{
              uri: iconImage,
            }}
            style={styles.iconImage}
          />
          <Text style={styles.info}>{newInfo}</Text>
        </View>

        <Text style={styles.temp}>{temp}°</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  border: {
    borderTopWidth: 1,
    borderColor: "#e8e8e8",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
    margin: 10,
  },
  iconImage: {
    width: 40,
    height: 40,
    right: 30,
  },
  data: {
    fontSize: 16,
    color: "#3d3d3d",
    fontFamily: "Inter_300Light",
    width: 125,
  },
  temp: {
    fontSize: 16,
    color: "#3d3d3d",
    fontFamily: "Inter_300Light",
  },
  iconView: {
    flexDirection: "column",
  },
  info: {
    right: 30,
    textAlign: "center",
    fontFamily: "Inter_200ExtraLight",
    fontSize: 12,
  },
});
