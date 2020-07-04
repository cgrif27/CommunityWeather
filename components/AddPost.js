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
} from "react-native";
import { Button } from "react-native-elements";
import converter from "../localFunctions/celciusToFahrenheit";

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
import { Keyboard } from "react-native";
const db = firebase.firestore();

export default function addPost() {
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

  //settings the units of the post input
  const [units, setUnits] = useState("");
  useEffect(() => {
    AsyncStorage.getItem("units").then((result) => setUnits(result));
  }, []);

  //modal states
  const [modalVisible, setModalVisible] = useState(false);

  const [selected, setSelected] = useState(-1);
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
    let count = 0;

    const docRef = firebase
      .firestore()
      .collection("posts")
      .doc(tempRanges[selected])
      .collection("captions")
      .doc("size");
    return firebase.firestore().runTransaction((transaction) => {
      return transaction
        .get(docRef)
        .then((doc) => {
          if (!doc.exists) {
            //make the document

            firebase
              .firestore()
              .collection("posts")
              .doc(tempRanges[selected])
              .collection("captions")
              .doc("size")
              .set({
                count: 0,
              })
              .then(() => {
                alert("No size document one has been created though!");
                setLoading(false);
                return;
              });
          }
          count = doc.data().count;
          count++;
          transaction.update(docRef, {
            count: count,
          });
        })
        .then(() => {
          db.collection("posts")
            .doc(tempRanges[selected])
            .collection("captions")
            .add({
              docNum: count,
              sentence: textAreaValue,
              creator: displayName,
              email: email,
              created_at: Date.now(),
              tempRangeIndex: selected,
              likes: [],
              docId: 0,
              likesCount: 0,
              isVisible: true,
              uid: firebase.auth().currentUser.uid,
            })
            .then((doc) => {
              console.log(doc.id);
              db.collection("posts")
                .doc(tempRanges[selected])
                .collection("captions")
                .doc(doc.id)
                .update({
                  docId: doc.id,
                });
              setModalVisible(true);
              setCount(0);
              setLoading(false);
            })
            .catch((e) => {
              alert("Something went wrong");
              setLoading(false);
            });
        });
    });
    //adding the post with the required details
    // const increment = firebase.firestore.FieldValue.increment(1);

    // firebase
    //   .firestore()
    //   .collection("posts")
    //   .doc(tempRanges[selected])
    //   .collection("captions")
    //   .doc("size")
    //   .set({
    //     count: increment,
    //   })
    //   .then(() => console.log("It updated"))
    //   .catch((e) => console.log(e));

    db.collection("posts")
      .doc(tempRanges[selected])
      .collection("captions")
      .get()
      .then((snapshot) => {});
  }

  if (!fontsLoaded) return <AppLoading />;

  return (
    <ScrollView
      contentContainerStyle={{
        justifyContent: "center",
        backgroundColor: "#e8e8e8",
        height: Dimensions.get("window").height,
      }}
      keyboardShouldPersistTaps="always"
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <PostHeader />
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
          <Text style={styles.selectHeading}>Temperature Range</Text>
          <Text style={styles.selectSub}>
            This will be what temperature range your caption will be displayed
            at
          </Text>
          <Item picker>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              style={{ width: undefined }}
              placeholderStyle={{ color: "#bfc6ea" }}
              placeholderIconColor="#007aff"
              selectedValue={selected}
              onValueChange={(e) => setSelected(e)}
              placeholder="Test"
            >
              <Picker.Item label={`Select a Temperature Range`} value={-1} />
              <Picker.Item
                label={`Less than ${converter(0, units)}° (Fucking Cold)`}
                value={0}
              />
              <Picker.Item
                label={`${converter(0, units)}° - ${converter(
                  18,
                  units
                )}° (Cold)`}
                value={1}
              />
              <Picker.Item
                label={`${converter(18, units)}° - ${converter(
                  24,
                  units
                )}° (Alright)`}
                value={2}
              />
              <Picker.Item
                label={`${converter(24, units)}° - ${converter(
                  27,
                  units
                )}° (Perfect)`}
                value={3}
              />
              <Picker.Item
                label={`${converter(27, units)}° - ${converter(
                  35,
                  units
                )}° (Hot)`}
                value={4}
              />
              <Picker.Item
                label={`${converter(35, units)}°+ (Fucking Hot)`}
                value={5}
              />
            </Picker>
          </Item>
          <Button
            loading={loading}
            title="Post your Caption"
            buttonStyle={{
              width: "100%",
              alignSelf: "center",
              backgroundColor: getColor(),
              borderRadius: 10,
              marginTop: 30,
            }}
            titleStyle={{ fontSize: 20, fontFamily: "Inter_300Light" }}
            onPress={() => {
              if (count > 0 && selected >= 0) {
                setLoading(true);
                addToDb();

                setValue("");
              } else if (count <= 0) {
                Alert.alert(
                  "Please Enter a Caption",
                  "No one wants to read nothing on there weather feed."
                );
              } else if (selected < 0) {
                Alert.alert(
                  "Please Select a Temperature Range",
                  "If you want everyone to see your funny caption, please select a range."
                );
              }
            }}
          />
          <PostModal
            modalVisible={modalVisible}
            onClick={() => setModalVisible(false)}
            title="Caption Posted Successfully"
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
});
