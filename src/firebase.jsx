import firebase from "firebase";

let firebaseConfig = {
    apiKey: "AIzaSyDweP2M-lzNHqg-R4Fq-kjtcZ8yKdDEino",
    authDomain: "cuando-347e1.firebaseapp.com",
    databaseURL: "https://cuando-347e1.firebaseio.com",
    projectId: "cuando-347e1",
    storageBucket: "cuando-347e1.appspot.com",
    messagingSenderId: "1000921888211",
    appId: "1:1000921888211:web:b01527b54ec9534a5aeb26",
    measurementId: "G-Z50Q3H1310"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;