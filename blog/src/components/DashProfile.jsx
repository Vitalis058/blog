/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, Modal, Spinner, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { start, success, failed } from "../redux/user/userSlice";
import { BsExclamationCircle } from "react-icons/bs";

import { errorNotification } from "../utils/error";
import { infoNotification } from "../utils/info";
import { successNotification } from "../utils/success";

function DashProfile() {
  const { currentUser, isLoading } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(undefined);
  const [imageFileUploadProgress, setImageFileUPloadProgress] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [username, setUsername] = useState(undefined);
  const [email, setEmail] = useState(undefined);
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // use ref to hold the input value of the file
  // so that we can set it to hidden after wards
  const filePicker = useRef();

  // to handle the uploading  of the image and creating a new url
  // using the the URl.createObjectUrl to create a new url
  function handleImageChange(e) {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  }

  // configure a function that we will use to update the image whenever we upload a new one
  // set up the fire bas storage to store the images
  // use effect to sync the ui with the data
  useEffect(
    function () {
      if (imageFile) {
        uploadImage();
      }
    },
    [imageFile],
  );

  // function to get executed when uploading the image to the google firestore
  // also indicates the image uploading progress

  async function uploadImage() {
    setImageError(null); // error resetting for a new upload
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);

    // uploading the image to the fire base store
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",

      // tracking the upload percentage
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUPloadProgress(progress.toFixed(0));
      },

      // handling the error while uploading
      (error) => {
        console.log(error);
        setImageError(
          "could not upload the image(file must be less than 2 mb)",
        );
        setImageFileUPloadProgress(null);
        setImageFileUrl(null);
        setImageFile(null);
      },
      // getting the image url from the firebase store
      // setting it to the download url state
      () =>
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL), setImageFileUPloadProgress(null);
        }),
    );
  }

  //handles submission of the update
  async function onSubmitUpdate(e) {
    e.preventDefault();

    if (
      username === undefined &&
      username === undefined &&
      imageFileUrl === undefined
    ) {
      infoNotification(theme, "select atleast one field");
      return;
    }

    const formData = {
      username: username,
      email: email,
      photoUrl: imageFileUrl,
    };
    try {
      dispatch(start());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(failed());
        errorNotification(theme, data.message);
        return;
        // TODO toast
      }

      if (data.success === true) {
        // console.log(data.newUser);
        dispatch(success(data.newUser));
        successNotification(theme, "updated");
        return;
      }
    } catch (error) {
      errorNotification(theme, error.message);
      dispatch(failed());
      // TODO toast
    }
  }

  // function to delete the user
  async function handleDeleteUser() {
    // call the backend api
    setShowModal(false);
    try {
      // dispatch(start());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.status === "success") {
        dispatch(success(null));
        navigate("/signin");
      } else {
        dispatch(failed());
        errorNotification(theme, "error in deleting the user");
        // TODO toast
      }
    } catch (error) {
      dispatch(failed());
      errorNotification(theme, error.message);
    }
  }

  // signOut functionality
  async function handleSignOut() {
    try {
      const res = await fetch("api/auth/signout", {
        method: "post",
      });
      const data = await res.json();
      if (data.success === true) {
        dispatch(success(null));
        navigate("/signin");
      }
    } catch (error) {
      console.log(error);
      dispatch(failed());
      errorNotification(theme, "failed");
    }
  }

  return (
    <>
      <div className="mx-auto w-full max-w-lg p-3">
        <h1 className="my-7 text-center text-3xl font-semibold">Profile</h1>
        <form className="flex flex-col gap-4" onSubmit={onSubmitUpdate}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={filePicker}
            className="hidden"
          />
          <div
            className="relative h-32 w-32 cursor-pointer self-center rounded-full shadow-md"
            onClick={() => filePicker.current.click()}
          >
            {imageFileUploadProgress && (
              <CircularProgressbar
                value={imageFileUploadProgress || 0}
                text={`${imageFileUploadProgress}%`}
                strokeWidth={5}
                styles={{
                  root: {
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  },
                  path: {
                    stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`,
                  },
                }}
              />
            )}
            <img
              src={imageFileUrl || currentUser.photoUrl}
              alt="user"
              className={` aspect-square rounded-full  border-8 border-[lightgray] object-cover ${imageFileUploadProgress && imageFileUploadProgress < 100 && "opacity-55"} `}
            />
          </div>
          {imageError && <Alert color="failure">{imageError}</Alert>}
          <TextInput
            type="text"
            id="username"
            placeholder="username"
            defaultValue={currentUser.username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextInput
            type="email"
            id="email"
            placeholder="email"
            defaultValue={currentUser.email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            type="submit"
            className="bg-[#41A1D7]"
            outline
            disable={isLoading.toString() || imageFileUploadProgress.toString()}
          >
            {" "}
            {isLoading ? <Spinner /> : "Update"}
          </Button>

          {currentUser.isAdmin && (
            <Link to="/create-post">
              <Button className="w-full bg-[#41A1D7]" type="button">
                {" "}
                Create post
              </Button>
            </Link>
          )}
        </form>

        <div className="mt-5 flex cursor-pointer justify-between text-red-500">
          <span onClick={() => setShowModal(true)}>Delete Account</span>
          <span onClick={() => handleSignOut()}>Sign Out</span>
        </div>

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
                Are you sure yu want to delete your account ?
              </h3>
              <div className="flex justify-center gap-10">
                <Button color="failure" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>

                <Button color="success" onClick={handleDeleteUser}>
                  {" "}
                  Delete
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default DashProfile;

// dont forget to change the read in the fire base store to is true
