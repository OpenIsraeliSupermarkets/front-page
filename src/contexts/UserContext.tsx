import { createContext, useContext, ReactNode } from "react";

interface User {
  name: string;
  email: string;
  apiToken?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
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
  // בשלב זה נשתמש בנתונים קבועים לדוגמה
  const user = {
    name: "John Doe",
    email: "john@example.com",
    apiToken: "abc123",
  };

  return (
    <UserContext.Provider value={{ user, setUser: () => {} }}>
      {children}
    </UserContext.Provider>
  );
};
