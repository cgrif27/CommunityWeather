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
import { Entypo, Ionicons } from "@expo/vector-icons";
import { SocialIcon } from "react-native-elements";
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

async function signInWithGoogle() {
  const provider = new auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
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
});
