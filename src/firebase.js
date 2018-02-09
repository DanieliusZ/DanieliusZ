import Firebase from 'firebase'

const firebaseApp = Firebase.initializeApp({
    apiKey: "AIzaSyB3fJSoQyXAt9idROr0CCyvHAhC87MZWZo",
    authDomain: "darbo-apskaita-4205e.firebaseapp.com",
    databaseURL: "https://darbo-apskaita-4205e.firebaseio.com",
    projectId: "darbo-apskaita-4205e",
    storageBucket: "",
    messagingSenderId: "439685034387"
});

export const db = firebaseApp.database();