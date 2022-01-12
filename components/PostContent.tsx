import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { PostData } from "../types/post-feed";

type ComponentProps = {
   post: PostData;
};

const PostContent = ({ post }: ComponentProps) => {
   return (
      <div className="card">
         <h1>{post?.title}</h1>
         <span className="text-sm">
            Written by{" "}
            <Link href={`/${post.nickname}/`}>
               <a className="text-info">@{post.nickname}</a>
            </Link>{" "}
            on {new Date(post.createdAt).toISOString()}
         </span>
         <ReactMarkdown>{post?.content}</ReactMarkdown>
      </div>
   );
};

export default PostContent;
