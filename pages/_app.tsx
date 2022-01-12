import React from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import { AuthContextProvider } from "../lib/context";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
   return (
      <>
         <AuthContextProvider>
            <Navbar />
            <Component {...pageProps} />
         </AuthContextProvider>
         <Toaster />
      </>
   );
}
export default MyApp;
