import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import {
  useFonts,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_500Medium,
} from "@expo-google-fonts/inter";
import { AntDesign } from "@expo/vector-icons";
import firebase from "../firebase";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { Button } from "react-native-elements";
import getColor from "../localFunctions/getColor";

TimeAgo.addLocale(en);

export default function VoteCard({
  caption,
  creator,
  timestamp,
  likeCount,
  likeButtonColor,
  tempRange,
  docId,
  rangeIndex,
}) {
  let [fontsLoaded] = useFonts({
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_500Medium,
  });
  const [likeColor, setLikeColor] = useState(likeButtonColor);
  //   const [tempRangeIndex, setTempRangeIndex] = useState(-1);
  const [tempLikeCount, setTempLikeCount] = useState(likeCount);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState("flex");

  const tempRanges = ["-0", "0-18", "18-24", "24-27", "27-35", "35+"];

  //   useEffect(() => {}, []);

  let timeAgo = new TimeAgo("en-US");

  return (
    <View
      style={{
        display: visible,
      }}
    >
      <View style={styles.card}>
        <View style={styles.headerView}>
          <Text style={styles.creator}>{creator}</Text>
          <Text style={styles.timestamp}>{timeAgo.format(timestamp)}</Text>
        </View>
        <Text style={styles.caption}>{caption}</Text>

        <View style={styles.likeView}>
          <Text style={styles.tempRange}>Range: {tempRange}</Text>
          <View style={styles.likeView}>
            <Text style={styles.likeText}>{tempLikeCount}</Text>
            <AntDesign name="heart" size={28} color={likeColor} />
          </View>
        </View>
        <Button
          loading={loading}
          title="Delete"
          buttonStyle={{
            alignSelf: "center",
            backgroundColor: getColor(),
            borderRadius: 10,
            marginTop: 10,
            marginBottom: 20,
            paddingLeft: 15,
            paddingRight: 15,
            width: 120,
          }}
          titleStyle={{ fontSize: 17, fontFamily: "Inter_300Light" }}
          onPress={() => {
            Alert.alert(
              "Delete Caption",
              "Are you sure you want to delete this caption. Once it is deleted it cannot be restored.",
              [
                {
                  //deleting the caption
                  text: "Yes",
                  onPress: () => {
                    setLoading(true);
                    let docNum = 0;
                    let size = 0;
                    //assigning the docNum
                    const docRef = firebase
                      .firestore()
                      .collection("posts")
                      .doc(tempRanges[rangeIndex])
                      .collection("captions")
                      .doc(docId);

                    docRef.delete().then(() => {
                      setLoading(false);
                      setVisible("none");
                    });
                  },
                },
                {
                  text: "No",
                  style: "cancel",
                },
              ]
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    marginBottom: 30,
    borderRadius: 10,
    borderColor: getColor(),
    borderWidth: 1,
    width: "90%",
    alignSelf: "center",
  },
  caption: {
    fontFamily: "Inter_500Medium",
    fontSize: 25,
    textAlign: "center",
  },
  creator: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    textAlign: "center",
  },
  timestamp: {
    fontFamily: "Inter_200ExtraLight",
    fontSize: 15,
    textAlign: "center",
  },
  likeView: {
    flexDirection: "row",
    marginLeft: 5,
    justifyContent: "space-between",
    padding: 10,
  },
  likeText: {
    alignSelf: "flex-end",
    marginRight: 5,
    fontFamily: "Inter_300Light",
    fontSize: 20,
  },
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomColor: getColor(),
    borderBottomWidth: 1,
    width: "100%",
    marginBottom: 15,
  },
  tempRange: {
    alignSelf: "flex-end",
    paddingBottom: 10,
    fontFamily: "Inter_300Light",
    fontSize: 15,
  },
});
