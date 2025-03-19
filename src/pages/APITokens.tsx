import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { BackButton } from "@/components/BackButton";
import { useUser } from "@/contexts/UserContext";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

interface APIToken {
  id: string;
  name: string;
  created_at: string;
  last_used_at: string | null;
  is_active: boolean;
}

// Define validation schema for token name
const tokenFormSchema = z.object({
  tokenName: z
    .string()
    .min(3, { message: "Token name must be at least 3 characters" })
    .max(50, { message: "Token name must be at most 50 characters" })
    .regex(/^[a-zA-Z0-9 _-]+$/, {
      message:
        "Token name can only contain letters, numbers, spaces, underscores and hyphens",
    }),
});

type TokenFormValues = z.infer<typeof tokenFormSchema>;

const APITokens = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useUser();
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [tokens, setTokens] = useState<APIToken[]>([]);

  const form = useForm<TokenFormValues>({
    resolver: zodResolver(tokenFormSchema),
    defaultValues: {
      tokenName: "",
    },
  });

  // Load tokens only if user is authenticated
  useEffect(() => {
    const loadTokens = async () => {
      if (!user) return;

      const { data, error } = await supabase.functions.invoke("get-tokens");

      if (error) {
        toast({
          variant: "destructive",
          title: t("errorTitle"),
          description: t("errorLoadTokens"),
        });
        return;
      }

      setTokens(data || []);
    };

    loadTokens();
  }, [user, toast, t]);

  const handleCreateToken = async (values: TokenFormValues) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: t("errorTitle"),
        description: t("errorMustLogin"),
      });
      return;
    }

    const { data, error } = await supabase.functions.invoke("create-token", {
      body: { name: values.tokenName.trim() },
    });

    if (error) {
      toast({
        variant: "destructive",
        title: t("errorTitle"),
        description: t("errorCreateToken"),
      });
      return;
    }

    setGeneratedToken(data.token);
    form.reset();

    // Refresh tokens list
    const { data: updatedTokens } = await supabase.functions.invoke(
      "get-tokens"
    );

    if (updatedTokens) {
      setTokens(updatedTokens);
    }

    toast({
      title: t("tokenCreated"),
      description: t("tokenCreatedDesc"),
    });
  };

  const handleDeactivateToken = async (tokenId: string, tokenName: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: t("errorTitle"),
        description: t("errorMustLogin"),
      });
      return;
    }

    if (tokenName === "Playground") {
      toast({
        variant: "destructive",
        title: t("errorTitle"),
        description: t("cannotDeactivatePlayground"),
      });
      return;
    }

    try {
      const { error } = await supabase.functions.invoke("deactivate-token", {
        body: JSON.stringify({ tokenId }),
      });

      if (error) {
        console.error("Function error:", error);
        toast({
          variant: "destructive",
          title: t("errorTitle"),
          description: t("errorDeactivateToken"),
        });
        return;
      }

      setTokens(
        tokens.map((token) =>
          token.id === tokenId ? { ...token, is_active: false } : token
        )
      );

      toast({
        title: t("tokenDeactivated"),
        description: t("tokenDeactivatedDesc"),
      });
    } catch (e) {
      console.error("API call failed:", e);
      toast({
        variant: "destructive",
        title: t("errorTitle"),
        description: t("networkError"),
      });
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4" dir={direction}>
      <BackButton />
      <div className="pt-16">
        <h1 className="text-3xl font-bold mb-8">{t("apiTokensTitle")}</h1>

        {!user && (
          <div className="p-6 border rounded-lg bg-card mb-6">
            <h2 className="text-xl font-semibold mb-4">{t("authRequired")}</h2>
            <p className="text-muted-foreground mb-4">
              {t("authRequiredDesc")}
            </p>
            <Button onClick={() => navigate("/")}>{t("login")}</Button>
          </div>
        )}

        {user && (
          <div className="space-y-6">
            <div className="p-6 border rounded-lg bg-card">
              <h2 className="text-xl font-semibold mb-4">
                {t("createNewToken")}
              </h2>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleCreateToken)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="tokenName"
                    render={({ field }) => (
                      <FormItem>
                        <label
                          htmlFor="tokenName"
                          className="block text-sm font-medium mb-2"
                        >
                          {t("tokenName")}
                        </label>
                        <FormControl>
                          <Input
                            id="tokenName"
                            placeholder={t("enterTokenName")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">{t("generateToken")}</Button>
                </form>
              </Form>
            </div>

            {generatedToken && (
              <div className="p-6 border rounded-lg bg-card">
                <h2 className="text-xl font-semibold mb-4">
                  {t("yourNewToken")}
                </h2>
                <div className="bg-muted p-4 rounded-md break-all font-mono text-sm">
                  {generatedToken}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {t("copyTokenWarning")}
                </p>
              </div>
            )}

            {tokens.length > 0 && (
              <div className="p-6 border rounded-lg bg-card">
                <h2 className="text-xl font-semibold mb-4">
                  {t("yourTokens")}
                </h2>
                <div className="space-y-4">
                  {tokens.map((token) => (
                    <div
                      key={token.id}
                      className="p-4 border rounded-md flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{token.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {t("created")}{" "}
                          {new Date(token.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t("status")}{" "}
                          {token.is_active ? (
                            <span className="text-green-600">
                              {t("active")}
                            </span>
                          ) : (
                            <span className="text-red-600">
                              {t("inactive")}
                            </span>
                          )}
                        </p>
                      </div>
                      {token.is_active && token.name !== "Playground" && (
                        <Button
                          variant="destructive"
                          onClick={() =>
                            handleDeactivateToken(token.id, token.name)
                          }
                        >
                          {t("deactivate")}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <Button
          variant="outline"
          className="mt-8"
          onClick={() => navigate("/")}
        >
          {t("backToHome")}
        </Button>
      </div>
    </div>
  );
};

export default APITokens;
