import * as firebase from "firebase";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyAE7YW80UOgMSIH1Lg79DPacUvbmtdKfvA",
  authDomain: "australiahot-d5cc6.firebaseapp.com",
  databaseURL: "https://australiahot-d5cc6.firebaseio.com",
  projectId: "australiahot-d5cc6",
  storageBucket: "australiahot-d5cc6.appspot.com",
  messagingSenderId: "840944330443",
  appId: "1:840944330443:web:a61b01c57e2cb710f9dd4e",
  measurementId: "G-0WVHYK1NS0",
};
// Initialize Firebase

export default firebase.initializeApp(firebaseConfig);
