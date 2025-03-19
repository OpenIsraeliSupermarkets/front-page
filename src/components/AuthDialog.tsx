import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
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
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle } from "lucide-react";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = "login" | "register" | "reset-password" | "verify-reset";

// Define validation schemas for each form mode
const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
});

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

const verifyResetSchema = z.object({
  otp: z
    .string()
    .min(6, { message: "Verification code must be at least 6 characters" }),
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
});

// Rate limiting implementation
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

// Store login attempts in localStorage
const getLoginAttempts = (email: string) => {
  const attemptsJson = localStorage.getItem(`loginAttempts_${email}`);
  if (!attemptsJson) return { count: 0, timestamp: 0 };
  return JSON.parse(attemptsJson);
};

const incrementLoginAttempts = (email: string) => {
  const attempts = getLoginAttempts(email);
  const newAttempts = {
    count: attempts.count + 1,
    timestamp: Date.now(),
  };
  localStorage.setItem(`loginAttempts_${email}`, JSON.stringify(newAttempts));
  return newAttempts;
};

const resetLoginAttempts = (email: string) => {
  localStorage.removeItem(`loginAttempts_${email}`);
};

interface AuthError {
  message: string;
}

interface FormValues {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  otp?: string;
  newPassword?: string;
}

export function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [error, setError] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const attemptTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [remainingLockTime, setRemainingLockTime] = useState(0);

  useEffect(() => {
    // Clear any existing errors when changing modes
    setError(null);

    // Clear interval if component unmounts
    return () => {
      if (attemptTimerRef.current) {
        clearInterval(attemptTimerRef.current);
      }
    };
  }, [mode]);

  // Get the appropriate schema based on the current mode
  const getSchema = () => {
    switch (mode) {
      case "register":
        return registerSchema;
      case "login":
        return loginSchema;
      case "reset-password":
        return resetPasswordSchema;
      case "verify-reset":
        return verifyResetSchema;
    }
  };

  // Configure the form with the appropriate schema
  const form = useForm<
    | z.infer<typeof registerSchema>
    | z.infer<typeof loginSchema>
    | z.infer<typeof resetPasswordSchema>
    | z.infer<typeof verifyResetSchema>
  >({
    resolver: zodResolver(getSchema()),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      otp: "",
      newPassword: "",
    },
  });

  // Reset the form when the mode changes
  const changeMode = (newMode: AuthMode) => {
    setMode(newMode);
    form.reset();
  };

  const checkRateLimit = (email: string): boolean => {
    const attempts = getLoginAttempts(email);
    const now = Date.now();

    // Reset attempts if lockout period has passed
    if (
      attempts.count >= MAX_ATTEMPTS &&
      now - attempts.timestamp > LOCKOUT_TIME
    ) {
      resetLoginAttempts(email);
      return true;
    }

    // Check if account is locked
    if (attempts.count >= MAX_ATTEMPTS) {
      const remainingTime = LOCKOUT_TIME - (now - attempts.timestamp);
      setRemainingLockTime(Math.ceil(remainingTime / 1000));

      // Start countdown timer
      if (attemptTimerRef.current) {
        clearInterval(attemptTimerRef.current);
      }

      attemptTimerRef.current = setInterval(() => {
        setRemainingLockTime((prev) => {
          if (prev <= 1) {
            clearInterval(attemptTimerRef.current as NodeJS.Timeout);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return false;
    }

    return true;
  };

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      if (mode === "register") {
        // Registration flow
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              first_name: values.firstName,
              last_name: values.lastName,
              full_name: `${values.firstName} ${values.lastName}`,
            },
          },
        });

        if (error) throw error;

        toast({
          title: t("registrationSuccess"),
          description: t("checkEmail"),
        });
      } else if (mode === "login") {
        // Login flow with rate limiting
        const email = values.email;

        // Check rate limiting
        if (!checkRateLimit(email)) {
          const minutes = Math.floor(remainingLockTime / 60);
          const seconds = remainingLockTime % 60;
          throw new Error(
            `Too many failed attempts. Try again in ${minutes}m ${seconds}s.`
          );
        }

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: values.password,
        });

        if (error) {
          // Increment attempt counter on failure
          incrementLoginAttempts(email);
          throw error;
        }

        // Reset attempts on successful login
        resetLoginAttempts(email);

        toast({
          title: t("loginSuccess"),
          description: t("welcomeBack"),
        });
        navigate("/api-tokens");
      } else if (mode === "reset-password") {
        // Save email for verification step
        setResetEmail(values.email);

        const { error } = await supabase.auth.resetPasswordForEmail(
          values.email,
          {
            redirectTo: window.location.origin + "/reset-password",
          }
        );

        if (error) throw error;

        toast({
          title: t("resetPasswordSuccess"),
          description: t("resetPasswordDesc"),
        });

        // Move to verification step
        changeMode("verify-reset");
      } else if (mode === "verify-reset") {
        // Validate OTP and set new password
        const { error } = await supabase.auth.verifyOtp({
          email: resetEmail,
          token: values.otp,
          type: "recovery",
        });

        if (error) throw error;

        // Set new password
        const { error: updateError } = await supabase.auth.updateUser({
          password: values.newPassword,
        });

        if (updateError) throw updateError;

        toast({
          title: t("passwordUpdated"),
          description: t("passwordUpdateSuccess"),
        });

        changeMode("login");
      }

      if (mode !== "verify-reset") {
        onClose();
      }
    } catch (error: unknown) {
      // More specific error handling
      let errorMessage = t("invalidCredentials");

      if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        if (error.message.includes("Email not confirmed")) {
          errorMessage = t("emailNotConfirmed");
        } else if (error.message.includes("Invalid login credentials")) {
          errorMessage = t("invalidLoginCredentials");
        } else if (error.message.includes("Too many failed attempts")) {
          errorMessage = error.message;
        } else if (error.message.includes("Rate limit")) {
          errorMessage = t("tooManyRequests");
        } else {
          errorMessage = error.message;
        }
      }

      setError(errorMessage);

      toast({
        variant: "destructive",
        title:
          mode === "reset-password" ? t("resetPasswordError") : t("authError"),
        description: errorMessage,
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
      case "verify-reset":
        return t("verifyResetPassword");
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

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {remainingLockTime > 0 && mode === "login" && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t("accountLocked")} {Math.floor(remainingLockTime / 60)}m{" "}
              {remainingLockTime % 60}s
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {mode === "register" && (
              <>
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("firstName")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("lastName")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {mode === "verify-reset" ? (
              <>
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("verificationCode")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={t("newPassword")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <>
                {mode !== "verify-reset" && (
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={t("email")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {(mode === "login" || mode === "register") && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder={t("password")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </>
            )}

            <div className="flex flex-col space-y-2">
              <Button
                type="submit"
                disabled={isLoading || remainingLockTime > 0}
              >
                {isLoading
                  ? t("processing")
                  : mode === "register"
                  ? t("register")
                  : mode === "login"
                  ? t("login")
                  : mode === "verify-reset"
                  ? t("verify")
                  : t("resetPassword")}
              </Button>

              {mode === "login" && (
                <>
                  <Button
                    type="button"
                    variant="link"
                    className="self-end px-0"
                    onClick={() => changeMode("reset-password")}
                  >
                    {t("forgotPassword")}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => changeMode("register")}
                  >
                    {t("noAccount")}
                  </Button>
                </>
              )}

              {mode === "register" && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => changeMode("login")}
                >
                  {t("haveAccount")}
                </Button>
              )}

              {mode === "reset-password" && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => changeMode("login")}
                >
                  {t("backToLogin")}
                </Button>
              )}

              {mode === "verify-reset" && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => changeMode("reset-password")}
                >
                  {t("resendCode")}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
