import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { errorNotification } from "../utils/error";
import { useSelector } from "react-redux";
import { Button, Spinner } from "flowbite-react";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

function PostPage() {
  const { postSlug } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState({});
  const [recentArticles, setRecentArticles] = useState();
  const { theme } = useSelector((state) => state.theme);

  useEffect(
    function () {
      async function getPost() {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/post/get-posts?slug=${postSlug}`);
          const data = await res.json();
          if (data.success === true) {
            setPost(data.posts[0]);
            setIsLoading(false);
          } else {
            errorNotification(theme, "something went wrong");
          }
        } catch (error) {
          console.log(error);
          errorNotification(theme, error.message);
          setIsLoading(false);
        }
      }

      getPost();
    },
    [postSlug],
  );

  //getting the recent articles
  useEffect(function () {
    try {
      const getRecentPosts = async () => {
        const res = await fetch("/api/post/get-posts?limit=3&sort=asc");
        const data = await res.json();
        if (data.success) {
          setRecentArticles(data.posts);
        }
      };
      getRecentPosts();
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="xl" />
      </div>
    );

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col p-3">
      <h1 className="mx-auto mt-10 p-3 text-center font-serif text-3xl font-bold lg:text-4xl">
        {post && post.title}
      </h1>

      <Link
        to={`/search?category=${post && post.category}`}
        className="mt-5 self-center"
      >
        <Button className="" color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.title}
        className="mt-10 max-h-[600px] w-full object-cover p-3"
      />

      <div className="mx-auto  flex w-full max-w-2xl justify-between border-b-2 border-slate-500 p-3 text-xs">
        <span>{post && new Date(post.updatedAt).toLocaleDateString()}</span>
        <span className="italic">
          {/* {post && (Array.from(post.content).length / 1000).toFixed(0)} mins */}
          read
        </span>
      </div>

      {/* adding the html content dynamically */}
      <div
        className="post-content break-word mx-auto w-full max-w-2xl overflow-auto p-3"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>

      <div className="mx-auto w-full max-w-4xl">
        <CallToAction />
      </div>
      <div className="mx-auto w-full max-w-2xl">
        <CommentSection postId={post._id} />
      </div>
      <div className="mb-5 flex flex-col items-center justify-center">
        <h1 className="mt-5 text-xl">Recent Articles</h1>
        <div className="mt-5 flex flex-wrap justify-center gap-5">
          {recentArticles && recentArticles.length > 0 ? (
            recentArticles.map((article) => (
              <PostCard key={article._id} post={article} />
            ))
          ) : (
            <p>no recent posts found</p>
          )}
        </div>
      </div>
    </main>
  );
}

export default PostPage;
