import { Button, Modal, Spinner, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { BsExclamationCircle } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { errorNotification } from "../utils/error";

function DashComments() {
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useSelector((state) => state.theme);
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentId, setCommentId] = useState(null);
  const dispatch = useDispatch();

  // getting the comments
  useEffect(
    function () {
      async function getComments() {
        setIsLoading(true);
        try {
          const res = await fetch("/api/comment/get-all-comments");
          const data = await res.json();
          if (data.success === true) {
            setComments(data.comments);
            setIsLoading(false);
            if (data.comments.length < 9) {
              setShowMore(false);
            }
          }
        } catch (error) {
          console.log(error);
          errorNotification(theme, error.message);
          setIsLoading(false);
        }
      }
      // call the func if the user is an admin
      if (currentUser.isAdmin) {
        getComments();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser._id, currentUser.isAdmin, dispatch],
  );

  // function to fetch the show more data
  async function handleShowMore() {
    const startIndex = comments.length;
    try {
      const res = await fetch(
        `/api/comment/get-all-comments?startIndex=${startIndex}`,
      );
      const data = await res.json();
      if (data.success === true) {
        setComments((comments) => [...comments, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  //function to delete a comment
  async function handleDeleteComment() {
    setShowModal(false);

    if (currentUser.isAdmin) {
      const res = await fetch(
        // dont forget to change the api route below
        `/api/comment/delete-comment/${commentId}`,
        {
          method: "delete",
        },
      );
      const data = await res.json();
      if (data.success === true) {
        const newComments = comments.filter(
          (comment) => commentId !== comment._id,
        );
        setComments(newComments);
      }
    }
  }

  return isLoading ? (
    <div className="mx-auto flex min-h-screen items-center justify-center">
      <Spinner size="xl" />
    </div>
  ) : (
    <div className="table-auto overflow-x-scroll p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-300 dark:scrollbar-thumb-slate-500 md:mx-auto">
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>comment content</Table.HeadCell>
              <Table.HeadCell>Number of likes</Table.HeadCell>
              <Table.HeadCell>user id</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
              <Table.Body key={comment._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-500 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{comment.content}</Table.Cell>
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  <Table.Cell>{comment.userId}</Table.Cell>

                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setCommentId(comment._id);
                      }}
                      className="font-medium text-red-500 hover:underline"
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
              className="w-full self-center py-7 text-teal-700"
            >
              Show more ...
            </button>
          )}
        </>
      ) : (
        <p>No comments</p>
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

              <Button color="success" onClick={() => handleDeleteComment()}>
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

export default DashComments;
