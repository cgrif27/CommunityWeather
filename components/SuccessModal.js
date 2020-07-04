import React, { useState } from "react";
import { StyleSheet, Text, View, Modal, TextInput } from "react-native";
import { Button } from "react-native-elements";
import getColor from "../localFunctions/getColor";
import firebase from "../firebase";
import { AntDesign } from "@expo/vector-icons";

export default function PostModal({ modalVisible, onClick }) {
  const [email, setEmail] = useState("");
  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <AntDesign name="checkcircleo" size={50} color="black" />

            <Button
              title="Close"
              buttonStyle={{
                width: 230,
                alignSelf: "center",
                backgroundColor: getColor(),
                borderRadius: 10,
                marginTop: 30,
              }}
              titleStyle={{ fontSize: 20, fontFamily: "Inter_300Light" }}
              onPress={onClick}
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
});
