// src/components/Signup.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

function Signup({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onClose(); // Close signup and fallback to login
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, provider);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Sign Up for Writify
      </h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-600">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-600">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
        >
          Sign Up
        </button>
      </form>

      <div className="mt-6 text-center text-gray-500">OR</div>

      <button
        onClick={handleGoogleSignup}
        className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-md"
      >
        Continue with Google
      </button>

      {/* ✅ Add Login toggle here */}
      <div className="mt-6 text-center">
        <button onClick={onClose} className="text-blue-600 underline text-sm">
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}

export default Signup;
