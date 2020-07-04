import React from "react";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import {
  MaterialCommunityIcons,
  FontAwesome,
  Entypo,
} from "@expo/vector-icons";
import {
  useFonts,
  Inter_200ExtraLight,
  Inter_300Light,
} from "@expo-google-fonts/inter";

export default function WeatherInfo({ iconColor, low, humidity, wind, high }) {
  let [fontsLoaded] = useFonts({
    Inter_200ExtraLight,
    Inter_300Light,
  });

  const iconSize = 35;
  return (
    <View style={styles.infoView}>
      <View style={styles.lowView}>
        <FontAwesome
          name="thermometer-quarter"
          size={iconSize}
          style={styles.icons}
          color={iconColor}
        />
        <Text style={styles.value}>{low}°</Text>
        <Text
          style={{
            color: iconColor,
            fontFamily: "Inter_300Light",
          }}
        >
          Low
        </Text>
      </View>

      <View style={styles.lowView}>
        <Entypo
          name="water"
          size={iconSize}
          style={styles.icons}
          color={iconColor}
        />
        <Text style={styles.value}>{humidity}</Text>
        <Text
          style={{
            color: iconColor,
            fontFamily: "Inter_300Light",
          }}
        >
          Humidity
        </Text>
      </View>

      <View style={styles.lowView}>
        <MaterialCommunityIcons
          name="weather-windy"
          size={iconSize}
          style={styles.icons}
          color={iconColor}
        />
        <Text style={styles.value}>{wind} m/s</Text>
        <Text
          style={{
            color: iconColor,
            fontFamily: "Inter_300Light",
          }}
        >
          Wind
        </Text>
      </View>

      <View style={styles.lowView}>
        <FontAwesome
          name="thermometer-3"
          size={iconSize}
          style={styles.icons}
          color={iconColor}
        />
        <Text style={styles.value}>{high}°</Text>
        <Text
          style={{
            color: iconColor,
            fontFamily: "Inter_300Light",
          }}
        >
          High
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoView: {
    width: "90%",
    alignSelf: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    margin: 10,
  },
  lowView: {
    alignItems: "center",
  },

  icons: {
    textAlign: "center",
    paddingBottom: 10,
  },
  description: {
    color: "#575757",
  },
  value: {
    color: "#333",
    fontFamily: "Inter_300Light",
    fontSize: 16,
  },
});
