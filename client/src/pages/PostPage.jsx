import { Alert, Button, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import { MdError } from "react-icons/md";
import PostCard from "../components/PostCard";

const PostPage = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  // state to save the data when fetching posts:
  const [post, setPost] = useState(null);
  // state to save recent posts:
  const [recentPosts, setRecentPosts] = useState(null);
  // useEffect to fetch the post based on the slug:
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(false);
        // create response:
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        // convert response to json:
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          console.log(data.message);
          return;
        }

        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
        }
      } catch (error) {
        console.log(error.message);
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  // useEffect to get recent posts:
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setLoading(true);
        setError(false);
        // create response:
        const res = await fetch(`/api/post/getposts?limit=3`);
        // convert response to json:
        const data = await res.json();
        if (!res.ok) {
          setError(data.message);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setRecentPosts(data.posts);
          setLoading(false);
        }
      } catch (error) {
        console.log(error.message);
        setError(error.message);
        setLoading(false);
      }
    };
    fetchRecentPosts();
  }, []);

  //   Put the loading :
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size={"xl"} color={"pink"} />
      </div>
    );
  }

  return (
    <main className="p-3 max-w-6xl flex flex-col mx-auto min-h-screen">
      <h1 className="text-3xl max-w-2xl mx-auto p-3 font-serif mt-8 lg:text-5xl">
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className="self-center mt-5"
      >
        <Button gradientMonochrome="success" pill size={"sm"}>
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.title}
        className="max-h-[600px] border border-gray-500 dark:border-cyan-500 rounded-md mt-5 w-full p-3 object-cover"
      />
      <div className="flex items-center justify-between p-3 border-b border-b-gray-500 dark:border-b-cyan-500 max-w-2xl mx-auto w-full text-sm">
        <span className="font-semibold">
          {post && new Date(post.createdAt).toLocaleDateString()}
        </span>
        <span className="italic font-semibold">
          {post && (post.content.length / 500).toFixed(0)}mins read
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      <CommentSection postId={post._id} />
      <div className="flex flex-col items-center justify-center mb-5">
        <h1 className="text-2xl font-semibold  mt-5 text-gray-600 dark:text-cyan-400 font-mono">
          Recent Article
        </h1>
        <div className="flex flex-wrap gap-5 mt-5 justify-center items-center">
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
      {error && (
        <Alert color={"failure"} icon={MdError} className="font-semibold mt-5">
          {error}
        </Alert>
      )}
    </main>
  );
};

export default PostPage;
