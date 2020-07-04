import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
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
import getColor from "../localFunctions/getColor";
import LoginModal from "../components/LoginModal";

TimeAgo.addLocale(en);

const tempRanges = ["-0", "0-18", "18-24", "24-27", "27-35", "35+"];

function unlikePost(tempRangeIndex, postId) {
  const docRef = firebase
    .firestore()
    .collection("posts")
    .doc(tempRanges[tempRangeIndex])
    .collection("captions")
    .doc(postId);
  return firebase.firestore().runTransaction((transaction) => {
    return transaction.get(docRef).then((doc) => {
      if (!doc.exists) {
        throw "Document does not exist!";
      }
      let likes = doc.data().likes;
      likes.pop(firebase.auth().currentUser.email);
      transaction.update(docRef, {
        likesCount: likes.length,
        likes: likes,
      });
    });
  });
}

function likePost(tempRangeIndex, postId, likes) {
  if (firebase.auth().currentUser != null) {
    let currentUser = firebase.auth().currentUser;
    const docRef = firebase
      .firestore()
      .collection("posts")
      .doc(tempRanges[tempRangeIndex])
      .collection("captions")
      .doc(postId);
    return firebase.firestore().runTransaction((transaction) => {
      return transaction.get(docRef).then((doc) => {
        if (!doc.exists) {
          throw "Document does not exist!";
        }
        let likes = doc.data().likes;
        likes.push(firebase.auth().currentUser.email);
        transaction.update(docRef, {
          likesCount: likes.length,
          likes: likes,
        });
      });
    });
  } else {
    console.log("Nopt signed in");
  }
}

export default function VoteCard({
  caption,
  creator,
  timestamp,
  likeCount,
  likeButtonColor,
  tempRange,
  likes,
  tempRangeIndex,
  postId,
}) {
  let [fontsLoaded] = useFonts({
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_500Medium,
  });
  const [likeColor, setLikeColor] = useState(likeButtonColor);
  //   const [tempRangeIndex, setTempRangeIndex] = useState(-1);
  const [tempLikeCount, setTempLikeCount] = useState(likeCount);
  const [signedIn, setSignedIn] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  let timeAgo = new TimeAgo("en-US");

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      setSignedIn(true);
    } else {
      setSignedIn(false);
    }
  });

  if (signedIn) {
    return (
      <View style={styles.card}>
        <View style={styles.headerView}>
          <Text style={styles.creator}>{creator}</Text>
          <Text style={styles.timestamp}>{timeAgo.format(timestamp)}</Text>
        </View>
        <Text style={styles.caption}>{caption}</Text>

        <View style={styles.likeView}>
          <Text style={styles.tempRange}>Temp: {tempRange}</Text>
          <TouchableOpacity
            style={styles.likeView}
            onPress={() => {
              //TODO: add in a check to see if the user is logged in and if the user isnt then add a modal box and get the user to log in.
              if (likeColor === "#b0b0b0") {
                setLikeColor("#F92E54");
                setTempLikeCount(tempLikeCount + 1);
                //if the like fails it will revert back to what it was
                likePost(tempRangeIndex, postId).catch((err) => {
                  setLikeColor("#b0b0b0");
                  setTempLikeCount(tempLikeCount - 1);
                });
              } else if (likeColor === "#F92E54" && tempLikeCount >= 0) {
                setLikeColor("#b0b0b0");
                setTempLikeCount(tempLikeCount - 1);
                unlikePost(tempRangeIndex, postId).catch((err) => {
                  setLikeColor("#F92E54");
                  setTempLikeCount(tempLikeCount - 1);
                });
              }
            }}
          >
            <Text style={styles.likeText}>{tempLikeCount}</Text>
            <AntDesign name="heart" size={28} color={likeColor} />
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    return (
      <React.Fragment>
        <View style={styles.card}>
          <View style={styles.headerView}>
            <Text style={styles.creator}>{creator}</Text>
            <Text style={styles.timestamp}>{timeAgo.format(timestamp)}</Text>
          </View>
          <Text style={styles.caption}>{caption}</Text>

          <View style={styles.likeView}>
            <Text style={styles.tempRange}>Temp: {tempRange}</Text>
            <TouchableOpacity
              style={styles.likeView}
              onPress={() => {
                //TODO: add in a check to see if the user is logged in and if the user isnt then add a modal box and get the user to log in.
                //Pop up a modal
                setModalVisible(true);
              }}
            >
              <Text style={styles.likeText}>{tempLikeCount}</Text>
              <AntDesign name="heart" size={28} color="#b0b0b0" />
            </TouchableOpacity>
          </View>
        </View>
        <LoginModal
          modalVisible={modalVisible}
          onClick={() => setModalVisible(false)}
        />
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    marginBottom: 30,
    borderRadius: 10,
    borderColor: getColor(),
    borderWidth: 2,
    width: "90%",
    alignSelf: "center",
  },
  caption: {
    fontFamily: "Inter_500Medium",
    fontSize: 20,
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
    borderBottomWidth: 2,
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
