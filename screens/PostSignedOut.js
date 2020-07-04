import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  TouchableHighlight,
  Dimensions,
} from "react-native";
import { Button } from "react-native-elements";

import {
  useFonts,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_500Medium,
} from "@expo-google-fonts/inter";
import getColor from "../localFunctions/getColor";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import NotLoggedIn from "../components/NotLoggedIn";
import AppLoading from "../screens/loadingScreen";
import PostHeader from "../components/postHeader";
import PostModal from "../components/PostModal";
import Account from "../screens/Account";

//firbase
import firebase from "../firebase";
const db = firebase.firestore();

export default function PostSignedOut({ navigation }) {
  let [fontsLoaded] = useFonts({
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_500Medium,
  });
  const [count, setCount] = useState(0);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [value, setValue] = useState("");

  const numCharacters = 140;

  const [size, setSize] = useState(0);
  const [loading, setLoading] = useState(false);

  //modal states
  const [modalVisible, setModalVisible] = useState(false);

  const [selected, setSelected] = useState(2);
  //ranges for the temps to be referenced from
  const tempRanges = ["-0", "0-18", "18-24", "24-27", "27-35", "35+"];

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");

  if (!fontsLoaded) return <AppLoading />;

  return (
    <ScrollView
      contentContainerStyle={{
        justifyContent: "center",
        backgroundColor: "#e8e8e8",
      }}
      keyboardShouldPersistTaps="always"
    >
      <View style={styles.container}>
        <PostHeader />
        <NotLoggedIn />
      </View>
      <Account />
      <View style={styles.bottom} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    width: "90%",
    alignSelf: "center",
    justifyContent: "center",
  },

  textArea: {
    fontFamily: "Inter_500Medium",
    fontSize: 16,
    borderColor: getColor(),
    borderRadius: 10,
    padding: 10,
    borderWidth: 2,
    textAlignVertical: "top",
  },
  count: {
    fontFamily: "Inter_300Light",
  },
  countView: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 10,
  },

  selectHeading: {
    fontFamily: "Inter_300Light",
    fontSize: 16,
    marginTop: 25,
  },
  selectSub: {
    fontFamily: "Inter_200ExtraLight",
  },
  loggedOut: {
    marginTop: 30,
    width: "90%",
    alignSelf: "center",
  },
  header: {
    fontFamily: "Inter_500Medium",
    fontSize: 30,
    textAlign: "center",
  },
  subheading: {
    textAlign: "center",
    fontFamily: "Inter_300Light",
    fontSize: 20,
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
