import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import{ getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCKcWgniReBDbSvPKnkMdFwwkdW14U3jLY",
  authDomain: "reactlinks-5fc96.firebaseapp.com",
  projectId: "reactlinks-5fc96",
  storageBucket: "reactlinks-5fc96.appspot.com",
  messagingSenderId: "1048800830940",
  appId: "1:1048800830940:web:6c34438af2b04cb4b95b19"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }