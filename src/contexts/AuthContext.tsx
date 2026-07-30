import { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import { type User, userService } from "@/services/user.service";
import { api } from "@/services/api";

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: Record<string, unknown>) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("@Template:token");
      if (token) {
        try {
          // Na vida real, a api usaria o token. Aqui simulamos o fetch de profile
          const profile = await userService.getProfile();
          setUser(profile);
        } catch {
          localStorage.removeItem("@Template:token");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: Record<string, unknown>) => {
    const response = await api.post("/auth/login", credentials);
    const { token, user: loggedUser } = response.data;

    localStorage.setItem("@Template:token", token);
    setUser(loggedUser);
  };

  const logout = () => {
    localStorage.removeItem("@Template:token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
