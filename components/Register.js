import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  AsyncStorage,
  Keyboard,
} from "react-native";
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Label,
} from "native-base";
import { Button } from "react-native-elements";
import getColor from "../localFunctions/getColor";
import {
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { Entypo, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { SocialIcon } from "react-native-elements";
import {
  useFonts,
  Inter_200ExtraLight,
  Inter_300Light,
} from "@expo-google-fonts/inter";
import firebase from "../firebase";
import { BarPasswordStrengthDisplay } from "react-native-password-strength-meter";

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
          {/* <View style={styles.strengthBar}>
          <BarPasswordStrengthDisplay password={password} />
        </View> */}
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

                      // Alert.alert("Uh, oh", err[0].slice(8, err.length - 1));
                    });
                  return;
                }
              });

              // }
            }}
          />

          {/* <View style={styles.socialIcons}>
          <Text style={styles.orMessage}>OR</Text>

          <TouchableOpacity>
            <SocialIcon
              type="facebook"
              title="Sign In With Facebook"
              raised={true}
              button
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <SocialIcon
              type="google"
              title="Sign In With Google"
              raised={true}
              button
            />
          </TouchableOpacity>
        </View> */}
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
});
