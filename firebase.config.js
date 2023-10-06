
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCaV_ikT4HTCXVnw64g9GNVjxnJG3ZlmuU",
  authDomain: "adventure-park-10111.firebaseapp.com",
  projectId: "adventure-park-10111",
  storageBucket: "adventure-park-10111.appspot.com",
  messagingSenderId: "41906163361",
  appId: "1:41906163361:web:75b9b20d4fd2de13f1aae0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage};