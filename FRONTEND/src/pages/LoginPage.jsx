import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext, useAuth } from "../context/AuthContext";
import { useContext } from "react";
import Spinner from "../components/Spinner";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { loading, setLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        "https://chat-application-mvvh.onrender.com/api/users/login",
        { email, password },
      );
      console.log("Token: ", data.Token);
      login(data.Token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="logname text-2xl text-center font-bold mb-4">
          Login for <span className="logoname">KooTalk!</span>
        </h2>
        
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="input w-full mb-4 mt-4 p-2"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="input w-full mb-4 p-2"
          required
        />
        <button
          type="submit"
          className="btn p-2 flex items-center justify-center gap-2">
          Login {loading && <Spinner />}
        </button>
        <div className="text-sm mt-4 flex justify-between">
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </Link>
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
