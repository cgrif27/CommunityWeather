import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  AsyncStorage,
} from "react-native";
import { Button } from "react-native-elements";
import getColor from "../localFunctions/getColor";
import { AntDesign, Ionicons, Entypo } from "@expo/vector-icons";
import Login from "../components/Login";
import firebase from "../firebase";

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

export default function PostModal({ modalVisible, onClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordInput, setPasswordInput] = useState();

  const [loading, setLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [passwordIcon, setPasswordIcon] = useState("md-eye-off");

  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.closeIcon}>
              <View>
                <TouchableOpacity onPress={onClick}>
                  <AntDesign name="closecircle" size={28} color="red" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.modalText}>
              Please Login to Vote for Captions
            </Text>
            <Text style={styles.subText}>
              If you don't have an account, please create one. Otherwise log in
              below.
            </Text>
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
                paddingLeft: 50,
                paddingRight: 50,
                marginTop: 20,
                backgroundColor: getColor(),
                borderRadius: 25,
              }}
              titleStyle={{
                fontSize: 20,
                fontFamily: "Inter_300Light",
              }}
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
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "Inter_300Light",
    fontSize: 25,
    padding: 10,
  },
  closeIcon: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  subText: {
    textAlign: "center",
    fontFamily: "Inter_300Light",
    fontSize: 15,
    marginBottom: 30,
  },
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
});
