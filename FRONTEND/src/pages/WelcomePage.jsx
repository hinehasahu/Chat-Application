import React from "react";
import { Link } from "react-router-dom";
// import Kootalk-logo-slogan from './assets/Kootalk-logo-slogan.png'

const WelcomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <img src="/KooTalkslogan.png" alt="Logo" className="logo" />
      <h1 className="text-2xl font-bold mb-2 welcome">Welcome to KooTalk App</h1>
      <p className="text-lg mb-6">Connect and chat with anyone, anytime!</p>
      
      <div className="space-x-4">
        <Link
          to="/login"
          className="loginbtn ">
          Login
        </Link>
        <Link
          to="/signup"
          className="signupbtn ">
          Signup
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;
