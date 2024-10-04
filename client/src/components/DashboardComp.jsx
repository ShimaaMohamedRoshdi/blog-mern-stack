import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiUserGroup,
} from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

const DashboardComp = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [usersLastMonthAgo, setUsersLastMonthAgo] = useState(0);
  const [commentsLastMonthAgo, setCommentsLastMonthAgo] = useState(0);
  const [postsLastMonthAgo, setPostsLastMonthAgo] = useState(0);
  const [errorUsers, setErrorUsers] = useState(null);
  const [errorPosts, setErrorPosts] = useState(null);
  const [errorComments, setErrorComments] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  // useEffect to fetch and get the data from the server:
  useEffect(() => {
    // fetch users:
    const fetchUsers = async () => {
      try {
        setErrorUsers(null);
        const res = await fetch("/api/user/getusers?limit=5");
        const data = await res.json();
        if (!res.ok) {
          // console.log(data.message);
          setErrorUsers(data.message);
          return;
        }
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setUsersLastMonthAgo(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
        setErrorUsers(error.message);
      }
    };
    // fetch posts:
    const fetchPosts = async () => {
      try {
        setErrorPosts(null);
        const res = await fetch("/api/post/getposts?limit=5");
        const data = await res.json();
        if (!res.ok) {
          console.log("Error Fetching Users", data.message);
          setErrorPosts(data.message);
          return;
        }
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setPostsLastMonthAgo(data.lastMonthPosts);
        }
      } catch (error) {
        console.log("Error Fetcghing posts", error.message);
        setErrorPosts(error.message);
      }
    };
    // fetch comments:
    const fetchComments = async () => {
      try {
        setErrorComments(null);
        const res = await fetch("/api/comment/getcomments?limit=5");
        const data = await res.json();
        if (!res.ok) {
          // console.log(data.message);
          setErrorComments(data.message);
          return;
        }
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setCommentsLastMonthAgo(data.lastMonthComments);
        }
      } catch (error) {
        console.log("Error Fetching comments", error.message);
        setErrorComments(error.message);
      }
    };

    // call Functions if the user is Admin:
    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);
  return (
    <div className="p-3 my-5 md:mx-auto">
      <div className="flex flex-wrap gap-4 justify-center items-center ">
        {/* users start here */}
        <div className="flex flex-col p-3 dark:bg-slate-700 gap-4 w-full md:w-72 border border-teal-500 dark:border-cyan-500 rounded-md shadow-lg lg:hover:scale-105 transition-all duration-200 ">
          <div className="flex justify-between">
            <div className="text-teal-500 dark:text-cyan-500">
              <h3 className="text-gray-500 font-medium dark:text-gray-200 text-md uppercase">
                Total Users
              </h3>
              {totalUsers}
            </div>
            <HiUserGroup className="bg-teal-500 text-white dark:bg-cyan-500 rounded-full text-5xl p-3 shadow-xl" />
          </div>
          <div className="flex gap-2">
            <div
              className={`flex text-md items-center text-green-500 ${
                usersLastMonthAgo === 0 ? "text-red-500" : ""
              }`}
            >
              <HiArrowNarrowUp />
              {usersLastMonthAgo}
            </div>
            <p className="text-gray-500 font-[500] text-md dark:text-cyan-500">
              Last Month
            </p>
          </div>
        </div>
        {/* users end here */}
        {/* posts start here */}
        <div className="flex flex-col p-3 dark:bg-slate-700 gap-4 w-full md:w-72 border border-lime-500 rounded-md shadow-lg lg:hover:scale-105 transition-all duration-200 ">
          <div className="flex justify-between">
            <div className="text-teal-500 dark:text-cyan-500">
              <h3 className="text-gray-500 font-medium dark:text-gray-200 text-md uppercase">
                Total Posts
              </h3>
              {totalPosts}
            </div>
            <HiDocumentText className="bg-lime-500 text-white  rounded-full text-5xl p-3 shadow-xl" />
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`flex text-md items-center text-green-500 ${
                postsLastMonthAgo === 0 ? "text-red-500" : ""
              }`}
            >
              <HiArrowNarrowUp />
              {postsLastMonthAgo}
            </div>
            <p className="text-gray-500 font-[500] text-md dark:text-lime-500">
              Last Month
            </p>
          </div>
        </div>
        {/* posts End Here */}
        {/* comments start here */}
        <div className="flex flex-col p-3 dark:bg-slate-700 gap-4 w-full md:w-72 rounded-md shadow-lg border border-indigo-600 lg:hover:scale-105 transition-all duration-200  ">
          <div className="flex justify-between">
            <div className="text-indigo-600 dark:text-cyan-500">
              <h3 className="text-gray-500 font-medium dark:text-gray-200 text-md uppercase">
                Total Comments
              </h3>
              {totalComments}
            </div>
            <HiAnnotation className="bg-indigo-600 text-white  rounded-full text-5xl p-3 shadow-xl" />
          </div>
          <div className="flex gap-2">
            <div
              className={`flex text-md items-center text-green-500 ${
                commentsLastMonthAgo === 0 ? "text-red-500" : ""
              }`}
            >
              <HiArrowNarrowUp />
              {commentsLastMonthAgo}
            </div>
            <p className="text-gray-500 font-[500] text-md dark:text-indigo-600">
              Last Month
            </p>
          </div>
        </div>
        {/* comments End here */}
      </div>
      {/* tables start here */}
      <div className="flex flex-wrap gap-5 my-7 mx-auto justify-center">
        {/* table users statrt here */}
        <div className="flex flex-col w-full  md:w-auto shadow-lg border border-teal-500 dark:border-cyan-500 rounded-md dark:bg-gray-800">
          <div className="flex items-center justify-between p-3 font-semibold text-md">
            <h1 className="text-center p-2 dark:text-cyan-500">Recent Users</h1>
            <Link to={"/dashboard?tab=users"}>
              <Button
                pill
                size={"sm"}
                className="bg-teal-500 uppercase dark:bg-cyan-500 active:scale-75 transition-all duration-300"
              >
                See All
              </Button>
            </Link>
          </div>
          <Table hoverable>
            <Table.Head className="border-b border-t dark:border-b-cyan-500 dark:border-t-cyan-500">
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell className="border-l dark:border-l-cyan-500">
                User Name
              </Table.HeadCell>
            </Table.Head>
            {users &&
              users.map((user) => (
                <Table.Body key={user._id} className="divide-y">
                  <Table.Row>
                    <Table.Cell>
                      <img
                        src={user.profilePhoto}
                        alt={user.username}
                        className="w-10 h-10 rounded-full bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        {/* table users end here */}
        {/* table comments statrt here */}
        {comments.length > 0 && (
          <div className="flex flex-col w-full md:w-auto shadow-lg border border-indigo-600  rounded-md dark:bg-gray-800">
            <div className="flex items-center justify-between p-3 font-semibold text-md">
              <h1 className="text-center p-2 text-indigo-600">
                Recent Comments
              </h1>

              <Button
                pill
                size={"sm"}
                className="!bg-indigo-500 uppercase  active:scale-75 transition-all duration-300"
              >
                <Link to={"/dashboard?tab=comments"}>See All</Link>
              </Button>
            </div>
            <Table hoverable>
              <Table.Head className="border-b border-t dark:border-b-indigo-600 dark:border-t-indigo-600">
                <Table.HeadCell>comment content</Table.HeadCell>
                <Table.HeadCell className="border-l dark:border-l-indigo-600">
                  likes
                </Table.HeadCell>
              </Table.Head>
              {comments &&
                comments.map((comment) => (
                  <Table.Body key={comment._id} className="divide-y">
                    <Table.Row>
                      <Table.Cell className="w-96 line-clamp-2">
                        {comment.content}
                      </Table.Cell>
                      <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))}
            </Table>
          </div>
        )}

        {/* tabel comments end here */}
        {/* table posts statrt here */}
        <div className="flex flex-col w-full md:w-auto shadow-lg border border-lime-500  rounded-md dark:bg-gray-800">
          <div className="flex items-center justify-between p-3 font-semibold text-md">
            <h1 className="text-center p-2 dark:text-lime-500">Recent Posts</h1>
            <Button
              pill
              size={"sm"}
              className="!bg-lime-500 uppercase  active:scale-75 transition-all duration-300"
            >
              <Link to={"/dashboard?tab=posts"}>See All</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head className="border-b text-center border-t dark:border-b-lime-500 dark:border-t-lime-500">
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell className="border-l border-r dark:border-r-lime-500 dark:border-l-lime-500">
                post title
              </Table.HeadCell>
              <Table.HeadCell>category</Table.HeadCell>
            </Table.Head>
            {posts &&
              posts.map((post) => (
                <Table.Body key={post._id} className="divide-y">
                  <Table.Row>
                    <Table.Cell>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-14 h-10 mx-auto rounded-md bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell className="text-center w-96">
                      {post.title}
                    </Table.Cell>
                    <Table.Cell className="text-center w-5">
                      {post.category}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        {/* table Posts end here */}
      </div>
      {/* tables end here */}
    </div>
  );
};

export default DashboardComp;
