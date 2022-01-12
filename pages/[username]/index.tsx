import { getUserWithUsername, postToJSON } from "../../lib/firebase";
import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";
import {
   collection,
   query,
   getDocs,
   where,
   orderBy,
   limit,
} from "firebase/firestore";
import { Posts } from "../../types/post-feed";
import { UserData } from "../../types/user";

type Props = {
   user: UserData;
   posts: Posts;
};

export async function getServerSideProps({ query: queryParams }) {
   const { username } = queryParams;
   const userDoc = await getUserWithUsername(username);

   let user = null;
   let posts = null;

   if (userDoc) {
      user = userDoc.data();
      const postsQuery = query(
         collection(userDoc.ref, "posts"),
         where("published", "==", true),
         orderBy("createdAt", "desc"),
         limit(5)
      );

      posts = (await getDocs(postsQuery)).docs.map(postToJSON);
   }

   return {
      props: { user, posts },
   };
}

const UserProfilePage: React.FC<Props> = ({ user, posts }) => {
   return (
      <main>
         <UserProfile user={user} />
         <PostFeed posts={posts} admin={true} />
      </main>
   );
};

export default UserProfilePage;
