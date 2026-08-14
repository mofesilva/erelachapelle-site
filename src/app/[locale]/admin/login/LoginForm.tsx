"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { login, ApiError } from "@/lib/admin-api";
import { useAdminAuth } from "../_lib/auth-context";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const t = useTranslations("admin.login");
  const locale = useLocale();
  const router = useRouter();
  const { setSession } = useAdminAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    setFormError(null);
    try {
      const session = await login(values.email, values.password);
      setSession(session);
      router.push(`/${locale}/admin`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setFormError(t("errorInvalidCredentials"));
      } else {
        setFormError(t("errorGeneric"));
      }
    }
  }

  return (
    <div className="flex w-full max-w-md max-h-2xl h-full flex-col items-center">
      <Card className="w-full border-none bg-parchment p-8 shadow-2xl">
        <CardHeader className="items-center gap-1 px-0 text-center">
          <CardTitle className="font-serif text-2xl text-carbon-black">{t("title")}</CardTitle>
          <CardDescription className="text-coffee-bean">{t("subtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="px-0 pt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("emailLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        className="h-11 border-dust-grey bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("passwordLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="current-password"
                        className="h-11 border-dust-grey bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {formError && (
                <p className="text-sm text-destructive" role="alert">
                  {formError}
                </p>
              )}

              <Button
                type="submit"
                className="h-11 w-full bg-night-bordeaux-2 hover:bg-rich-mahogany"
                size="lg"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? t("submitting") : t("submit")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
