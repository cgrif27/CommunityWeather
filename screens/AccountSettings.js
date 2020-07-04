import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
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
import firebase from "../firebase";

export default function AccountSettings({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [numCaptions, setNumCaptions] = useState(-1);
  const [captions, setCaptions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [refresh, setRefresh] = useState(0);

  let [fontsLoaded] = useFonts({
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_500Medium,
  });

  //to get the number of documents a user has
  useEffect(() => {
    let query = firebase
      .firestore()
      .collectionGroup("captions")
      .where("email", "==", firebase.auth().currentUser.email);
    query
      .where("isVisible", "==", true)
      .get()
      .then((data) => {
        setNumCaptions(data.size);
        setRefreshing(false);
      });
    // .catch((err) => alert(err));
  }, [refresh]);

  const settingOptions = [
    {
      id: "Captions",
      title: "Captions",
      icon: "message",
      badge: {
        value: numCaptions,
        textStyle: {
          backgroundColor: getColor(),
          borderRadius: 20,
          width: 40,
          textAlign: "center",
          padding: 2,
        },
      },
    },
    {
      id: "ChangePassword",
      title: "Change Password",
      icon: "lock",
    },
  ];

  if (numCaptions < 0 || !fontsLoaded) {
    //returns a loading page instead of being black
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color={getColor()} />
      </View>
    );
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            let num = refresh + 1;
            setRefresh(num);
          }}
        />
      }
    >
      <View style={styles.statusBar} />
      <View style={styles.settingsTop}>
        <Text style={styles.title}>Account Settings</Text>
      </View>

      {settingOptions.map((item, i) => (
        <ListItem
          key={i}
          title={item.title}
          leftIcon={{ name: item.icon }}
          bottomDivider
          chevron
          onPress={() => {
            navigation.navigate(item.id);
          }}
          badge={item.badge}
        />
      ))}
      <Button
        loading={loading}
        title="Logout"
        buttonStyle={{
          width: "80%",
          marginTop: 20,
          alignSelf: "center",
          backgroundColor: getColor(),
          borderRadius: 25,
        }}
        titleStyle={{ fontSize: 20, fontFamily: "Inter_300Light" }}
        onPress={() => {
          setLoading(true);
          firebase
            .auth()
            .signOut()
            .then(() => setLoading(false))
            .catch((err) => alert(err));
        }}
      />
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
});
