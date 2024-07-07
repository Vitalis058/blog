import { Button, Select, Spinner, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { errorNotification } from "./../utils/error";
import { useSelector } from "react-redux";
import PostCard from "./../components/PostCard";
import { IoSearchOutline } from "react-icons/io5";

function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [searchParams] = useSearchParams();
  const searchQuery = useLocation().search;
  const { theme } = useSelector((state) => state.theme);
  const navigate = useNavigate();

  useEffect(
    function () {
      const searchTermFromUrl = searchParams.get("searchTerm");
      const sortFromUrl = searchParams.get("sort");
      const categoryFromUrl = searchParams.get("category");

      if (searchParams) {
        setSidebarData({
          ...sidebarData,
          searchTerm: searchTermFromUrl,
          sort: sortFromUrl,
          category: categoryFromUrl,
        });
      }

      async function getPosts() {
        setIsLoading(true);
        const res = await fetch(`/api/post/get-posts${searchQuery}`);
        const data = await res.json();
        if (!data.success) {
          setIsLoading(false);
          errorNotification(theme, "something went wrong");
        } else {
          setPosts(data.posts);
          setIsLoading(false);

          if (data.posts === 9) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        }
      }
      getPosts();
    },
    [searchQuery, searchParams],
  );
  function handleChange(e) {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }

    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    }

    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized";
      setSidebarData({ ...sidebarData, category: category });
    }
  }

  // handle submit
  async function handleSubmit(e) {
    e.preventDefault();

    navigate(
      `/search?searchTerm=${sidebarData.searchTerm || ""}&sort=${sidebarData.sort || ""}&category=${sidebarData.category || ""}`,
    );
  }

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/post/get-posts?${searchQuery}`);
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
    <div className="flex flex-col">
      <div className=" justify-between border-b border-gray-500 p-7 md:border-r">
        <form
          className="flex flex-col justify-center gap-8 sm:flex-row"
          onSubmit={handleSubmit}
        >
          <div className="flex items-center gap-2">
            <TextInput
              id="searchTerm"
              value={sidebarData.searchTerm}
              onChange={handleChange}
              sizing="sm"
              icon={IoSearchOutline}
              className="w-full rounded-full sm:hidden"
            />
          </div>
          <div className=" flex flex-col items-center gap-2 ">
            <label className="whitespace-nowrap text-xs font-normal">
              sort
            </label>
            <Select
              id="sort"
              onChange={handleChange}
              value={sidebarData.sort || ""}
              sizing="sm"
              className="w-full"
            >
              <option value="desc">latest</option>
              <option value="asc">oldest</option>
            </Select>
          </div>
          <div className="flex flex-col items-center gap-2">
            <label className="whitespace-nowrap text-xs font-normal">
              category
            </label>
            <Select
              id="category"
              onChange={handleChange}
              value={sidebarData.category || ""}
              sizing="sm"
              className="w-full"
            >
              <option value="uncategorized">uncategorized</option>
              <option value="react">react js</option>
              <option value="javascript">javaScript</option>
              <option value="typescript">typeScript</option>
            </Select>
          </div>

          <button
            type="submit"
            outline
            className="hover:scale-y-400 h-9 w-full self-end rounded-md border-2 border-[#41A1D7] px-6 transition-all hover:bg-[#41a1d7] hover:shadow-md sm:w-28"
          >
            Apply
          </button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="mt-5 border-gray-600 p-3 text-center text-3xl font-semibold">
          Post results
        </h1>
        <div className="flex flex-wrap justify-center gap-4 p-7">
          {!isLoading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts found</p>
          )}
          {isLoading && <Spinner size="xl" className="self-center" />}
          {!isLoading &&
            posts.length > 0 &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}

          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full p-7 text-lg text-teal-500 hover:underline"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
