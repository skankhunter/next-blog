import React, { createContext, useContext, useEffect, useState } from "react";
import {
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   sendPasswordResetEmail,
   onAuthStateChanged,
   signInWithPopup,
   signOut,
   confirmPasswordReset,
   UserCredential,
} from "firebase/auth";
import { auth, googleAuthProvider } from "./firebase";
import { AuthContextT } from "../types/user";

const def: UserCredential = {
   user: null,
   providerId: null,
   operationType: null,
};

const AuthContext: React.Context<AuthContextT> = createContext({
   currentUser: null,
   signInWithGoogle: () => Promise.resolve(def),
   login: () => Promise.resolve(def),
   register: () => Promise.resolve(def),
   logout: () => Promise.resolve(def),
   forgotPassword: () => Promise.resolve(def),
   resetPassword: () => Promise.resolve(def),
});

export const useAuth = () => useContext(AuthContext);

export function AuthContextProvider({ children }) {
   const [currentUser, setCurrentUser] = useState(null);

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
         setCurrentUser(user ? user : null);
      });
      return () => unsubscribe();
   }, []);

   const login = (email: string, password: string) => {
      return signInWithEmailAndPassword(auth, email, password);
   };

   const register = (email: string, password: string) => {
      return createUserWithEmailAndPassword(auth, email, password);
   };

   const forgotPassword = (email: string) => {
      return sendPasswordResetEmail(auth, email);
   };

   const resetPassword = (oobCode: string, newPassword: string) => {
      return confirmPasswordReset(auth, oobCode, newPassword);
   };

   const logout = () => {
      return signOut(auth);
   };

   const signInWithGoogle = async () => {
      return signInWithPopup(auth, googleAuthProvider);
   };

   const value = {
      currentUser,
      signInWithGoogle,
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
   };

   //@ts-ignore
   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
