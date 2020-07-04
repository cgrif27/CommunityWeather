import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { Button } from "react-native-elements";

import {
  useFonts,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_500Medium,
} from "@expo-google-fonts/inter";
import getColor from "../../localFunctions/getColor";
import firebase from "../../firebase";

export default function ChangePassword() {
  let [fontsLoaded] = useFonts({
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_500Medium,
  });

  const [hidePassword, setHidePassword] = useState(true);
  const [passwordIcon, setPasswordIcon] = useState("md-eye-off");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Change Password</Text>
      <Text style={styles.subHeading}>
        If you would like to change your password you can do so here
      </Text>
      <View style={styles.oldPassword}>
        <Entypo name="lock" color="#333" size={22} style={styles.icon} />
        <TextInput
          placeholder="Old Password"
          placeholderTextColor="#818181"
          style={styles.textArea}
          secureTextEntry={hidePassword}
          autoCapitalize="none"
          value={oldPassword}
          onChangeText={(text) => setOldPassword(text)}
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
      <View style={styles.inputContainer}>
        <Entypo name="lock" color="#333" size={22} style={styles.icon} />
        <TextInput
          placeholder="New Password"
          placeholderTextColor="#818181"
          style={styles.textArea}
          secureTextEntry={hidePassword}
          autoCapitalize="none"
          value={password}
          onChangeText={(text) => setPassword(text)}
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
        title="Change Password"
        buttonStyle={{
          width: "100%",
          marginTop: 10,
          alignSelf: "center",
          backgroundColor: getColor(),
          borderRadius: 25,
        }}
        titleStyle={{ fontSize: 20, fontFamily: "Inter_300Light" }}
        onPress={() => {
          if (password === "") {
            Alert.alert(
              "Missing Fields",
              "Please make sure all inputs are filled out."
            );
            return;
          }
          setLoading(true);
          firebase
            .auth()
            .signInWithEmailAndPassword(
              firebase.auth().currentUser.email,
              oldPassword
            )
            .then(() => {
              firebase
                .auth()
                .currentUser.updatePassword(password)
                .then(() => {
                  Alert.alert(
                    "Password Updated",
                    "Your password has now been changed."
                  );
                  setLoading(false);
                })
                .catch((err) => {
                  alert(err);
                  setLoading(false);
                });
            })
            .catch((err) => {
              alert(err);
              setLoading(false);
            });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    textAlign: "center",
    fontFamily: "Inter_500Medium",
    fontSize: 25,
    marginTop: 20,
  },
  subHeading: {
    textAlign: "center",
    fontFamily: "Inter_300Light",
    fontSize: 17,
    marginTop: 5,
  },
  container: {
    justifyContent: "center",
    paddingTop: 50,
    paddingBottom: 50,
    width: "90%",
    alignSelf: "center",
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
    marginTop: 30,
  },
  oldPassword: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 30,
  },
});
