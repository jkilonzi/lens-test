"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
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
  emails: { address: string; primary: boolean; verified: boolean }[]
  eventsAttended?: number
  poapsCollected?: number
  avatarUrl?: string
  googleId?:string
  googleToken?:string
  authMethod?: 'email' | 'google' | 'wallet'
  walletConnected?: boolean
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
  connectWallet: (walletAddress: string) => void
  isWalletRequired: () => boolean
  canCreateEvents: () => boolean
  needsWalletForEventCreation: () => boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const updateUserProfile = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : prev);
  };

  const updateProfileImage = (imageUrl: any) => {
    setUser(prev => prev ? { ...prev, avatarUrl: imageUrl } : prev);
  };

  const updateUserName = (name: any) => {
    setUser(prev => prev ? { ...prev, name } : prev);
  };

  const updateUserEmail = (email: any) => {
    setUser(prev => prev ? ({ ...prev, email }): prev);
  };

  const connectWallet = (walletAddress: string) => {
    setUser(prev => prev ? { 
      ...prev, 
      walletAddress, 
      walletConnected: true 
    } : prev);
  };

  const isWalletRequired = () => {
    return !user?.walletConnected && user?.authMethod !== 'wallet';
  };
  const login = async (userData: User) => {
  const canCreateEvents = () => {
    if (!user) return false;
    
    // If user signed in with wallet, they can create events immediately
    if (user.authMethod === 'wallet') return true;
    
    // For email/Google users, they need to have connected a wallet
    return user.walletConnected === true && !!user.walletAddress;
  };

  const needsWalletForEventCreation = () => {
    if (!user) return false;
    
    // If user signed in with wallet, no additional wallet connection needed
    if (user.authMethod === 'wallet') return false;
    
    // For email/Google users, check if wallet is connected
    return !user.walletConnected || !user.walletAddress;
  };
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
  }, []);

  // Persist user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      updateUserProfile, 
      updateProfileImage, 
      updateUserName, 
      updateUserEmail, 
      login, 
      logout,
      connectWallet,
      isWalletRequired
    }}>
      {children}
    </UserContext.Provider>
  )
}
        isWalletRequired,
        canCreateEvents,
        needsWalletForEventCreation
export const useUser = (): UserContextType => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
