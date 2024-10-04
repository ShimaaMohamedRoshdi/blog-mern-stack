import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [errorPosts, setErrorPosts] = useState(null);

  // useEffect to fetch the data:
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setErrorPosts(null);
        // create response based on id the post:
        const res = await fetch("/api/post/getposts");
        // convert response to json:
        const data = await res.json();
        if (!res.ok) {
          setErrorPosts(data.message);
          return;
        }
        if (res.ok) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.log("Error fetching posts: ", error.message);
        setErrorPosts(error.message);
      }
    };
    fetchPosts();
  }, []);
  return (
    <div>
      <div className="p-28 px-3 max-w-6xl mx-auto flex flex-col gap-6">
        <h1 className="capitalize text-3xl lg:text-6xl font-bold text-gray-600 dark:text-cyan-500 font-mono  ">
          welcome to my blog
        </h1>
        <p className="text-sm lg:text-md dark:text-gray-300 capitalize">
          Here you'll find a variety of articles and tutorials on topics such as
          web development, software engineering, and programming languages.
        </p>
        <Link
          to={"/search"}
          className="px-2 py-1 border border-cyan-600 w-fit hover:bg-cyan-600 hover:text-white rounded-md font-semibold mx-auto"
        >
          View All Posts
        </Link>
      </div>
      <div className="p-7 bg-amber-300 dark:bg-slate-700">
        <CallToAction />
      </div>
      <div className=" p-3 max-w-6xl mx-auto flex flex-col gap-8 py-7 items-center">
        {
          posts && posts.length >0 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-center text-3xl font-semibold font-mono">Recent Posts</h2>
              <div className="flex flex-wrap gap-4">
                {posts.map((post)=>(
                  <PostCard key={post._id} post={post}/>
                ))}
              </div>
              <Link
                to={"/search"}
                className="px-2 py-1 border border-cyan-600 w-fit hover:bg-cyan-600 hover:text-white rounded-md font-semibold mx-auto"
              >
                View All Posts
              </Link>
            </div>
          )
        }

      </div>
    </div>
  );
};

export default Home;
