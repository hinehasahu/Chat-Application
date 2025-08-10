import React from "react";
import { Link } from "react-router-dom";

const WelcomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 text-center p-6">
      <img src="/Logo.png" alt="Logo" className="sm:w-32 md:w-40 lg:w-54" />
      <h1 className="text-3xl font-bold mb-2">Welcome to KooTalk App</h1>
      <p className="text-lg mb-6">Connect and chat with anyone, anytime!</p>
      <div className="space-x-4">
        <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Login</Link>
        <Link to="/signup" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">Signup</Link>
      </div>

    </div>
    // <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-white p-4">
    //   <div className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-4xl bg-red-500 p-4 rounded">
    //     Resize me to change text size!
    //   </div>
    // </div>
  );
};

export default WelcomePage;
