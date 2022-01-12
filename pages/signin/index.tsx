import React, { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { useAuth } from "../../lib/context";
import { firestore } from "../../lib/firebase";

import { goToPage, useMounted } from "../../lib/hooks";
import Link from "next/link";
import { UserCredential } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import SignInWithGoogleBtn from "../../components/SignInWithGoogleBtn";

import styles from "../../styles/Signin.module.css";
import { randomInteger } from "../../lib/utils";

const SignIn: React.FC = () => {
   const router = useRouter();
   const mounted = useMounted();
   const { login, signInWithGoogle } = useAuth();
   const [isSubmiting, setIsSubmiting] = useState(false);
   const [email, setEmail] = useState("");
   const [pass, setPass] = useState("");

   const onSubmit = (e: React.SyntheticEvent) => {
      e.preventDefault();
      if (!email || !pass) {
         toast.error("Please, provide credentials.");
         return;
      }
      setIsSubmiting(true);
      login(email, pass)
         .then(() => goToPage(router))
         .catch((error) => toast.error(error.message))
         .finally(() => mounted.current && setIsSubmiting(false));
   };

   const onUserCreationSuccess = async (userCreds: UserCredential) => {
      const { user } = userCreds;

      const userRef = doc(firestore, `users/${user.uid}`);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
         goToPage(router);

         return;
      }

      await setDoc(userRef, {
         nickname: `randomShrek${randomInteger(0, 9999)}`,
         photoURL: user.photoURL,
         displayName: user.displayName,
      });
      goToPage(router);
   };

   const handleSignInWithGoogle = () => {
      setIsSubmiting(true);

      signInWithGoogle()
         .then(onUserCreationSuccess)
         .finally(() => mounted.current && setIsSubmiting(false));
   };

   return (
      <form className={styles.signinForm} onSubmit={onSubmit}>
         <div>
            <input
               type="email"
               required
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               placeholder="email"
            />
            <input
               type="password"
               required
               value={pass}
               onChange={(e) => setPass(e.target.value)}
               placeholder="password"
            />
         </div>
         <button
            className="button btn-blue"
            type="submit"
            disabled={isSubmiting}
         >
            {isSubmiting ? <Loader show /> : "Sign in"}
         </button>
         <Link href="/forgot-pass">Forgot password?</Link>
         <SignInWithGoogleBtn onClick={handleSignInWithGoogle} />
      </form>
   );
};

export default SignIn;
