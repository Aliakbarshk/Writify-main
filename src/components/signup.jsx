import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

function Signup({ onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onSignup();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    try {
      await signInWithPopup(auth, provider);
      onSignup();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      <form onSubmit={handleSignup} className="space-y-4">
        <input
          className="border rounded px-4 py-2"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border rounded px-4 py-2"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          type="submit"
        >
          Sign Up
        </button>
      </form>
      <button
        onClick={handleGoogleSignup}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Sign Up with Google
      </button>
      {error && <div className="text-red-600">{error}</div>}
    </div>
  );
}

export default Signup;
