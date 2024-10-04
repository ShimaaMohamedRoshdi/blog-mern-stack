import React from "react";
import { Link } from "react-router-dom";
import { MdOutlineAccessTimeFilled } from "react-icons/md";

const PostCard = ({ post }) => {
  return (
    <div className="group relative shadow-md  w-full border-2 border-cyan-600  h-[400px] overflow-hidden rounded-lg sm:w-[350px] transition-all duration-300">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt={post.title}
          className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20"
        />
      </Link>
      <div className="p-3 flex flex-col gap-2">
        <p className="font-semibold line-clamp-2 text-xl dark:text-cyan-500">
          {post.title}
        </p>
        <div className="flex items-center justify-between">
          <span className="italic">{post.category}</span>
          <span className="flex items-center gap-1 text-gray-500 dark:text-cyan-500 text-sm">
            <MdOutlineAccessTimeFilled className="text-lg" />
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
        <Link
          to={`/post/${post.slug}`}
          className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
