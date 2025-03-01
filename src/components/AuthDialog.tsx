import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = "login" | "register" | "reset-password";

export function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mode, setMode] = useState<AuthMode>("login");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { direction } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              full_name: `${firstName} ${lastName}`,
            },
          },
        });
        if (error) throw error;
        toast({
          title: t("registrationSuccess"),
          description: t("checkEmail"),
        });
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: t("loginSuccess"),
          description: t("welcomeBack"),
        });
        navigate("/api-tokens");
      } else if (mode === "reset-password") {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        toast({
          title: t("resetPasswordSuccess"),
          description: t("resetPasswordDesc"),
        });
        setMode("login");
      }
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title:
          mode === "reset-password" ? t("resetPasswordError") : t("authError"),
        description: t("invalidCredentials"),
        className:
          "bg-white text-destructive font-bold border-2 border-destructive shadow-lg",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "register":
        return t("createAccount");
      case "reset-password":
        return t("resetPassword");
      default:
        return t("loginTitle");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" dir={direction}>
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <div>
                <Input
                  type="text"
                  placeholder={t("firstName")}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required={mode === "register"}
                />
              </div>
              <div>
                <Input
                  type="text"
                  placeholder={t("lastName")}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required={mode === "register"}
                />
              </div>
            </>
          )}
          <div>
            <Input
              type="email"
              placeholder={t("email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {mode !== "reset-password" && (
            <div>
              <Input
                type="password"
                placeholder={t("password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={mode !== "reset-password"}
              />
            </div>
          )}
          <div className="flex flex-col space-y-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? t("processing")
                : mode === "register"
                ? t("register")
                : mode === "reset-password"
                ? t("resetPassword")
                : t("login")}
            </Button>
            {mode === "login" && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setMode("register")}
                >
                  {t("noAccount")}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setMode("reset-password")}
                >
                  {t("forgotPassword")}
                </Button>
              </>
            )}
            {(mode === "register" || mode === "reset-password") && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setMode("login")}
              >
                {t("backToLogin")}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
