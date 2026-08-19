import type { FormEvent, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { SolarIcon } from "@/types/common";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icon: SolarIcon;
  title: string;
  description: string;
  /** Normalmente `form.handleSubmit(handler)` — quem chama já é dono do react-hook-form. */
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitting: boolean;
  error: string | null;
  saveLabel: string;
  savingLabel: string;
  cancelLabel: string;
  /** Os campos do formulário. */
  children: ReactNode;
};

/**
 * Chrome padrão de criação/edição do backoffice: ícone + título + descrição, área de campos,
 * banner de erro e rodapé com Cancelar/Salvar. Não sabe nada de react-hook-form — quem chama
 * é dono do form, do schema e do mapeamento de erro; aqui só entra `onSubmit` já resolvido.
 */
export function FormSheet({
  open,
  onOpenChange,
  icon: Icon,
  title,
  description,
  onSubmit,
  submitting,
  error,
  saveLabel,
  savingLabel,
  cancelLabel,
  children,
}: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="gap-0 bg-parchment sm:max-w-md">
        <SheetHeader className="gap-0 border-b border-dust-grey px-6 py-6">
          <span className="mb-3 flex size-11 items-center justify-center bg-toffee-brown/12">
            <Icon size={22} color="var(--toffee-brown)" />
          </span>
          {/* Continua <h2> (Radix exige, por acessibilidade), mas com o tamanho de h6 da
              escala — sem isso herdaria a regra de h2, que é escala de hero do site. */}
          <SheetTitle className="font-serif text-h6 text-carbon-black">{title}</SheetTitle>
          <SheetDescription className="text-coffee-bean/70">{description}</SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 px-6 py-6">
            {children}

            {error && (
              <p
                className="mt-5 border-l-2 border-destructive bg-destructive/5 px-3 py-2 text-sm text-destructive"
                role="alert"
              >
                {error}
              </p>
            )}
          </div>

          <SheetFooter className="flex-row justify-end gap-3 border-t border-dust-grey px-6 py-4">
            <SheetClose asChild>
              <Button type="button" variant="ghost" className="h-11 text-coffee-bean">
                {cancelLabel}
              </Button>
            </SheetClose>
            <Button
              type="submit"
              className="h-11 bg-night-bordeaux-2 px-6 hover:bg-rich-mahogany"
              disabled={submitting}
            >
              {submitting ? savingLabel : saveLabel}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
