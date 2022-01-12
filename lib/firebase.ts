import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
   collection,
   query,
   getDocs,
   getFirestore,
   where,
   limit,
   Timestamp,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
   apiKey: "AIzaSyAjwnqP15s3k2bHZMIrVuQqnxVjVScfpgA",
   authDomain: "blog-7a5ff.firebaseapp.com",
   projectId: "blog-7a5ff",
   storageBucket: "blog-7a5ff.appspot.com",
   messagingSenderId: "1039644513104",
   appId: "1:1039644513104:web:d78173e5f0c90e8b915255",
   measurementId: "G-HR3KX1Q9GY",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const googleAuthProvider = new GoogleAuthProvider();

export async function getUserWithUsername(nickname: string) {
   const q = query(
      collection(firestore, "users"),
      where("nickname", "==", nickname),
      limit(1)
   );

   const userDoc = (await getDocs(q)).docs[0];

   return userDoc;
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
   const data = doc.data();
   return {
      ...data,
      // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
      createdAt: data.createdAt.toMillis(),
      updatedAt: data.updatedAt.toMillis(),
   };
}

export const fromMillis = Timestamp.fromMillis;
