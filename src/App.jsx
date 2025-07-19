import React, { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";

import "./App.css"

function App() {
  const [mode, setMode] = useState("type");
  const [darkMode, setDarkMode] = useState(false);
  const [text, setText] = useState("");

  const [fontSize, setFontSize] = useState(22);
  const [lineHeight, setLineHeight] = useState(30);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [wordSpacing, setWordSpacing] = useState(0);
  const [topOffset, setTopOffset] = useState(40);

  const canvasRef = useRef(null);
  const previewRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    if (canvasRef.current) {
      ctxRef.current = canvasRef.current.getContext("2d");
    }
  }, []);

  const startDraw = () => {
    drawing.current = true;
  };

  const endDraw = () => {
    drawing.current = false;
    ctxRef.current.beginPath();
  };

  const draw = (e) => {
    if (!drawing.current) return;
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctxRef.current.lineWidth = 2;
    ctxRef.current.lineCap = "round";
    ctxRef.current.strokeStyle = "#0d47a1";

    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
  };

  const clearCanvas = () => {
    ctxRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    ctxRef.current.beginPath();
  };

  const downloadImage = () => {
    const target = mode === "type" ? previewRef.current : canvasRef.current;
    html2canvas(target).then((canvas) => {
      const link = document.createElement("a");
      link.download = "notebook.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const previewStyle = {
    fontSize: `${fontSize}px`,
    lineHeight: `${lineHeight}px`,
    letterSpacing: `${letterSpacing}px`,
    wordSpacing: `${wordSpacing}px`,
    paddingTop: `${topOffset}px`,
  };

  return (
    <div className="App">
      <button
        className="dark-toggle"
        onClick={() => setDarkMode((prev) => !prev)}
      >
        🌗 Toggle Dark Mode
      </button>

      <h2>Text ✍️ ↔ Canvas 🖊️ Notebook</h2>

      <div className="tabs">
        <button
          className={mode === "type" ? "active" : ""}
          onClick={() => setMode("type")}
        >
          Type
        </button>
        <button
          className={mode === "draw" ? "active" : ""}
          onClick={() => setMode("draw")}
        >
          Draw
        </button>
      </div>

      <div className="controls">
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

      {mode === "type" && (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Yahan likh …"
          />
          <div
            className="notebook-bg preview"
            ref={previewRef}
            style={previewStyle}
          >
            {text}
            <div className="page-number">Page 1</div>
          </div>
        </>
      )}

      {mode === "draw" && (
        <canvas
          className="notebook-bg canvas"
          ref={canvasRef}
          width={794}
          height={1123}
          onMouseDown={startDraw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onMouseMove={draw}
        />
      )}

      <div className="btns">
        {mode === "draw" && (
          <button className="action" onClick={clearCanvas}>
            🧹 Clear
          </button>
        )}
        <button className="action" onClick={downloadImage}>
          📥 Download
        </button>
      </div>
      <footer
        style={{
          fontSize: "13px",
          textAlign: "center",
          padding: "16px",
          background: "#f8f8f8",
          color: "#888",
        }}
      >
        Writify is for educational/personal use only. Copyright misuse, fraud,
        or illegal activity is user's own risk. No refunds after payment.
      </footer>
    </div>
  );
}

export default App;
