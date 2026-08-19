"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRoundedBold } from "solar-icon-set";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ApiError } from "@/lib/admin-api";
import { FormSheet } from "../FormSheet";
import { userFormSchema, type UserFormValues } from "../../_features/users/user.schema";
import { ROLES, type User } from "../../_features/users/user.type";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: UserFormValues) => Promise<void>;
  /** Preenchida = modo edição; nula = criação. */
  user: User | null;
};

export function UserFormSheet({ open, onOpenChange, onSubmit, user }: Props) {
  const t = useTranslations("admin.users");
  const [formError, setFormError] = useState<string | null>(null);
  const editing = user !== null;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: { name: "", email: "", role: "editor", password: "" },
  });

  // O sheet não desmonta entre aberturas, então o formulário precisa ser recarregado
  // sempre que muda o alvo (novo usuário vs. edição de outro). A senha nunca é
  // pré-preenchida — só existe hash no servidor, não dá pra mostrar a atual.
  useEffect(() => {
    if (open) {
      form.reset({
        name: user?.name ?? "",
        email: user?.email ?? "",
        role: user?.role ?? "editor",
        password: "",
      });
      setFormError(null);
    }
  }, [open, user, form]);

  async function handleSubmit(values: UserFormValues) {
    setFormError(null);

    // A senha é obrigatória só na criação — o schema estático não sabe distinguir os
    // dois modos, então a checagem entra aqui antes de chamar onSubmit.
    if (!editing && !values.password) {
      form.setError("password", { message: t("passwordRequired") });
      return;
    }

    try {
      await onSubmit(values);
      form.reset();
      onOpenChange(false);
    } catch (err) {
      // As mensagens da API vêm em português e o usuário é francófono — traduzimos por status.
      if (err instanceof ApiError && err.status === 409) {
        setFormError(t("errorDuplicate"));
      } else if (err instanceof ApiError && err.status === 403) {
        setFormError(t("errorForbidden"));
      } else {
        setFormError(t("errorGeneric"));
      }
    }
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      form.reset();
      setFormError(null);
    }
    onOpenChange(next);
  }

  return (
    <Form {...form}>
      <FormSheet
        open={open}
        onOpenChange={handleOpenChange}
        icon={UserRoundedBold}
        title={editing ? t("editTitle") : t("createTitle")}
        description={editing ? t("editDescription") : t("createDescription")}
        onSubmit={form.handleSubmit(handleSubmit)}
        submitting={form.formState.isSubmitting}
        error={formError}
        saveLabel={t("save")}
        savingLabel={t("saving")}
        cancelLabel={t("cancel")}
      >
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-coffee-bean uppercase">
                  {t("nameLabel")}
                </FormLabel>
                <FormControl>
                  <Input
                    autoFocus
                    placeholder={t("namePlaceholder")}
                    className="h-11 border-dust-grey bg-white focus-visible:border-toffee-brown focus-visible:ring-toffee-brown/25"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-coffee-bean uppercase">
                  {t("emailLabel")}
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    className="h-11 border-dust-grey bg-white focus-visible:border-toffee-brown focus-visible:ring-toffee-brown/25"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-coffee-bean uppercase">
                  {t("roleLabel")}
                </FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="h-11 w-full border-dust-grey bg-white">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {t(role === "admin" ? "roleAdmin" : "roleEditor")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-coffee-bean uppercase">
                  {t("passwordLabel")}
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("passwordPlaceholder")}
                    className="h-11 border-dust-grey bg-white focus-visible:border-toffee-brown focus-visible:ring-toffee-brown/25"
                    {...field}
                  />
                </FormControl>
                {editing && (
                  <FormDescription className="text-xs text-coffee-bean/60">
                    {t("passwordHintEdit")}
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </FormSheet>
    </Form>
  );
}
