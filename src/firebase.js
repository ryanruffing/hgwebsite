import "firebase/database";
import {getDatabase} from "firebase/database";
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyDAqlKIAOytuwOyE2hieKXlf3cyH0b391I",
  authDomain: "hitting-genie.firebaseapp.com",
  databaseURL: "https://hitting-genie-default-rtdb.firebaseio.com",
  projectId: "hitting-genie",
  storageBucket: "hitting-genie.appspot.com",
  messagingSenderId: "858478401316",
  appId: "1:858478401316:web:6a40fb046799f6860685b1",
  measurementId: "G-WCKLC4VPJP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);

export default app;