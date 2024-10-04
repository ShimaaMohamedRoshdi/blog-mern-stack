import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Spinner, TextInput } from "flowbite-react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { MdCheckCircle } from "react-icons/md";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  signOutSuccess,
} from "../redux/userSlice/userSlice";
import { useDispatch, useSelector } from "react-redux";
import ModelCom from "./ModelCom";
import { Link } from "react-router-dom";

const DashProfile = () => {
  const { currentUser, loading } = useSelector((state) => state.user);
  const filePickerClick = useRef();
  // Add Some State to upload image:
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(0);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  // state to show model :
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  // handle Image Change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  // useEffect to track progress:
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  // Function to upload image:
  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 6MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePhoto: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  //handle Change The input:
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // handle Submit the form:
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserSuccess(null);
    setUpdateUserError(null);
    // check if the form is empty:
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes were made!");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Please wait while the image is uploading!");
      return;
    }

    try {
      // setUpdateUserSuccess(null);
      dispatch(updateStart());
      // create the response:
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // convertt the data into a json object
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
        return;
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User updated successfully!");
      }
    } catch (error) {
      console.log("Error updating user ", error.message);
      dispatch(updateFailure(error.message));
    }
  };

  // handle Sign Out User:
  const handleSignOutUser = async () => {
    try {
      // create response:
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      // convert the data into a json object
      const data = await res.json();
      if (!res.ok) {
        console.log("Error signing out user ", error.message);
        return;
      } else {
        dispatch(signOutSuccess(data));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className=" max-w-lg mx-auto w-full p-3 my-4">
      <h1 className="my-7 text-center font-semibold text-3xl">
        Pro
        <span className="uppercase text-3xl text-cyan-500 italic dark:text-red-500">
          f
        </span>
        ile
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerClick}
        />
        <div
          onClick={() => filePickerClick.current.click()}
          className="w-32 relative  h-32 self-center cursor-pointer shadow-md overflow-y-hidden rounded-full"
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={6}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 1,
                },
                path: {
                  stroke: `rgba(62,152,199 / ${
                    imageFileUploadProgress / 100
                  } )`,
                },
              }}
            />
          )}
          <img
            className={`w-full absolute -top-[0.2%]  h-full border-[6px] object-cover border-gray-100 rounded-full ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            } `}
            src={imageFileUrl || currentUser.profilePhoto}
            alt="user profile"
          />
        </div>
        {imageFileUploadError && (
          <Alert
            color={"failure"}
            icon={AiOutlineCloseCircle}
            className="font-semibold"
          >
            {imageFileUploadError}
          </Alert>
        )}
        <TextInput
          placeholder="Enter username..."
          type="text"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          placeholder="Enter email..."
          type="email"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          onChange={handleChange}
          placeholder="password..."
          type="password"
          id="password"
        />
        <Button
          type="submit"
          gradientDuoTone={"greenToBlue"}
          outline
          className="text-xl uppercase font-[500]"
          disabled={loading || imageFileUploading}
        >
          {loading || imageFileUploading ? (
            <>
              <Spinner color="warning" size={"md"} />
              <span className="pl-3">Updating...</span>
            </>
          ) : (
            "Update"
          )}
        </Button>
        {currentUser && currentUser.isAdmin && (
          <Link to={"/create-post"}>
            <Button
              gradientDuoTone={"cyanToBlue"}
              className="w-full font-semibold"
              type="button"
            >
              Create a Post
            </Button>
          </Link>
        )}
      </form>
      <div className="flex items-center justify-between mt-5">
        <span
          onClick={() => setShowModal(true)}
          className="cursor-pointer text-red-500 px-2 py-1 bg-gray-50 hover:bg-red-500 hover:text-white border-2 font-medium border-red-500 transition-all duration-150 rounded-md"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOutUser}
          className="cursor-pointer text-red-500 px-2 py-1 bg-gray-100 hover:bg-red-500 hover:text-white border-2 font-medium border-red-500 transition-all duration-150 rounded-md"
        >
          Sign Out
        </span>
      </div>
      {updateUserSuccess && (
        <Alert
          color={"success"}
          icon={MdCheckCircle}
          className="font-semibold mt-5"
        >
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert
          color={"failure"}
          icon={AiOutlineCloseCircle}
          className="font-semibold mt-5"
        >
          {updateUserError}
        </Alert>
      )}
      <ModelCom showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
};

export default DashProfile;
