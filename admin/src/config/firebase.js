import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCPKJtu6B8o78gUthQrS9edBCtASdXUc3A",
    authDomain: "zamani-70e13.firebaseapp.com",
    databaseURL: "https://zamani-70e13-default-rtdb.firebaseio.com",
    projectId: "zamani-70e13",
    storageBucket: "zamani-70e13.firebasestorage.app",
    messagingSenderId: "865180079005",
    appId: "1:865180079005:web:11b221908a2d4b95639574",
    measurementId: "G-S4KL904ZJ3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
