"use client";

import { Button } from "@/components/ui/button";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo,
  RemoveFormatting,
  Underline as UnderlineIcon,
  Undo,
  Unlink,
} from "lucide-react";
import React, { useEffect, useState } from "react";

export interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minHeight?: string;
  error?: string;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({
  value,
  onChange,
  placeholder = "Write a detailed job description...",
  disabled = false,
  minHeight = "240px",
  error,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline font-medium cursor-pointer",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const isEmpty = editor.isEmpty;
      onChange(isEmpty ? "" : html);
    },
  });

  // Sync external value updates (e.g. async fetch on Edit Job)
  useEffect(() => {
    if (editor && value !== undefined) {
      if (editor.getHTML() !== value) {
        editor.commands.setContent(value || "");
      }
    }
  }, [editor, value]);

  // Sync disabled state
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter destination URL:", previousUrl);

    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // Auto prepend https:// if missing scheme
    const formattedUrl =
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("mailto:")
        ? url
        : `https://${url}`;

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: formattedUrl })
      .run();
  };

  if (!mounted || !editor) {
    return (
      <div
        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs text-slate-400 animate-pulse flex items-center justify-center"
        style={{ minHeight }}
      >
        Initializing rich text editor...
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border transition-all ${
        error
          ? "border-red-300 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100"
          : "border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100/60"
      } bg-white overflow-hidden`}
    >
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 bg-slate-50/80 p-2">
        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`h-7 w-7 rounded-md p-1 transition flex items-center justify-center ${
            editor.isActive("heading", { level: 1 })
              ? "bg-indigo-600 text-white shadow-xs font-bold"
              : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
          }`}
          title="Heading 1"
          disabled={disabled}
        >
          <Heading1 className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`h-7 w-7 rounded-md p-1 transition flex items-center justify-center ${
            editor.isActive("heading", { level: 2 })
              ? "bg-indigo-600 text-white shadow-xs font-bold"
              : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
          }`}
          title="Heading 2"
          disabled={disabled}
        >
          <Heading2 className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`h-7 w-7 rounded-md p-1 transition flex items-center justify-center ${
            editor.isActive("heading", { level: 3 })
              ? "bg-indigo-600 text-white shadow-xs font-bold"
              : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
          }`}
          title="Heading 3"
          disabled={disabled}
        >
          <Heading3 className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={`h-7 w-7 rounded-md p-1 transition flex items-center justify-center ${
            editor.isActive("heading", { level: 4 })
              ? "bg-indigo-600 text-white shadow-xs font-bold"
              : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
          }`}
          title="Heading 4"
          disabled={disabled}
        >
          <Heading4 className="h-4 w-4" />
        </button>

        <div className="h-4 w-px bg-slate-200 mx-1" />

        {/* Text Marks: Bold, Italic, Underline */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`h-7 w-7 rounded-md p-1 transition flex items-center justify-center ${
            editor.isActive("bold")
              ? "bg-indigo-600 text-white shadow-xs font-bold"
              : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
          }`}
          title="Bold (Ctrl+B)"
          disabled={disabled}
        >
          <Bold className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`h-7 w-7 rounded-md p-1 transition flex items-center justify-center ${
            editor.isActive("italic")
              ? "bg-indigo-600 text-white shadow-xs font-bold"
              : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
          }`}
          title="Italic (Ctrl+I)"
          disabled={disabled}
        >
          <Italic className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`h-7 w-7 rounded-md p-1 transition flex items-center justify-center ${
            editor.isActive("underline")
              ? "bg-indigo-600 text-white shadow-xs font-bold"
              : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
          }`}
          title="Underline (Ctrl+U)"
          disabled={disabled}
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>

        <div className="h-4 w-px bg-slate-200 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`h-7 w-7 rounded-md p-1 transition flex items-center justify-center ${
            editor.isActive("bulletList")
              ? "bg-indigo-600 text-white shadow-xs font-bold"
              : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
          }`}
          title="Bullet List"
          disabled={disabled}
        >
          <List className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`h-7 w-7 rounded-md p-1 transition flex items-center justify-center ${
            editor.isActive("orderedList")
              ? "bg-indigo-600 text-white shadow-xs font-bold"
              : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
          }`}
          title="Numbered List"
          disabled={disabled}
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`h-7 w-7 rounded-md p-1 transition flex items-center justify-center ${
            editor.isActive("blockquote")
              ? "bg-indigo-600 text-white shadow-xs font-bold"
              : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
          }`}
          title="Blockquote"
          disabled={disabled}
        >
          <Quote className="h-4 w-4" />
        </button>

        <div className="h-4 w-px bg-slate-200 mx-1" />

        {/* Text Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`h-7 w-7 rounded-md p-1 transition flex items-center justify-center ${
            editor.isActive({ textAlign: "left" })
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
          }`}
          title="Align Left"
          disabled={disabled}
        >
          <AlignLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`h-7 w-7 rounded-md p-1 transition flex items-center justify-center ${
            editor.isActive({ textAlign: "center" })
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
          }`}
          title="Align Center"
          disabled={disabled}
        >
          <AlignCenter className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`h-7 w-7 rounded-md p-1 transition flex items-center justify-center ${
            editor.isActive({ textAlign: "right" })
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
          }`}
          title="Align Right"
          disabled={disabled}
        >
          <AlignRight className="h-4 w-4" />
        </button>

        <div className="h-4 w-px bg-slate-200 mx-1" />

        {/* Links */}
        <button
          type="button"
          onClick={setLink}
          className={`h-7 w-7 rounded-md p-1 transition flex items-center justify-center ${
            editor.isActive("link")
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
          }`}
          title="Insert Link"
          disabled={disabled}
        >
          <LinkIcon className="h-4 w-4" />
        </button>

        {editor.isActive("link") && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="h-7 w-7 rounded-md p-1 text-red-500 hover:bg-red-50 transition flex items-center justify-center"
            title="Remove Link"
            disabled={disabled}
          >
            <Unlink className="h-4 w-4" />
          </button>
        )}

        <div className="h-4 w-px bg-slate-200 mx-1" />

        {/* Clear formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          className="h-7 w-7 rounded-md p-1 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition flex items-center justify-center"
          title="Clear Formatting"
          disabled={disabled}
        >
          <RemoveFormatting className="h-4 w-4" />
        </button>

        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo() || disabled}
          className="h-7 w-7 rounded-md p-1 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition disabled:opacity-40 flex items-center justify-center"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo() || disabled}
          className="h-7 w-7 rounded-md p-1 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition disabled:opacity-40 flex items-center justify-center"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent
        editor={editor}
        className="tiptap-content p-4 text-xs font-normal text-slate-800 leading-relaxed min-h-[220px] max-h-[500px] overflow-y-auto focus:outline-none"
        style={{ minHeight }}
      />
    </div>
  );
};

export default TiptapEditor;

