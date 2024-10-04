import React from "react";
import { Alert, Button, Modal, Spinner } from "flowbite-react";
import { MdErrorOutline } from "react-icons/md";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteFailure,
  deleteStart,
  deleteSuccess,
} from "../redux/userSlice/userSlice";

const ModelCom = ({ showModal, setShowModal }) => {
  const dispatch = useDispatch();
  const { currentUser, error,loading } = useSelector((state) => state.user);

  // fectch the data from the api:
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteStart());
      // create response
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      // convert response to json
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteFailure(data.message));
      } else {
        dispatch(deleteSuccess(data));
        setShowModal(false); // close modal after success message is shown
      }
    } catch (error) {
      console.log("Error deleting user ", error.message);
      dispatch(deleteFailure(error.message));
      setShowModal(false); // close modal after error message is shown
    }
  };
  return (
    <>
      <Modal
        show={showModal}
        popup
        size={"md"}
        onClose={() => setShowModal(false)}
      >
        <Modal.Header className="border border-red-500 rounded">
          <Modal.Body>
            <div className="text-center">
              <MdErrorOutline className="h-14 w-14 text-red-600 mb-4 mx-auto" />
              <h3 className=" text-lg text-gray-500 dark:text-gray-100 mb-5 ">
                Are you sure you want to Dalete your Account?{" "}
              </h3>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button onClick={handleDeleteUser} color={"failure"}>
                {
                  loading ?(
                    <Spinner size={'md'} color={'warnning'}/>
                  ):('Yes,Im Sure')
                }
              </Button>
              <Button
                color={"gray"}
                className="border border-gray-400 font-semibold"
                onClick={() => setShowModal(false)}
                appearance="secondary"
              >
                No, Cancel
              </Button>
            </div>
          </Modal.Body>
        </Modal.Header>
      </Modal>
      {error && (
        <Alert color={"failure"} className="mt-5 font-semibold" icon={AiOutlineCloseCircle}>
          {error}
        </Alert>
      )}
    </>
  );
};

export default ModelCom;
