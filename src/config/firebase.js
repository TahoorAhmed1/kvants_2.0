import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: 'AIzaSyCWzLsxvC32GC9lGHdKY8e_DfQPd1Ioj0E',
    authDomain: 'taptap-2ca60.firebaseapp.com',
    projectId: 'taptap-2ca60',
    storageBucket: 'taptap-2ca60.appspot.com',
    messagingSenderId: '436266436372',
    appId: '1:436266436372:web:4f226df3739762601aa401',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log(
    db, app
);

export { db };

