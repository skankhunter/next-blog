import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import debounce from "lodash/debounce";
import { UserCredential } from "firebase/auth";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { useAuth } from "../../lib/context";

import { goToPage, useMounted } from "../../lib/hooks";
import { firestore } from "../../lib/firebase";
import SignInWithGoogleBtn from "../../components/SignInWithGoogleBtn";

import styles from "../../styles/Signin.module.css";
import { Providers } from "../../types/providers";
import { randomInteger } from "../../lib/utils";

const SignUp: React.FC = () => {
   const router = useRouter();
   const mounted = useMounted();
   const { register, signInWithGoogle } = useAuth();
   const [isSubmiting, setIsSubmiting] = useState(false);
   const [email, setEmail] = useState("");
   const [nickname, setNickname] = useState("");
   const [isNickValid, setIsNickValid] = useState(false);
   const [isNickLoading, setIsNickLoading] = useState(false);
   const [pass, setPass] = useState("");
   const [passRepeat, setPassRepeat] = useState("");

   useEffect(() => {
      checkUsername(nickname);
   }, [nickname]);

   // Hit the database for nickname match after each debounced change
   // useCallback is required for debounce to work
   const checkUsername = useCallback(
      debounce(async (nickname: string) => {
         if (nickname.length >= 3) {
            const docRef = doc(firestore, `nicknames/${nickname}`);
            const docSnap = await getDoc(docRef);
            setIsNickValid(!docSnap.exists());
            setIsNickLoading(false);
         }
      }, 500),
      []
   );

   const handleNickname = (e) => {
      const val = e.target.value.toLowerCase();
      const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

      if (val.length < 3) {
         setNickname(e.target.value);

         setIsNickValid(false);
         setIsNickLoading(false);
      }

      if (re.test(val)) {
         setNickname(e.target.value);

         setIsNickValid(true);
         setIsNickLoading(false);
      }
   };

   const onUserCreationSuccess = async (userCreds: UserCredential) => {
      const { user } = userCreds;

      // Create refs for both documents
      const userDoc = doc(firestore, `users/${user.uid}`);
      const nicknameValue =
         user.providerData[0].providerId === Providers.GOOGLE
            ? `randomShrek${randomInteger(0, 9999)}`
            : nickname;
      const usernameDoc = doc(firestore, `nicknames/${nicknameValue}`);

      // Commit both docs together as a batch write.
      const batch = writeBatch(firestore);
      batch.set(userDoc, {
         nickname,
         photoURL: user.photoURL,
         displayName: user.displayName,
      });
      batch.set(usernameDoc, { uid: user.uid });

      await batch.commit();
      goToPage(router);
   };

   const onSubmit = (e: React.SyntheticEvent) => {
      e.preventDefault();
      if (!email || !pass || pass !== passRepeat || !isNickValid) {
         toast.error("Credentials not valid.");
         return;
      }
      setIsSubmiting(true);
      register(email, pass)
         .then(onUserCreationSuccess)
         .catch((error) => toast.error(error.message))
         .finally(() => mounted.current && setIsSubmiting(false));
   };

   const handleSignInWithGoogle = async () => {
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
               type="text"
               required
               value={nickname}
               onChange={handleNickname}
               placeholder="nickname"
            />
            <div>
               Loading: {isNickLoading.toString()}
               <br />
               Username Valid: {isNickValid.toString()}
            </div>
            <input
               type="password"
               required
               value={pass}
               onChange={(e) => setPass(e.target.value)}
               placeholder="password"
            />
            <input
               type="password"
               required
               value={passRepeat}
               onChange={(e) => setPassRepeat(e.target.value)}
               placeholder="repeat password"
            />
         </div>
         <button
            className="button btn-blue"
            type="submit"
            disabled={isSubmiting}
         >
            {isSubmiting ? <Loader show /> : "Sign up"}
         </button>
         <SignInWithGoogleBtn onClick={handleSignInWithGoogle} />
      </form>
   );
};

export default SignUp;
