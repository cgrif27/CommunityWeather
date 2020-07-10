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
  AsyncStorage,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Button } from "react-native-elements";

import {
  useFonts,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_500Medium,
} from "@expo-google-fonts/inter";
import getColor from "../localFunctions/getColor";
import { Item, Picker, Icon } from "native-base";

import AppLoading from "../screens/loadingScreen";
import PostHeader from "../components/postHeader";
import PostModal from "../components/PostModal";

//firbase
import firebase from "../firebase";
const db = firebase.firestore();

export default function addPost({ navigation }) {
  //caption data
  const data = navigation.getParam("data");
  const id = navigation.getParam("id");

  let [fontsLoaded] = useFonts({
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_500Medium,
  });
  const [count, setCount] = useState(data.sentence.length);
  const [textAreaValue, setTextAreaValue] = useState(data.sentence);
  const [value, setValue] = useState(data.sentence);

  const numCharacters = 140;

  const [size, setSize] = useState(0);
  const [loading, setLoading] = useState(false);

  //settings the units of the post input
  const [units, setUnits] = useState("");
  useEffect(() => {
    AsyncStorage.getItem("units").then((result) => setUnits(result));
  }, []);

  //modal states
  const [modalVisible, setModalVisible] = useState(false);

  const [selected, setSelected] = useState(data.tempRangeIndex);
  //ranges for the temps to be referenced from
  const tempRanges = ["-0", "0-18", "18-24", "24-27", "27-35", "35+"];

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");

  function getDisplayName() {
    //getting and setting the email
    useEffect(() => {
      firebase.auth().onAuthStateChanged((user) => {
        setEmail(user.email);
      });
    }, []);

    return db.collection("users").where("email", "==", email).get();
  }
  let name = "";

  async function addToDb() {
    //getting details from storage
    const displayName = await AsyncStorage.getItem("displayName");
    const email = await AsyncStorage.getItem("email");

    //adding the post with the required details
    return db
      .collection("posts")
      .doc(tempRanges[selected])
      .collection("captions")
      .doc(id)
      .update({
        docNum: data.docNum,
        sentence: textAreaValue,
        creator: data.creator,
        email: data.email,
        tempRangeIndex: data.tempRangeIndex,
      })
      .then(() => {
        setModalVisible(true);
        setCount(0);
        navigation.navigate("Captions");
        setLoading(false);
      })
      .catch((e) => {
        alert("Something went wrong");
        setLoading(false);
      });
  }

  if (!fontsLoaded) return <AppLoading />;

  return (
    <ScrollView
      contentContainerStyle={{
        justifyContent: "center",
      }}
      keyboardShouldPersistTaps="always"
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <View>
            <Text style={styles.heading}>Edit Your Caption</Text>
            <Text style={styles.subheading}>
              Edit your caption below, then press "Update your Caption". Your
              caption will then be updated.
            </Text>
          </View>
          <TextInput
            multiline={true}
            placeholder="Write a funny caption..."
            numberOfLines={6}
            style={styles.textArea}
            onChangeText={(value) => {
              setTextAreaValue(value);
              setCount(value.length);
              setValue(value);
            }}
            value={value}
            maxLength={numCharacters}
          />
          <View style={styles.countView}>
            <Text style={styles.count}>
              {count}/{numCharacters}
            </Text>
          </View>

          <Button
            loading={loading}
            title="Update your Caption"
            buttonStyle={{
              width: "100%",
              alignSelf: "center",
              backgroundColor: getColor(),
              borderRadius: 10,
              marginTop: 30,
              marginBottom: 30,
            }}
            titleStyle={{ fontSize: 20, fontFamily: "Inter_300Light" }}
            onPress={() => {
              if (count > 0) {
                setLoading(true);
                addToDb();

                setValue("");
              } else {
                Alert.alert(
                  "Please Enter a Caption",
                  "No one wants to read nothing on there weather feed."
                );
              }
            }}
          />
          <PostModal
            modalVisible={modalVisible}
            onClick={() => setModalVisible(false)}
            title="Caption Updated Successfully"
          />
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
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
  heading: {
    fontFamily: "Inter_500Medium",
    fontSize: 25,
    textAlign: "center",
    color: "#333",
    width: "90%",
    alignSelf: "center",
    marginBottom: 5,
    marginTop: 30,
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
