import React, { useRef, useState, useEffect, useCallback } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./Notebook.css";
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

  // NEW features state
  const [autoSave, setAutoSave] = useState(true);
  const [saveNotice, setSaveNotice] = useState("");
  const [customColor, setCustomColor] = useState("#1a237e");

  // Undo/Redo stacks
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

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
    setCustomColor(selected.color);
    setFontWeight(selected.weight);
  };

  // push to undo stack (store previous value)
  const pushUndo = useCallback((prev) => {
    setUndoStack((s) => {
      const next = [...s, prev];
      // keep limited history
      if (next.length > 50) next.shift();
      return next;
    });
    // clearing redo on new edit
    setRedoStack([]);
  }, []);

  // handle text changes with undo stack
  const handleTextChange = (val) => {
    pushUndo(text);
    setText(val);
  };

  // Undo
  const handleUndo = () => {
    setUndoStack((u) => {
      if (u.length === 0) return u;
      const prev = u[u.length - 1];
      setRedoStack((r) => [text, ...r]);
      setText(prev);
      return u.slice(0, u.length - 1);
    });
  };

  // Redo
  const handleRedo = () => {
    setRedoStack((r) => {
      if (r.length === 0) return r;
      const next = r[0];
      setUndoStack((u) => [...u, text]);
      setText(next);
      return r.slice(1);
    });
  };

  // Download PNG (existing)
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

  // NEW: Download PDF (multipage if tall)
  const downloadPDF = async () => {
    if (!text.trim()) return;
    const canvas = await html2canvas(previewRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#fff",
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = 210;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    // If content fits one page
    if (pdfHeight <= 297) {
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    } else {
      // split in pages
      let remainingHeight = canvas.height;
      let position = 0;
      const pageCanvas = document.createElement("canvas");
      const pageCtx = pageCanvas.getContext("2d");
      const pageHeightPx = (canvas.width * 297) / pdfWidth; // px per page for given ratio
      pageCanvas.width = canvas.width;
      pageCanvas.height = pageHeightPx;
      while (remainingHeight > 0) {
        pageCtx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
        pageCtx.drawImage(
          canvas,
          0,
          position,
          canvas.width,
          pageHeightPx,
          0,
          0,
          canvas.width,
          pageHeightPx
        );
        const img = pageCanvas.toDataURL("image/png");
        pdf.addImage(img, "PNG", 0, 0, pdfWidth, 297);
        remainingHeight -= pageHeightPx;
        position += pageHeightPx;
        if (remainingHeight > 0) pdf.addPage();
      }
    }
    pdf.save("writify-note.pdf");
  };

  // NEW: Copy text to clipboard
  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setSaveNotice("Copied to clipboard!");
      setTimeout(() => setSaveNotice(""), 1500);
    } catch (e) {
      setSaveNotice("Copy failed");
      setTimeout(() => setSaveNotice(""), 1500);
    }
  };

  // NEW: Export plain .txt
  const exportTxt = () => {
    if (!text.trim()) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.download = "writify-note.txt";
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Auto-save to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("writify_text_v1");
    if (saved) setText(saved);
    const savedColor = localStorage.getItem("writify_color_v1");
    if (savedColor) {
      setTextColor(savedColor);
      setCustomColor(savedColor);
    }
  }, []);

  // Save when text changes (debounced)
  useEffect(() => {
    if (!autoSave) return;
    const t = setTimeout(() => {
      localStorage.setItem("writify_text_v1", text);
      localStorage.setItem("writify_color_v1", customColor);
      setSaveNotice("Saved locally");
      setTimeout(() => setSaveNotice(""), 1200);
    }, 800);
    return () => clearTimeout(t);
  }, [text, customColor, autoSave]);

  // keyboard shortcuts: Ctrl+Z / Ctrl+Y / Ctrl+S / Ctrl+C
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        // quick save to file (txt)
        exportTxt();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        // let browser handle normal copy; do nothing special
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleUndo, handleRedo, text]);

  // Sync color picker and textColor
  const handleColorChange = (e) => {
    setCustomColor(e.target.value);
    setTextColor(e.target.value);
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
          <span className="rounded-xl bg-[#F5BD02] px-3 py-1 text-[#222831] font-bold select-none">
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
          onChange={(e) => handleTextChange(e.target.value)}
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
            onClick={() => {
              pushUndo(text);
              setText("");
            }}
            disabled={!text.trim()}
          >
            🧹 Clear
          </button>

          {/* NEW: Undo / Redo */}
          <button
            className="px-3 py-2 bg-[#5a5a5a] hover:bg-[#6e6e6e] text-white text-sm rounded-md cursor-pointer"
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            title="Undo (Ctrl+Z)"
          >
            ↶ Undo
          </button>
          <button
            className="px-3 py-2 bg-[#5a5a5a] hover:bg-[#6e6e6e] text-white text-sm rounded-md cursor-pointer"
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            title="Redo (Ctrl+Y)"
          >
            ↷ Redo
          </button>

          {/* NEW: Color picker (keeps UI compact) */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="color"
              value={customColor}
              onChange={handleColorChange}
              className="w-8 h-8 p-0 border-0 bg-transparent cursor-pointer"
              title="Pick pen color"
            />
          </label>

          <button
            className="px-4 py-2 bg-[#00adb5] hover:bg-[#00c3cc] text-white text-sm rounded-md cursor-pointer"
            onClick={downloadImage}
            disabled={!text.trim()}
          >
            📥 Download (PNG)
          </button>

          {/* NEW: PDF, Copy, Export TXT */}
          <button
            className="px-4 py-2 bg-[#7b61ff] hover:bg-[#8c76ff] text-white text-sm rounded-md cursor-pointer"
            onClick={downloadPDF}
            disabled={!text.trim()}
          >
            📄 Export PDF
          </button>

          <button
            className="px-4 py-2 bg-[#3b82f6] hover:bg-[#60a5fa] text-white text-sm rounded-md cursor-pointer"
            onClick={copyText}
            disabled={!text.trim()}
          >
            📋 Copy
          </button>

          <button
            className="px-4 py-2 bg-[#6b7280] hover:bg-[#9ca3af] text-white text-sm rounded-md cursor-pointer"
            onClick={exportTxt}
            disabled={!text.trim()}
          >
            📁 Export TXT
          </button>

          {/* Autosave toggle compact */}
          <label className="ml-2 text-sm flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
              className="cursor-pointer"
            />
            AutoSave
          </label>

          <span className="text-sm text-gray-400 ml-auto">
            📝 {text.length} Chars |{" "}
            {text.trim() ? text.trim().split(/\s+/).length : 0} Words
          </span>
        </div>

        {/* small save/copy notice */}
        {saveNotice && (
          <div className="text-xs text-center text-green-400 mb-4">
            {saveNotice}
          </div>
        )}

        <footer className="text-center text-xs text-gray-400 border-t border-gray-700 pt-4">
          Writify © — Personal/Educational Use Only. No refunds. because it is a
          digital service/tool
          <p>
            Writify is provided for personal, educational, and creative use
            only. All content generated using this platform remains the user's
            responsibility.
          </p>
          <div className="policiesaboutus flex gap-[10px] w-[100%] justify-center">
            <Link
              className="text-[15px] hover:underline cursor-pointer"
              to="/Policies"
            >
              Policies
            </Link>
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
