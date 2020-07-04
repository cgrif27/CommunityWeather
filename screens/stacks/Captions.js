import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  AsyncStorage,
} from "react-native";
import firebase from "../../firebase";
import getColor from "../../localFunctions/getColor";
import { Card } from "react-native-elements";
import {
  useFonts,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_500Medium,
} from "@expo-google-fonts/inter";
import CaptionCard from "../../components/CaptionCard";
import { Item, Picker, Icon } from "native-base";

import getDate from "../../localFunctions/dateConverter";

export default function Captions({ navigation }) {
  const [captions, setCaptions] = useState([]);
  const [selected, setSelected] = useState(0);

  let captionList = [];

  let sortOptions = [
    ["created_at", "desc"],
    ["created_at", "asc"],
    ["likesCount", "desc"],
    ["likesCount", "asc"],
  ];

  const [refreshing, setRefreshing] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [units, setUnits] = useState("");
  const [tempRanges, setTempRanges] = useState([]);

  let [fontsLoaded] = useFonts({
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_500Medium,
  });

  useEffect(() => {
    setRefreshing(true);
    let query = firebase
      .firestore()
      .collectionGroup("captions")
      .where("email", "==", firebase.auth().currentUser.email);

    query
      .where("isVisible", "==", true)
      .orderBy(sortOptions[selected][0], sortOptions[selected][1])
      .get()
      .then((data) => {
        data.forEach((doc) => {
          let docData = {
            data: doc.data(),
            id: doc.id,
          };
          captionList.push(docData);
        });
        setCaptions(captionList);
        setRefreshing(false);
      });
    // .catch((err) => alert(err));
    AsyncStorage.getItem("units").then((result) => {
      if (result === "celcius") {
        setTempRanges([
          "Less than 0°",
          "0° - 18°",
          "18° - 24°",
          "24° - 27°",
          "27° -35°",
          "35°+",
        ]);
      } else {
        setTempRanges([
          "Less than 32°",
          "32° - 64°",
          "64° - 75°",
          "75° - 81°",
          "81° - 95°",
          "95°+",
        ]);
      }
    });
  }, [refresh, selected]);

  if (refreshing || !fontsLoaded) {
    //returns a loading page instead of being black
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color={getColor()} />
      </View>
    );
  }

  if (captions.length === 0) {
    return (
      <View>
        <Text style={styles.heading}>Captions</Text>
        <Text style={styles.sub}>Here are all the captions you have made.</Text>
        <Text style={styles.message}>
          It looks like you havent made any captions.
        </Text>
        <Text style={styles.message}>
          Please press the plus button below to make your first one.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              let num = refresh + 1;
              setRefresh(num);
            }}
          />
        }
      >
        <Text style={styles.heading}>Captions</Text>
        <Text style={styles.sub}>Here are all the captions you have made.</Text>
        <View style={styles.sorterView}>
          <Text style={styles.sortHeader}>Sort by:</Text>
          <Picker
            mode="dropdown"
            iosIcon={<Icon name="arrow-down" />}
            style={{ width: undefined }}
            placeholderStyle={{ color: "#bfc6ea" }}
            placeholderIconColor="#007aff"
            selectedValue={selected}
            onValueChange={(e) => {
              setSelected(e);
              captionList = [];
            }}
          >
            <Picker.Item label="Newest - Oldest" value={0} />
            <Picker.Item label="Oldest - Newest" value={1} />
            <Picker.Item label="Most Liked - Least Liked" value={2} />
            <Picker.Item label="Least Liked - Most Liked" value={3} />
          </Picker>
        </View>
        {captions.map((caption) => (
          <View key={caption.id}>
            <TouchableOpacity
              onPress={() => navigation.navigate("EditCaption", caption)}
            >
              <CaptionCard
                caption={caption.data.sentence}
                tempRange={tempRanges[caption.data.tempRangeIndex]}
                timestamp={caption.data.created_at}
                likeButtonColor="#F92E54"
                likeCount={caption.data.likesCount}
                creator={caption.data.creator}
                docId={caption.id}
                rangeIndex={caption.data.tempRangeIndex}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  caption: {
    textAlign: "center",
    fontFamily: "Inter_500Medium",
    fontSize: 20,
  },
  heading: {
    textAlign: "center",
    fontFamily: "Inter_500Medium",
    fontSize: 25,
    marginTop: 20,
  },
  sub: {
    textAlign: "center",
    fontFamily: "Inter_300Light",
    fontSize: 16,
    marginBottom: 30,
  },
  created: {
    textAlign: "center",
    fontFamily: "Inter_200ExtraLight",
    fontSize: 16,
    marginTop: 10,
  },
  card: {
    backgroundColor: "white",
    padding: 10,
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    borderColor: "grey",
    borderWidth: 1,
    marginBottom: 20,
  },
  tempRange: {
    textAlign: "center",
    fontFamily: "Inter_200ExtraLight",
    fontSize: 16,
    marginTop: 10,
  },
  sorterView: {
    flexDirection: "row",
    width: "80%",
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  sortHeader: {
    alignSelf: "center",
    fontFamily: "Inter_300Light",
    fontSize: 15,
  },
  message: {
    textAlign: "center",
    fontFamily: "Inter_500Medium",
    fontSize: 20,
    margin: 20,
  },
});
