import React from "react";
import CallToAction from "../components/CallToAction";

const Projects = () => {
  return (
    <div className="min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3">
      <h1 className="text-3xl text-gray-700 dark:text-cyan-500 font-mono font-semibold">
        Projects
      </h1>
      <p className="text-md text-gray-500">
        Build fun and engaging projects while learning HTML, CSS, and JavaScript
        and Other Features in Java Script!
      </p>
      <CallToAction />
    </div>
  );
};

export default Projects;
