type ComponentProps = {
   onClick: () => void;
};

const SignInWithGoogleBtn: React.FC<ComponentProps> = (props) => {
   return (
      <button className="btn-google" onClick={props.onClick}>
         <img src={"/google.png"} /> Sign in with Google
      </button>
   );
};

export default SignInWithGoogleBtn;
