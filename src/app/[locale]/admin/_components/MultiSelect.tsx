"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { AddCircleLinear } from "solar-icon-set";

export type MultiSelectOption = {
  id: string;
  label: string;
};

type Props = {
  options: MultiSelectOption[];
  value: string[];
  onChange: (ids: string[]) => void;
  placeholder: string;
  searchPlaceholder: string;
  emptyLabel: string;
  /**
   * Opcional: quando a busca não encontra nenhuma opção, mostra um item "Criar “X”" que
   * chama isso com o texto digitado e seleciona a opção criada. Usado hoje só em Temas,
   * no editor de posts (criação inline estilo Notion) — omitido, o combobox se comporta
   * exatamente como antes.
   */
  onCreate?: (label: string) => Promise<MultiSelectOption>;
  createLabel?: (query: string) => string;
};

/**
 * Não existia combobox multi-select no projeto — essa é a composição mínima reaproveitando
 * só peças shadcn já presentes (Popover + Command + Checkbox). Selecionados aparecem como
 * badges no próprio trigger; o popover fica aberto entre seleções, pra marcar vários seguido.
 */
export function MultiSelect({
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  emptyLabel,
  onCreate,
  createLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const selected = options.filter((option) => value.includes(option.id));

  const query = search.trim();
  const hasExactMatch = options.some((option) => option.label.toLowerCase() === query.toLowerCase());
  const showCreate = Boolean(onCreate) && query.length > 0 && !hasExactMatch;

  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  }

  async function handleCreate() {
    if (!onCreate || !query || creating) return;
    setCreating(true);
    try {
      const created = await onCreate(query);
      onChange([...value, created.id]);
      setSearch("");
    } finally {
      setCreating(false);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-auto min-h-11 w-full justify-start border-dust-grey bg-white px-3 py-2 font-normal hover:bg-white",
            selected.length === 0 && "text-coffee-bean/50"
          )}
        >
          {selected.length === 0 ? (
            placeholder
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {selected.map((option) => (
                <Badge
                  key={option.id}
                  variant="secondary"
                  className="bg-toffee-brown/12 text-carbon-black"
                >
                  {option.label}
                </Badge>
              ))}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] border-dust-grey bg-parchment p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} value={search} onValueChange={setSearch} />
          <CommandList>
            {!showCreate && <CommandEmpty>{emptyLabel}</CommandEmpty>}
            {showCreate && (
              <CommandGroup>
                <CommandItem
                  value={`__create__${query}`}
                  onSelect={handleCreate}
                  className="gap-2 data-[selected=true]:bg-transparent data-[selected=true]:text-carbon-black"
                >
                  <AddCircleLinear size={16} />
                  {creating ? "…" : (createLabel?.(query) ?? query)}
                </CommandItem>
              </CommandGroup>
            )}
            <CommandGroup>
              {options.map((option) => {
                const checked = value.includes(option.id);
                return (
                  <CommandItem
                    key={option.id}
                    value={option.label}
                    onSelect={() => toggle(option.id)}
                    className="gap-2 data-[selected=true]:bg-transparent data-[selected=true]:text-carbon-black"
                  >
                    <Checkbox
                      checked={checked}
                      className="pointer-events-none data-[state=checked]:text-white"
                    />
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
