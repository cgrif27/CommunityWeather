import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  AsyncStorage,
  Keyboard,
  Image,
} from "react-native";

import { Button } from "react-native-elements";
import getColor from "../localFunctions/getColor";
import {
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { Entypo, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import {
  useFonts,
  Inter_200ExtraLight,
  Inter_300Light,
} from "@expo-google-fonts/inter";
import firebase from "../firebase";

function signUp(email, password) {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
}

function userExists(user) {
  return firebase
    .firestore()
    .collection("users")
    .where("displayName", "==", user)
    .get();
}

function addUsername(displayName, email) {
  return firebase.firestore().collection("users").add({
    displayName: displayName,
    email: email,
  });
}

export default function Register({ navigation }) {
  let [fontsLoaded] = useFonts({
    Inter_200ExtraLight,
    Inter_300Light,
  });

  //textinput states
  const [emailInput, setEmailInput] = useState();
  const [passwordInput, setPasswordInput] = useState();
  const [confirmPasswordInput, setConfirmPasswordInput] = useState();

  //credentials
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <ScrollView
      contentContainerStyle={{
        justifyContent: "center",
        flexGrow: 1,
        backgroundColor: "#e8e8e8",
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="always"
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <Image
            source={{
              uri:
                "https://lh3.googleusercontent.com/EmXXP4hbcAN2DehzM9Fd-Yf8txgLSTIh72o_pOjTl3DEBH0Qg3HkJ9er2MiDM1MMa1zI2OJPuZ2dOd-iGZfWi4ZZzswynsjhvKqeKo_vVYFvgEARtkLfAUxKoWmIcucns0ofaIGhxd8pZEBYHf0XFR1w5HBifXvedTcKcFYs646Am1lvCxb3yzm7iNRWx1V1Yhkji0MCNYBeuDalMiRPhqGd87Pi6-ry4ccpnzddwabYAxRdS25IsKl__eDJJIg3dR-bfog4OuQVEdD3VPwuvHdDE82N4BYiQO5DN_mHV_B8MIqR9GW65ccsc-kdzIYshprgMizsthIrPqlDzuxpwDcrtG6k3fZyQKBWUuQQpSC5nvA6zWgVStQmEqTqeWpP3lTuw0_UPHdu5ODQzwPLoB9dUDQhohanoZvgFdnMpNSj7nC7kpRcnNUGYp5o0Yjy6worPqJVkvg3MB0cn7tthm2ALukZG42WMl6gw0mU9DucQO7_MLC_ST9e8acxtDyCFSEcIEVysy1KgGgHepqvTh3yXTI_IS9IPc_bqJokIQhHvx7eLhwQlwE_Mpm-EIJT1yR-YAtnykNl3vh7rYYM5xAxj3kjzC3P6_elH1t5C1_X1e-FMxfgLMWX9X0-J5q_5F5-KpzgOa7fx-r6GFSqEn2r-CSMuCoYhs8ftX2CCbPpk3K3m2EF9rtDJ_UI=w1101-h1265-no?authuser=0",
            }}
            style={styles.iconImage}
          />
          <Text style={styles.headerText}>Sign Up</Text>
          <View style={styles.inputContainer}>
            <FontAwesome5
              name="user-alt"
              color="#333"
              size={19}
              style={styles.icon}
            />
            <TextInput
              placeholder="Display Name"
              placeholderTextColor="#818181"
              style={styles.textArea}
              onSubmitEditing={() => emailInput.focus()}
              onChangeText={(text) => setDisplayName(text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons
              name="ios-mail"
              color="#333"
              size={22}
              style={styles.icon}
            />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#818181"
              style={styles.textArea}
              autoCapitalize="none"
              ref={(input) => setEmailInput(input)}
              onSubmitEditing={() => passwordInput.focus()}
              onChangeText={(text) => setEmail(text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Entypo name="lock" color="#333" size={22} style={styles.icon} />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#818181"
              style={styles.textArea}
              secureTextEntry={true}
              autoCapitalize="none"
              ref={(input) => setPasswordInput(input)}
              onSubmitEditing={() => confirmPasswordInput.focus()}
              onChangeText={(text) => setPassword(text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Entypo name="lock" color="#333" size={22} style={styles.icon} />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#818181"
              style={styles.textArea}
              secureTextEntry={true}
              autoCapitalize="none"
              ref={(input) => setConfirmPasswordInput(input)}
              onChangeText={(text) => setConfirmPassword(text)}
            />
          </View>

          <Button
            loading={loading}
            title="Sign Up"
            buttonStyle={{
              width: "100%",
              marginTop: 20,
              alignSelf: "center",
              backgroundColor: getColor(),
              borderRadius: 25,
            }}
            titleStyle={{ fontSize: 20, fontFamily: "Inter_300Light" }}
            onPress={() => {
              //making sure they fuill out everything
              if (email === "" || displayName === "" || password === "") {
                Alert.alert(
                  "Missing Fields",
                  "Please make sure all inputs are filled out."
                );
                return;
              }
              // //if there is already a user with the same name

              //Password dont match
              if (password !== confirmPassword) {
                Alert.alert(
                  "Wrong Password",
                  "Please make sure both password are the same."
                );
                return;
              }
              //Will sign up the user
              // if (password === confirmPassword && password.length > 6) {
              setLoading(true);
              userExists(displayName).then((users) => {
                if (users.size > 0) {
                  Alert.alert(
                    "Display Name Taken",
                    "Another user has already taken the name you chose"
                  );
                  setLoading(false);
                } else {
                  console.log(displayName);

                  signUp(email, password)
                    .then((user) =>
                      addUsername(displayName, email).then(() => {
                        navigation.jumpTo("Home");
                        setLoading(false);
                        AsyncStorage.setItem("email", email);
                        AsyncStorage.setItem("displayName", displayName);
                        console.log(displayName);
                        AsyncStorage.getItem("displayName").then((name) =>
                          console.log("Name: " + name)
                        );
                        //clear all inputs
                      })
                    )
                    .catch((err) => {
                      setLoading(false);
                      alert(err);
                    });
                  return;
                }
              });
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingTop: 50,
    paddingBottom: 50,
    width: "80%",
    alignSelf: "center",
  },
  headerText: {
    fontFamily: "Inter_300Light",
    fontSize: 20,
    padding: 10,
  },
  textArea: {
    fontFamily: "Inter_300Light",
    fontSize: 16,
    borderColor: getColor(),
    borderRadius: 20,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 20,
    borderWidth: 1,
    textAlignVertical: "top",
    alignSelf: "center",
    flex: 1,
    paddingLeft: 35,
    color: "#333",
  },
  icon: {
    left: 10,
    zIndex: 10,
    position: "absolute",
    top: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginBottom: 20,
  },
  socialIcons: {
    width: "100%",
    alignSelf: "center",
    marginTop: 30,
  },
  orMessage: {
    textAlign: "center",
    fontSize: 20,
    marginBottom: 15,
    fontFamily: "Inter_300Light",
  },
  forgotPassword: {
    textAlign: "center",
    marginTop: 20,
    color: getColor(),
    fontFamily: "Inter_300Light",
  },
  strengthBar: {
    width: 80,
    marginBottom: 20,
  },
  iconImage: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
});
