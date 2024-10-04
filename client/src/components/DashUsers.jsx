import { Button, Modal, Spinner, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { TfiFaceSad } from "react-icons/tfi";
import { MdErrorOutline, MdCheckCircle } from "react-icons/md";
import { FaUserCheck, FaUserTimes } from "react-icons/fa";

const DashUsers = () => {
  const { currentUser } = useSelector((state) => state.user);
  // state to save the posts based on the user:
  const [users, setUsers] = useState([]);
  // state to show more posts:
  const [showMore, setShowMore] = useState(true);
  // stste to show model:
  const [showModal, setShowModal] = useState(false);
  // stste to save id of post which will be deleted:
  const [userIdToDelete, setUserIdToDelete] = useState("");
  // UseEffect to Fetch the data from the api:
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // create a response:
        const res = await fetch(`/api/user/getusers`);
        // convert the response to json:
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    // call the function when the user is Administrator:
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  // handle Show More Posts:
  const handleShowMore = async () => {
    // get start Index:
    const startIndex = users.length;
    try {
      // create response:
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      // convert the response to json:
      const data = await res.json();
      if (res.ok) {
        // update the userPosts array:
        setUsers((prevState) => [...prevState, ...data.users]);
        // check if there are more posts:
        if (data.users.length < 9) {
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
  const handleDeleteUser = async () => {
    try {
      // create response:
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
      });
      // convert the response to json:
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModal(false); // close modal after success message is shown
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="table-auto overflow-x-scroll lg:overflow-x-hidden md:mx-auto p-3 my-5 scrollbar scrollbar-track-slate-200 scrollbar-thumb-slate-400 dark:scrollbar-track-cyan-200 dark:scrollbar-thumb-cyan-400">
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell className="text-center">
                Date created
              </Table.HeadCell>
              <Table.HeadCell className="text-center">
                user Image
              </Table.HeadCell>
              <Table.HeadCell className="text-center">username</Table.HeadCell>
              <Table.HeadCell className="text-center">email</Table.HeadCell>
              <Table.HeadCell className="text-center">Admin</Table.HeadCell>
              <Table.HeadCell className="text-center">Delete</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body className="divide-y" key={user._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePhoto}
                      alt={user.username}
                      className="w-12 h-12 rounded-full p-[2px]  object-cover border border-gray-100"
                    />
                  </Table.Cell>
                  <Table.Cell className="truncate">{user.username}</Table.Cell>
                  <Table.Cell className="font-semibold text-gray-800  dark:text-cyan-500 cursor-pointer text-center">
                    {user.email}
                  </Table.Cell>
                  <Table.Cell className="text-gray-600 dark:text-gray-400">
                    {user.isAdmin ? (
                      <FaUserCheck className="text-green-500 text-xl cursor-pointer  mx-auto " />
                    ) : (
                      <FaUserTimes className="text-red-500 text-xl cursor-pointer  mx-auto " />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
                      }}
                      className="font-medium text-[16px] text-red-500  hover:underline hover:underline-offset-2 cursor-pointer"
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
            You have No Users Yet!
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
        <Modal.Header className="border border-red-500 rounded">
          <Modal.Body>
            <div className="text-center">
              <MdErrorOutline className="h-14 w-14 text-red-600 mb-4 mx-auto" />
              <h3 className=" text-lg text-gray-500 dark:text-gray-100 mb-5 ">
                Are you sure you want to Dalete This User?{" "}
              </h3>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button onClick={handleDeleteUser} color={"failure"}>
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

export default DashUsers;
