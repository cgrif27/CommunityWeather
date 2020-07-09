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
  const [icon, setIcon] = useState(
    `http://openweathermap.org/img/wn/${iconImage}@2x.png`
  );

  //changing the default weather text
  useEffect(() => {
    if (info === "Clear") {
      setNewInfo("Sunny");
    }

    //changing the sunny icon
    if (iconImage == "01d" || iconImage == "01n") {
      setIcon(
        "https://lh3.googleusercontent.com/6UxleMQvqKV6mW3ZhrVpQC3j3G15c2TXhrN-VUb1tNIfnBELJEgqxIhkOD_jIpQqbdTlzSLzvs7QoiNzad00liORdi7-lcHOu8tHP9KDU4UW6EthxVINw8FMLVgG6TwUd-z2P-yT3kNc_x0Mu2t5Gv4YFr2feYbPkPfz62iOhOB8_C5M1Xo4GRelXU4UlwAlfuuvuVesp9vYZnbqpuwgssaRyh0sREM_IBq1JkWAptMKLYpaMt2N-jMcPTxrvUMvHwojJd1-ntglBlOXwO1FpES_kmgiY2ysbltkT-o-_2Y_hcb-gt3fmcmSuNt7kSqAbcViG8qcE_hcdJcrwxWWqPZ7ob1RTXII5InqBNlcj2Zgte-QMKDwvdso6UagAUFEr7095INWpGqBf5pgUDhgad3iPMS0Jqn_D9ru_v7-Eu5NFlzZthwVuecid-A4h4PbEZX-U6zByj6mDqcdZd6iPm4EDKM9NWIS-9XNxT02TUjBP6Ru_kkdpal9GLDyGoYpqfv9aw18IYPQqObkDl08HWHXlCBf8ryHNWkxHw1qB29eRuRSrlNq-j2NPDKwXEtmsZ7GqFqIcJxheQplxHGXFErlvtpm_ROjTkscolo2dUeTS3zju2GAoNdOJ85h2qhXpS2mWeWslmpNUf93LbnZyu8uAcW0HT5OBUVxCJ-WLkvLEokS06-qLrpEdoas=s100-no?authuser=0"
      );
    }
  }, []);

  return (
    <View style={styles.border}>
      <View style={styles.container}>
        <Text style={styles.data}>{day}</Text>
        <View style={styles.iconView}>
          <Image
            source={{
              uri: icon,
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
    width: 50,
    height: 50,
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
    bottom: 5,
  },
});
