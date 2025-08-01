import React, { useState, useEffect } from "react";
import Signup from "./components/signup";
import Login from "./components/Login";
import Notebook from "./components/Notebook";
import { auth } from "./firebase";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  alert('Still under devlopment Prototype:2')

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    setShowSignup(false);
    setUser(auth.currentUser);
  };

  const handleLogout = () => {
    auth.signOut();
    setUser(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {!user ? (
        showSignup ? (
          <Signup onClose={() => setShowSignup(false)} />
        ) : (
          <div className="flex flex-col items-center">
            <Login onLogin={handleLogin} />
            <button
              onClick={() => setShowSignup(true)}
              className="mt-4 text-blue-600 underline"
            >
              Don't have an account? Signup
            </button>
          </div>
        )
      ) : (
        <Notebook onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
