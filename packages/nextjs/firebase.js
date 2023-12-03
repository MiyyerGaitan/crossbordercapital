
//import firebase from 'firebase/app';
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBBzbSumvlaHSedZxZj1B3avZrHRKgF85M",
    authDomain: "crossborder-capital.firebaseapp.com",
    projectId: "crossborder-capital",
    storageBucket: "crossborder-capital.appspot.com",
    messagingSenderId: "458383179957",
    appId: "1:458383179957:web:0fcf31668ae426b5183efc"
};

export const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
