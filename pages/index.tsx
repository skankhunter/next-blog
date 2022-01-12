import {
   collectionGroup,
   getDocs,
   limit,
   orderBy,
   query,
   startAfter,
   where,
} from "firebase/firestore";
import { useState } from "react";
import Loader from "../components/Loader";
import PostFeed from "../components/PostFeed";
import { firestore, fromMillis, postToJSON } from "../lib/firebase";

const LIMIT = 1;

export async function getServerSideProps() {
   const postsQuery = query(
      collectionGroup(firestore, "posts"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(LIMIT)
   );

   const posts = (await getDocs(postsQuery)).docs.map(postToJSON);

   return {
      props: { posts },
   };
}

export default function Home(props) {
   const [posts, setPosts] = useState(props.posts);
   const [loading, setLoading] = useState(false);

   const [postsEnd, setPostsEnd] = useState(!posts.length);

   const getMorePosts = async () => {
      setLoading(true);
      const last = posts[posts.length - 1];

      const cursor =
         typeof last.createdAt === "number"
            ? fromMillis(last.createdAt)
            : last.createdAt;

      const postsQuery = query(
         collectionGroup(firestore, "posts"),
         where("published", "==", true),
         orderBy("createdAt", "desc"),
         startAfter(cursor),
         limit(LIMIT)
      );

      const newPosts = (await getDocs(postsQuery)).docs.map((doc) =>
         doc.data()
      );

      setPosts(posts.concat(newPosts));
      setLoading(false);

      if (newPosts.length < LIMIT) {
         setPostsEnd(true);
      }
   };

   return (
      <main>
         <PostFeed posts={posts} admin={true} />

         {!loading && !postsEnd && (
            <button onClick={getMorePosts}>Load more</button>
         )}

         <Loader show={loading} />

         {postsEnd && "You have reached the end!"}
      </main>
   );
}
