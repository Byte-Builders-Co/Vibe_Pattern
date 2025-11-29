import { router } from "expo-router";
import React, {
  createContext,
  ReactNode,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import { sendRequest } from "../lib/api";
import {
  getStoreValue,
  removeStoreValue,
  setStoreValue,
} from "../utils/storage";

interface UserRoleType {
  superadmin: boolean;
  admin: boolean;
  user: boolean;
}

export interface User {
  id: string | number;
  email: string;
  role_id: number; // 1 = superadmin, 2 = admin, 3 = user
  name: string;
  created_at: string;
  updated_at: string;
  email_verified_at: string;
  access_token?: string;
}

interface UserContextProps {
  user: User | null;
  userRole: UserRoleType;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => Promise<void>;
  clearUserData: () => Promise<void>;
  reloadUser: () => Promise<void>;
  logout: () => Promise<void>;
}

// Create context
const UserContext = createContext<UserContextProps | undefined>(undefined);

// Helper to determine role
const getUserRole = (role_id?: number): UserRoleType => {
  if (role_id === 1) return { superadmin: true, admin: false, user: false };
  if (role_id === 2) return { superadmin: false, admin: true, user: false };
  if (role_id === 3) return { superadmin: false, admin: false, user: true };
  return { superadmin: false, admin: false, user: false };
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRoleType>({
    superadmin: false,
    admin: false,
    user: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    loadUserFromStorage();
  }, []);

  const logout = async () => {
    try {
      const response = await sendRequest({
        method: "post",
        action: "logout",
      });
      if (response.success) {
        console.log("Logout successful");
        await clearUserData();
        router.replace("/(auth)/login");
      } else {
        console.log("Logout failed:", response.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API call fails, clear local data
      await clearUserData();
      router.replace("/(auth)/login");
    }
  };

  const loadUserFromStorage = async () => {
    try {
      const storedUser = await getStoreValue({ key: "user", type: "any" });
      const storedToken = await getStoreValue({ key: "token", type: "string" });

      if (storedUser && storedToken) {
        setUserState(storedUser);
        setUserRole(getUserRole(storedUser.role_id));
      } else {
        setUserState(null);
        setUserRole({ superadmin: false, admin: false, user: false });
      }
    } catch (error) {
      console.error("Error loading user:", error);
      setUserState(null);
      setUserRole({ superadmin: false, admin: false, user: false });
    } finally {
      setIsLoading(false);
    }
  };

  // Save or clear user
  const setUser = async (userData: User | null) => {
    try {
      if (userData) {
        await setStoreValue({ key: "user", value: userData });
        setUserState(userData);
        setUserRole(getUserRole(userData.role_id));
      } else {
        await clearUserData();
      }
    } catch (error) {
      console.error("Error setting user:", error);
    }
  };

  // Clear all auth data
  const clearUserData = async () => {
    try {
      await removeStoreValue({ key: "user" });
      await removeStoreValue({ key: "token" });
      setUserState(null);
      setUserRole({ superadmin: false, admin: false, user: false });
    } catch (error) {
      console.error("Error clearing user data:", error);
    }
  };

  // Force reload
  const reloadUser = async () => {
    await loadUserFromStorage();
  };

  const value: UserContextProps = {
    user,
    userRole,
    isAuthenticated: !!user,
    isLoading,
    setUser,
    clearUserData,
    reloadUser,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Hook
export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default UserContext;
