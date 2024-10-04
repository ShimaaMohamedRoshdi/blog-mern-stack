import React, { useEffect, useState } from "react";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signOutSuccess } from "../redux/userSlice/userSlice";

const Header = () => {
  const path = useLocation().pathname;
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // handle User Delete:
  const handleUserDelete = async () => {
    try {
      // create a response:
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      // convert the response to json:
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess(data));
      }
    } catch (error) {
      console.log("Error signing out user: ", error.message);
    }
  };
  // useEffect to get url search params:
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlSearchParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  // handle Submit Search:
  const handleSubmitSearch = (e) => {
    e.preventDefault();
    const searchUrlParams = new URLSearchParams(location.search);
    searchUrlParams.set("searchTerm", searchTerm);
    // convert searchUrlParams to string:
    const searchQuery = searchUrlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  return (
    <Navbar className="border-b-2 border-gray-300 shadow-sm bg-gray-50">
      <Link
        to={"/"}
        className="self-center whitespace-nowrap text-lg font-semibold sm:text-xl dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-green-400 rounded-md text-white">
          FreePen
        </span>
        Blog
      </Link>
      <form onSubmit={handleSubmitSearch}>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button
        className="w-12 h-12 lg:hidden"
        gradientDuoTone="greenToBlue"
        pill
      >
        <AiOutlineSearch className="text-xl mt-1 text-gray-100" />
      </Button>
      <div className="flex items-center gap-2 md:order-2">
        <Button
          onClick={() => dispatch(toggleTheme())}
          color={"gray"}
          className="w-12 h-10 hidden sm:inline"
          pill
        >
          {theme === "light" ? (
            <FaSun className="text-lg" />
          ) : (
            <FaMoon className="text-lg" />
          )}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="user"
                img={currentUser.profilePhoto}
                rounded
                bordered
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-md font-medium cursor-pointer">
                {" "}
                @{currentUser.username}
              </span>
              <span className="block text-md font-semibold cursor-pointer truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            {currentUser && currentUser.isAdmin && (
              <Link to={"/dashboard?tab=dash"}>
                <Dropdown.Item className="font-semibold border-none bg-transparent text-gray-700 text-md hover:text-red-500 transition-all duration-150">
                  DashBoard
                </Dropdown.Item>
              </Link>
            )}
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item className="font-semibold border-none bg-transparent text-gray-700 text-md hover:text-red-500 transition-all duration-150">
                Profile
              </Dropdown.Item>
            </Link>
            <Dropdown.Item
              onClick={handleUserDelete}
              className="font-semibold border-none text-gray-700 hover:text-red-500 text-md transition-all duration-150"
            >
              Sign Out
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <Button gradientDuoTone="greenToBlue" outline>
            <Link to={"/sign-in"}>Sign In </Link>
          </Button>
        )}

        <Navbar.Toggle className="border border-gray-500" />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to={"/"} className="text-lg">
            Home
          </Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to={"/about"} className="text-lg">
            About
          </Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to={"/projects"} className="text-lg">
            Projects
          </Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
