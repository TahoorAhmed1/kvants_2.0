import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBx5uCJeu44wz5sHwVcTJdGxqbcCecoeIo",
    authDomain: "kvantas-c287c.firebaseapp.com",
    projectId: "kvantas-c287c",
    storageBucket: "kvantas-c287c.appspot.com",
    messagingSenderId: "220317376027",
    appId: "1:220317376027:web:5b211e8f56284c4094e2be",
    measurementId: "G-85B4YG8P9W"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log(
    db, app
);

export { db };

