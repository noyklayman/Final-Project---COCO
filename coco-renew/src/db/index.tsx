import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAwP_KvNqzlcwWKvzFQew79jGEJouIYp98",
  authDomain: 'coco-df960.firebaseapp.com',
  projectId: "coco-df960",
  storageBucket: "coco-df960.appspot.com",
  messagingSenderId:"760786876135",
  appId: "1:760786876135:web:79a14ad5e60e05c1de9442",
  databaseURL: "https://coco-df960-default-rtdb.europe-west1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const database = getDatabase(app);
const firestore = getFirestore(app);

export { auth, database ,firestore};
