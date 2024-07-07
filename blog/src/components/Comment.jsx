import { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Modal, Textarea } from "flowbite-react";
import { errorNotification } from "../utils/error";
import { BsExclamationCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

/* eslint-disable react/prop-types */
function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.content);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // function to get the user
  useEffect(
    function () {
      async function getUser() {
        try {
          const res = await fetch(`/api/user/get-user/${comment.userId}`);
          const data = await res.json();

          if (data.success === true) {
            setUser(data.user);
          }
        } catch (error) {
          console.log(error);
        }
      }
      getUser();
    },
    [comment.userId],
  );

  // to enable the editing mode
  function handleIsEditing() {
    setIsEditing(true);
  }

  // function to edit the comment
  async function handleEdit() {
    try {
      const res = await fetch(`/api/comment/edit-comment/${comment._id}`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editedComment }),
      });
      const data = await res.json();
      if (data.success) {
        setIsEditing(false);
        onEdit(comment, editedComment);
      }
    } catch (error) {
      console.log(error.message);
      errorNotification(
        theme,
        "something went wrong when updating the comment",
      );
    }
  }

  // function to delete the comment
  async function handleDelete() {
    if (!currentUser) {
      navigate("/sign-in");
    }

    try {
      const res = await fetch(`/api/comment/delete-comment/${comment._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        onDelete(data.comment);
        setShowModal(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="flex border-b p-4 dark:border-gray-600">
      <div className="mr-3 flex-shrink-0">
        <img
          className="h-10 w-10 rounded-full bg-gray-500"
          src={user.photoUrl}
          alt={user.username}
        />
      </div>
      <div className="flex-1">
        <div className="">
          <span className="mr-1 truncate text-xs font-bold">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-xs text-gray-500">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className="mb-3 mt-2"
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
              maxLength="200"
            />
            <div className="mx-3 flex justify-end gap-3">
              <Button
                gradientDuoTone="purpleToBlue"
                size="sm"
                onClick={() => handleEdit()}
                outline
              >
                Save
              </Button>

              <Button
                gradientDuoTone="purpleToBlue"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="mb-2 text-xs text-gray-400">{comment.content}</p>
            <div className="max-w flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`flex items-center gap-2 text-gray-400 hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser._id) && "!text-blue-500"}`}
              >
                <FaThumbsUp className="text-sm" />
                {comment.numberOfLikes > 0 && (
                  <p className="text-xs text-gray-400">
                    {comment.numberOfLikes +
                      (comment.numberOfLikes === 1 ? " like" : " likes")}
                  </p>
                )}
              </button>

              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <p
                      className=" cursor-pointer text-xs text-gray-400 hover:scale-110  hover:text-blue-500"
                      onClick={handleIsEditing}
                    >
                      Edit
                    </p>
                    <p
                      className="cursor-pointer text-xs text-gray-400 hover:scale-110 hover:text-blue-500"
                      onClick={() => setShowModal(true)}
                    >
                      Delete
                    </p>

                    <Modal
                      className="bg-gray-500"
                      show={showModal}
                      onClose={() => setShowModal(false)}
                      popup
                      size="sm"
                    >
                      <Modal.Header />
                      <Modal.Body className="">
                        <div className="text-center">
                          <BsExclamationCircle className="mx-auto mb-4 h-14 w-14 justify-center text-gray-400 dark:text-gray-200" />
                          <h3 className="dark:text-gray-400k mb-5 text-lg text-gray-500">
                            Are you sure you want to delete the comment ?
                          </h3>
                          <div className="flex justify-center gap-10">
                            <Button
                              color="failure"
                              onClick={() => setShowModal(false)}
                            >
                              Cancel
                            </Button>

                            <Button color="success" onClick={handleDelete}>
                              {" "}
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Modal.Body>
                    </Modal>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Comment;
