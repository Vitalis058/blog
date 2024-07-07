import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { errorNotification } from "../utils/error";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { FaArrowUp } from "react-icons/fa6";
import { MdOutlineArticle } from "react-icons/md";
import { HiAnnotation } from "react-icons/hi";
import { Button, Table } from "flowbite-react";

function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalCommments] = useState([]);
  const [totalUsers, setTotalUsers] = useState([]);
  const [lastMonthPosts, setLastMonthPosts] = useState([]);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const navigate = useNavigate();

  useEffect(
    function () {
      // users
      async function fetchUsers() {
        const res = await fetch("/api/user/get-users?limit=5");
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      }
      // posts
      async function fetchPosts() {
        const res = await fetch("/api/post/get-posts?limit=5");
        const data = await res.json();
        if (data.success) {
          setPosts(data.posts);
          setTotalPosts(data.totalPost);
          setLastMonthPosts(data.lastMonthPosts);
        }
      }

      //comments
      async function fetchComments() {
        const res = await fetch("/api/comment/get-all-comments?limit=5");
        const data = await res.json();
        if (data.success) {
          setComments(data.comments);
          setLastMonthComments(data.lastMonthComments);
          setTotalCommments(data.totalComments);
        }
      }

      // caling the functions
      if (currentUser.isAdmin) {
        fetchUsers();
        fetchPosts();
        fetchComments();
      } else {
        errorNotification(theme, "you are not allowed to perform this action");
        navigate("/");
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser],
  );
  return (
    <div className="p-3 md:mx-auto">
      <div className="flex flex-wrap justify-center gap-4">
        {/* users */}
        <div className="flex max-h-fit w-full flex-col gap-4 rounded-md p-3 shadow-md dark:bg-slate-700 md:w-72">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-md uppercase text-gray-500">Total Users</h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className=" rounded-full bg-teal-600 p-3 text-5xl text-white shadow-xl" />
          </div>
          <div className="flex gap-3 text-sm">
            <span className="flex items-center text-green-500">
              <FaArrowUp />
              {lastMonthUsers}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>

        {/* comments */}
        <div className="flex max-h-fit w-full flex-col gap-4 rounded-md p-3 shadow-md dark:bg-slate-700 md:w-72">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-md uppercase text-gray-500">
                Total Comments
              </h3>
              <p className="text-2xl">{totalComments}</p>
            </div>
            <HiAnnotation className=" rounded-full bg-indigo-600 p-3 text-5xl text-white shadow-xl" />
          </div>
          <div className="flex gap-3 text-sm">
            <span className="flex items-center text-green-500">
              <FaArrowUp />
              {lastMonthComments}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>

        {/* posts */}
        <div className="flex max-h-fit w-full flex-col gap-4 rounded-md p-3 shadow-md dark:bg-slate-700 md:w-72">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-md uppercase text-gray-500">Total Posts</h3>
              <p className="text-2xl">{totalPosts}</p>
            </div>
            <MdOutlineArticle className=" rounded-full bg-lime-600 p-3 text-5xl text-white shadow-xl" />
          </div>
          <div className="flex gap-3 text-sm">
            <span className="flex items-center text-green-500">
              <FaArrowUp />
              {lastMonthPosts}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>
      </div>

      {/* to hold the tables */}
      <div className="mx-auto flex flex-wrap justify-center gap-5 p-3">
        {/*  */}
        <div className="flex w-full flex-col rounded-md shadow-md dark:bg-gray-800 md:w-auto">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="p-2 text-center">Recent users</h1>
            <Button outline className="bg-[#41A1D7]" size="sm" pill>
              <Link to={"/dashboard?tab=users"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>username</Table.HeadCell>
            </Table.Head>
            {users &&
              users.map((user) => (
                <Table.Body key={user._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        src={user.photoUrl}
                        alt={user.username}
                        className="h-10 w-10 rounded-full bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        {/*  */}

        {/*  */}
        <div className="flex w-full flex-col rounded-md shadow-md dark:bg-gray-800 md:w-auto">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="p-2 text-center">Recent users</h1>
            <Button outline className="bg-[#41A1D7]" size="sm" pill>
              <Link to={"/dashboard?tab=comments"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>comment content</Table.HeadCell>
              <Table.HeadCell>likes</Table.HeadCell>
            </Table.Head>
            {comments &&
              comments.map((comment) => (
                <Table.Body key={comment._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <p className="line-clamp-2">{comment.content}</p>
                    </Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        {/*  */}

        {/*  */}
        <div className="flex w-full flex-col rounded-md shadow-md dark:bg-gray-800 md:w-auto">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="p-2 text-center">Recent users</h1>
            <Button outline className="bg-[#41A1D7]" size="sm" pill>
              <Link to={"/dashboard?tab=posts"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>post title</Table.HeadCell>
              <Table.HeadCell>category</Table.HeadCell>
            </Table.Head>
            {posts &&
              posts.map((post) => (
                <Table.Body key={post._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-10 w-10 rounded-full bg-gray-500 object-cover"
                      />
                    </Table.Cell>
                    <Table.Cell>{post.title}</Table.Cell>
                    <Table.Cell>{post.category}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        {/*  */}
      </div>
    </div>
  );
}

export default DashboardComp;
