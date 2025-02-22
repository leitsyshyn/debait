"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

const TextEditor = ({
  content,
  onChange,
}: {
  onChange: (richText: string) => void;
  content: string;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Start typing..." }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getText({ blockSeparator: "\n" }));
      console.log(editor.getHTML());
    },

    editorProps: {
      attributes: {
        class:
          " max-h-48 min-h-9 overflow-y-auto  w-full rounded-md border border-input bg-transparent px-3 py-1 pt-2 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      },
    },
    immediatelyRender: false,
  });

  return <EditorContent editor={editor} />;
};

export default TextEditor;
