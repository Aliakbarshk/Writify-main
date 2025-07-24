// src/App.jsx
import React, { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import "./Notebook.css";

function Notebook() {
  const [darkMode, setDarkMode] = useState(false);
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(22);
  const [lineHeight, setLineHeight] = useState(30);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [wordSpacing, setWordSpacing] = useState(0);
  const [topOffset, setTopOffset] = useState(40);

  const [fontFamily, setFontFamily] = useState("Daniel, cursive");
  const [textColor, setTextColor] = useState("#1a237e");

  const previewRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const downloadImage = () => {
    if (!text.trim()) return;
    html2canvas(previewRef.current, {
      scale: 2, // High-DPI download
      backgroundColor: null, // Keeps your notebook/paper background
      useCORS: true, // In case you use webfonts or images
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
  // 🔽 Remove or tone down this line:
  // textShadow: "0.2px 0.2px 0 #0002",
};


  return (
    <div className="App">
      <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light" : "🌗 Dark"}
      </button>
      <div className="user-section">
  <div className="user-avatar">👤</div>
  <div>
    <div className="user-name">Welcome, User!</div>
    <button className="logout-link" >
      Logout
    </button>
  </div>
</div>


      <h2>🖊️ Writify – Handwritten Note Generator</h2>
      <p className="tagline">Make your typed text look handwritten!</p>

      <div className="controls">
        <label>
          Font
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
          >
            <option value="Daniel, cursive">Daniel (Default)</option>
            <option value="'Dancing Script', cursive">Dancing Script</option>
            <option value="'Indie Flower', cursive">Indie Flower</option>
          </select>
        </label>
        <label>
          Text Color
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
          />
        </label>
        <label>
          Font Size
          <input
            type="range"
            min="12"
            max="40"
            value={fontSize}
            onChange={(e) => setFontSize(+e.target.value)}
          />
        </label>
        <label>
          Line Height
          <input
            type="range"
            min="20"
            max="60"
            value={lineHeight}
            onChange={(e) => setLineHeight(+e.target.value)}
          />
        </label>
        <label>
          Letter Spacing
          <input
            type="range"
            min="-1"
            max="5"
            step="0.1"
            value={letterSpacing}
            onChange={(e) => setLetterSpacing(+e.target.value)}
          />
        </label>
        <label>
          Word Spacing
          <input
            type="range"
            min="0"
            max="20"
            value={wordSpacing}
            onChange={(e) => setWordSpacing(+e.target.value)}
          />
        </label>
        <label>
          Top Padding
          <input
            type="range"
            min="0"
            max="200"
            value={topOffset}
            onChange={(e) => setTopOffset(+e.target.value)}
          />
        </label>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something amazing..."
      />

      <div
        className="notebook-bg preview"
        ref={previewRef}
        style={previewStyle}
      >
        {text || (
          <span style={{ opacity: 0.3 }}>
            Your handwriting preview will appear here.
          </span>
        )}
        <div className="page-number">Page 1</div>
      </div>

      <div className="btns">
        <button
          className="action"
          onClick={() => setText("")}
          disabled={!text.trim()}
        >
          🧹 Clear
        </button>
        <button
          className="action"
          onClick={downloadImage}
          disabled={!text.trim()}
        >
          📥 Download
        </button>
        <span className="stats">
          📝 {text.length} Chars |{" "}
          {text.trim() ? text.trim().split(/\s+/).length : 0} Words
        </span>
      </div>

      <footer className="footer">
        Writify © — Personal/Educational Use Only. No refunds. Powered by 💡

        <p>Writify is provided for personal, educational, and creative use only. All content generated using this platform—whether handwritten images or notes—remains the sole responsibility of the user. By using this service, you agree not to misuse generated content for fraud, unlawful activities, or infringement of copyright or intellectual property rights. Writify and its team accept no liability for any loss, damage, or dispute resulting from the use of materials produced here. Please note that all digital purchases are final; due to the nature of digital products, refunds will not be issued. By accessing or using Writify, you confirm your understanding and acceptance of these terms.</p>
      </footer>
    </div>
  );
}

export default Notebook;
