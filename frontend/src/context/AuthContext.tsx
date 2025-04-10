import { createContext, useContext, useState, useEffect } from "react";

interface User {
  username: string;
}

const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  login: (credentials: string) => void;
  logout: () => void;
} | null>(null);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Not authenticated");

        const data = await res.json();
        console.log(data);
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: string) => {
    // Implementation of login logic
    console.log(credentials);
  };

  const logout = () => {
    // Implementation of logout logic
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
