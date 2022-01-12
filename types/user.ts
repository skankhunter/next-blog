import { User, UserCredential } from "firebase/auth";

export type UserData = {
   displayName: string;
   nickname: string;
   photoURL: string;
};


export type AuthContextT = {
   currentUser: null | User;
   signInWithGoogle: () => Promise<UserCredential>;
   login: (email: string, pass: string) => Promise<UserCredential>;
   register: (email: string, pass: string) => Promise<UserCredential>;
   logout: () => Promise<UserCredential>;
   forgotPassword: (email: string) => Promise<UserCredential>;
   resetPassword: (
      oobCode: string,
      newPassword: string
   ) => Promise<UserCredential>;
};