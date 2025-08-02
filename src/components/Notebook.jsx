import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import "./Notebook.css";

function Notebook({ user, onLogout }) {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(22);
  const [lineHeight, setLineHeight] = useState(30);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [wordSpacing, setWordSpacing] = useState(0);
  const [topOffset, setTopOffset] = useState(40);
  const [fontFamily, setFontFamily] = useState("Daniel, cursive");
  const [textColor, setTextColor] = useState("#1a237e");

  const previewRef = useRef(null);

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
  };

  const userDisplayName = user?.displayName || user?.email || "User";

  return (
    <div className="App">
      <header className="top-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <h2>🖊️ Writify – Handwritten Note Generator</h2>
          <p className="tagline">Make your typed text look handwritten!</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontWeight: "bold", color: "#1a237e", fontSize: "1rem" }}>
            👋 Hello, {userDisplayName}
          </span>
          <button
            onClick={onLogout}
            style={{
              marginLeft: "12px",
              fontSize: "0.9em",
              padding: "4px 12px",
              background: "#e3e8fc",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Font Controls */}
      <div className="controls">
        <label>
          Font
          <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
            <option value="Daniel, cursive">Daniel (Default)</option>
            <option value="'Dancing Script', cursive">Dancing Script</option>
            <option value="'Indie Flower', cursive">Indie Flower</option>
          </select>
        </label>

        <label>
          Text Color
          <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
        </label>

        <label>
          Font Size
          <input type="range" min="12" max="40" value={fontSize} onChange={(e) => setFontSize(+e.target.value)} />
        </label>

        <label>
          Line Height
          <input type="range" min="20" max="60" value={lineHeight} onChange={(e) => setLineHeight(+e.target.value)} />
        </label>

        <label>
          Letter Spacing
          <input type="range" min="-1" max="5" step="0.1" value={letterSpacing} onChange={(e) => setLetterSpacing(+e.target.value)} />
        </label>

        <label>
          Word Spacing
          <input type="range" min="0" max="20" value={wordSpacing} onChange={(e) => setWordSpacing(+e.target.value)} />
        </label>

        <label>
          Top Padding
          <input type="range" min="0" max="200" value={topOffset} onChange={(e) => setTopOffset(+e.target.value)} />
        </label>
      </div>

      {/* Text Input */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something amazing..."
      />

      {/* Notebook Preview */}
      <div className="notebook-container" ref={previewRef}>
        <div className="notebook-paper" style={previewStyle}>
          {text || <span style={{ opacity: 0.3 }}>Your handwriting preview will appear here.</span>}
        </div>
      </div>

      {/* Buttons */}
      <div className="btns">
        <button className="action" onClick={() => setText("")} disabled={!text.trim()}>
          🧹 Clear
        </button>
        <button className="action" onClick={downloadImage} disabled={!text.trim()}>
          📥 Download
        </button>
        <span className="stats">
          📝 {text.length} Chars | {text.trim() ? text.trim().split(/\s+/).length : 0} Words
        </span>
      </div>

      {/* Footer */}
      <footer className="footer">
        Writify © — Personal/Educational Use Only. No refunds. Powered by 💡
        <p>
          Writify is provided for personal, educational, and creative use only.
          All content generated using this platform—whether handwritten images or notes—remains the sole responsibility of the user.
        </p>
      </footer>
    </div>
  );
}

export default Notebook;
