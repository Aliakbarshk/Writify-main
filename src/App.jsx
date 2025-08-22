import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/signup";
import Login from "./components/Login";
import Notebook from "./components/Notebook";
import Policies from "./components/Policies";
import About from "./components/aboutUs";
import { auth } from "./firebase";
import "./index.css";
import "./App.css";

alert("📱For the phone users , please flip your phones and use it in landscape mode or desktop mode")
function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

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
    <BrowserRouter>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <Routes>
          <Route
            path="/"
            element={
              !user ? (
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
              )
            }
          />
          <Route path="/policies" element={<Policies />} />
          <Route path="/About" element={<About />} />
          {/* Add other pages like About, Contact here if needed */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
