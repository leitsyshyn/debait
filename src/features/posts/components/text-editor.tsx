"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

interface TextEditorProps {
  content: string;
  onChange: (richText: string) => void;
}

const TextEditor = forwardRef(({ content, onChange }: TextEditorProps, ref) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Start typing..." }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getText({ blockSeparator: "\n" }));
    },
    editorProps: {
      attributes: {
        class:
          "max-h-48 min-h-9 overflow-y-auto  rounded-md border border-input bg-transparent px-3 py-1 pt-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      },
    },
    immediatelyRender: false,
  });

  useImperativeHandle(ref, () => ({
    clearContent: () => {
      if (editor) editor.commands.clearContent();
    },
  }));

  return <EditorContent editor={editor} />;
});

TextEditor.displayName = "TextEditor";
export default TextEditor;
