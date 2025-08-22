import React, { useRef, useState, useEffect, useCallback } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./Notebook.css";
import Policies from "./Policies";
import { Link } from "react-router-dom";

function Notebook({ user, onLogout }) {
  // GLOBAL styling states
  const [fontSize, setFontSize] = useState(22);
  const [lineHeight, setLineHeight] = useState(30);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [wordSpacing, setWordSpacing] = useState(0);
  const [topOffset, setTopOffset] = useState(40);
  const [leftPadding, setLeftPadding] = useState(40);
  const [rightPadding, setRightPadding] = useState(40);

  const [fontFamily, setFontFamily] = useState("'Indie Flower', cursive");
  const [textColor, setTextColor] = useState("#1a237e");
  const [fontWeight, setFontWeight] = useState("normal");
  const [textAlign, setTextAlign] = useState("left");

  const [autoSave, setAutoSave] = useState(true);
  const [saveNotice, setSaveNotice] = useState("");
  const [customColor, setCustomColor] = useState("#1a237e");
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Pages: each page has its own text, style, customBg, and image adjustments
  const [pages, setPages] = useState(() => {
    try {
      const saved = localStorage.getItem("writify_pages_v3");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        text: "",
        style: "ruled",
        customBg: null,
        bgAdjust: { scale: 1, rotate: 0, offsetX: 0, offsetY: 0 },
      },
    ];
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [text, setText] = useState(pages[0]?.text || "");

  const previewRefs = useRef([]);
  const previewRefSingle = useRef(null);

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

  const pageStyles = {
    ruled: {
      backgroundImage:
        "linear-gradient(to bottom, transparent 29px, #d0d0d0 30px)",
      backgroundSize: "100% 30px",
    },
    plain: { background: "#fff" },
    dotted: {
      backgroundImage: "radial-gradient(#d0d0d0 1px, transparent 1px)",
      backgroundSize: "12px 12px",
    },
    grid: {
      backgroundImage:
        "linear-gradient(#d0d0d0 1px, transparent 1px), linear-gradient(90deg, #d0d0d0 1px, transparent 1px)",
      backgroundSize: "24px 24px",
    },
    parchment: {
      backgroundImage: "url('https://i.ibb.co/RBH0Xff/parchment.jpg')",
      backgroundSize: "cover",
    },
    dark: { background: "#f7f7f7" },
  };

  // Handler for pen selection
  const handlePenChange = (e) => {
    const selected = penOptions[e.target.value];
    if (!selected) return;
    setTextColor(selected.color);
    setCustomColor(selected.color);
    setFontWeight(selected.weight);
  };

  // Undo functionality
  const pushUndo = useCallback((prevText, pageIndex) => {
    setUndoStack((s) => {
      const next = [...s, { text: prevText, page: pageIndex }];
      if (next.length > 50) next.shift();
      return next;
    });
    setRedoStack([]);
  }, []);

  const handleTextChange = (val) => {
    pushUndo(pages[currentPage].text, currentPage);
    setText(val);
    setPages((p) => {
      const next = [...p];
      next[currentPage] = { ...next[currentPage], text: val };
      return next;
    });
  };

  const handleUndo = () => {
    setUndoStack((u) => {
      if (u.length === 0) return u;
      const last = u[u.length - 1];
      setRedoStack((r) => [
        { text: pages[last.page].text, page: last.page },
        ...r,
      ]);
      setPages((p) => {
        const next = [...p];
        next[last.page] = { ...next[last.page], text: last.text };
        return next;
      });
      setText(last.text);
      setCurrentPage(last.page);
      return u.slice(0, u.length - 1);
    });
  };

  const handleRedo = () => {
    setRedoStack((r) => {
      if (r.length === 0) return r;
      const first = r[0];
      setUndoStack((u) => [
        ...u,
        { text: pages[first.page].text, page: first.page },
      ]);
      setPages((p) => {
        const next = [...p];
        next[first.page] = { ...next[first.page], text: first.text };
        return next;
      });
      setText(first.text);
      setCurrentPage(first.page);
      return r.slice(1);
    });
  };

  // Color picker
  const handleColorChange = (e) => {
    setCustomColor(e.target.value);
    setTextColor(e.target.value);
  };

  // Only allow background image upload for custom image
  const handleBgUpload = (e, pageIndex) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPages((p) => {
        const next = [...p];
        next[pageIndex] = {
          ...next[pageIndex],
          customBg: ev.target.result,
          style: "custom",
          bgAdjust: { scale: 1, rotate: 0, offsetX: 0, offsetY: 0 },
        };
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  // Custom background image adjuster
  // This only changes image position/size/rotation, leaves page (canvas) intact!
  const handleBgAdjust = (key, value) => {
    setPages((p) => {
      const next = [...p];
      const adjustments = { ...next[currentPage].bgAdjust };
      adjustments[key] = value;
      next[currentPage] = { ...next[currentPage], bgAdjust: adjustments };
      return next;
    });
  };

  // Compute only the image style (not the whole canvas/paper)
  const getPageStyleObj = (page) => {
    if (page.style === "custom" && page.customBg) {
      // Paper stays plain, ruled, etc. Image is separate layer!
      // We'll use relative "layer"
      return pageStyles["plain"];
    }
    return pageStyles[page.style] || pageStyles.ruled;
  };

  // Add, Remove, Navigate pages
  const addPage = () => {
    setPages((p) => [
      ...p,
      {
        text: "",
        style: "ruled",
        customBg: null,
        bgAdjust: { scale: 1, rotate: 0, offsetX: 0, offsetY: 0 },
      },
    ]);
    setCurrentPage(pages.length);
    setText("");
  };

  const deletePage = (index) => {
    if (pages.length === 1) {
      pushUndo(pages[0].text, 0);
      setPages([
        {
          text: "",
          style: "ruled",
          customBg: null,
          bgAdjust: { scale: 1, rotate: 0, offsetX: 0, offsetY: 0 },
        },
      ]);
      setCurrentPage(0);
      setText("");
      return;
    }
    const next = pages.filter((_, i) => i !== index);
    const newIndex = Math.max(0, index - 1);
    setPages(next);
    setCurrentPage(newIndex);
    setText(next[newIndex]?.text || "");
  };

  const goNext = () =>
    setCurrentPage(Math.min(pages.length - 1, currentPage + 1));
  const goPrev = () => setCurrentPage(Math.max(0, currentPage - 1));

  useEffect(() => {
    setText(pages[currentPage]?.text || "");
  }, [currentPage, pages]);

  // Image download
  const downloadImage = async () => {
    if (!pages[currentPage].text.trim()) return;
    const el = previewRefs.current[currentPage];
    if (!el) return;
    const canvas = await html2canvas(el, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#fff",
    });
    const link = document.createElement("a");
    link.download = `writify-page-${currentPage + 1}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // PDF download
  const downloadPDF = async () => {
    if (!pages.some((pg) => pg.text.trim())) return;
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    for (let i = 0; i < pages.length; i++) {
      const el = previewRefs.current[i];
      if (!el) continue;
      const canvas = await html2canvas(el, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#fff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    }
    pdf.save("writify-notebook.pdf");
  };

  // TXT export
  const exportTxt = () => {
    const content = pages[currentPage]?.text || "";
    if (!content.trim()) return;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.download = `writify-page-${currentPage + 1}.txt`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Copy plain text to clipboard
  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(pages[currentPage]?.text || "");
      setSaveNotice("Copied to clipboard!");
      setTimeout(() => setSaveNotice(""), 1500);
    } catch {
      setSaveNotice("Copy failed");
      setTimeout(() => setSaveNotice(""), 1500);
    }
  };

  // Autosave changes, including bgAdjust per page
  useEffect(() => {
    if (!autoSave) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem("writify_pages_v3", JSON.stringify(pages));
        localStorage.setItem("writify_color_v1", customColor);
        setSaveNotice("Saved locally");
        setTimeout(() => setSaveNotice(""), 900);
      } catch (e) {}
    }, 800);
    return () => clearTimeout(t);
  }, [pages, customColor, autoSave]);

  useEffect(() => {
    try {
      const savedColor = localStorage.getItem("writify_color_v1");
      if (savedColor) {
        setTextColor(savedColor);
        setCustomColor(savedColor);
      }
    } catch (e) {}
  }, []);

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
        exportTxt();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleUndo, handleRedo, pages]);

  const previewStyle = {
    fontFamily,
    fontSize: `${fontSize}px`,
    lineHeight: `${lineHeight}px`,
    letterSpacing: `${letterSpacing}px`,
    wordSpacing: `${wordSpacing}px`,
    paddingTop: `${topOffset}px`,
    paddingLeft: `${leftPadding}px`,
    paddingRight: `${rightPadding}px`,
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
    position: "relative",
    zIndex: 10,
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
          YouWritee
        </div>
        <div className="flex items-center gap-3 text-xs sm:text-sm">
          <span className="rounded-xl bg-[#7D8D86] px-3 py-1 text-[#222831] font-bold select-none">
            Plans
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
        {/* --- The controls --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {/* Font selector */}
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

          {/* Pen Style */}
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

          {/* Text Alignment */}
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

          {/* Font Size */}
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

          {/* Line Height */}
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

          {/* Letter Spacing */}
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

          {/* Word Spacing */}
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

          {/* Top Padding */}
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

          {/* Left Padding */}
          <label className="flex flex-col text-sm font-medium text-white">
            Left Padding
            <input
              type="range"
              min="0"
              max="200"
              value={leftPadding}
              onChange={(e) => setLeftPadding(+e.target.value)}
              className="mt-1 cursor-pointer"
            />
          </label>

          {/* Right Padding */}
          <label className="flex flex-col text-sm font-medium text-white">
            Right Padding
            <input
              type="range"
              min="0"
              max="200"
              value={rightPadding}
              onChange={(e) => setRightPadding(+e.target.value)}
              className="mt-1 cursor-pointer"
            />
          </label>
        </div>

        {/* Textarea */}
        <textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Type something amazing..."
          style={{ fontFamily }}
          className="w-full min-h-[100px] mb-6 p-4 text-base rounded-lg border border-gray-500 bg-[#2d2f34] text-white font-mono resize-y"
        />

        {/* Preview area */}
        <div
          className="w-full overflow-x-auto mb-6"
          style={{ position: "relative" }}
        >
          <div
            ref={(el) => {
              previewRefs.current[currentPage] = el;
              previewRefSingle.current = el;
            }}
            className="w-[794px] h-[1123px] bg-white mx-auto shadow-md"
            style={{
              ...getPageStyleObj(pages[currentPage] || { style: "ruled" }),
              backgroundSize:
                pages[currentPage]?.style === "ruled" ? "100% 30px" : undefined,
              boxSizing: "border-box",
              fontFamily,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* --- Show background image ONLY for custom image mode --- */}
            {pages[currentPage]?.style === "custom" &&
              pages[currentPage].customBg && (
                <img
                  src={pages[currentPage].customBg}
                  alt="Custom background"
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%, -50%) scale(${pages[currentPage].bgAdjust.scale}) rotate(${pages[currentPage].bgAdjust.rotate}deg) translate(${pages[currentPage].bgAdjust.offsetX}px, ${pages[currentPage].bgAdjust.offsetY}px)`,
                    zIndex: 1,
                    maxWidth: "100%",
                    maxHeight: "100%",
                    opacity: 1,
                    pointerEvents: "none",
                  }}
                />
              )}
            {/* --- Text Layer --- */}
            <div style={previewStyle}>
              {pages[currentPage]?.text ? (
                pages[currentPage].text
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

        {/* Controls row */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <button
            className="px-4 py-2 bg-[#393e46] hover:bg-[#4c515a] text-white text-sm rounded-md cursor-pointer"
            onClick={() => {
              pushUndo(pages[currentPage].text, currentPage);
              setPages((p) => {
                const next = [...p];
                next[currentPage] = { ...next[currentPage], text: "" };
                return next;
              });
              setText("");
            }}
            disabled={!pages[currentPage]?.text?.trim()}
          >
            🧹 Clear
          </button>

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
            disabled={!pages[currentPage]?.text?.trim()}
          >
            📥 Download (PNG)
          </button>

          <button
            className="px-4 py-2 bg-[#7b61ff] hover:bg-[#8c76ff] text-white text-sm rounded-md cursor-pointer"
            onClick={downloadPDF}
            disabled={!pages.some((pg) => pg.text.trim())}
          >
            📄 Export PDF
          </button>

          <button
            className="px-4 py-2 bg-[#3b82f6] hover:bg-[#60a5fa] text-white text-sm rounded-md cursor-pointer"
            onClick={copyText}
            disabled={!pages[currentPage]?.text?.trim()}
          >
            📋 Copy
          </button>

          <button
            className="px-4 py-2 bg-[#6b8374] hover:bg-[#9ca3af] text-white text-sm rounded-md cursor-pointer"
            onClick={exportTxt}
            disabled={!pages[currentPage]?.text?.trim()}
          >
            📁 Export TXT
          </button>

          <label className="ml-2 text-sm flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
              className="cursor-pointer "
            />
            AutoSave
          </label>

          <div className="flex items-center gap-2 ml-2">
            <button
              onClick={goPrev}
              className="px-2 py-1 bg-[#2d2f34] rounded text-sm hover:bg-[#3b3f46]"
              title="Previous Page"
            >
              ◀
            </button>
            <span className="text-sm text-gray-300">
              Page {currentPage + 1} / {pages.length}
            </span>
            <button
              onClick={goNext}
              className="px-2 py-1 bg-[#2d2f34] rounded text-sm hover:bg-[#3b3f46]"
              title="Next Page"
            >
              ▶
            </button>
            <button
              onClick={addPage}
              className="px-2 py-1 bg-[#1f6feb] rounded text-sm hover:bg-[#2677ff]"
              title="Add Page"
            >
              +Page
            </button>
            <button
              onClick={() => deletePage(currentPage)}
              className="px-2 py-1 bg-[#ff5c5c] rounded text-sm hover:bg-[#ff7b7b]"
              title="Delete Page"
            >
              🗑
            </button>
          </div>

          <span className="text-sm text-gray-400 ml-auto">
            📝 {pages[currentPage]?.text?.length || 0} Chars |{" "}
            {pages[currentPage]?.text?.trim()
              ? pages[currentPage].text.trim().split(/\s+/).length
              : 0}{" "}
            Words
          </span>
        </div>

        {/* Page style selector */}
        <div className="flex gap-3 items-center mb-4">
          <label className="flex items-center gap-2 text-sm text-white">
            Page Style:
            <select
              value={pages[currentPage]?.style || "ruled"}
              onChange={(e) => {
                const style = e.target.value;
                setPages((p) => {
                  const next = [...p];
                  next[currentPage] = { ...next[currentPage], style };
                  if (style !== "custom") {
                    next[currentPage].customBg = null;
                    next[currentPage].bgAdjust = {
                      scale: 1,
                      rotate: 0,
                      offsetX: 0,
                      offsetY: 0,
                    };
                  }
                  return next;
                });
              }}
              className="mt-1 p-2 bg-[#2d2f34] text-white border border-gray-600 rounded-md cursor-pointer"
            >
              <option value="ruled">Ruled</option>
              <option value="plain">Plain</option>
              <option value="custom">Custom Image</option>
            </select>
          </label>

          {pages[currentPage]?.style === "custom" && (
            <label className="flex items-center gap-2 text-sm text-white cursor-pointer border-2-transparent rounded-3xl p-2 bg-[#393E46] pl-23">
              (beta)Upload Custom background:
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleBgUpload(e, currentPage)}
                className="mt-1"
              />
            </label>
          )}

          {/* Preview thumbnail of current background */}
          <div
            style={{
              width: 48,
              height: 34,
              borderRadius: 6,
              border: "1px solid #444",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Only show image thumbnail if style is custom */}
            {pages[currentPage]?.style === "custom" &&
              pages[currentPage].customBg && (
                <img
                  src={pages[currentPage].customBg}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: `scale(${pages[currentPage].bgAdjust.scale}) 
                    rotate(${pages[currentPage].bgAdjust.rotate}deg) 
                    translate(${pages[currentPage].bgAdjust.offsetX / 2}px,${
                      pages[currentPage].bgAdjust.offsetY / 2
                    }px)`,
                  }}
                  alt="preview-bg"
                />
              )}
          </div>
        </div>

        {/* ---- Custom Bg Adjustment Controls (for image only) ---- */}
        {pages[currentPage]?.style === "custom" &&
          pages[currentPage].customBg && (
            <div className="flex gap-4 items-center mb-4 bg-[#32343a] rounded-lg p-4">
              <label>
                Zoom:
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.01"
                  value={pages[currentPage].bgAdjust?.scale || 1}
                  onChange={(e) => handleBgAdjust("scale", +e.target.value)}
                  className="ml-2"
                />
              </label>
              <label>
                Rotate:
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={pages[currentPage].bgAdjust?.rotate || 0}
                  onChange={(e) => handleBgAdjust("rotate", +e.target.value)}
                  className="ml-2"
                />
              </label>
              <label>
                Move H:
                <input
                  type="range"
                  min="-200"
                  max="200"
                  step="1"
                  value={pages[currentPage].bgAdjust?.offsetX || 0}
                  onChange={(e) => handleBgAdjust("offsetX", +e.target.value)}
                  className="ml-2"
                />
              </label>
              <label>
                Move V:
                <input
                  type="range"
                  min="-200"
                  max="200"
                  step="1"
                  value={pages[currentPage].bgAdjust?.offsetY || 0}
                  onChange={(e) => handleBgAdjust("offsetY", +e.target.value)}
                  className="ml-2"
                />
              </label>
            </div>
          )}

        {saveNotice && (
          <div className="text-xs text-center text-green-400 mb-4">
            {saveNotice}
          </div>
        )}

        <footer className="text-center text-xs text-gray-400 border-t border-gray-700 pt-4">
          YouWritee © — Personal/Educational Use Only. No refunds. because it is a
          digital service/tool
          <p>
            YouWritee is provided for personal, educational, and creative use
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
