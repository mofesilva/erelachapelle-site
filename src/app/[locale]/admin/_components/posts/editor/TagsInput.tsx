"use client";

import { useState, type KeyboardEvent } from "react";
import { CloseCircleBold } from "solar-icon-set";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type Props = {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
};

/** Chips de texto livre: Enter ou vírgula adiciona, backspace no campo vazio remove o último. */
export function TagsInput({ value, onChange, placeholder }: Props) {
  const [draft, setDraft] = useState("");

  function commit() {
    const tag = draft.trim();
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setDraft("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commit();
    } else if (event.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div className="flex min-h-11 flex-wrap items-center gap-1.5 border border-dust-grey bg-white px-3 py-2">
      {value.map((tag) => (
        <Badge key={tag} variant="secondary" className="gap-1 bg-toffee-brown/12 text-carbon-black">
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((t) => t !== tag))}
            aria-label={tag}
            className="text-coffee-bean/60 hover:text-destructive"
          >
            <CloseCircleBold size={13} />
          </button>
        </Badge>
      ))}
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        placeholder={value.length === 0 ? placeholder : ""}
        className="h-6 flex-1 border-0 p-0 shadow-none focus-visible:ring-0"
      />
    </div>
  );
}
