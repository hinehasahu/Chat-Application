import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../components/Spinner";

const SignupPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const {loading, setLoading} = useContext(AuthContext)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)

      await axios.post(
        "https://chat-application-mvvh.onrender.com/api/users/signup",
        form
      );
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally{
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="logname text-2xl text-center font-bold mb-4">Signup for <span className="logoname">KooTalk!</span></h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
          className="input mb-2 w-full p-2 mt-4"
          required
        />
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          className="input mb-2 w-full p-2"
          required
        />
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Password"
          className="input mb-4 w-full p-2"
          required
        />
        <button type="submit" className="btn p-2 flex items-center justify-center gap-2">
          {loading ? "Signing up" : "Signup" }{loading && <Spinner/> }
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
