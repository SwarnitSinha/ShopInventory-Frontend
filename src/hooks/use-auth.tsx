import React, { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { z } from "zod";
import type { Shop } from "../types";
type InsertUser = z.infer<typeof insertUserSchema>;

export const insertUserSchema = z.object({
  shopName: z.string().min(2, {
    message: "Shop name must be at least 2 characters",
  }),
  // email: z.string().email({
  //   message: "Please enter a valid email address",
  // }),
  username: z.string().min(3, {
    message: "Username must be at least 3 characters",
  }),
  ownerName: z.string().min(2, {
    message: "Name must be at least 2 characters",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "./use-toast";

type AuthContextType = {
  user: Omit<Shop,"password"> | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<Omit<Shop,"password">, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<Omit<Shop,"password">, Error, InsertUser>;
};

type LoginData = Pick<InsertUser, "username" | "password">;

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  const token = localStorage.getItem("token");
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<Omit<Shop,"password"> | undefined, Error>({
    queryKey: ["/api/user"],
    queryFn: async() =>{
      if (token == null) return null;

      const res = await apiRequest("GET", "/api/auth/user", undefined, token);

      if (!res.ok) {
        localStorage.removeItem("token"); // Remove invalid token
        return null;
      }
  
      return res.json();
      // getQueryFn({ on401: "returnNull" }),
    } ,
    enabled: !!token,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      try {
        const res = await apiRequest("POST", "/api/auth/login", credentials);
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || 'Login failed');
        }
  
        const data = await res.json();
        
        if (!data.token) {
          throw new Error('No token received');
        }
  
        // Store all auth data at once
        localStorage.setItem("token", data.token);
        if (data.shop) {
          localStorage.setItem("shopName", data.shop.shopName);
          localStorage.setItem("ownerName", data.shop.ownerName);
          localStorage.setItem("username", data.shop.username);
          localStorage.setItem("email", data.shop.email);
        }
  
        return data.shop;
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    onSuccess: (shop) => {
      queryClient.setQueryData(["/api/user"], shop);
      // Better: Use navigate from react-router instead
      window.location.assign("/dashboard"); // assign() is better than href for programmatic navigation
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      // Clear any partial auth state
      localStorage.removeItem("token");
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: InsertUser) => {
      const res = await apiRequest("POST", "/api/auth/register", credentials);
  
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Registration failed");
      }
  
      return await res.json(); // Return the full response (token + user data)
    },
    onSuccess: (data) => {
      // Store the token and user details in localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.shop) {
        localStorage.setItem("shopName", data.shop.shopName);
        localStorage.setItem("ownerName", data.shop.ownerName);
        localStorage.setItem("username", data.shop.username);
        localStorage.setItem("email", data.shop.email);
      }
  
      // Update the React Query cache with the user data
      queryClient.setQueryData(["/api/user"], data.shop);
  
      // Redirect the user to the dashboard
      window.location.assign("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      //clear localstorage
      localStorage.clear(); 
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
