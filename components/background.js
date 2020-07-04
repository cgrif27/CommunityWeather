import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Animated,
  RefreshControl,
  AsyncStorage,
  Alert,
} from "react-native";
//change the font of everythign using this https://stackoverflow.com/questions/35255645/how-to-set-default-font-family-in-react-native
import {
  useFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";
import LoadingScreen from "../screens/loadingScreen";
import WeatherInfo from "../components/weatherInfo";
import ForecastList from "../components/forecastList";
import { AntDesign } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { Ionicons } from "@expo/vector-icons";
import firebase from "../firebase";
import getTempRange from "../localFunctions/getTempRange";
import tempConverter from "../localFunctions/tempConverter";
import { AdMobBanner } from "expo-ads-admob";

const db = firebase.firestore();

function timeToDate(time) {
  let date = new Date(time * 1000);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[date.getDay()] + " " + dateSuffix(date.getDate());
}

function celciusConverter(temp) {
  let convert = temp - 273.15;
  return convert.toFixed(1);
}

function dateSuffix(d) {
  if (d > 3 && d < 21) return d + "th";
  switch (d % 10) {
    case 1:
      return d + "st";
    case 2:
      return d + "nd";
    case 3:
      return d + "rd";
    default:
      return d + "th";
  }
}

function getDateString() {
  let date = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const months = [
    "January",
    "Feburary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return `${days[date.getDay()]}, ${dateSuffix(date.getDate())} ${
    months[date.getMonth()]
  }`;
}
let seenNums = [];

function randomDocNum(min, max) {
  return Math.floor(Math.random() * max) + min;
}

export default function homeScreen({
  image,
  textColor,
  suburb,
  currentTemp,
  currentStatus,
  low,
  humidity,
  wind,
  high,
  futureDates,
}) {
  let [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  const [sentence, setSentence] = useState("");
  const [firebaseLoading, setFirebaseLoading] = useState(true);
  const [size, setSize] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [creator, setCreator] = useState("");
  const [refreshing, setRefrehsing] = useState(false);
  const [units, setUnits] = useState("");
  const [captionType, setCaptionType] = useState("");
  const [lastCaption, setLastCaption] = useState(null);
  const [captionIndex, setCaptionIndex] = useState(1);
  const [trendingDisplay, setTrendingDisplay] = useState("none");
  const [adShown, setAdShown] = useState("flex");

  useEffect(() => {
    AsyncStorage.getItem("units").then((result) => {
      if (result == null) {
        console.log("Its null;");
        AsyncStorage.setItem("units", "celcius");
      }
    });
  });

  AsyncStorage.getItem("units").then((result) => {
    setUnits(result);
  });

  let rangeTemp = celciusConverter(currentTemp);
  let convertedTemp = tempConverter(currentTemp, units);

  let range = getTempRange(rangeTemp);
  let randomNum = 0;

  useEffect(() => {
    //setting the caption type result
    AsyncStorage.getItem("captionType").then((result) => {
      setCaptionType(result);
    });

    if (captionType === "random") {
      setTrendingDisplay("none");
      db.collection("posts")
        .doc(range)
        .collection("captions")
        .doc("size")
        .get()
        .then((data) => {
          setSize(data.data().count);
        });

      //checks to see if there is no more to grab and will allow them to be reshown
      if (seenNums.length === size + 1) seenNums = [];
      //gets a random number that hasnt been see before
      while (seenNums.indexOf(randomNum) >= 0) {
        randomNum = randomDocNum(1, size);
      }
      seenNums.push(randomNum);
      console.log(seenNums);
      console.log("Size: " + size);

      console.log("Random Number: " + randomNum);

      if (randomNum === 0) {
        randomNum = randomDocNum(1, size);
        setFirebaseLoading(true);
        setRefrehsing(true);
      }

      db.collection("posts")
        .doc(range)
        .collection("captions")
        .where("docNum", "==", randomNum)
        .get()
        .then((data) => {
          //if the document has been deleted it will rerun the caption lookup
          if (data.size == 0) {
            setRefresh(refresh + 1);
          }

          data.forEach((doc) => {
            //if the caption is deleted it will grab another document till it finds one that is
            // if (!doc.data().isVisible) {
            //   setRefresh(refresh + 1);
            //   return;
            // }

            setSentence(doc.data().sentence);
            setFirebaseLoading(false);
            setCreator(doc.data().creator);
            setRefrehsing(false);
          });
        })
        .catch((e) => alert(e));
    } else if (captionType === "mostPopular") {
      //for when the user freshes they want another caption
      //first caption to render
      setTrendingDisplay("flex");
      if (lastCaption == null) {
        setRefrehsing(true);
        db.collection("posts")
          .doc(range)
          .collection("captions")
          .where("isVisible", "==", true)
          .orderBy("likesCount", "desc")
          .limit(1)
          .get()
          .then((data) => {
            data.forEach((doc) => {
              setSentence(doc.data().sentence);
              setFirebaseLoading(false);
              setCreator(doc.data().creator);
              setRefrehsing(false);
              setLastCaption(data.docs[data.docs.length - 1]);
            });
          })
          .catch((e) => alert(e));
      } else {
        //Runs after there has been a captions and gets the next most popular ones
        db.collection("posts")
          .doc(range)
          .collection("captions")
          .where("isVisible", "==", true)
          .orderBy("likesCount", "desc")
          .startAfter(lastCaption)
          .limit(1)
          .get()
          .then((data) => {
            //means there is no more documents in that field
            if (data.size == 0) {
              setRefrehsing(false);
              Alert.alert(
                "Oh no!",
                "It looks like there isn't anymore captions. Come back later to see if there is anymore.",
                [
                  {
                    text: "Stay",
                  },
                  {
                    text: "Restart",
                    onPress: () => {
                      setLastCaption(null);
                      setCaptionIndex(1);
                      setRefresh(refresh + 1);
                    },
                  },
                ]
              );
            }
            data.forEach((doc) => {
              setSentence(doc.data().sentence);
              setFirebaseLoading(false);
              setCreator(doc.data().creator);
              setRefrehsing(false);
              setLastCaption(data.docs[data.docs.length - 1]);
              setCaptionIndex(captionIndex + 1);
            });
          })
          .catch((e) => alert(e));
      }
    }
  }, [size, refresh, captionType]);

  if (!fontsLoaded && firebaseLoading && randomNum === 0)
    return <LoadingScreen />;
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefrehsing(true);
            let num = refresh + 1;
            setRefresh(num);
          }}
        />
      }
    >
      <ImageBackground
        style={styles.background}
        source={{
          uri: image,
        }}
        resizeMode="repeat"
      >
        <TouchableOpacity
          style={styles.speakerView}
          onPress={() => {
            Speech.speak(sentence);
          }}
        >
          <AntDesign name="sound" size={30} color={textColor} />
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.refreshView}
          onPress={() => {
            let num = refresh + 1;
            setRefresh(num);
          }}
        >
          <Ionicons name="md-refresh" size={30} color={textColor} />
        </TouchableOpacity> */}

        <View style={styles.tempView}>
          <Text style={styles.weatherType}>{currentStatus}</Text>
          <Text style={styles.weatherTemp}>{convertedTemp}°</Text>
          {/* Maybe get rid of the date */}
          <Text style={styles.date}>{getDateString()}</Text>
        </View>

        <View style={styles.captionView}>
          <Text
            style={{
              fontSize: 16,
              color: "black",
              fontFamily: "Inter_200ExtraLight",
              textAlign: "center",
              paddingTop: 5,
              display: trendingDisplay,
            }}
          >
            #{captionIndex} on Trending
            {/* {dateSuffix(captionIndex)} most liked */}
          </Text>
          <Text style={styles.caption}>{sentence}</Text>
          <Text style={styles.captionCreator}>Creator: {creator}</Text>
        </View>

        <View style={styles.moreInfo}>
          <Text
            style={{
              fontSize: 25,
              textAlign: "center",
              padding: 20,
              color: textColor,
              fontFamily: "Inter_200ExtraLight",
            }}
          >
            {suburb.toUpperCase()}
          </Text>
          <WeatherInfo
            iconColor={textColor}
            low={low}
            humidity={humidity}
            wind={wind}
            high={high}
          />
          {/* <FlatList
              data={futureDates}
              renderItem={(date) => (
                <ForecastList
                  iconImage={`http://openweathermap.org/img/wn/${date.item.weather[0].icon}@2x.png`}
                  temp={celciusConverter(date.item.temp.day)}
                  day={timeToDate(date.item.dt)}
                />
              )}
              key={futureDates.dt}
            /> */}
          {futureDates.map((date) => (
            <ForecastList
              iconImage={`http://openweathermap.org/img/wn/${date.weather[0].icon}@2x.png`}
              temp={tempConverter(date.temp.day, units)}
              day={timeToDate(date.dt)}
              key={date.dt}
              info={date.weather[0].main}
            />
          ))}
        </View>
      </ImageBackground>
      {/* <View style={{ height: 350 }} /> */}
      <View style={styles.ads}>
        <AdMobBanner
          bannerSize="mediumRectangle"
          adUnitID="ca-app-pub-2420896677065299/4135456134"
          onDidFailToReceiveAdWithError={(e) => setAdShown("none")}
          style={{
            marginTop: 10,
            display: adShown,
          }}
          servePersonalizedAds={true}
        />
        <AdMobBanner
          bannerSize="mediumRectangle"
          adUnitID="ca-app-pub-2420896677065299/8529727213"
          onDidFailToReceiveAdWithError={(e) => setAdShown("none")}
          style={{
            marginTop: 10,
            display: adShown,
          }}
          servePersonalizedAds={true}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: {},
  weatherType: {
    fontSize: 25,
    color: "white",
    textAlign: "center",
    fontFamily: "Inter_200ExtraLight",
  },
  tempView: {
    top: 60,
    flex: 0.8,
    height: 250,
  },
  weatherTemp: {
    fontSize: 60,
    color: "white",
    textAlign: "center",
    fontFamily: "Inter_200ExtraLight",
  },
  moreInfo: {
    width: "100%",
    backgroundColor: "white",
    borderTopEndRadius: 40,
    borderTopLeftRadius: 40,
  },
  locationTitle: {
    fontSize: 25,
    textAlign: "center",
    padding: 20,
    color: "#333",
  },
  captionView: {
    flex: 0.5,
    width: "90%",
    alignSelf: "center",
    marginBottom: 50,
    backgroundColor: "rgba(255,255,255, 0.8)",
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 10,
    paddingRight: 10,
    // padding: 6,

    borderRadius: 20,
  },
  caption: {
    fontSize: 30,
    color: "#333",
    textAlign: "center",
    fontFamily: "Inter_600SemiBold",
  },
  captionCreator: {
    fontFamily: "Inter_200ExtraLight",
    textAlign: "center",
  },

  speakerView: {
    zIndex: 100,
    position: "absolute",
    right: 20,
    top: 40,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 30,
    width: 50,
    height: 50,
  },
  date: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    fontFamily: "Inter_200ExtraLight",
  },
  refreshView: {
    zIndex: 100,
    position: "absolute",
    left: 20,
    top: 40,
    backgroundColor: "white",
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  ads: {
    alignSelf: "center",
    marginTop: 20,
  },
});
