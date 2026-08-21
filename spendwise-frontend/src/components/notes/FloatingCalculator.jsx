// src/components/notes/FloatingCalculator.jsx
// Draggable floating calculator with Insert Result feature.

import { useState, useRef, useEffect } from "react";

const BUTTONS = [
  ["C", "±", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["0", ".", "=", "⌫"],
];

export default function FloatingCalculator({ onInsert, onClose, tokens }) {
  const t = tokens;
  const [display, setDisplay]   = useState("0");
  const [expr, setExpr]         = useState("");
  const [result, setResult]     = useState(null);
  const [minimized, setMin]     = useState(false);

  // Drag state
  const ref      = useRef(null);
  const dragging = useRef(false);
  const offset   = useRef({ x: 0, y: 0 });
  const pos      = useRef({ x: window.innerWidth / 2 - 130, y: 120 });

  useEffect(() => {
    if (ref.current) {
      ref.current.style.left = pos.current.x + "px";
      ref.current.style.top  = pos.current.y + "px";
    }
  }, []);

  const onMouseDown = (e) => {
    dragging.current = true;
    offset.current = {
      x: e.clientX - pos.current.x,
      y: e.clientY - pos.current.y,
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!dragging.current) return;
    pos.current = { x: e.clientX - offset.current.x, y: e.clientY - offset.current.y };
    if (ref.current) {
      ref.current.style.left = pos.current.x + "px";
      ref.current.style.top  = pos.current.y + "px";
    }
  };

  const onMouseUp = () => {
    dragging.current = false;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  const handleBtn = (btn) => {
    if (btn === "C") { setDisplay("0"); setExpr(""); setResult(null); return; }
    if (btn === "⌫") {
      setDisplay((d) => d.length > 1 ? d.slice(0, -1) : "0");
      setExpr((e) => e.slice(0, -1));
      return;
    }
    if (btn === "±") {
      setDisplay((d) => d.startsWith("-") ? d.slice(1) : "-" + d);
      return;
    }
    if (btn === "=") {
      try {
        const evalExpr = (expr || display)
          .replace(/×/g, "*")
          .replace(/÷/g, "/");
        const res = Function(`"use strict"; return (${evalExpr})`)();
        const rounded = Math.round(res * 1e10) / 1e10;
        setDisplay(String(rounded));
        setResult(rounded);
        setExpr(String(rounded));
      } catch {
        setDisplay("Error");
      }
      return;
    }

    const opMap = { "×": "*", "÷": "/" };
    const char  = opMap[btn] || btn;

    if (display === "0" && !"+-×÷%".includes(btn)) {
      setDisplay(btn);
      setExpr(char);
    } else {
      setDisplay((d) => d + btn);
      setExpr((e) => e + char);
    }
    setResult(null);
  };

  const btnClass = (btn) => {
    if (btn === "=") return "bg-blue-600 hover:bg-blue-700 text-white font-bold";
    if (["÷", "×", "-", "+"].includes(btn)) return "bg-orange-500 hover:bg-orange-600 text-white font-bold";
    if (["C", "±", "%"].includes(btn)) return `${t.btn.secondary} font-semibold`;
    return `${t.card} ${t.border} border font-medium hover:brightness-95`;
  };

  return (
    <div
      ref={ref}
      className={`fixed z-50 w-64 rounded-2xl shadow-2xl border ${t.border} overflow-hidden animate-slide-up-modal`}
      style={{ left: pos.current.x, top: pos.current.y }}
    >
      {/* Title bar */}
      <div
        className={`${t.surface} px-3 py-2.5 flex items-center justify-between cursor-grab active:cursor-grabbing select-none`}
        onMouseDown={onMouseDown}
      >
        <span className={`text-xs font-bold ${t.text}`}>🧮 Calculator</span>
        <div className="flex gap-2">
          <button onClick={() => setMin((v) => !v)} className={`text-xs ${t.muted} transition-transform active:scale-90`}>
            {minimized ? "▲" : "▼"}
          </button>
          <button onClick={onClose} className="text-xs text-red-500 font-bold transition-transform active:scale-90">✕</button>
        </div>
      </div>

      {!minimized && (
        <div className="animate-fade-in">
          {/* Display */}
          <div className={`${t.card} px-4 py-3 text-right`}>
            <div className={`text-xs ${t.muted} h-4 truncate`}>{expr}</div>
            <div className={`text-2xl font-bold ${t.text} truncate`}>{display}</div>
          </div>

          {/* Buttons */}
          <div className={`${t.surface} p-2 grid grid-cols-4 gap-1.5`}>
            {BUTTONS.flat().map((btn, i) => (
              <button
                key={i}
                onClick={() => handleBtn(btn)}
                className={`rounded-xl py-3 text-sm transition-all duration-100 active:scale-90 ${btnClass(btn)}`}
              >
                {btn}
              </button>
            ))}
          </div>

          {/* Insert result */}
          {result !== null && (
            <div className={`${t.card} px-3 pb-3 animate-fade-slide-up`}>
              <button
                onClick={() => { onInsert(String(result)); setResult(null); }}
                className={`${t.btn.success} w-full py-2 rounded-xl text-xs font-bold active:scale-95 transition-all`}
              >
                Insert Result ({result}) →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

}
