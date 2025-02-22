import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { supabase } from "@/lib/supabase";

interface User {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  apiToken?: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const userData = session.user.user_metadata;
        setUser({
          firstName: userData?.first_name || "",
          lastName: userData?.last_name || "",
          name: userData?.full_name || session.user.email || "משתמש אנונימי",
          email: session.user.email || "",
          apiToken: session.access_token,
        });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userData = session.user.user_metadata;
        setUser({
          firstName: userData?.first_name || "",
          lastName: userData?.last_name || "",
          name: userData?.full_name || session.user.email || "משתמש אנונימי",
          email: session.user.email || "",
          apiToken: session.access_token,
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
