import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBnhmA1XjZpuDFs5q5GDjEGO0uxaSqvT8s",
  authDomain: "bimbel-19188.firebaseapp.com",
  databaseURL: "https://bimbel-19188-default-rtdb.firebaseio.com",
  projectId: "bimbel-19188",
  storageBucket: "bimbel-19188.appspot.com",
  messagingSenderId: "125065531558",
  appId: "1:125065531558:web:45dc785b4c81c71ccae467",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); 
}

// Inisialisasi service
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Ekspor agar bisa dipakai di komponen lain
export { firebase, auth, db, storage };
