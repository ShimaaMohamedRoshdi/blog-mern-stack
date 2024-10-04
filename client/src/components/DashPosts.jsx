import { Button, Modal, Spinner, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { TfiFaceSad } from "react-icons/tfi";
import { MdErrorOutline } from "react-icons/md";

const DashPosts = () => {
  const { currentUser } = useSelector((state) => state.user);
  // state to save the posts based on the user:
  const [userPosts, setUserPosts] = useState([]);
  // state to show more posts:
  const [showMore, setShowMore] = useState(true);
  // stste to show model:
  const [showModal, setShowModal] = useState(false);
  // stste to save id of post which will be deleted:
  const [postIdToDelete, setPostIdToDelete] = useState("");
  // UseEffect to Fetch the data from the api:
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // create a response:
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        // convert the response to json:
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    // call the function when the user is Administrator:
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  // handle Show More Posts:
  const handleShowMore = async () => {
    // get start Index:
    const startIndex = userPosts.length;
    try {
      // create response:
      const res = await fetch(
        `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      // convert the response to json:
      const data = await res.json();
      if (res.ok) {
        // update the userPosts array:
        setUserPosts((prevState) => [...prevState, ...data.posts]);
        // check if there are more posts:
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //Function To handle Delete Post:
  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      // create response:
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      // convert the response to json:
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prevState) =>
          prevState.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="table-auto overflow-x-scroll lg:overflow-x-hidden md:mx-auto p-3 my-5 scrollbar scrollbar-track-slate-200 scrollbar-thumb-slate-400 dark:scrollbar-track-cyan-200 dark:scrollbar-thumb-cyan-400">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>post Title</Table.HeadCell>
              <Table.HeadCell>Post Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
              <Table.Body className="divide-y" key={post._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 rounded p-[2px]  object-cover border border-gray-100 "
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium capitalize text-gray-900 dark:text-white"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell className="font-semibold text-gray-800 dark:text-cyan-500 cursor-pointer text-center">
                    {post.category}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                      className="font-medium text-[16px] text-red-500  hover:underline hover:underline-offset-2 cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-teal-500 hover:underline hover:underline-offset-2 text-[16px]"
                      to={`/update-post/${post._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="flex items-center justify-center mx-auto rounded  self-center font-semibold my-3 px-4  py-1 border border-green-500 hover:bg-green-500 text-green-500 hover:text-gray-100"
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-5 mt-10 ">
          <h1 className="text-center text-3xl font-semibold capitalize italic text-gray-700 dark:text-gray-200 underline underline-offset-2 ">
            You have No Posts Yet!
          </h1>
          <TfiFaceSad className="text-6xl text-gray-700 dark:text-yellow-300" />
        </div>
      )}
      <Modal
        show={showModal}
        popup
        size={"md"}
        onClose={() => setShowModal(false)}
      >
        <Modal.Header className="border-2 border-red-500 rounded">
          <Modal.Body>
            <div className="text-center">
              <MdErrorOutline className="h-14 w-14 text-red-600 mb-4 mx-auto" />
              <h3 className=" text-lg text-gray-500 dark:text-gray-100 mb-5 ">
                Are you sure you want to Dalete your Account?{" "}
              </h3>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button onClick={handleDeletePost} color={"failure"}>
                "Yes,Im Sure"
              </Button>
              <Button
                color={"gray"}
                className="border border-gray-400 font-semibold"
                onClick={() => setShowModal(false)}
                appearance="secondary"
              >
                No, Cancel
              </Button>
            </div>
          </Modal.Body>
        </Modal.Header>
      </Modal>
    </div>
  );
};

export default DashPosts;
