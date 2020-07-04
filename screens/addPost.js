import React, { useState, useEffect } from "react";

import AddPost from "../components/AddPost";
import AppLoading from "./loadingScreen";
import PostSignedOut from "./PostSignedOut";

//firbase
import firebase from "../firebase";
const db = firebase.firestore();

export default function addPost() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      //setting if a user is logged in
      if (user) {
        setSignedIn(true);
      } else {
        setSignedIn(false);
      }
    });
  }, []);

  if (signedIn) {
    return <AddPost />;
  } else {
    return <PostSignedOut />;
  }
}
