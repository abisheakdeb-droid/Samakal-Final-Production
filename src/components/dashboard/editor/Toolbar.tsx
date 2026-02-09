"use client";

import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Quote,
  List,
  ListOrdered,
  Image as ImageIcon,
  Undo,
  Redo,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Youtube as YoutubeIcon,
  Table as TableIcon,
  Highlighter,
  Minus,
  Columns,
  Rows,
  Trash2,
  Combine,
  Split,
} from "lucide-react";
import { AIToolbar } from "./AIToolbar";
import { type Editor } from "@tiptap/react";
import { clsx } from "clsx";
import { useCallback, useEffect, useState } from "react";

interface ToolbarProps {
  editor: Editor | null;
}

interface ToggleButtonProps {
  isActive?: boolean;
  onClick: (e: React.MouseEvent) => void;
  icon: React.ElementType;
  title?: string;
  className?: string;
}

const ToggleButton = ({
  isActive,
  onClick,
  icon: Icon,
  title,
  className,
}: ToggleButtonProps) => (
  <button
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    title={title}
    className={clsx(
      "p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-700 flex items-center justify-center min-w-[30px]",
      isActive && "bg-blue-100 text-blue-700 hover:bg-blue-200",
      className,
    )}
  >
    <Icon size={18} strokeWidth={2} />
  </button>
);

const Divider = () => <div className="w-px h-6 bg-gray-300 mx-1 self-center" />;

export function Toolbar({ editor }: ToolbarProps) {
  // Force re-render on editor transaction to update button states
  const [, forceUpdate] = useState({});

  useEffect(() => {
    if (!editor) return;

    const handleTransaction = () => {
      forceUpdate({});
    };

    editor.on("transaction", handleTransaction);

    return () => {
      editor.off("transaction", handleTransaction);
    };
  }, [editor]);

  const addYoutube = useCallback(() => {
    if (!editor) return;
    const url = prompt("Enter YouTube URL");
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-gray-300 bg-[#edf2fa] p-2 sticky top-0 z-30 flex flex-wrap items-center shadow-sm select-none">
      {/* AI Assistant - Featured at the start */}
      <div className="mr-2">
        <AIToolbar editor={editor} />
      </div>

      <Divider />

      {/* History */}
      <div className="flex items-center gap-1 mr-1">
        <ToggleButton
          onClick={() => editor.chain().focus().undo().run()}
          icon={Undo}
          title="Undo (Cmd+Z)"
        />
        <ToggleButton
          onClick={() => editor.chain().focus().redo().run()}
          icon={Redo}
          title="Redo (Cmd+Shift+Z)"
        />
      </div>

      <Divider />

      {/* Typography */}
      <div className="flex items-center gap-1 mx-1">
        <ToggleButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          icon={Heading1}
          title="Heading 1"
        />
        <ToggleButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          icon={Heading2}
          title="Heading 2"
        />
        <ToggleButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          isActive={editor.isActive("paragraph")}
          icon={Minus}
          title="Normal Text"
        />
      </div>

      <Divider />

      {/* Formatting */}
      <div className="flex items-center gap-1 mx-1">
        <ToggleButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          icon={Bold}
          title="Bold (Cmd+B)"
        />
        <ToggleButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          icon={Italic}
          title="Italic (Cmd+I)"
        />
        <ToggleButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          icon={Underline}
          title="Underline (Cmd+U)"
        />
        <ToggleButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive("highlight")}
          icon={Highlighter}
          title="Highlight"
        />
      </div>

      <Divider />

      {/* Alignment */}
      <div className="flex items-center gap-1 mx-1">
        <ToggleButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          icon={AlignLeft}
          title="Align Left"
        />
        <ToggleButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          icon={AlignCenter}
          title="Align Center"
        />
        <ToggleButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          icon={AlignRight}
          title="Align Right"
        />
        <ToggleButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          isActive={editor.isActive({ textAlign: "justify" })}
          icon={AlignJustify}
          title="Justify"
        />
      </div>

      <Divider />

      {/* Lists & Quotes */}
      <div className="flex items-center gap-1 mx-1">
        <ToggleButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          icon={List}
          title="Bullet List"
        />
        <ToggleButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          icon={ListOrdered}
          title="Numbered List"
        />
        <ToggleButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          icon={Quote}
          title="Quote"
        />
      </div>

      {/* Table Controls (Contextual) */}
      {editor.isActive("table") && (
        <>
          <Divider />
          <div className="flex items-center gap-1 mx-1 bg-blue-50 p-1 rounded animate-in fade-in slide-in-from-top-2 duration-200">
            <ToggleButton
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              icon={Columns}
              title="Add Column Left"
              className="text-blue-700"
            />
            <ToggleButton
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              icon={Columns}
              title="Add Column Right"
              className="text-blue-700"
            />
            <ToggleButton
              onClick={() => editor.chain().focus().deleteColumn().run()}
              icon={Trash2}
              title="Delete Column"
              className="text-red-600 hover:bg-red-100"
            />

            <div className="w-px h-4 bg-blue-200 mx-1"></div>

            <ToggleButton
              onClick={() => editor.chain().focus().addRowBefore().run()}
              icon={Rows}
              title="Add Row Above"
              className="text-blue-700"
            />
            <ToggleButton
              onClick={() => editor.chain().focus().addRowAfter().run()}
              icon={Rows}
              title="Add Row Below"
              className="text-blue-700"
            />
            <ToggleButton
              onClick={() => editor.chain().focus().deleteRow().run()}
              icon={Trash2}
              title="Delete Row"
              className="text-red-600 hover:bg-red-100"
            />

            <div className="w-px h-4 bg-blue-200 mx-1"></div>

            <ToggleButton
              onClick={() => editor.chain().focus().mergeCells().run()}
              icon={Combine}
              title="Merge Cells"
              className="text-blue-700"
            />
            <ToggleButton
              onClick={() => editor.chain().focus().splitCell().run()}
              icon={Split}
              title="Split Cell"
              className="text-blue-700"
            />
          </div>
        </>
      )}

      <Divider />

      {/* Insert */}
      <div className="flex items-center gap-1 mx-1">
        <ToggleButton
          onClick={setLink}
          isActive={editor.isActive("link")}
          icon={LinkIcon}
          title="Insert Link"
        />

        <ToggleButton
          onClick={() => {
            const url = window.prompt(
              "Image URL (e.g. https://placehold.co/600x400)",
            );
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
          icon={ImageIcon}
          title="Insert Image"
        />

        <ToggleButton
          onClick={addYoutube}
          isActive={editor.isActive("youtube")}
          icon={YoutubeIcon}
          title="Insert YouTube Video"
        />

        <ToggleButton
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          icon={TableIcon}
          title="Insert Table (3x3)"
        />
      </div>
    </div>
  );
}
