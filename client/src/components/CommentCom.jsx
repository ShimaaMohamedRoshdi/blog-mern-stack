import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { FiEdit } from "react-icons/fi";
import { IoSaveSharp } from "react-icons/io5";
import { Button, Textarea } from "flowbite-react";
import { RiDeleteBinLine } from "react-icons/ri";

const CommentCom = ({ comment, onLike, onEdit, onDelete }) => {
  // get the currentUser:
  const { currentUser } = useSelector((state) => state.user);
  // state to save the user's comment
  const [user, setUser] = useState({});
  // state to show text area to edit the comment:
  const [isEditing, setIsEditing] = useState(false);
  // state to save edited comment:
  const [editedComment, setEditedComment] = useState(comment.content);
  // useEffect to get the user:
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [comment]);
  // console.log(user);
  // console.log(comment);

  // handle Edit Comment:
  const handleEdit = () => {
    setIsEditing(true);
    setEditedComment(comment.content);
  };

  // handle Save Edit Comment and fetch the data from the api:
  const handleSaveEditComment = async () => {
    try {
      // create response:
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editedComment }),
      });

      // convert to json:
      const data = await res.json();
      if (!res.ok) {
        console.log("Error editing comment ", data.message);
      }

      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedComment);
      }
    } catch (error) {
      console.log("Error saving edited comment ", error.message);
    }
  };

  // handle delete comment:
  return (
    <div className="p-4 flex border-b rounded-xl border-b-gray-400 dark:border-b-cyan-500">
      {/* div for image start here */}
      <div className="flex-shrink-0 mr-3">
        <img
          src={user.profilePhoto}
          alt={user.username}
          className="w-10 h-10 rounded-full bg-gray-500"
        />
      </div>
      {/* div for image end here */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold mr-1 text-sm truncate dark:text-cyan-500">
            {user ? `@${user.username}` : "Anonymous user"}
          </span>
          <span className="text-gray-400 text-xs border-b border-b-gray-400 rounded-full">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className="mb-2"
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button
                onClick={handleSaveEditComment}
                type="button"
                size={"sm"}
                color={"success"}
              >
                <IoSaveSharp className="text-lg font-semibold" />
              </Button>
              <Button
                type="button"
                size={"sm"}
                color={"failure"}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p>{comment.content}</p>
            <div className="flex mt-2 items-center pt-[6px] text-xs border-t border-t-gray-500 dark:border-cyan-500  max-w-fit gap-2">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`text-gray-500  hover:text-blue-500 text-[20px] ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-600"
                }`}
              >
                <FaThumbsUp />
              </button>
              <p className="text-sm font-semibold dark:text-cyan-500">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "Like" : "Likes")}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      type="button"
                      className="text-green-600 dark:text-gray-300 dark:hover:text-green-500 active:scale-75 transition-all duration-150"
                      onClick={handleEdit}
                      title="Edit comment"
                    >
                      <FiEdit className="text-[18px]" />
                    </button>
                    <button
                      onClick={() => onDelete(comment._id)}
                      title="Delete comment"
                      type="button"
                      className="text-red-600 dark:text-gray-300 dark:hover:text-red-500 active:scale-75 transition-all duration-150"
                    >
                      <RiDeleteBinLine className="text-[18px]" />
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CommentCom;
