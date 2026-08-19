"use client";

import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  HashtagSquareBold,
  LinkBold,
  TextBoldBold,
  TextItalicBold,
  TextUnderlineBold,
} from "solar-icon-set";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  editor: Editor;
};

/** Aparece na seleção de texto, estilo Medium: só as ações mais comuns em linha. */
export function EditorBubbleMenu({ editor }: Props) {
  return (
    <BubbleMenu editor={editor} className="flex gap-0.5 border border-dust-grey bg-carbon-black p-1 shadow-lg">
      {[
        { active: editor.isActive("bold"), icon: TextBoldBold, run: () => editor.chain().focus().toggleBold().run() },
        {
          active: editor.isActive("italic"),
          icon: TextItalicBold,
          run: () => editor.chain().focus().toggleItalic().run(),
        },
        {
          active: editor.isActive("underline"),
          icon: TextUnderlineBold,
          run: () => editor.chain().focus().toggleUnderline().run(),
        },
        {
          active: editor.isActive("heading", { level: 2 }),
          icon: HashtagSquareBold,
          run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        },
        {
          active: editor.isActive("link"),
          icon: LinkBold,
          run: () => {
            const href = editor.getAttributes("link").href;
            if (href) editor.chain().focus().unsetLink().run();
            else {
              const url = window.prompt("URL");
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }
          },
        },
      ].map(({ active, icon: Icon, run }, i) => (
        <Button
          key={i}
          type="button"
          variant="ghost"
          size="icon"
          onClick={run}
          className={cn(
            "size-8 text-parchment hover:bg-white/10 hover:text-parchment",
            active && "bg-white/15 text-toffee-brown"
          )}
        >
          <Icon size={16} />
        </Button>
      ))}
    </BubbleMenu>
  );
}
