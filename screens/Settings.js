import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ActivityIndicator,
  AsyncStorage,
} from "react-native";
import { ListItem, Button } from "react-native-elements";
import {
  useFonts,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_500Medium,
} from "@expo-google-fonts/inter";
import { ScrollView } from "react-native-gesture-handler";
import getColor from "../localFunctions/getColor";

function CaptionTypeHeader() {
  return (
    <React.Fragment>
      <Text style={styles.unitsHeading}>Select Caption Type</Text>
      <Text style={styles.unitsSub}>
        This will change the type of caption you will see on your home screen.
      </Text>
    </React.Fragment>
  );
}

function CaptionType() {
  const [captionType, setCaptionType] = useState("");
  const random = [
    {
      id: "random",
      title: "Random Caption",
      icon: "check",
    },
    {
      id: "mostPopular",
      title: "Most Popular Caption",
    },
  ];
  const mostPopular = [
    {
      id: "random",
      title: "Random Caption",
    },
    {
      id: "mostPopular",
      title: "Most Popular Caption",
      icon: "check",
    },
  ];

  //getting the caption type from storage
  AsyncStorage.getItem("captionType").then((result) => {
    setCaptionType(result);
  });

  if (captionType === "random") {
    return (
      <View style={styles.captionTypeView}>
        <CaptionTypeHeader />

        {random.map((item, i) => (
          <ListItem
            key={i}
            title={item.title}
            leftIcon={{ name: item.icon }}
            bottomDivider
            onPress={() => {
              AsyncStorage.setItem("captionType", item.id);
              setCaptionType(item.id);
            }}
            badge={item.badge}
          />
        ))}
      </View>
    );
  } else if (captionType === "mostPopular") {
    return (
      <View style={styles.captionTypeView}>
        <CaptionTypeHeader />

        {mostPopular.map((item, i) => (
          <ListItem
            key={i}
            title={item.title}
            leftIcon={{ name: item.icon }}
            bottomDivider
            onPress={() => {
              AsyncStorage.setItem("captionType", item.id);
              setCaptionType(item.id);
            }}
            badge={item.badge}
          />
        ))}
      </View>
    );
  }
  return (
    <View style={styles.captionTypeView}>
      <CaptionTypeHeader />

      {random.map((item, i) => (
        <ListItem
          key={i}
          title={item.title}
          leftIcon={{ name: item.icon }}
          bottomDivider
          onPress={() => {
            AsyncStorage.setItem("units", item.id);
            setCaptionType(item.id);
          }}
          badge={item.badge}
        />
      ))}
    </View>
  );
}

function TempUnitHeader() {
  return (
    <React.Fragment>
      <View style={styles.settingsTop}>
        <Text style={styles.title}>Settings</Text>
      </View>
      <View style={styles.unitsView}>
        <Text style={styles.unitsHeading}>Select Temperature Unit</Text>
        <Text style={styles.unitsSub}>
          Once changed, please restart the app to have the changes take effect.
        </Text>
      </View>
    </React.Fragment>
  );
}

export default function Settings({ navigation }) {
  let [fontsLoaded] = useFonts({
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_500Medium,
  });

  const [units, setUnits] = useState("celcius");

  const unitsCelcius = [
    {
      id: "celcius",
      title: "Celcius",
      icon: "check",
    },
    {
      id: "fahrenheit",
      title: "Fahrenheit",
    },
  ];

  const unitsFahrenheit = [
    {
      id: "celcius",
      title: "Celcius",
    },
    {
      id: "fahrenheit",
      title: "Fahrenheit",
      icon: "check",
    },
  ];

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color={getColor()} />
      </View>
    );
  }

  AsyncStorage.getItem("units").then((result) => {
    setUnits(result);
  });

  if (units === "celcius") {
    return (
      <ScrollView>
        <View style={styles.statusBar} />
        <TempUnitHeader />
        <View>
          {unitsCelcius.map((item, i) => (
            <ListItem
              key={i}
              title={item.title}
              leftIcon={{ name: item.icon }}
              bottomDivider
              onPress={() => {
                AsyncStorage.setItem("units", item.id);
                setUnits(item.id);
              }}
              badge={item.badge}
            />
          ))}
        </View>
        <CaptionType />
      </ScrollView>
    );
  } else if (units === "fahrenheit") {
    return (
      <ScrollView>
        <View style={styles.statusBar} />
        <TempUnitHeader />
        <View>
          {unitsFahrenheit.map((item, i) => (
            <ListItem
              key={i}
              title={item.title}
              leftIcon={{ name: item.icon }}
              bottomDivider
              onPress={() => {
                AsyncStorage.setItem("units", item.id);
                setUnits(item.id);
              }}
              badge={item.badge}
            />
          ))}
        </View>
        <CaptionType />
      </ScrollView>
    );
  }
  return (
    <ScrollView>
      <View style={styles.statusBar} />
      <TempUnitHeader />
      <View>
        {unitsCelcius.map((item, i) => (
          <ListItem
            key={i}
            title={item.title}
            leftIcon={{ name: item.icon }}
            bottomDivider
            onPress={() => {
              AsyncStorage.setItem("units", item.id);
              setUnits(item.id);
            }}
            badge={item.badge}
          />
        ))}
      </View>
      <CaptionType />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  statusBar: {
    height: StatusBar.currentHeight,
  },
  title: {
    fontFamily: "Inter_300Light",
    fontSize: 25,
    textAlign: "center",
    margin: 25,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  unitsHeading: {
    fontFamily: "Inter_300Light",
    fontSize: 20,
    paddingLeft: 20,
  },
  unitsSub: {
    fontFamily: "Inter_300Light",
    paddingLeft: 20,
    paddingBottom: 15,
    width: "96%",
  },
  captionTypeView: {
    marginTop: 25,
  },
});
