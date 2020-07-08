import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  Alert,
} from "react-native";
import Background from "../components/background";
import axios from "axios";
import LoadingScreen from "./loadingScreen";
import firebase from "../firebase";

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

  function geoSuccess(position) {
    setLong(position.coords.longitude);
    setLat(position.coords.latitude);
    setGettingLoc(false);
  }

  function geoFail(err) {
    if (err) {
      Alert.alert(
        "Location Not Found",
        'There was error finding your location. Please make sure that "Location Permissions" are enabled.'
      );
    }
  }

  let userLocation = navigator.geolocation.getCurrentPosition(
    geoSuccess,
    geoFail,
    geoOptions
  );

  //TODO: Make the api key an evironment variable
  //Geocoding from the coords to an address in order to get the suburb

  useEffect(() => {
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
  }, [gettingLoc]);

  //data for the weather info
  useEffect(() => {
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
      />
    );
  } else {
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
