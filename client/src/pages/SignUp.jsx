import React, { useEffect, useState } from "react";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { VscError } from "react-icons/vsc";
import { FaHandshake } from "react-icons/fa";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // handle change the input field:
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  let timeOutId;

  // handle submit the form:
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setError("Please Fill All required Fields!.");
    }
    try {
      setLoading(true), setError(null), setSuccess(false);
      // create response:
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      // convert the data:
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setSuccess(true);
      // redirect to login page:
      if (res.ok) {
        timeOutId = setTimeout(()=>{
          navigate("/sign-in");
        },2000)
        
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(()=>{
    if(timeOutId){
      clearTimeout(timeOutId);
      setSuccess(false);
    }
  },[timeOutId])

  return (
    <div onSubmit={handleSubmit} className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left side start here */}
        <div className="flex-1">
          <Link to={"/"} className="text-4xl font-bold dark:text-white ">
            <span className="px-2 py-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 rounded-lg text-white">
              FreePen
            </span>
            Blog
          </Link>
          <p className="text-md mt-5 ">
            Free Pen is a blog offering tips and resources for freelance
            writers, You can sign up with your email and password or with
            Google.
          </p>
        </div>
        {/* left side end here */}
        {/* right side start here */}
        <div className="flex-1">
          <form className="flex flex-col gap-4">
            <div>
              <Label value="Your UserName:" />
              <TextInput
                type="text"
                placeholder="Enter Your UserName..."
                id="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your Email:" />
              <TextInput
                type="email"
                placeholder="Enter Your Email..."
                id="email"
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <Label value="Your Password:" />
              <TextInput
                type={showPassword ? "text" : "password"}
                placeholder="Enter Your Password..."
                id="password"
                onChange={handleChange}
              />
              {showPassword ? (
                <FaEyeSlash
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xl cursor-pointer absolute top-9 right-3"
                />
              ) : (
                <FaEye
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xl cursor-pointer absolute top-9 right-3"
                />
              )}
            </div>
            <Button
              type="submit"
              className="uppercase"
              gradientDuoTone={"greenToBlue"}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size={"sm"} color={"failure"} />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <OAuth/>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <p className="font-[500]">
              -Already have an Account?{" "}
              <Link
                to={"/sign-in"}
                className="text-blue-500 font-semibold px-2 py-1 border border-gray-400 rounded-md hover:border-red-500 uppercase  hover:text-red-500 transition-all ease-in duration-100"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
        {/* right side end here */}
      </div>
      {error && (
        <div className=" max-w-2xl mx-auto  flex justify-center ">
          <Alert
            icon={VscError}
            color={"failure"}
            className="mt-5  font-semibold"
          >
            {error}
          </Alert>
        </div>
      )}
      {
        success && (
          <div className="max-w-2xl mx-auto flex justify-center ">
            <Alert
              icon={FaHandshake}
              color={"success"}
              className="mt-5 font-semibold"
            >
              User Sign Up Successfully!...
            </Alert>
          </div>
        )
      }
    </div>
  );
};

export default SignUp;
