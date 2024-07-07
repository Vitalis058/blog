import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import PostCard from "./../components/PostCard";
import { useEffect, useState } from "react";

function Home() {
  const [posts, setPosts] = useState([]);

  // getting the posts
  useEffect(function () {
    async function getPosts() {
      try {
        const res = await fetch("/api/post/get-posts");
        const data = await res.json();
        setPosts(data.posts);
      } catch (error) {
        console.log(error);
      }
    }
    getPosts();
  }, []);

  return (
    <div>
      <div className="mx-auto flex  h-1/2 max-w-6xl flex-col gap-6 p-4 px-2">
        <h1 className="text-3xl font-bold lg:text-6xl">
          Welcome to my Blog Page
        </h1>
        <p className="text-xs text-gray-500 sm:text-sm">
          Here you will find a variety of articles and tutorials on topics such
          as web development, software engineering, and programming languages.
        </p>
        <Link
          to="/search"
          className="text-xs font-bold text-teal-500 hover:underline sm:text-sm"
        >
          View All Posts
        </Link>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-8 p-3 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-center text-2xl font-semibold">Recent Posts</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            <Link
              to={"/search"}
              className="text-center text-lg text-teal-500 hover:underline"
            >
              View All Posts
            </Link>
          </div>
        )}
      </div>
      <div className=" p-3 ">
        <CallToAction />
      </div>
    </div>
  );
}

export default Home;
