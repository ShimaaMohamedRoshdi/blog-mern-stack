import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { MdOutlineRunningWithErrors } from "react-icons/md";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const UpdatePost = () => {
  const [file, setFile] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(0);
  const [formData, setFormData] = useState({});
  const [puplishError, setPuplishError] = useState(null);
  const navigate = useNavigate();
  // we will use id to fetch the data from the api:
  const { postId } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  // handle Upload Image:
  const handleUploadImage = async () => {
    if (!file) {
      setImageFileUploadError("Please Select a image!");
      return;
    }
    try {
      setImageFileUploadError(null);
      // setImageFileUploadProgress(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageFileUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageFileUploadError("Image upload failed!");
          setImageFileUploadProgress(0);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUploadError(null);
            setImageFileUploadProgress(0);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageFileUploadError("something went wrong");
      setImageFileUploadProgress(0);
    }
  };
  // handle Update Post
  const handleUpdatePost = async (e) => {
    e.preventDefault();
    try {
      setPuplishError(null);
      // create a respone:
      const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // convert to json:
      const data = await res.json();
      if (!res.ok) {
        setPuplishError(data.message);
        return;
      }
      if (res.ok) {
        setPuplishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      console.log(error.message);
      setPuplishError("Something went wrong while Updating your post!");
    }
  };

  // useEffect to fetch the data from the api route based on the id:
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setPuplishError(null)
        // create response based on id the post:
        const res =await fetch(`/api/post/getposts?postId=${postId}`);
        // convert response to json:
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPuplishError(data.message)
          return;
        } else {
          setFormData(data.posts[0]);
          setPuplishError(null)
        }
      } catch (error) {
        console.log(error.message);
        setPuplishError("Something went wrong while fetching the post!");
      }
    };
    if(currentUser.isAdmin){
      fetchPost();
    }
    
  }, [postId]);
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="my-7 text-center underline underline-offset-8  font-semibold text-4xl text-gray-800 dark:text-gray-100 ">
        Update a Post
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleUpdatePost}>
        {/* div for title and category start here */}
        <div className="flex flex-col gap-4  justify-between sm:flex-row">
          <TextInput
            type="text"
            id="title"
            placeholder="Enter Your Title..."
            required
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="font-semibold"
            value={formData.category}
          >
            <option className="font-semibold" value="uncategorized">
              Select a Category
            </option>
            <option className="font-semibold" value="javascript">
              JavaScript
            </option>
            <option className="font-semibold" value="reactjs">
              React Js
            </option>
            <option className="font-semibold" value="nodejs">
              Node Js
            </option>
            <option className="font-semibold" value="nextjs">
              Next Js
            </option>
            <option className="font-semibold" value="tailwindcss">
              Tailwind CSS
            </option>
          </Select>
        </div>
        {/* div for title and category enf=d here */}
        {/* div for image and input start here */}
        <div className="flex gap-4 justify-between items-center border-4 border-cyan-500 border-dashed p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone={"greenToBlue"}
            outline
            size={"sm"}
            onClick={handleUploadImage}
            disabled={!file || imageFileUploadProgress}
          >
            {imageFileUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageFileUploadProgress}
                  text={`${imageFileUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageFileUploadError && (
          <Alert
            color={"failure"}
            className="font-semibold"
            icon={MdOutlineRunningWithErrors}
          >
            {imageFileUploadError}
          </Alert>
        )}
        {formData.image && (
          <img
            src={formData.image}
            className="h-96 w-full object-cover"
            alt="upload-image"
          />
        )}
        {/* div for image and input end here */}
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          id="content"
          className="h-72 mb-12"
          required
          onChange={(value) => setFormData({ ...formData, content: value })}
          value={formData.content}
        />
        <Button
          disabled={imageFileUploadProgress}
          type="submit"
          gradientDuoTone={"redToYellow"}
        >
          Update Post
        </Button>
      </form>
      {puplishError && (
        <Alert
          color={"failure"}
          className="font-semibold mt-5"
          icon={MdOutlineRunningWithErrors}
        >
          {puplishError}
        </Alert>
      )}
    </div>
  );
};

export default UpdatePost;
