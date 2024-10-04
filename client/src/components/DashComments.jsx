import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { TfiFaceSad } from "react-icons/tfi";

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(
        `/api/comment/getcomments?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll lg:overflow-x-hidden md:mx-auto p-3 my-5 scrollbar scrollbar-track-slate-200 scrollbar-thumb-slate-400 dark:scrollbar-track-cyan-200 dark:scrollbar-thumb-cyan-400">
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
              <Table.Body className="divide-y" key={comment._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{comment.content}</Table.Cell>
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  <Table.Cell>{comment.postId}</Table.Cell>
                  <Table.Cell>{comment.userId}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
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
            You have No Comments Yet!
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
                Are you sure you want to Dalete This comment?{" "}
              </h3>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button onClick={handleDeleteComment} color={"failure"}>
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
}
