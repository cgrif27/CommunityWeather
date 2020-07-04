import React from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import { Button } from "react-native-elements";
import getColor from "../localFunctions/getColor";
import { AntDesign } from "@expo/vector-icons";

export default function PostModal({ modalVisible, onClick, title }) {
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
            <Text style={styles.modalText}>{title}</Text>
            <Text style={styles.subText}>
              Look out for your caption on the home page.
            </Text>
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
  closeIcon: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  subText: {
    textAlign: "center",
    fontFamily: "Inter_300Light",
    fontSize: 20,
  },
  extraText: {
    marginTop: 10,
    textAlign: "center",
    fontFamily: "Inter_200ExtraLight",
    fontSize: 20,
  },
});
