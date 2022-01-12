import React, { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { useAuth } from "../../lib/context";

import styles from "../../styles/Signin.module.css";
import { useMounted } from "../../lib/hooks";

const ForgotPassword: React.FC = () => {
   const router = useRouter();
   const mounted = useMounted();
   const { forgotPassword } = useAuth();
   const [isSubmiting, setIsSubmiting] = useState(false);
   const [email, setEmail] = useState("");

   const onSubmit =  async (e: React.SyntheticEvent) => {
      e.preventDefault();
      if (!email) {
         toast.error("Please, provide credentials.");
         return;
      }
      setIsSubmiting(true);
      try {
         await forgotPassword(email)
         toast(`Email has been sent to ${email}.`)
         mounted.current && setIsSubmiting(false);
         router.push('/login')
       } catch (error) {
         toast(error.message)
         mounted.current && setIsSubmiting(false);
       }
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
         </div>
         <button
            className="button btn-blue"
            type="submit"
            disabled={isSubmiting}
         >
            {isSubmiting ? <Loader show /> : "Reset"}
         </button>
      </form>
   );
};

export default ForgotPassword;
