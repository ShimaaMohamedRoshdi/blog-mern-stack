import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import {
  HiArrowCircleRight,
  HiDocumentText,
  HiUser,
  HiUserGroup,
} from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { signOutSuccess } from "../redux/userSlice/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { VscCommentDiscussion } from "react-icons/vsc";
import { IoBarChartSharp } from "react-icons/io5";

const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState();
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      // create a resposne:
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      // convert data to json object:
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log("Error signing out user ", error.message);
      // dispatch error action here for UI feedback:
      // dispatch(signOutFailure(error.message)) // Uncomment when using Redux slice for error handling.  The error message will be displayed in the UI.  The action would be dispatched to the Redux store to update the state.  The UI would then show an error message.  Note: This is a placeholder and should be replaced with actual error handling logic.  This example assumes the error message is returned in the response data.  In a real-world application, you would need to handle the error response differently.  For example, you might want to retry the request, display a different error message, or handle it differently based on the status code of the response.  For more information on error handling in Redux, see the official Redux documentation: https://redux.js.org/usage/advanced/async-actions#error-handling-in-
    }
  };
  return (
    <Sidebar className="w-full md:w-56 border-r border-t-2 border-r-gray-300 dark:border-t-transparent dark:border-r-transparent">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-2">
          {
            currentUser && currentUser.isAdmin &&(
              <Link to={"/dashboard?tab=dash"}>
              <Sidebar.Item
                as="div"
                icon={IoBarChartSharp}
                // labelColor={"dark"}
                active={tab === "dash" || !tab}
                className="font-[600]"
              >
                Dashboard
              </Sidebar.Item>
            </Link>
            )
          }
          <Link to={"/dashboard?tab=profile"}>
            <Sidebar.Item
              as={"div"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor={"dark"}
              active={tab === "profile"}
              className="font-[600]"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser && currentUser.isAdmin && (
            <Link to={"/dashboard?tab=posts"}>
              <Sidebar.Item
                as="div"
                icon={HiDocumentText}
                labelColor={"dark"}
                active={tab === "posts"}
                className="font-[600]"
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}
          {currentUser && currentUser.isAdmin && (
            <>
            <Link to={"/dashboard?tab=users"}>
              <Sidebar.Item
                as="div"
                icon={HiUserGroup}
                // labelColor={"dark"}
                active={tab === "users"}
                className="font-[600]"
              >
                Users
              </Sidebar.Item>
            </Link>
            <Link to={"/dashboard?tab=comments"}>
              <Sidebar.Item
                as="div"
                icon={VscCommentDiscussion}
                // labelColor={"dark"}
                active={tab === "comments"}
                className="font-[600]"
              >
                Comments
              </Sidebar.Item>
            </Link>
            </>
          )}
          <Sidebar.Item
            onClick={handleDelete}
            icon={HiArrowCircleRight}
            className="cursor-pointer font-[600]"
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
