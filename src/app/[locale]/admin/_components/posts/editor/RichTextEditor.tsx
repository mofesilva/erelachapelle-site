"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Youtube from "@tiptap/extension-youtube";
import { useEffect } from "react";
import { EditorBubbleMenu } from "./EditorBubbleMenu";

type UseRichTextEditorProps = {
  content: string;
  onChange: (html: string) => void;
  placeholder: string;
  onUploadImage: (file: File) => Promise<string>;
};

/**
 * Dona da instância Tiptap. Fica separada do componente visual porque a toolbar precisa
 * ficar fixa no topo da página (acima de título/subtítulo), fora de onde o corpo do texto
 * é renderizado — quem chama (`PostEditor`) usa `editor` tanto pra `EditorToolbar` quanto
 * pra `RichTextEditor` (só o corpo).
 */
export function useRichTextEditor({ content, onChange, placeholder, onUploadImage }: UseRichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      Placeholder.configure({ placeholder }),
      CharacterCount,
      Youtube.configure({ nocookie: true, width: 640, height: 360 }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral max-w-none focus:outline-none min-h-[160px] font-serif text-carbon-black [&_p]:my-3 [&_h2]:font-serif [&_h3]:font-serif",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Troca de post (navegação entre /admin/posts/[id]) reusa a mesma instância — sem isso o
  // editor continuaria mostrando o conteúdo do post anterior.
  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() === content) return;
    editor.commands.setContent(content, { emitUpdate: false });
  }, [editor, content]);

  async function handleImageUpload(file: File) {
    const url = await onUploadImage(file);
    editor?.chain().focus().setImage({ src: url }).run();
  }

  function handleAddYoutube(url: string) {
    editor?.commands.setYoutubeVideo({ src: url });
  }

  return { editor, handleImageUpload, handleAddYoutube };
}

type Props = {
  editor: Editor;
};

/** Só o corpo do texto + bubble menu — a toolbar fica fora, fixa no topo da página. */
export function RichTextEditor({ editor }: Props) {
  return (
    <>
      <EditorBubbleMenu editor={editor} />
      <EditorContent editor={editor} className="mt-2" />
    </>
  );
}
