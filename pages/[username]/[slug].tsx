import PostContent from "../../components/PostContent";
import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase";
import {
   collection,
   collectionGroup,
   doc,
   DocumentData,
   DocumentReference,
   getDoc,
   getDocs,
} from "firebase/firestore";
import { PostData } from "../../types/post-feed";

import styles from "../../styles/Post.module.css";

type ComponentProps = {
   post: PostData;
   path: DocumentReference<DocumentData>;
};

export async function getStaticProps({ params }) {
   const { username, slug } = params;
   const userDoc = await getUserWithUsername(username);

   let post;
   let path;

   if (userDoc) {
      const postsRes = collection(userDoc.ref, "posts");
      const postRef = doc(postsRes, slug);
      post = postToJSON(await getDoc(postRef));

      path = postRef.path;
   }

   return {
      props: { post, path },
      revalidate: 5000,
   };
}

export async function getStaticPaths() {
   const postsRef = await collectionGroup(firestore, "posts");
   const snapshot = await getDocs(postsRef);

   const paths = snapshot.docs.map((doc) => {
      const { slug, nickname } = doc.data();
      return {
         params: { username: nickname, slug },
      };
   });

   return {
      paths,
      fallback: "blocking",
   };
}

const Post = ({ post }: ComponentProps) => {
   return (
      <main className={styles.container}>
         <section>
            <PostContent post={post} />
         </section>

         <aside className="card">
            <p>
               <strong>{post.heartCount || 0} 🤍</strong>
            </p>
         </aside>
      </main>
   );
};

export default Post;
