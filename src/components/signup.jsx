import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

function Signup({ onClose }) {
  const [error, setError] = useState("");

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, provider);
      onClose(); // Close popup after successful signup
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-[#222831] bg-opacity-90 backdrop-blur-md shadow-2xl border border-[#7D8D86] rounded-xl p-8 w-full max-w-md mx-auto">
      <h2 className="text-3xl font-extrabold text-center text-[#7D8D86] mb-6 font-cursive select-none">
        Welcome to Writify
      </h2>

      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
      )}

      <button
        onClick={handleGoogleSignup}
        className="w-full bg-[#dc4e41] hover:bg-[#b33729] text-white font-semibold py-3 rounded-md transition"
      >
        Continue with Google
      </button>

      <div className="mt-6 text-center">
        <button
          onClick={onClose}
          className="text-[#7D8D86] underline text-sm hover:text-[#57564F]"
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}

export default Signup;
