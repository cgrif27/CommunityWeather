import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  AsyncStorage,
} from "react-native";
import {
  useFonts,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_500Medium,
} from "@expo-google-fonts/inter";
import VoteCard from "../components/VoteCard";
import firebase from "../firebase";
import getColor from "../localFunctions/getColor";
import { Item, Picker, Icon } from "native-base";
import { FlatList } from "react-native-gesture-handler";
import { Context } from "../SortingContext";

let captionList = [];

function VoteHeader() {
  const [selected, setSelected] = useContext(Context);

  return (
    <React.Fragment>
      <View style={styles.container}>
        <Text style={styles.heading}>Vote on Your Favourite Captions</Text>
        <Text style={styles.sub}>
          Here you can see everyones captions and choose your favourite ones.
          After you find one you like, tap the heart button.
        </Text>
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
      </View>
    </React.Fragment>
  );
}

export default function Vote() {
  let [fontsLoaded] = useFonts({
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_500Medium,
  });

  const db = firebase.firestore();

  const [data, setData] = useState([]);

  const [captions, setCaptions] = useState([]);

  //variables for sorting the data
  const [selected, setSelected] = useContext(Context);

  const [likedPost, setLikedPost] = useState("");
  const [likesCount, setLikesCount] = useState(0);

  const [unlikedPost, setUnlikedPost] = useState("");
  const [unlikedTempRangeIndex, setUnlikedTempRangeIndex] = useState(-1);

  const tempRanges = ["-0", "0-18", "18-24", "24-27", "27-35", "35+"];
  const [tempRangeIndex, setTempRangeIndex] = useState(-1);
  const [refresh, setRefresh] = useState(0);

  const [signedIn, setSignedIn] = useState(false);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  //limiting for the number of votes it will return
  const limit = 10;

  let sortOptions = [
    ["created_at", "desc"],
    ["created_at", "asc"],
    ["likesCount", "desc"],
    ["likesCount", "asc"],
  ];

  //this is the firebase function for pagination
  const [lastDoc, setLastDoc] = useState(null);

  const [tempRangesArray, setTempRangesArray] = useState([]);
  const [changed, setChanged] = useState(0);

  const [likeButtonColor, setLikeButtonColor] = useState("#b0b0b0");

  function resetVoteCards() {
    setLastDoc(null);
    let num = refresh + 1;
    setRefresh(num);
    captionList = [];
    setData(captionList);
  }

  //resets the data and researches when the sorting value changes
  //IMPORTANT: Keep it in this spot
  useEffect(() => {
    setChanged(changed + 1);
    if (changed > 0) {
      //resetting the pagination
      resetVoteCards();
    }
  }, [selected]);

  useEffect(() => {
    setLoadingMore(true);
    if (lastDoc == null) {
      console.log("Running from last doc null");
      db.collectionGroup("captions")
        .where("isVisible", "==", true)
        .orderBy(sortOptions[selected][0], sortOptions[selected][1])
        .limit(limit)
        .get()
        .then((data) => {
          if (data.size == 0) setLoadingMore(false);
          setLastDoc(data.docs[data.docs.length - 1]);
          data.forEach((doc) => {
            let docData = {
              data: doc.data(),
              id: doc.id,
            };
            if (!captionList.includes(doc.id)) {
              captionList.push(docData);
            } else {
              console.log("It tried to duplicate something");
            }
            // doc.get("likes").push("test");
            setLoadingMore(false);
            setRefreshing(false);
          });
          setData(captionList);
          setLoading(false);
        });
    }

    //gettting the users units and setting the temp range
    AsyncStorage.getItem("units").then((result) => {
      if (result === "celcius") {
        setTempRangesArray([
          "Less than 0°",
          "0° - 18°",
          "18° - 24°",
          "24° - 27°",
          "27° -35°",
          "35°+",
        ]);
      } else {
        setTempRangesArray([
          "Less than 32°",
          "32° - 64°",
          "64° - 75°",
          "75° - 81°",
          "81° - 95°",
          "95°+",
        ]);
      }
    });
  }, [refresh]);

  let updatedOnce = 0;

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      //setting if a user is logged in
      updatedOnce++;
      if (user) {
        setSignedIn(true);
        //checking if it has been updated more then once because it updated at the start and then when it changes so ti will run the same query twice
        if (updatedOnce > 1) {
          setLastDoc(null);
          let num = refresh + 1;
          setRefresh(num);
          captionList = [];
          setData(captionList);
        }
      } else {
        setSignedIn(false);
      }
    });
  }, []);

  if (loading || !fontsLoaded) {
    //returns a loading page instead of being black
    return (
      <View style={[styles.loadingBox, styles.horizontal]}>
        <ActivityIndicator size="large" color={getColor()} />
      </View>
    );
  }

  return (
    <React.Fragment>
      <View
        style={{ height: StatusBar.currentHeight, backgroundColor: "white" }}
      />
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              //resetting the pagination
              resetVoteCards();
            }}
          />
        }
        data={data}
        ListFooterComponent={
          <View>
            <ActivityIndicator
              size="large"
              style={{
                alignSelf: "center",
              }}
              animating={loadingMore}
              color={getColor()}
            />
          </View>
        }
        ListHeaderComponent={<VoteHeader />}
        keyExtractor={(item) => item.id}
        onEndReachedThreshold={0.1}
        onEndReached={() => {
          console.log("At the end");
          if (lastDoc != null) {
            console.log("Running from here");
            setLoadingMore(true);
            //loading the next page of data
            db.collectionGroup("captions")
              .where("isVisible", "==", true)
              .orderBy(sortOptions[selected][0], sortOptions[selected][1])
              .startAfter(lastDoc)
              .limit(limit)
              .get()
              .then((data) => {
                if (data.size == 0) setLoadingMore(false);
                setLastDoc(data.docs[data.docs.length - 1]);
                data.forEach((doc) => {
                  let docData = {
                    data: doc.data(),
                    id: doc.id,
                  };
                  // captionList.push(docData);
                  if (!captionList.includes(docData)) {
                    captionList.push(docData);
                  } else {
                    console.log("It tried to duplicate something");
                  }
                  setLoadingMore(false);
                  setRefreshing(false);
                });
                setData(captionList);
                setLoading(false);
              });
          }
        }}
        renderItem={({ item }) => {
          if (signedIn) {
            //checks if the user has liked the post and makes the heart red if so
            if (item.data.likes.includes(firebase.auth().currentUser.email)) {
              return (
                <VoteCard
                  postId={item.id}
                  likes={item.data.likes}
                  caption={item.data.sentence}
                  creator={item.data.creator}
                  timestamp={item.data.created_at}
                  likeCount={item.data.likes.length}
                  likeButtonColor="#F92E54"
                  tempRange={tempRangesArray[item.data.tempRangeIndex]}
                  tempRangeIndex={item.data.tempRangeIndex}
                />
              );
            } else {
              //if the user is logged in but hasnt liked the post will make it grey
              return (
                <VoteCard
                  postId={item.id}
                  likes={item.data.likes}
                  caption={item.data.sentence}
                  creator={item.data.creator}
                  timestamp={item.data.created_at}
                  likeCount={item.data.likes.length}
                  likeButtonColor="#b0b0b0"
                  tempRange={tempRangesArray[item.data.tempRangeIndex]}
                  tempRangeIndex={item.data.tempRangeIndex}
                />
              );
            }
          }
          //if the user isnt logged in but we want to show the post with the grey heart
          return (
            <VoteCard
              postId={item.id}
              likes={item.data.likes}
              caption={item.data.sentence}
              creator={item.data.creator}
              timestamp={item.data.created_at}
              likeCount={item.data.likes.length}
              likeButtonColor="#F92E54"
              tempRange={tempRangesArray[item.data.tempRangeIndex]}
              tempRangeIndex={item.data.tempRangeIndex}
            />
          );
        }}
      />
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  loadingBox: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  container: {
    alignSelf: "center",
    marginTop: 60,
    width: "90%",
  },
  heading: {
    fontFamily: "Inter_500Medium",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 5,
  },
  sub: {
    fontFamily: "Inter_300Light",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 30,
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
});
