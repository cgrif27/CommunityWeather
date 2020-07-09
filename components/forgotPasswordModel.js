import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-elements";
import getColor from "../localFunctions/getColor";
import firebase from "../firebase";
import SuccessModal from "../components/SuccessModal";
import { AntDesign } from "@expo/vector-icons";
import { Entypo, Ionicons } from "@expo/vector-icons";

export default function PostModal({ modalVisible, onClick }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("none");

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
            <Text style={styles.modalText}>Forgot Password?</Text>
            <Text style={styles.subText}>
              Thats alright, we can reset it for you. Simply enter your email
              and press "Reset Password". A link will be sent to your email to
              reset your Password.
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
              />
            </View>
            <View
              style={{
                display: success,
                flexDirection: "row",
              }}
            >
              <AntDesign name="checkcircleo" size={24} color="#00cf53" />
              <Text style={styles.message}>Email Sent!</Text>
            </View>
            <Button
              loading={loading}
              title="Reset Password"
              buttonStyle={{
                width: 230,
                alignSelf: "center",
                backgroundColor: getColor(),
                borderRadius: 10,
                marginTop: 30,
              }}
              titleStyle={{ fontSize: 20, fontFamily: "Inter_300Light" }}
              onPress={() => {
                if (email === "") {
                  Alert.alert(
                    "No Email Supplied",
                    "Please make sure your email is entered"
                  );
                  return;
                }
                setLoading(true);
                firebase
                  .auth()
                  .sendPasswordResetEmail(email)
                  .then(() => {
                    setSuccess("flex");
                    setLoading(false);
                    //hides the email sent text after 5 seconds
                    setTimeout(() => {
                      setSuccess("none");
                    }, 5000);
                  })
                  .catch((err) => {
                    alert(err);
                    setLoading(false);
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
  closeIcon: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    marginTop: 15,

    textAlign: "center",
    fontFamily: "Inter_300Light",
    fontSize: 25,
  },
  subText: {
    textAlign: "center",
    fontFamily: "Inter_300Light",
  },
  email: {
    width: "90%",
    borderColor: getColor(),
    margin: 20,
    borderRadius: 20,
    borderWidth: 1,
    paddingLeft: 10,
  },
  message: {
    paddingLeft: 10,
    fontFamily: "Inter_300Light",
    fontSize: 20,
    color: "#00cf53",
    bottom: 2,
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
    marginBottom: 10,
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
    marginTop: 20,
  },
});
