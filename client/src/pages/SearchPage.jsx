import { Alert, Button, Select, Spinner, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import { HiInformationCircle } from "react-icons/hi";

const SearchPage = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [posts, setPosts] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  // useEffect to get the url:
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    // Function to fetch the data from the server:
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setSearchError(false);
        const searchQuery = urlParams.toString();
        // create response:
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        // convert response to json:
        const data = await res.json();
        if (!res.ok) {
          setSearchError(data.message);
          setLoading(false);
          return;
        }
        setPosts(data.posts);
        setLoading(false);
        if (data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      } catch (error) {
        setSearchError(error.message);
        setLoading(false);
        setShowMore(false);
      }
    };
    fetchPosts();
  }, [location.search]);

  // handle Change
  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }

    if (e.target.id === "sort") {
      const order = e.target.value || "asc";
      setSidebarData({ ...sidebarData, sort: order });
    }

    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized";
      setSidebarData({ ...sidebarData, category });
    }
  };

  // handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // create and set the new url search params:
    const urlSearchParams = new URLSearchParams(location.search);
    urlSearchParams.set("searchTerm", sidebarData.searchTerm);
    urlSearchParams.set("sort", sidebarData.sort);
    urlSearchParams.set("category", sidebarData.category);
    // convert to string:
    const searchQuery = urlSearchParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  // handle show more:
  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/post/getposts?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      if (data.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };
  return (
    <div className="flex flex-col md:flex-row">
      {/* sidebar start here */}
      <div className="p-7 border-b md:border-r dark:border-b-cyan-500 dark:md:border-r-cyan-500 md:min-h-screen border-b-gray-500">
        <form onSubmit={handleSubmit} className="flex flex-col gap-9">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <TextInput
              type="text"
              id="searchTerm"
              placeholder="Search..."
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select onChange={handleChange} id="sort" value={sidebarData.sort}>
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold">Category:</label>
            <Select
              onChange={handleChange}
              id="category"
              value={sidebarData.category}
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="javascript">JavaScript</option>
              <option value="reactjs">React.JS</option>
              <option value="nodejs">Node.Js</option>
              <option value="nextjs">Next.js</option>
              <option value="tailwindcss">Tailwind.CSS</option>
            </Select>
          </div>

          {/* Button */}
          <Button
            type="submit"
            disabled={loading}
            className="uppercase  active:scale-90 transition-all duration-150"
            outline
            gradientDuoTone={"greenToBlue"}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner size={"md"} color={"pink"} />
                <span>Search...</span>
              </div>
            ) : (
              "Search"
            )}
          </Button>
          {searchError && (
            <Alert color="failure" icon={HiInformationCircle} className="mt-5 ">
              <span className="font-semibold">{searchError}</span>
            </Alert>
          )}
        </form>
      </div>
      {/* sidebar end here */}
      {/* content start here */}
      <div className="w-full">
        <h1 className="text-3xl w-fit text-gray-700 dark:text-cyan-500 p-3 mt-5 font-semibold font-mono border-b-2 border-b-gray-400 dark:border-b-cyan-500">
          Post Results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 && (
            <Alert className="mt-3" color="failure" icon={HiInformationCircle}>
              <span className="font-semibold">No posts found.</span>
            </Alert>
          )}
          {loading && (
            <div className="flex items-center my-7 justify-center mx-auto">
              <Spinner size={"xl"} color={"pink"} />
            </div>
          )}
          {!loading &&
            posts &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
        {showMore && (
          <button
            onClick={handleShowMore}
            className="flex items-center justify-center mx-auto rounded  self-center font-semibold my-3 px-4  py-1 border border-green-500 hover:bg-green-500 text-green-500 hover:text-gray-100"
          >
            Show More
          </button>
        )}
      </div>
      {/* content end here */}
    </div>
  );
};

export default SearchPage;
