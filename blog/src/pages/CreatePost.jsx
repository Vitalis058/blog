import { Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "./../firebase.js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CircularProgressbar } from "react-circular-progressbar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { errorNotification } from "../utils/error.js";

function CreatePost() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(null);
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [post, setPost] = useState({});

  const { theme } = useSelector((state) => state.theme);
  const navigate = useNavigate();

  const handleUploadImage = async () => {
    try {
      if (!file) {
        errorNotification(theme, "please select an image");
        return;
      }
      // get the storage and link it to the app from the firebase
      const storage = getStorage(app);
      // create a unique filename
      const fileName = new Date().getTime() + "-" + file.name;
      // set up the storage
      const storageRef = ref(storage, fileName);

      // the uploading task
      const uploadTask = uploadBytesResumable(storageRef, file);
      // track the changes of the upload
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        // handle the image upload error
        (error) => {
          errorNotification(theme, error.message);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageURL(downloadURL);
          setImageUploadProgress(null);
        },
      );
    } catch (error) {
      errorNotification(theme, error.message);
    }
  };

  // function to handle the post publish
  async function handlePublish(e) {
    e.preventDefault();

    const postData = {
      title,
      category,
      content,
      image: imageURL,
    };

    try {
      const res = await fetch("/api/post/create-post", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const data = await res.json();
      setPost(data.post);
      console.log(data.post);

      if (data.success === true) {
        navigate("/dashboard?tab=posts");
      }

      if (data.success === true) {
        setCategory(null);
        setContent(null);
        setImageURL(null);
        setFile(null);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <div className="mx-auto min-h-screen max-w-3xl p-3">
      <h1 className="my-7 text-center text-3xl font-semibold">Create post</h1>
      <form className="gap flex flex-col gap-4" onSubmit={handlePublish}>
        <div className=" flex flex-col justify-between gap-4 sm:flex-row">
          <TextInput
            type="text"
            required
            placeholder="Title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1"
          />
          <Select onChange={(e) => setCategory(e.target.value)}>
            <option value="uncategorized">select a category</option>
            <option value="javascript">javascript</option>
            <option value="react">react</option>
            <option value="typescript">typeScript</option>
          </Select>
        </div>
        <div className="flex items-center justify-between gap-4 border-4 border-dotted border-teal-500 p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            className="bg-[#41A1D7]"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={Boolean(imageURL)}
          >
            {imageUploadProgress ? (
              <CircularProgressbar
                value={imageUploadProgress}
                text={`${imageUploadProgress}` || 0}
                className="h-10 w-10"
              />
            ) : (
              "Update image"
            )}
          </Button>
        </div>
        {imageURL && (
          <img src={imageURL} className="aspect-auto max-w-full object-cover" />
        )}
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          className="mb-12 h-72"
          required
        />

        <Button type="submit" className="bg-[#41A1D7]">
          Publish
        </Button>
      </form>
    </div>
  );
}

export default CreatePost;