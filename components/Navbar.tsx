import Link from "next/link";
import { useAuth } from "../lib/context";
import { useUserData } from "../lib/hooks";
import SignOutButton from "./SignOutBtn";

const Navbar: React.FC = () => {
   const {user, nickname} = useUserData()

   return (
      <nav className="navbar">
         <ul>
            <li>
               <Link href="/">
                  <button className="btn-logo">FEED</button>
               </Link>
            </li>

            {/* user is signed-in and has username */}
            {user && (
               <>
                  <li className="push-left">
                     <Link href="/admin">
                        <button className="btn-blue">Write Posts</button>
                     </Link>
                  </li>
                  <li>
                     <Link href={`/${nickname}`}>
                        <img src={user?.photoURL} />
                     </Link>
                  </li>
                  <li>
                     <SignOutButton />
                  </li>
               </>
            )}

            {/* user is not signed OR has not created username */}
            {!user && (
               <>
                  <li>
                     <Link href="/signin">
                        <button className="btn-blue">Sign in</button>
                     </Link>
                  </li>
                  <li>
                     <Link href="/signup">
                        <button className="btn">Sign up</button>
                     </Link>
                  </li>
               </>
            )}
         </ul>
      </nav>
   );
};

export default Navbar;
