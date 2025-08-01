import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {GoogleAuthProvider} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDqYGhSw07JQgjwnbOOceqWBDysphmFMwc",
  authDomain: "writify-a823a.firebaseapp.com",
  projectId: "writify-a823a",
  storageBucket: "writify-a823a.firebasestorage.app",
  messagingSenderId: "588065529980",
  appId: "1:588065529980:web:7140d547d699f47e70e9f9",
  measurementId: "G-S4R49HN31R",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
