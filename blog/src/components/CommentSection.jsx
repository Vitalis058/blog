import { Button, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { errorNotification } from "../utils/error";
import Comment from "./Comment";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const { theme } = useSelector((state) => state.theme);
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  // function to submit the comment
  async function handleSubmit(e) {
    e.preventDefault();
    const commentObj = {
      content: comment,
      postId,
      userId: currentUser._id,
    };
    try {
      const res = await fetch(`/api/comment/create/${currentUser._id}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentObj),
      });
      const data = await res.json();
      if (data.success === true) {
        setComments([data.comment, ...comments]);
        setComment("");
      }
    } catch (error) {
      errorNotification(theme, error.message);
      console.log(error);
    }
  }

  // function to fetch the comments based on the post id
  useEffect(
    function () {
      async function getComments() {
        try {
          const res = await fetch(`/api/comment/get-comments/${postId}`);
          const data = await res.json();
          if (data.success === true) {
            setComments(data.comments);
          } else {
            errorNotification(
              theme,
              "something went wrong when getting the comments",
            );
          }
        } catch (error) {
          console.log(error);
        }
      }
      getComments();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [postId],
  );

  // function to handle the liking of the comments
  async function handleLike(commentId) {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      } else {
        const res = await fetch(`/api/comment/like-comment/${commentId}`, {
          method: "put",
        });

        const data = await res.json();

        if (data.success === true) {
          const updatedComments = comments.map((comment) =>
            comment._id === data.comment._id
              ? {
                  ...comment,
                  numberOfLikes: data.comment.numberOfLikes,
                  likes: data.comment.likes,
                }
              : comment,
          );
          setComments(updatedComments);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  // function to update the comments on the ui after the edit
  function handleEdit(editedComment, editedContent) {
    const updatedArr = comments.map((comment) =>
      comment._id === editedComment._id
        ? { ...comment, content: editedContent }
        : comment,
    );
    setComments(updatedArr);
  }

  // function to update the comments after the delete
  async function handleDelete(deletedComment) {
    const updatedArr = comments.filter(
      (comment) => comment._id !== deletedComment._id,
    );
    setComments(updatedArr);
  }

  return (
    <div className=" max-w-3xl">
      {currentUser ? (
        <div className=" text-s my-5 flex items-center justify-start gap-2 text-gray-400">
          <p>signed in as: </p>
          <img
            src={currentUser.photoUrl}
            className="aspect-square h-7 rounded-full object-cover"
            alt=""
          />
          <Link className="text-xs text-cyan-500" to="/dashboard?tab=profile">
            {" "}
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className=" flex flex-col items-center p-3 ">
          <h1 className=" justify-self-center text-2xl font-bold">Comments</h1>
          <div className="my-5 flex gap-1 text-sm text-teal-500">
            <p>you must be logged in to comment</p>
            <Link className="text-blue-500 hover:underline" to="/signin">
              sign in
            </Link>
          </div>
        </div>
      )}

      {currentUser && (
        <form
          className="mx-auto rounded border border-teal-500 p-5"
          onSubmit={handleSubmit}
        >
          <Textarea
            placeholder="Add a comment"
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />

          <div className="flex items-center justify-between p-3">
            <p className="text-xs text-gray-500">
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" pill type="submit">
              {" "}
              submit
            </Button>
          </div>
        </form>
      )}

      {comments.length === 0 ? (
        <p className="my-5 text-sm">no comments</p>
      ) : (
        <>
          <div className="my-5 flex items-center gap-1 text-sm">
            <p>comments</p>
            <div className="rounded-sm border border-gray-500 px-2">
              <p>{comments.length}</p>
            </div>
          </div>

          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </>
      )}
    </div>
  );
}

export default CommentSection;
