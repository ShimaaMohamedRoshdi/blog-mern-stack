import { Button } from "flowbite-react";
import React from "react";

const CallToAction = () => {
  return (
    <div className="flex flex-col gap-2 sm:flex-row p-3 border-2 border-teal-500 text-center items-center justify-center rounded-bl-3xl rounded-tr-3xl my-2">
      {/* left side sart here */}
      <div className="flex flex-col flex-1 justify-center gap-5">
        <h2 className="text-2xl font-bold underline underline-offset-4 capitalize">
          Do you want to Learn more about MERN Stack?
        </h2>
        <p className="my-2 text-gray-700 dark:text-cyan-400 capitalize font-semibold">
          -Checkout these resources with 100 JavaScript Projects
        </p>
        <Button
          outline
          gradientDuoTone={"greenToBlue"}
          className="rounded-tl-lg rounded-bl-none rounded-tr-none rounded-br-lg"
        >
          <a
            href="https://www.100jsprojects.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            100 JavaScript Projects
          </a>
        </Button>
      </div>
      {/* left side end here */}
      {/* right side start here */}
      <div className=" p-6 flex-1 ">
        <img
          src="https://backendapi.iihtsrt.com/wp-content/uploads/2022/07/MERN.jpg"
          alt="call-to-action-image"
        />
      </div>
      {/* right side end here */}
    </div>
  );
};

export default CallToAction;
