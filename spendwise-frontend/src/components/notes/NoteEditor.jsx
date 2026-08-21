// src/components/notes/NoteEditor.jsx
// Full note editor with toolbar, contenteditable body, floating calculator.

import { useEffect, useRef, useState, useCallback } from "react";
import Toolbar from "./Toolbar";
import FloatingCalculator from "./FloatingCalculator";
import { NOTE_COLORS, NOTE_COLORS_DARK } from "./ColorPicker";
import { exportNoteToPDF } from "../../utils/notes/notesExportPdf";
import { CATEGORIES } from "./CategoryFilter";

export default function NoteEditor({ note, onSave, onBack, tokens, isDark }) {
  const t = tokens;
  const editorRef     = useRef(null);
  const saveTimer     = useRef(null);
  const [local, setLocal]         = useState(note);
  const [showCalc, setShowCalc]   = useState(false);
  const [saved, setSaved]         = useState(true);

  const colorKey = local.color || "white";
  const editorBg = isDark ? NOTE_COLORS_DARK[colorKey] : NOTE_COLORS[colorKey]?.bg || "bg-white";

  // Populate editor with content on mount
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== (note.content || "")) {
      editorRef.current.innerHTML = note.content || "";
    }
  }, [note.id]);

  // Auto-save debounce
  const triggerSave = useCallback((updates) => {
    setSaved(false);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setLocal((prev) => {
        const merged = { ...prev, ...updates };
        onSave(merged);
        setSaved(true);
        return merged;
      });
    }, 600);
  }, [onSave]);

  const handleContentChange = () => {
    const html = editorRef.current?.innerHTML || "";
    triggerSave({ content: html });
  };

  const handleUpdate = (updates) => {
    setLocal((prev) => ({ ...prev, ...updates }));
    // If content override (template), push to editor
    if (updates.content !== undefined && editorRef.current) {
      editorRef.current.innerHTML = updates.content;
    }
    triggerSave(updates);
  };

  const handleInsertResult = (value) => {
    editorRef.current?.focus();
    document.execCommand("insertText", false, value);
    handleContentChange();
  };

  return (
    <div className={`min-h-screen ${editorBg} ${t.text} flex flex-col`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 ${t.surface} ${t.border} border-b`}>
        <button onClick={onBack} className={`text-sm font-medium ${t.btn.ghost}`}>← Back</button>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${saved ? "text-emerald-500" : t.muted}`}>
            {saved ? "✓ Saved" : "Saving…"}
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <Toolbar
        note={local}
        onUpdate={handleUpdate}
        onToggleCalc={() => setShowCalc((v) => !v)}
        onExportPdf={() => exportNoteToPDF(local)}
        tokens={t}
      />

      {/* Note content area */}
      <div className="flex-1 px-4 py-4 space-y-3">
        {/* Title */}
        <input
          type="text"
          placeholder="Title"
          value={local.title}
          onChange={(e) => handleUpdate({ title: e.target.value })}
          className={`w-full text-2xl font-extrabold bg-transparent border-none outline-none placeholder-current/30 ${t.text}`}
        />

        {/* Editable body */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleContentChange}
          data-placeholder="Start writing…"
          className={`min-h-[60vh] text-sm leading-relaxed outline-none ${t.text}
            [&_table]:w-full [&_table]:border-collapse [&_table]:my-2
            [&_td]:border [&_td]:border-current/20 [&_td]:p-2
            [&_th]:border [&_th]:border-current/20 [&_th]:p-2 [&_th]:font-semibold [&_th]:bg-current/5
            [&_ul.checklist]:list-none [&_ul.checklist]:pl-0
            [&_.check-item]:flex [&_.check-item]:items-center [&_.check-item]:gap-2 [&_.check-item]:my-1
            empty:before:content-[attr(data-placeholder)] empty:before:opacity-30 empty:before:pointer-events-none
          `}
        />
      </div>

      {/* Floating Calculator */}
      {showCalc && (
        <FloatingCalculator
          onInsert={handleInsertResult}
          onClose={() => setShowCalc(false)}
          tokens={t}
        />
      )}
    </div>
  );
}
