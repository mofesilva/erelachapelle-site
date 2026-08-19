"use client";

import { useRef, useState, type ReactNode } from "react";
import type { Editor } from "@tiptap/react";
import { Quote } from "lucide-react";
import {
  CodeBold,
  GalleryAddBold,
  LinkBold,
  ListBold,
  ListCheckBold,
  RulerBold,
  TextBoldBold,
  TextCrossBold,
  TextItalicBold,
  TextUnderlineBold,
  VideoFrameBold,
} from "solar-icon-set";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Props = {
  editor: Editor;
  onUploadImage: (file: File) => void;
  onAddYoutube: (url: string) => void;
};

/**
 * Estilo Substack: sem caixa/borda por botão, sem texto ao lado dos ícones — só um leve
 * escurecimento no hover/ativo. Nada de fundo preenchido nem bordas de agrupamento.
 */
function ToolbarButton({
  active,
  onClick,
  children,
  label,
}: {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex size-7 cursor-pointer items-center justify-center rounded text-coffee-bean/60 transition-colors hover:text-carbon-black",
        active && "text-toffee-brown"
      )}
    >
      {children}
    </button>
  );
}

function HeadingButton({ editor, level }: { editor: Editor; level: 2 | 3 }) {
  const active = editor.isActive("heading", { level });
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
      className={cn(
        "flex h-7 w-7 cursor-pointer items-center justify-center rounded text-sm font-semibold text-coffee-bean/60 transition-colors hover:text-carbon-black",
        active && "text-toffee-brown"
      )}
    >
      H{level}
    </button>
  );
}

function LinkPopover({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  function apply() {
    if (url.trim()) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
    setOpen(false);
    setUrl("");
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setUrl(editor.getAttributes("link").href ?? "");
      }}
    >
      <PopoverTrigger asChild>
        <span>
          <ToolbarButton active={editor.isActive("link")} onClick={() => setOpen(true)} label="Lien">
            <LinkBold size={16} />
          </ToolbarButton>
        </span>
      </PopoverTrigger>
      <PopoverContent className="flex w-72 gap-2 border-dust-grey bg-parchment p-2">
        <input
          autoFocus
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
          placeholder="https://…"
          className="h-9 flex-1 border border-dust-grey bg-white px-2 text-sm outline-none focus:border-toffee-brown"
        />
        <button
          type="button"
          onClick={apply}
          className="h-9 cursor-pointer px-3 text-sm font-medium text-toffee-brown hover:text-olive-wood"
        >
          OK
        </button>
      </PopoverContent>
    </Popover>
  );
}

function YoutubePopover({ onAdd }: { onAdd: (url: string) => void }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  function apply() {
    if (url.trim()) onAdd(url.trim());
    setOpen(false);
    setUrl("");
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span>
          <ToolbarButton onClick={() => setOpen(true)} label="YouTube">
            <VideoFrameBold size={16} />
          </ToolbarButton>
        </span>
      </PopoverTrigger>
      <PopoverContent className="flex w-80 gap-2 border-dust-grey bg-parchment p-2">
        <input
          autoFocus
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
          placeholder="https://www.youtube.com/watch?v=…"
          className="h-9 flex-1 border border-dust-grey bg-white px-2 text-sm outline-none focus:border-toffee-brown"
        />
        <button
          type="button"
          onClick={apply}
          className="h-9 cursor-pointer px-3 text-sm font-medium text-toffee-brown hover:text-olive-wood"
        >
          OK
        </button>
      </PopoverContent>
    </Popover>
  );
}

export function EditorToolbar({ editor, onUploadImage, onAddYoutube }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-0.5 py-2">
      <ToolbarButton
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        label="Gras"
      >
        <TextBoldBold size={16} />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        label="Italique"
      >
        <TextItalicBold size={16} />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        label="Souligné"
      >
        <TextUnderlineBold size={16} />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        label="Barré"
      >
        <TextCrossBold size={16} />
      </ToolbarButton>
      <LinkPopover editor={editor} />

      <HeadingButton editor={editor} level={2} />
      <HeadingButton editor={editor} level={3} />

      <ToolbarButton
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        label="Citation"
      >
        <Quote size={16} />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        label="Liste à puces"
      >
        <ListBold size={16} />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        label="Liste numérotée"
      >
        <ListCheckBold size={16} />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        label="Bloc de code"
      >
        <CodeBold size={16} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} label="Ligne horizontale">
        <RulerBold size={16} />
      </ToolbarButton>

      <ToolbarButton onClick={() => fileInputRef.current?.click()} label="Image">
        <GalleryAddBold size={16} />
      </ToolbarButton>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUploadImage(file);
          e.target.value = "";
        }}
      />
      <YoutubePopover onAdd={onAddYoutube} />
    </div>
  );
}
