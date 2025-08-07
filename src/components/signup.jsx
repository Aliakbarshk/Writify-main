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
      onClose();
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
    <div className="bg-[#222831] bg-opacity-90 backdrop-blur-md shadow-2xl border border-[#7D8D86] rounded-xl p-8 w-full max-w-md mx-auto">
      <h2 className="text-3xl font-extrabold text-center text-[#7D8D86] mb-6 font-cursive select-none">
        Sign Up for Writify
      </h2>

      {error && (
        <p className="text-red-500 text-sm mb-4 text-center select-none">
          {error}
        </p>
      )}

      <form onSubmit={handleSignup} className="space-y-5">
        <div>
          <label className="block mb-2 text-[#7D8D86] font-medium select-none">
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-3 rounded-md bg-[#1a1a1d] border border-[#57564F] text-white placeholder-[#57564F] focus:outline-none focus:ring-2 focus:ring-[#7D8D86] transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="block mb-2 text-[#7D8D86] font-medium select-none">
            Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-3 rounded-md bg-[#1a1a1d] border border-[#57564F] text-white placeholder-[#57564F] focus:outline-none focus:ring-2 focus:ring-[#7D8D86] transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="********"
            autoComplete="new-password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#7D8D86] hover:bg-[#57564F] text-[#222831] font-semibold py-3 rounded-md transition shadow-md"
        >
          Sign Up
        </button>
      </form>

      <div className="mt-6 text-center text-[#57564F] font-semibold select-none">
        OR
      </div>

      <button
        onClick={handleGoogleSignup}
        className="w-full mt-5 bg-[#dc4e41] hover:bg-[#b33729] text-white font-semibold py-3 rounded-md transition shadow-md"
      >
        Continue with Google
      </button>

      <div className="mt-6 text-center">
        <button
          onClick={onClose}
          className="text-[#7D8D86] underline text-sm hover:text-[#57564F] transition select-none"
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}

export default Signup;
