import Link from "next/link";
import { PostData } from "../types/post-feed";

type PostItemProps = {
   post: PostData;
   admin: boolean;
};

type PostFeedProps = {
   posts: PostData[];
   admin: boolean;
};

const PostItem: React.FC<PostItemProps> = ({ post, admin = false }) => {
   const wordCount = post?.content.trim().split(/\s+/g).length;
   const minutesToRead = (wordCount / 100 + 1).toFixed(0);

   return (
      <div className="card">
         <Link href={`/${post.nickname}`}>
            <a>
               <strong>By @{post.nickname}</strong>
            </a>
         </Link>

         <Link href={`/${post.nickname}/${post.slug}`}>
            <h2>
               <a>{post.title}</a>
            </h2>
         </Link>

         <footer>
            <span>
               {wordCount} words. {minutesToRead} min read
            </span>
            <span className="push-left">💗 {post.heartCount || 0} Hearts</span>
         </footer>

         {/* If admin view, show extra controls for user */}
         {admin && (
            <>
               <Link href={`/${post.nickname}/${post.slug}`}>
                  <h3>
                     <button className="btn-blue">Edit</button>
                  </h3>
               </Link>

               {post.published ? (
                  <p className="text-success">Live</p>
               ) : (
                  <p className="text-danger">Unpublished</p>
               )}
            </>
         )}
      </div>
   );
};

const PostFeed: React.FC<PostFeedProps> = ({ posts, admin }) => {
   return (
      <>
         {posts
            ? posts.map((post) => (
                 <PostItem post={post} key={post.slug} admin={admin} />
              ))
            : null}
      </>
   );
};

export default PostFeed;
