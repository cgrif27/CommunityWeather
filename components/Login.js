import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  AsyncStorage,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";

import { Button } from "react-native-elements";
import getColor from "../localFunctions/getColor";
import { Entypo, Ionicons } from "@expo/vector-icons";
import {
  useFonts,
  Inter_200ExtraLight,
  Inter_300Light,
} from "@expo-google-fonts/inter";
import firebase from "../firebase";
import ForgotPasswordModal from "../components/forgotPasswordModel";
import { auth } from "firebase";

function signIn(email, password) {
  firebase
    .firestore()
    .collection("users")
    .where("email", "==", email)
    .get()
    .then((doc) => {
      doc.forEach((user) => {
        AsyncStorage.setItem("email", email);
        AsyncStorage.setItem("displayName", user.data().displayName);
        console.log(user.data().displayName);
        AsyncStorage.getItem("displayName").then((name) =>
          console.log("Name: " + name)
        );
      });
    });
  return firebase.auth().signInWithEmailAndPassword(email, password);
}

export default function Login({ navigation }) {
  let [fontsLoaded] = useFonts({
    Inter_200ExtraLight,
    Inter_300Light,
  });

  //credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordInput, setPasswordInput] = useState();

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [passwordIcon, setPasswordIcon] = useState("md-eye-off");

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
          <Text style={styles.headerText}>Login</Text>
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
              value={email}
              onChangeText={(text) => setEmail(text)}
              onSubmitEditing={() => passwordInput.focus()}
            />
          </View>
          <View style={styles.inputContainer}>
            <Entypo name="lock" color="#333" size={22} style={styles.icon} />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#818181"
              style={styles.textArea}
              secureTextEntry={hidePassword}
              autoCapitalize="none"
              value={password}
              onChangeText={(text) => setPassword(text)}
              ref={(input) => setPasswordInput(input)}
            />
            <TouchableOpacity
              onPress={() => {
                setHidePassword(!hidePassword);
                //changing the icon of the password show
                if (passwordIcon === "md-eye") setPasswordIcon("md-eye-off");
                else setPasswordIcon("md-eye");
              }}
              style={styles.passwordShow}
            >
              <Ionicons name={passwordIcon} size={24} color="black" />
            </TouchableOpacity>
          </View>
          <Button
            loading={loading}
            title="Login"
            buttonStyle={{
              width: "100%",
              marginTop: 20,
              alignSelf: "center",
              backgroundColor: getColor(),
              borderRadius: 25,
            }}
            titleStyle={{ fontSize: 20, fontFamily: "Inter_300Light" }}
            onPress={() => {
              if (email === "" || password === "") {
                Alert.alert(
                  "Missing Fields",
                  "Please make sure all inputs are filled out."
                );
                return;
              }
              setLoading(true);
              signIn(email, password)
                .then(() => {
                  navigation.jumpTo("Home");
                  setLoading(false);
                  setEmail("");
                  setPassword("");
                })
                .catch((err) => {
                  setLoading(false);
                  alert(err);
                });
            }}
          />
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
          <ForgotPasswordModal
            modalVisible={modalVisible}
            onClick={() => {
              setModalVisible(false);
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
    paddingRight: 40,
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
  passwordShow: {
    position: "absolute",
    right: 10,
    top: 8,
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
  iconImage: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
});
