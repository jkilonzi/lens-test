"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"
import { checkAuthStatus } from "@/lib/auth"

type User = {
  name: string
  email: string
  bio?: string
  instagram?: string
  twitter?: string
  youtube?: string
  tiktok?: string
  linkedin?: string
  website?: string
  mobile?: string
  username?: string
  walletAddress?: string
  emails?: { address: string; primary: boolean; verified: boolean }[]
  eventsAttended?: number
  poapsCollected?: number
  avatarUrl?: string
  googleId?:string
  googleToken?:string
}

type UserContextType = {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  login: (user: User) => Promise<void>
  logout: () => void
  updateUserProfile: (updates: Partial<User>) => void
  updateProfileImage: (imageUrl: string) => void
  updateUserName: (name: string) => void
  updateUserEmail: (email: string) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const updateUserProfile = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : prev);
  };

  const updateProfileImage = (imageUrl: string) => {
    setUser(prev => prev ? { ...prev, avatarUrl: imageUrl } : prev);
  };

  const updateUserName = (name: string) => {
    setUser(prev => prev ? { ...prev, name } : prev);
  };

  const updateUserEmail = (email: string) => {
    setUser(prev => prev ? ({ ...prev, email }): prev);
  };

  const login = async (userData: User) => {
    try {
      // Optionally verify session with backend here or rely on checkAuthStatus on mount
      setUser(userData);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = () => setUser(null);

  // On mount, check auth status from backend to sync user state
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const authResponse = await checkAuthStatus();
        if (authResponse.user) {
          // Ensure emails property exists to satisfy User type
          const userWithEmails = {
            ...authResponse.user,
            emails: authResponse.user.emails || [],
          };
          setUser(userWithEmails);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
        console.error("Failed to verify auth status:", error);
      }
    };

    verifyUser();
  }, [user]);

  // Persist user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const contextValue = useCallback(() => ({
    user,
    setUser,
    updateUserProfile,
    updateProfileImage,
    updateUserName,
    updateUserEmail,
    login,
    logout,
  }), [user]);


  return (
    <UserContext.Provider value={contextValue()}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = (): UserContextType => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
