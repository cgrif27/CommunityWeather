import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  Alert,
  AppState,
} from "react-native";
import Background from "../components/background";
import axios from "axios";
import LoadingScreen from "./loadingScreen";
import firebase from "../firebase";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import LocNotAllowed from "../screens/locationNotAllowed";

const db = firebase.firestore();

function celciusConverter(temp) {
  let convert = temp - 273.15;
  return convert.toFixed(1);
}
export default function homeScreen() {
  //gettign the users geoLocation
  let geoOptions = {
    enableHighAccuracy: true,
    timeOut: 20000,
    maximumAge: 60 * 60,
  };
  const [long, setLong] = useState("");
  const [lat, setLat] = useState("");
  const [gettingLoc, setGettingLoc] = useState(true);
  const [suburb, setSuburb] = useState("");
  const [currentTemp, setCurrentTemp] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");

  //temp info states
  const [lowTemp, setLowTemp] = useState("");
  const [humidity, setHumidity] = useState("");
  const [wind, setWind] = useState("");
  const [highTemp, setHighTemp] = useState("");

  const [futureDates, setFutureDate] = useState([]);
  const [locationAllowed, setLocationAllowed] = useState(true);

  const [appState, setAppState] = useState(AppState.currentState);

  //getting the location of the user

  async function getLocationAsync() {
    try {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== "granted") {
        setLocationAllowed(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLong(location.coords.longitude);
      setLat(location.coords.latitude);
      setGettingLoc(false);
      setLocationAllowed(true);
      console.log("Location found");
    } catch (err) {
      //if the location services are disabled on the device level
      let status = await Location.getProviderStatusAsync();
      if (!status.locationServicesEnabled) {
        setLocationAllowed(false);
      }
    }
  }

  function handleAppStateChange(nextAppState) {
    if (appState.match(/inactive|background/) && nextAppState === "active") {
      //means the app has come from the bg to the foreground
      setGettingLoc(true);
    }
    setAppState(nextAppState);
  }

  AppState.addEventListener("change", handleAppStateChange);

  useEffect(() => {
    getLocationAsync();
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyBzJPfDtWK3x6VM7Zh6kH6TWLRTAeW_-7M`
      )
      .then((data) => {
        let parts = data.data.results[0].address_components;
        parts.forEach((part) => {
          if (part.types.includes("locality")) {
            setSuburb(part.long_name);
          }
        });
      })
      .catch((err) => console.log(err));

    //data for the weather info
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=hourly&appid=e5057124de77f988e45eaa9a691985d1`
    )
      .then((data) => data.json())
      .then((info) => {
        //changing the default weather text
        if (info.current.weather[0].main === "Clear") {
          setCurrentStatus("Sunny");
        } else setCurrentStatus(info.current.weather[0].main);

        setCurrentTemp(info.current.temp);
        setHumidity(info.current.humidity + "%");
        setLowTemp(celciusConverter(info.daily[0].temp.min));
        setHighTemp(celciusConverter(info.daily[0].temp.max));
        setWind(info.current.wind_speed);
        setFutureDate(info.daily);
      })
      .catch((err) => console.log(err));
  }, [gettingLoc]);

  let hourTime = new Date().getHours();
  if (hourTime >= 5 && hourTime < 18) {
    if (locationAllowed == false) {
      return (
        <LocNotAllowed image="https://firebasestorage.googleapis.com/v0/b/australiahot-d5cc6.appspot.com/o/noon.jpg?alt=media&token=c09bbd5d-8740-4299-884b-66819c0316cc" />
      );
    }
    //showing the loading screen if the data has not be filled
    if (currentTemp === "") {
      //change this to be something cool when loading
      return (
        <LoadingScreen image="https://firebasestorage.googleapis.com/v0/b/australiahot-d5cc6.appspot.com/o/noon.jpg?alt=media&token=c09bbd5d-8740-4299-884b-66819c0316cc" />
      );
    }
    return (
      <Background
        futureDates={futureDates}
        low={lowTemp}
        humidity={humidity}
        wind={wind}
        high={highTemp}
        currentStatus={currentStatus}
        currentTemp={currentTemp}
        suburb={suburb}
        textColor="#D7902F"
        image="https://firebasestorage.googleapis.com/v0/b/australiahot-d5cc6.appspot.com/o/noon.jpg?alt=media&token=c09bbd5d-8740-4299-884b-66819c0316cc"
        bottomImage="https://firebasestorage.googleapis.com/v0/b/australiahot-d5cc6.appspot.com/o/noon-bottom.png?alt=media&token=c03c5760-58f4-4fb4-abbf-e407e5e9c800"
      />
    );
  } else {
    if (locationAllowed == false) {
      return (
        <LocNotAllowed image="https://firebasestorage.googleapis.com/v0/b/australiahot-d5cc6.appspot.com/o/night.jpg?alt=media&token=c2bd96fc-cf73-41e4-8b8f-6c2b83867f07" />
      );
    }
    if (currentTemp === "") {
      //change this to be something cool when loading
      return (
        <LoadingScreen image="https://firebasestorage.googleapis.com/v0/b/australiahot-d5cc6.appspot.com/o/night.jpg?alt=media&token=c2bd96fc-cf73-41e4-8b8f-6c2b83867f07" />
      );
    }
    return (
      <Background
        futureDates={futureDates}
        low={lowTemp}
        humidity={humidity}
        wind={wind}
        high={highTemp}
        currentStatus={currentStatus}
        currentTemp={currentTemp}
        suburb={suburb}
        textColor="#242B73"
        image="https://firebasestorage.googleapis.com/v0/b/australiahot-d5cc6.appspot.com/o/night.jpg?alt=media&token=c2bd96fc-cf73-41e4-8b8f-6c2b83867f07"
        bottomImage="https://firebasestorage.googleapis.com/v0/b/australiahot-d5cc6.appspot.com/o/night-bottom.png?alt=media&token=27cdbaa1-24aa-416a-9c27-bbf761346cac"
      />
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    height: Dimensions.get("screen").height,
  },
});
