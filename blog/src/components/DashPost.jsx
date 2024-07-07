import { Button, Modal, Spinner, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { BsExclamationCircle } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function DashPost() {
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postId, setPostId] = useState(null);

  useEffect(
    function () {
      async function getPosts() {
        setIsLoading(true);
        try {
          const res = await fetch(
            `/api/post/get-posts?userId=${currentUser._id}`,
          );
          const data = await res.json();
          if (data.success === true) {
            setUserPosts(data.posts);
            setIsLoading(false);
            if (data.posts.length < 9) {
              setShowMore(false);
            }
          }
        } catch (error) {
          console.log(error);
          setIsLoading(false);
        }
      }
      // call the func if the user is an admin
      if (currentUser.isAdmin) {
        getPosts();
      }
    },
    [currentUser._id, currentUser.isAdmin],
  );

  // function to fetch the show more data
  async function handleShowMore() {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/post/get-posts?${currentUser._id}&startIndex=${startIndex}`,
      );
      const data = await res.json();
      if (data.success === true) {
        setUserPosts((userPosts) => [...userPosts, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  //function to delete a post
  async function handleDelete() {
    setShowModal(false);

    if (currentUser.isAdmin) {
      const res = await fetch(
        `/api/post/delete-post/${postId}/${currentUser._id}`,
        {
          method: "delete",
        },
      );
      const data = await res.json();
      if (data.success === true) {
        const newPosts = userPosts.filter((post) => postId !== post._id);
        setUserPosts(newPosts);
      }
    }
  }

  return isLoading ? (
    <div className="mx-auto flex min-h-screen items-center justify-center">
      <Spinner size="xl" />
    </div>
  ) : (
    <div className="table-auto overflow-x-scroll p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-300 dark:scrollbar-thumb-slate-500 md:mx-auto">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
              <Table.Body key={post.title} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-500 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        className="h-10 w-20 bg-gray-500 object-cover"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/post/${post.slug}`}
                      className="font-medium text-gray-900 dark:text-white"
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostId(post._id);
                      }}
                      className="cursor-pointer font-medium text-red-500 hover:underline"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/update-post/${post._id}`}
                      className="text-teal-500 hover:underline"
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full self-center py-7 text-teal-700"
            >
              Show more ...
            </button>
          )}
        </>
      ) : (
        <p>no posts</p>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body className="">
          <div className="text-center">
            <BsExclamationCircle className="mx-auto mb-4 h-14 w-14 justify-center text-gray-400 dark:text-gray-200" />
            <h3 className="dark:text-gray-400k mb-5 text-lg text-gray-500">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-10">
              <Button color="failure" onClick={() => setShowModal(false)}>
                Cancel
              </Button>

              <Button
                color="success"
                onClick={handleDelete}
                className="cursor-pointer"
              >
                {" "}
                Delete
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DashPost;
