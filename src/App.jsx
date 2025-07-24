// src/App.jsx
import React, { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import "./App.css";
import Landingpage from "./components/Landingpage";// this aint working for real 
import Notebook from "./components/Notebook";
import Signup from "./components/signup";


function App() {
  
  


  return (
    <>
  <Signup/>
    <Notebook/>
    </>
  );
}

export default App;
