import { auth, firestore } from "../lib/firebase";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { NextRouter, useRouter } from "next/router";

// Custom hook to read user data from db
export function useUserData() {
   const [user] = useAuthState(auth);
   const [nickname, setUNickname] = useState(null);

   const getUserData = async () => {
      const userRef = doc(firestore, `users/${user?.uid}`);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
         setUNickname(userSnapshot.data()?.nickname);
         return;
      }
   };

   useEffect(() => {
      getUserData();
   }, [user]);

   return { user, nickname };
}

export const useMounted = () => {
   const mounted = useRef(false);
   useEffect(() => {
      mounted.current = true;
      return () => {
         mounted.current = false;
      };
   }, []);

   return mounted;
};


export const goToPage = (router: NextRouter, url: string = '/') => {
  router.push(url);
}