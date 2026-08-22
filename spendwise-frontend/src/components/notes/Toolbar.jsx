// src/components/notes/Toolbar.jsx
// Rich editor toolbar: text, checklist, table, calculator, pin, favorite, color, PDF with Lucide icons.

import { useState } from "react";
import ColorPicker from "./ColorPicker";
import { CATEGORIES } from "./CategoryFilter";
import { TEMPLATES } from "../../utils/notes/templates";
import {
  Bold,
  Italic,
  Underline,
  SquareCheck,
  Table as TableIcon,
  Calculator,
  Pin,
  Star,
  Palette,
  Folder,
  FileText,
  Download,
} from "lucide-react";

export default function Toolbar({
  note, onUpdate, onInsertHtml, onToggleCalc, onExportPdf, tokens,
}) {
  const t = tokens;
  const [showColor, setShowColor]         = useState(false);
  const [showCategory, setShowCategory]   = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showTable, setShowTable]         = useState(false);
  const [tableRows, setTableRows]         = useState(3);
  const [tableCols, setTableCols]         = useState(3);

  const handleRowsChange = (val) => {
    const num = val.replace(/[^\d]/g, "").slice(0, 2);
    setTableRows(num);
  };
  const handleColsChange = (val) => {
    const num = val.replace(/[^\d]/g, "").slice(0, 2);
    setTableCols(num);
  };

  const insertChecklist = () => {
    const html = `<ul class="checklist" style="list-style:none;padding-left:0;margin:6px 0">
<li class="check-item" style="display:flex;align-items:center;gap:6px;margin:4px 0">
  <input type="checkbox" contenteditable="false" style="width:16px;height:16px;accent-color:#3b82f6;cursor:pointer"> <span>&nbsp;</span>
</li>
</ul><p></p>`;
    if (onInsertHtml) {
      onInsertHtml(html);
    } else {
      document.execCommand("insertHTML", false, html);
    }
  };

  const insertTable = () => {
    const r = Math.max(1, Math.min(20, Number(tableRows) || 3));
    const c = Math.max(1, Math.min(10, Number(tableCols) || 3));
    const headers = Array.from({ length: c }, (_, i) =>
      `<th style="border:1px solid rgba(128,128,128,0.3);padding:8px 12px;background:rgba(128,128,128,0.08);font-weight:600">Header ${i + 1}</th>`
    ).join("");
    const rows = Array.from({ length: r }, () => {
      const cells = Array.from({ length: c }, () =>
        `<td style="border:1px solid rgba(128,128,128,0.3);padding:8px 12px;min-width:60px">&nbsp;</td>`
      ).join("");
      return `<tr>${cells}</tr>`;
    }).join("");
    const html = `<table style="border-collapse:collapse;width:100%;margin:12px 0">
<thead><tr>${headers}</tr></thead>
<tbody>${rows}</tbody>
</table><p></p>`;
    if (onInsertHtml) {
      onInsertHtml(html);
    } else {
      document.execCommand("insertHTML", false, html);
    }
    setShowTable(false);
  };

  const applyTemplate = (tmpl) => {
    onUpdate({ title: tmpl.title, category: tmpl.category, color: tmpl.color, content: tmpl.content });
    setShowTemplates(false);
  };

  const toolBtn = (key, icon, title, onClick, active = false, labelText = null) => {
    const IconComp = icon;
    return (
      <button
        key={key}
        type="button"
        onClick={onClick}
        onMouseDown={(e) => {
          if (["bold", "italic", "underline", "checklist"].includes(key)) {
            e.preventDefault();
          }
        }}
        title={title}
        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-90 flex items-center gap-1.5 ${
          active ? t.btn.primary : `${t.btn.secondary} hover:brightness-95`
        }`}
      >
        <IconComp size={15} strokeWidth={active ? 2.4 : 1.9} />
        {labelText && <span className="hidden sm:inline text-[11px]">{labelText}</span>}
      </button>
    );
  };

  return (
    <div className={`${t.surface} ${t.border} border-b px-3 py-2 flex flex-wrap gap-1.5 items-center relative`}>
      {/* Text formatting */}
      {toolBtn("bold",      Bold,      "Bold",      () => document.execCommand("bold"))}
      {toolBtn("italic",    Italic,    "Italic",    () => document.execCommand("italic"))}
      {toolBtn("underline", Underline, "Underline", () => document.execCommand("underline"))}

      <div className={`w-px h-5 ${t.border} border-l mx-0.5`} />

      {/* Checklist */}
      {toolBtn("checklist", SquareCheck, "Checklist", insertChecklist, false, "To-Do")}

      {/* Table */}
      <div className="relative">
        {toolBtn("table", TableIcon, "Table", () => setShowTable((v) => !v), showTable, "Table")}
        {showTable && (
          <div className={`absolute top-9 left-0 z-30 ${t.card} ${t.border} border rounded-xl p-3 shadow-xl space-y-2 w-44 animate-fade-slide-up`}
            onMouseDown={(e) => e.stopPropagation()}>
            <p className={`text-xs font-bold ${t.text}`}>Insert Table</p>
            <div className="flex gap-2 items-center">
              <label className={`text-xs ${t.muted}`}>Rows</label>
              <input type="number" min="1" max="20" value={tableRows}
                onChange={(e) => handleRowsChange(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                onKeyUp={(e) => e.stopPropagation()}
                className={`border rounded-lg px-2 py-1 text-xs w-14 ${t.input}`} />
            </div>
            <div className="flex gap-2 items-center">
              <label className={`text-xs ${t.muted}`}>Cols</label>
              <input type="number" min="1" max="10" value={tableCols}
                onChange={(e) => handleColsChange(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                onKeyUp={(e) => e.stopPropagation()}
                className={`border rounded-lg px-2 py-1 text-xs w-14 ${t.input}`} />
            </div>
            <button onClick={insertTable}
              className={`${t.btn.primary} w-full py-1.5 rounded-lg text-xs font-bold`}>
              Insert
            </button>
          </div>
        )}
      </div>

      {/* Calculator */}
      {toolBtn("calculator", Calculator, "Calculator", onToggleCalc)}

      <div className={`w-px h-5 ${t.border} border-l mx-0.5`} />

      {/* Pin */}
      {toolBtn("pin", Pin, "Pin Note", () => onUpdate({ pinned: !note.pinned }), note.pinned)}

      {/* Favorite */}
      {toolBtn("favorite", Star, "Favorite", () => onUpdate({ favorite: !note.favorite }), note.favorite)}

      {/* Color picker */}
      <div className="relative">
        {toolBtn("color", Palette, "Card Color", () => { setShowColor((v) => !v); setShowCategory(false); setShowTemplates(false); })}
        {showColor && (
          <div className={`absolute top-9 left-0 z-30 ${t.card} ${t.border} border rounded-xl shadow-xl animate-fade-slide-up`}>
            <ColorPicker value={note.color} onChange={(c) => { onUpdate({ color: c }); setShowColor(false); }} />
          </div>
        )}
      </div>

      {/* Category */}
      <div className="relative">
        {toolBtn("category", Folder, "Category", () => { setShowCategory((v) => !v); setShowColor(false); setShowTemplates(false); }, false, note.category)}
        {showCategory && (
          <div className={`absolute top-9 left-0 z-30 ${t.card} ${t.border} border rounded-xl shadow-xl p-2 space-y-1 w-36 animate-fade-slide-up`}>
            {CATEGORIES.filter((c) => c !== "All").map((cat) => (
              <button key={cat} onClick={() => { onUpdate({ category: cat }); setShowCategory(false); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
                  note.category === cat ? t.btn.primary : `${t.btn.secondary} hover:brightness-95`
                }`}>
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Templates */}
      <div className="relative">
        {toolBtn("templates", FileText, "Templates", () => { setShowTemplates((v) => !v); setShowColor(false); setShowCategory(false); }, false, "Templates")}
        {showTemplates && (
          <div className={`absolute top-9 left-0 z-30 ${t.card} ${t.border} border rounded-xl shadow-xl p-2 space-y-1 w-48 animate-fade-slide-up`}>
            <p className={`text-xs font-bold px-2 py-1 ${t.muted}`}>Templates</p>
            {TEMPLATES.map((tmpl) => (
              <button key={tmpl.key} onClick={() => applyTemplate(tmpl)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${t.btn.secondary} hover:brightness-95`}>
                {tmpl.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* PDF Export */}
      {toolBtn("pdf", Download, "Export PDF", onExportPdf, false, "PDF")}
    </div>
  );
}
