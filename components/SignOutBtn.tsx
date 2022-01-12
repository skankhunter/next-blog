import { auth } from "../lib/firebase";

const SignOutButton: React.FC = () => {
   return <button onClick={() => auth.signOut()}>Sign Out</button>;
};

export default SignOutButton;
