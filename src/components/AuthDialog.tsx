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

export function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { direction } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegister) {
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
      } else {
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
      }
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("authError"),
        description: t("invalidCredentials"),
        className:
          "bg-white text-destructive font-bold border-2 border-destructive shadow-lg",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" dir={direction}>
        <DialogHeader>
          <DialogTitle>
            {isRegister ? t("createAccount") : t("loginTitle")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <Input
                  type="text"
                  placeholder={t("firstName")}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required={isRegister}
                />
              </div>
              <div>
                <Input
                  type="text"
                  placeholder={t("lastName")}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required={isRegister}
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
          <div>
            <Input
              type="password"
              placeholder={t("password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? t("processing")
                : isRegister
                ? t("register")
                : t("login")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? t("haveAccount") : t("noAccount")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
