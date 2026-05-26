import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwD5L5EsGLKcW-UMVPhK7X8wb3L3MW0tc",
  authDomain: "kinesia-relief.firebaseapp.com",
  projectId: "kinesia-relief",
  storageBucket: "kinesia-relief.firebasestorage.app",
  messagingSenderId: "968581110545",
  appId: "1:968581110545:web:881799983bbe0978588ab0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Session uniquement : l'utilisateur doit se reconnecter à chaque ouverture de l'appli
setPersistence(auth, browserSessionPersistence).catch(console.error);
