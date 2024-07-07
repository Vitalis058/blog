import { Button, Modal, Spinner, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { BsExclamationCircle } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { FcCheckmark } from "react-icons/fc";
import { FcCancel } from "react-icons/fc";
import { errorNotification } from "../utils/error";

function DashUsers() {
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useSelector((state) => state.theme);
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const dispatch = useDispatch();

  useEffect(
    function () {
      async function getUsers() {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/user/get-users`);
          const data = await res.json();
          if (data.success === true) {
            setUsers(data.users);
            setIsLoading(false);
            if (data.users.length < 9) {
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
        getUsers();
      }
    },
    [currentUser._id, currentUser.isAdmin, dispatch, theme],
  );

  // function to fetch the show more data
  async function handleShowMore() {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/get-users?startIndex=${startIndex}}`);
      const data = await res.json();
      if (data.success === true) {
        setUsers((users) => [...users, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  //function to delete a post
  async function handleDeleteUser() {
    setShowModal(false);

    if (currentUser.isAdmin) {
      const res = await fetch(
        `/api/user/delete-user/${userId}?userId=${currentUser._id}`,
        {
          method: "delete",
        },
      );
      const data = await res.json();
      if (data.success === true) {
        const newPosts = users.filter((user) => userId !== user._id);
        setUsers(newPosts);
      }
    }
  }

  return isLoading ? (
    <div className="mx-auto flex min-h-screen items-center justify-center">
      <Spinner size="xl" />
    </div>
  ) : (
    <div className="table-auto overflow-x-scroll p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-300 dark:scrollbar-thumb-slate-500 md:mx-auto">
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>user image</Table.HeadCell>
              <Table.HeadCell>UserName</Table.HeadCell>
              <Table.HeadCell>UserName</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body key={user._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-500 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    {user.photoUrl === "" ? (
                      <img
                        src="https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        className="aspect-square w-20 rounded-full bg-gray-500 object-cover"
                      />
                    ) : (
                      <img
                        src={user.photoUrl}
                        className="aspect-square w-20 rounded-full bg-gray-500 object-cover"
                      />
                    )}
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>

                  <Table.Cell>
                    {user.isAdmin ? <FcCheckmark /> : <FcCancel />}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setUserId(user._id);
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
        <p>No users</p>
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

              <Button color="success" onClick={() => handleDeleteUser()}>
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

export default DashUsers;
