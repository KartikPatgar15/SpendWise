// src/components/notes/NoteEditor.jsx
// Full note editor with toolbar, contenteditable body, floating calculator.

import { useEffect, useRef, useState, useCallback } from "react";
import Toolbar from "./Toolbar";
import FloatingCalculator from "./FloatingCalculator";
import { NOTE_COLORS, NOTE_COLORS_DARK } from "./ColorPicker";
import { exportNoteToPDF } from "../../utils/notes/notesExportPdf";

export default function NoteEditor({ note, onSave, onBack, tokens, isDark }) {
  const t = tokens;
  const editorRef     = useRef(null);
  const saveTimer     = useRef(null);
  const savedRangeRef = useRef(null);
  const [local, setLocal]         = useState(note);
  const [showCalc, setShowCalc]   = useState(false);
  const [saved, setSaved]         = useState(true);

  const colorKey = local.color || "white";
  const editorBg = isDark ? NOTE_COLORS_DARK[colorKey] : NOTE_COLORS[colorKey]?.bg || "bg-white";

  // Populate editor with content on mount or note switch
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

  const handleContentChange = useCallback(() => {
    const html = editorRef.current?.innerHTML || "";
    triggerSave({ content: html });
  }, [triggerSave]);

  const handleUpdate = (updates) => {
    setLocal((prev) => ({ ...prev, ...updates }));
    // If content override (template), push to editor
    if (updates.content !== undefined && editorRef.current) {
      editorRef.current.innerHTML = updates.content;
    }
    triggerSave(updates);
  };

  // ── Track and Save Current Caret Selection ─────────────────────────────────
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current && editorRef.current.contains(sel.anchorNode)) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  // ── HTML / Block Insertion Helper ──────────────────────────────────────────
  const handleInsertHtml = (html) => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    const sel = window.getSelection();
    if (sel) {
      if (savedRangeRef.current && editorRef.current.contains(savedRangeRef.current.commonAncestorContainer)) {
        sel.removeAllRanges();
        sel.addRange(savedRangeRef.current);
      } else if (!sel.rangeCount || !editorRef.current.contains(sel.anchorNode)) {
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }

    document.execCommand("insertHTML", false, html);
    saveSelection();
    handleContentChange();
  };

  const handleInsertResult = (value) => {
    handleInsertHtml(value);
  };

  // ── Click handler for interactive elements (Checkboxes) ───────────────────
  const handleClick = (e) => {
    if (e.target.tagName === "INPUT" && e.target.type === "checkbox") {
      if (e.target.checked) {
        e.target.setAttribute("checked", "");
      } else {
        e.target.removeAttribute("checked");
      }
      handleContentChange();
    }
  };

  // ── Keyboard handler (Backspace & Enter inside Checklists) ────────────────
  const handleKeyDown = (e) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;
      const range = sel.getRangeAt(0);

      let node = sel.anchorNode;
      const checkItem = node?.nodeType === Node.ELEMENT_NODE
        ? node.closest(".check-item")
        : node?.parentElement?.closest(".check-item");

      if (checkItem) {
        const text = checkItem.textContent || "";
        const isCollapsed = range.collapsed;

        let isAtStart = false;
        if (isCollapsed) {
          const preRange = range.cloneRange();
          preRange.selectNodeContents(checkItem);
          preRange.setEnd(range.startContainer, range.startOffset);
          const textBefore = preRange.toString();
          isAtStart = textBefore.length === 0;
        }

        // Backspace on empty checkbox OR when cursor is at the very beginning of the item
        if (e.key === "Backspace" && (isAtStart || text.trim() === "")) {
          e.preventDefault();
          const parentUl = checkItem.closest("ul.checklist") || checkItem.parentElement;
          const prevSibling = checkItem.previousElementSibling;
          const nextSibling = checkItem.nextElementSibling;

          if (text.trim() === "") {
            // Completely empty checklist item -> remove it
            checkItem.remove();

            if (parentUl && parentUl.children.length === 0) {
              const p = document.createElement("p");
              p.innerHTML = "<br>";
              parentUl.replaceWith(p);
              const newRange = document.createRange();
              newRange.selectNodeContents(p);
              newRange.collapse(true);
              sel.removeAllRanges();
              sel.addRange(newRange);
            } else if (prevSibling) {
              const newRange = document.createRange();
              newRange.selectNodeContents(prevSibling);
              newRange.collapse(false);
              sel.removeAllRanges();
              sel.addRange(newRange);
            } else if (nextSibling) {
              const newRange = document.createRange();
              newRange.selectNodeContents(nextSibling);
              newRange.collapse(true);
              sel.removeAllRanges();
              sel.addRange(newRange);
            }
          } else {
            // Has text, but cursor was at start -> convert to regular paragraph
            const p = document.createElement("p");
            p.textContent = text;
            if (parentUl && parentUl.children.length === 1) {
              parentUl.replaceWith(p);
            } else {
              checkItem.replaceWith(p);
            }
            const newRange = document.createRange();
            newRange.selectNodeContents(p);
            newRange.collapse(true);
            sel.removeAllRanges();
            sel.addRange(newRange);
          }

          handleContentChange();
          return;
        }
      }
    }

    if (e.key === "Enter") {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;

      let node = sel.anchorNode;
      const checkItem = node?.nodeType === Node.ELEMENT_NODE
        ? node.closest(".check-item")
        : node?.parentElement?.closest(".check-item");

      if (checkItem) {
        e.preventDefault();
        const text = checkItem.textContent || "";
        const parentUl = checkItem.closest("ul.checklist") || checkItem.parentElement;

        if (text.trim() === "") {
          // Enter on empty checklist item -> Exit checklist
          const p = document.createElement("p");
          p.innerHTML = "<br>";
          if (parentUl && parentUl.children.length === 1) {
            parentUl.replaceWith(p);
          } else {
            checkItem.remove();
            parentUl.after(p);
          }
          const newRange = document.createRange();
          newRange.selectNodeContents(p);
          newRange.collapse(true);
          sel.removeAllRanges();
          sel.addRange(newRange);
        } else {
          // Enter on item with text -> Create next checklist item
          const newLi = document.createElement("li");
          newLi.className = "check-item";
          newLi.style.cssText = "display:flex;align-items:center;gap:6px;margin:4px 0";
          newLi.innerHTML = `<input type="checkbox" contenteditable="false" style="width:16px;height:16px;accent-color:#3b82f6;cursor:pointer"> <span><br></span>`;
          checkItem.after(newLi);

          const span = newLi.querySelector("span");
          const newRange = document.createRange();
          newRange.selectNodeContents(span);
          newRange.collapse(true);
          sel.removeAllRanges();
          sel.addRange(newRange);
        }

        handleContentChange();
        return;
      }
    }
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
        onInsertHtml={handleInsertHtml}
        onToggleCalc={() => setShowCalc((v) => !v)}
        onExportPdf={() => exportNoteToPDF(local)}
        tokens={t}
      />

      {/* Note content area */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-4 max-w-4xl mx-auto w-full">
        {/* Title */}
        <input
          type="text"
          placeholder="Title"
          value={local.title}
          onChange={(e) => handleUpdate({ title: e.target.value })}
          className={`w-full text-2xl sm:text-3xl font-extrabold bg-transparent border-none outline-none placeholder-current/30 ${t.text}`}
        />

        {/* Editable body */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleContentChange}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          onKeyUp={saveSelection}
          onMouseUp={saveSelection}
          onFocus={saveSelection}
          data-placeholder="Start writing…"
          className={`min-h-[60vh] text-sm sm:text-base leading-relaxed outline-none ${t.text}
            [&_table]:w-full [&_table]:border-collapse [&_table]:my-3
            [&_td]:border [&_td]:border-current/20 [&_td]:p-2.5 [&_td]:min-w-[60px]
            [&_th]:border [&_th]:border-current/20 [&_th]:p-2.5 [&_th]:font-semibold [&_th]:bg-current/5
            [&_ul.checklist]:list-none [&_ul.checklist]:pl-0 [&_ul.checklist]:my-2
            [&_.check-item]:flex [&_.check-item]:items-center [&_.check-item]:gap-2 [&_.check-item]:my-1
            [&_.check-item_input]:cursor-pointer [&_.check-item_input]:shrink-0
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
