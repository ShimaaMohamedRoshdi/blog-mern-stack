import { Alert, Button, Modal, Spinner, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BsFillSendFill } from "react-icons/bs";
import { BiSolidCommentError } from "react-icons/bi";
import { VscDebugBreakpointLog } from "react-icons/vsc";
import CommentCom from "./CommentCom";
import { MdErrorOutline } from "react-icons/md";

const CommentSection = ({ postId }) => {
  // get the current user:
  const { currentUser } = useSelector((state) => state.user);
  // state to save the comments:
  const [comment, setComment] = useState("");
  // state to show error and loading:
  const [commentError, setCommentError] = useState(null);
  const [commentLoading, setCommentLoading] = useState(false);
  // state to save the fetched comments:
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  // state to save id of the comment to delete:
  const [commentIdToDelete, setCommentIdToDelete] = useState(null);
  const navigate = useNavigate();

  // handle Submit Comment:
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      setCommentError("Comment is too long. Maximum character limit is 200.");
      return;
    }
    try {
      setCommentLoading(true);
      setCommentError(null);
      // create response:
      const res = await fetch("/api/comment/createcomment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      // convert to json:
      const data = await res.json();
      if (!res.ok) {
        setCommentError(data.message);
        setCommentLoading(false);
        return;
      }
      if (res.ok) {
        setComment("");
        setCommentLoading(false);
        // // refresh comments:
        // window.location.reload()
        setCommentError(null);
        setComments([data, ...comments]);
      }
    } catch (error) {
      console.log("Error creating comment ", error.message);
      setCommentError(error.message);
      setCommentLoading(false);
    }
  };

  // useEffect to show the user:
  useEffect(() => {
    const getComments = async () => {
      try {
        // create response:
        const res = await fetch(`/api/comment/getcommentsPost/${postId}`);
        // convert response to json:
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          return;
        }
        if (res.ok) {
          setComments(data);
        }
      } catch (error) {
        console.log("Error getting user ", error.message);
      }
    };
    getComments();
  }, [postId]);

  // Function to add likes to the comment:
  const addLikeComment = async (commentId) => {
    try {
      // check if there is user:
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }

      // create a response:
      const res = await fetch(`/api/comment/likecomment/${commentId}`, {
        method: "PUT",
      });
      // convert the response to json:
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
        return;
      }
      if (res.ok) {
        // console.log(data) // // to check if the respose is ok or not
        // update the comments:
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                  // numberOfLikes:data.numberOfLikes // second way to get number of likes
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log("Error adding like to comment ", error.message);
    }
  };

  // Function to Edit Comments:
  const handleEditComment = (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };
  // Function to Delete Comments:
  const handleDeleteComment = async (commentId) => {
    try {
      // check if the user no authorized:
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      // create a response:
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE",
      });
      // convert the response to json:
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
        return;
      }
      if (res.ok) {
        // update the comments:
        setComments(comments.filter((comm) => comm._id !== commentId));
        setShowModal(false);
        setCommentIdToDelete(null);
      }
    } catch (error) {
      console.log("Error deleting comment ", error.message);
    }
  };
  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center my-4 gap-[6px] text-gray-600 dark:text-gray-100 text-sm">
          <p className="font-semibold">- Signed In as:</p>
          <img
            src={currentUser.profilePhoto}
            alt={currentUser.username}
            className="w-5 h-5 object-cover rounded-full"
          />
          <Link
            to={"/dashboard?tab=profile"}
            title="profile"
            className="  px-1  border border-cyan-600 hover:bg-cyan-600 hover:text-white   rounded-md transition-all duration-150"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 my-7 text-sm text-gray-500">
          <span className="underline underline-offset-2">
            - You Must be Sign In to continue to comment.
          </span>
          <Link
            to={"/sign-in"}
            className="cursor-pointer text-red-500 px-2 py-1 bg-gray-50 hover:bg-red-500 hover:text-white border-2 font-medium border-red-500 transition-all duration-150 rounded-md"
          >
            Sign In
          </Link>
        </div>
      )}
      {/* Comment Form */}
      {currentUser && (
        <form
          onSubmit={handleSubmitComment}
          className="border p-3 border-cyan-500 rounded-tl-lg rounded-br-lg"
        >
          <Textarea
            rows={3}
            placeholder="Write your comment..."
            maxLength={"200"}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex items-center justify-between mt-3">
            <p className="text-gray-600 font-semibold dark:text-gray-400">
              <span
                className={`border border-cyan-500 text-cyan-500 px-1 py-1 rounded-md ${
                  200 - comment.length === 0
                    ? "text-red-500 border border-red-500"
                    : ""
                }`}
              >
                {200 - comment.length}
              </span>{" "}
              Characters Remaining.
            </p>
            <Button
              // gradientDuoTone={"purpleToBlue"}
              type="submit"
              color="blue"
              size={"xs"}
              pill
              className="text-white"
              title="comment"
              disabled={commentLoading || comment.length === 0}
            >
              <BsFillSendFill className="text-[16px]" />
            </Button>
            {/* {commentLoading && (
              <div className="ml-2">
                <Spinner size="sm" />
              </div>
            )} */}
          </div>
          {commentError && (
            <Alert color={"failure"} icon={BiSolidCommentError}>
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {/*Show Comments */}
      {comments.length === 0 ? (
        <Alert
          color={"failure"}
          icon={BiSolidCommentError}
          className="my-5 font-semibold text-sm"
        >
          No comments found. Be the first to comment.
        </Alert>
      ) : (
        <>
          <div className="flex items-center gap-1 my-5 ">
            <p className="flex items-center font-semibold text-gray-500 dark:text-gray-300">
              <VscDebugBreakpointLog className="text-[15px] mt-[1px] text-cyan-600" />{" "}
              Comments:
            </p>
            <div className="border px-2 py-1  rounded-md border-gray-600 dark:border-cyan-600">
              {comments.length}
            </div>
          </div>
          {comments.map((comment) => (
            <CommentCom
              key={comment._id}
              comment={comment}
              onLike={addLikeComment}
              onEdit={handleEditComment}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentIdToDelete(commentId);
              }}
            />
          ))}
        </>
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
                Are you sure you want to Dalete this Comment?{" "}
              </h3>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={() => handleDeleteComment(commentIdToDelete)}
                color={"failure"}
              >
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

export default CommentSection;
