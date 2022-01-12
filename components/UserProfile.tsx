import { UserData } from "../types/user";

type Props = {
   user: UserData;
};

const UserProfile: React.FC<Props> = ({ user }) => {
   return (
      <div className="box-center">
         <img
            src={user?.photoURL || "/hacker.png"}
            className="card-img-center"
         />
         <p>
            <i>@{user?.nickname}</i>
         </p>
         <h1>{user?.displayName || "Anonymous User"}</h1>
      </div>
   );
};

export default UserProfile;
