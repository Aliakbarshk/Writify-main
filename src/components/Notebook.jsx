import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import './Notebook.css'
import Policies from "./Policies";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Link } from "react-router-dom";
function Notebook({ user, onLogout }) {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(22);
  const [lineHeight, setLineHeight] = useState(30);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [wordSpacing, setWordSpacing] = useState(0);
  const [topOffset, setTopOffset] = useState(40);
  const [fontFamily, setFontFamily] = useState("'Indie Flower', cursive");
  const [textColor, setTextColor] = useState("#1a237e");
  const [fontWeight, setFontWeight] = useState("normal");
  const [textAlign, setTextAlign] = useState("left");


  
  const previewRef = useRef(null);
 
  const penOptions = {
    "Blue Pen": { color: "#1a237e", weight: "normal" },
    "Dark Blue Pen": { color: "#0d1b5e", weight: "normal" },
    "Red Pen": { color: "#d32f2f", weight: "normal" },
    "Black Pen": { color: "#000000", weight: "normal" },
    "Bold Black Pen": { color: "#000000", weight: "bold" },
    "Thick Blue Pen": { color: "#1a237e", weight: "bold" },
    "Green Pen": { color: "#2e7d32", weight: "normal" },
    "Purple Pen": { color: "#6a1b9a", weight: "normal" },
  };

  const handlePenChange = (e) => {
    const selected = penOptions[e.target.value];
    setTextColor(selected.color);
    setFontWeight(selected.weight);
  };

  const downloadImage = () => {
    if (!text.trim()) return;
    html2canvas(previewRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#fff",
    }).then((canvas) => {
      const link = document.createElement("a");
      link.download = "writify-note.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  const previewStyle = {
    fontFamily,
    fontSize: `${fontSize}px`,
    lineHeight: `${lineHeight}px`,
    letterSpacing: `${letterSpacing}px`,
    wordSpacing: `${wordSpacing}px`,
    paddingTop: `${topOffset}px`,
    color: textColor,
    whiteSpace: "pre-wrap",
    height: "100%",
    width: "100%",
    overflow: "hidden",
    fontWeight,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    textAlign,
  };

  const userDisplayName = user?.displayName || user?.email || "User";

  return (
    <div className="min-h-screen w-full bg-[#1a1a1d]">
      {/* Nav Bar */}
      <nav
        className="w-full flex items-center justify-between px-4 sm:px-8 py-4"
        style={{ background: "#222831" }}
      >
        <span className="text-[#7D8D86] flex items-center gap-2 text-xs sm:text-sm truncate max-w-[40vw]">
          <span className="rounded-full bg-[#57564F] px-2 py-1 text-xs sm:text-sm font-semibold truncate">
            {userDisplayName.charAt(0)}
          </span>
          <span className="truncate">{userDisplayName} | Plan: Free</span>
        </span>
        <div className="Logo text-lg sm:text-3xl font-extrabold font-cursive text-[#7D8D86] tracking-widest truncate max-w-[30vw] text-center">
          WRITIFYy
        </div>
        <div className="flex items-center gap-3 text-xs sm:text-sm">
          <span className="rounded-xl bg-[#7D8D86] px-3 py-1 text-[#222831] font-bold select-none">
            pro
          </span>
          <button
            onClick={onLogout}
            className="text-xs px-3 py-1 rounded-lg bg-[#57564F] text-[#7D8D86] cursor-pointer"
            aria-label="Logout"
          >
            ⟲
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="p-6 max-w-5xl mx-auto bg-[#222831] rounded-xl shadow-md mt-6 text-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <label className="flex flex-col text-sm font-medium text-white">
            Font
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="mt-1 p-2 bg-[#2d2f34] text-white border border-gray-600 rounded-md cursor-pointer"
            >
              <option value="'Indie Flower', cursive">Indie Flower</option>
              <option value="Daniel, cursive">Daniel</option>
              <option value="'Dancing Script', cursive">Dancing Script</option>
              <option value="'Architects Daughter', cursive">
                Architects Daughter
              </option>
              <option value="'Gloria Hallelujah', cursive">
                Gloria Hallelujah
              </option>
              <option value="'Shadows Into Light', cursive">
                Shadows Into Light
              </option>
            </select>
          </label>

          <label className="flex flex-col text-sm font-medium text-white">
            Pen Style
            <select
              onChange={handlePenChange}
              className="mt-1 p-2 bg-[#2d2f34] text-white border border-gray-600 rounded-md cursor-pointer"
              defaultValue="Blue Pen"
            >
              {Object.keys(penOptions).map((pen) => (
                <option key={pen} value={pen}>
                  {pen}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-sm font-medium text-white">
            Text Alignment
            <select
              value={textAlign}
              onChange={(e) => setTextAlign(e.target.value)}
              className="mt-1 p-2 bg-[#2d2f34] text-white border border-gray-600 rounded-md cursor-pointer"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </label>

          <label className="flex flex-col text-sm font-medium text-white">
            Font Size
            <input
              type="range"
              min="12"
              max="40"
              value={fontSize}
              onChange={(e) => setFontSize(+e.target.value)}
              className="mt-1 cursor-pointer"
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-white">
            Line Height
            <input
              type="range"
              min="20"
              max="60"
              value={lineHeight}
              onChange={(e) => setLineHeight(+e.target.value)}
              className="mt-1 cursor-pointer"
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-white">
            Letter Spacing
            <input
              type="range"
              min="-1"
              max="5"
              step="0.1"
              value={letterSpacing}
              onChange={(e) => setLetterSpacing(+e.target.value)}
              className="mt-1 cursor-pointer"
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-white">
            Word Spacing
            <input
              type="range"
              min="0"
              max="20"
              value={wordSpacing}
              onChange={(e) => setWordSpacing(+e.target.value)}
              className="mt-1 cursor-pointer"
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-white">
            Top Padding
            <input
              type="range"
              min="0"
              max="200"
              value={topOffset}
              onChange={(e) => setTopOffset(+e.target.value)}
              className="mt-1 cursor-pointer"
            />
          </label>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something amazing..."
          style={{ fontFamily }}
          className="w-full min-h-[100px] mb-6 p-4 text-base rounded-lg border border-gray-500 bg-[#2d2f34] text-white font-mono resize-y"
        />

        <div className="w-full overflow-x-auto mb-6">
          <div
            ref={previewRef}
            className="w-[794px] h-[1123px] bg-white mx-auto shadow-md"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, transparent 29px, #d0d0d0 30px)",
              backgroundSize: "100% 30px",
              padding: "40px",
              boxSizing: "border-box",
              fontFamily,
            }}
          >
            <div style={previewStyle}>
              {text ? (
                text
                  .split("\n")
                  .map((line, idx) => <div key={idx}>{line || " "}</div>)
              ) : (
                <span className="opacity-30">
                  Your handwriting preview will appear here.
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center mb-6">
          <button
            className="px-4 py-2 bg-[#393e46] hover:bg-[#4c515a] text-white text-sm rounded-md cursor-pointer"
            onClick={() => setText("")}
            disabled={!text.trim()}
          >
            🧹 Clear
          </button>
          <button
            className="px-4 py-2 bg-[#00adb5] hover:bg-[#00c3cc] text-white text-sm rounded-md cursor-pointer"
            onClick={downloadImage}
            disabled={!text.trim()}
          >
            📥 Download
          </button>
          <span className="text-sm text-gray-400 ml-auto">
            📝 {text.length} Chars |{" "}
            {text.trim() ? text.trim().split(/\s+/).length : 0} Words
          </span>
        </div>

        <footer className="text-center text-xs text-gray-400 border-t border-gray-700 pt-4">
          Writify © — Personal/Educational Use Only. No refunds. because it is a
          digital service/tool
          <p>
            Writify is provided for personal, educational, and creative use
            only. All content generated using this platform remains the user's
            responsibility.
          </p>
          <div className="policiesaboutus flex gap-[10px] w-[100%] justify-center">
            <Link className="text-[15px] hover:underline cursor-pointer" to="/Policies">Policies</Link>
            <a className="text-[15px] hover:underline cursor-pointer">
              About us
            </a>
          </div>
        </footer>
      </div>
      
    </div>
  );
}

export default Notebook;
