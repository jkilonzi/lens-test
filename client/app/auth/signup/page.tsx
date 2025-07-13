"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { FcGoogle } from "react-icons/fc"
import { FaApple } from "react-icons/fa"
import { useCurrentAccount, ConnectModal } from "@mysten/dapp-kit"
import { useUser } from "@/context/UserContext"
import { useRouter } from 'next/navigation'
import { authenticateWithGoogle, authenticateWithWallet, sendOTP, verifyOTP } from '@/lib/auth'

// Wallet configuration
const wallets = [
  { name: "Slush", icon: "/download (2) 1.png" },
]

// Google OAuth interfaces
interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
  client_id: string;
}

interface GoogleUserInfo {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
}

export default function SignUpPage() {
  const router = useRouter()
  const { login, user } = useUser()
  const account = useCurrentAccount()
  const [showOtpDialog, setShowOtpDialog] = useState(false)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [otpError, setOtpError] = useState("")
  const [connectModalOpen, setConnectModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isAppleLoading, setIsAppleLoading] = useState(false)

  // Initialize Google Identity Services
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      console.error('Google Client ID is not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your environment variables.');
      return;
    }

    const initializeGoogleAuth = () => {
      if (typeof window !== 'undefined' && window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
            use_fedcm_for_prompt: false,
            context: 'signup',
            ux_mode: 'popup',
          });
          console.log('Google Identity Services initialized successfully');
        } catch (error) {
          console.error('Failed to initialize Google Identity Services:', error);
        }
      }
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      if (window.google) {
        initializeGoogleAuth();
      }
      return;
    }

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleAuth;
    script.onerror = () => {
      console.error('Failed to load Google Identity Services script');
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Decode JWT token to extract user info
  const decodeJWT = (token: string): GoogleUserInfo | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };

  // Handle Google OAuth response
  const handleGoogleResponse = async (response: GoogleCredentialResponse) => {
    try {
      const authResult = await authenticateWithGoogle(response.credential);
      
      if (authResult.user) {
        await login({
          name: authResult.user.name || '',
          email: authResult.user.email || '',
          emails: [{ address: authResult.user.email || '', primary: true, verified: true }],
          avatarUrl: authResult.user.avatarUrl || '/placeholder-user.jpg',
          walletAddress: authResult.user.walletAddress || '',
          username: authResult.user.username || '',
          bio: authResult.user.bio || '',
          location: authResult.user.location || '',
        });
        router.push('/landing');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Google signup error:', errorMessage);
      alert(`Signup failed: ${errorMessage}`);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Trigger Google OAuth flow without dialog box
  const handleGoogleSignUp = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      console.error('Google Client ID is not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your environment variables.');
      alert('Google Sign-Up is not configured. Please contact support.');
      return;
    }

    if (!window.google) {
      console.error('Google Identity Services not loaded');
      alert('Google Sign-Up is not available. Please refresh the page and try again.');
      return;
    }

    try {
      setIsGoogleLoading(true);
      
      // Create a hidden container for the Google button
      const buttonContainer = document.createElement('div');
      buttonContainer.style.position = 'absolute';
      buttonContainer.style.top = '-9999px';
      buttonContainer.style.left = '-9999px';
      buttonContainer.style.visibility = 'hidden';
      
      document.body.appendChild(buttonContainer);
      
      // Render Google button in hidden container
      window.google.accounts.id.renderButton(buttonContainer, {
        theme: 'outline',
        size: 'large',
        width: '250',
        text: 'signup_with',
        logo_alignment: 'left',
      });
      
      // Auto-click the Google button
      setTimeout(() => {
        const googleButton = buttonContainer.querySelector('div[role="button"]');
        if (googleButton) {
          (googleButton as HTMLElement).click();
        }
        
        // Clean up the hidden container
        if (buttonContainer.parentNode) {
          document.body.removeChild(buttonContainer);
        }
      }, 100);
      
    } catch (error) {
      console.error('Error during Google sign-up:', error);
      alert('An error occurred during Google Sign-Up. Please try again.');
      setIsGoogleLoading(false);
    }
  };

  // Placeholder for Apple Sign-In
  const handleAppleSignUp = () => {
    setIsAppleLoading(true);
    alert('Apple Sign-In is not implemented yet. Please use Google, Wallet, or Email to sign up.');
    setIsAppleLoading(false);
    // To implement Apple Sign-In, you need to:
    // 1. Include Apple's Sign-In JS SDK: https://appleid.apple.com/appleid.js
    // 2. Configure your Apple Developer account with Sign-In with Apple
    // 3. Initialize AppleID.auth with your client ID and redirect URI
    // 4. Handle the authentication response and integrate with your backend
  };

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleWalletConnection = async () => {
      if (account?.address && !user) {
        try {
          const authResult = await authenticateWithWallet(account.address)
          
          if (authResult.user) {
            await login({
              name: authResult.user.name || '',
              email: authResult.user.email || '',
              emails: [{ address: authResult.user.email || '', primary: true, verified: false }],
              avatarUrl: authResult.user.avatarUrl || '/placeholder-user.jpg',
              walletAddress: authResult.user.walletAddress || account.address,
              username: authResult.user.username || '',
              bio: authResult.user.bio || '',
              location: authResult.user.location || '',
            })
            router.push('/landing')
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
          console.error("Error during wallet authentication:", errorMessage)
          alert(`Wallet authentication failed: ${errorMessage}`)
        }
      } else if (user && account?.address) {
        router.push('/landing')
      }
    }

    handleWalletConnection()
  }, [account?.address, user, login, router])

  const handleEmailSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsVerifying(true)
    setOtpError("")
    
    try {
      const formData = new FormData(e.currentTarget)
      const emailValue = formData.get('email') as string
      
      setEmail(emailValue)
      await sendOTP(emailValue)
      setShowOtpDialog(true)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setOtpError(`Failed to send OTP: ${errorMessage}`)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleOtpVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsVerifying(true)
    setOtpError("")
    
    try {
      const authResult = await verifyOTP(email, otp)
      
      if (authResult.user) {
        await login({
          name: authResult.user.name || '',
          email: authResult.user.email || '',
          emails: [{ address: authResult.user.email || '', primary: true, verified: true }],
          avatarUrl: authResult.user.avatarUrl || '/placeholder-user.jpg',
          walletAddress: authResult.user.walletAddress || '',
          username: authResult.user.username || '',
          bio: authResult.user.bio || '',
          location: authResult.user.location || '',
        })
        router.push('/landing')
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setOtpError(`Verification failed: ${errorMessage}`)
    } finally {
      setIsVerifying(false)
    }
  }

  const resendOtp = async () => {
    try {
      await sendOTP(email)
      setOtpError("")
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setOtpError(`Failed to resend OTP: ${errorMessage}`)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-stretch bg-white">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 py-8 lg:py-12 w-full lg:w-auto">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-8 lg:mb-10">
            <h1 className="text-xl sm:text-2xl font-bold mb-2">Get Started on Suilens</h1>
            <p className="text-gray-500 text-sm sm:text-base">
              Sign up with one of your socials to start interacting with Suilens
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 py-4 sm:py-6 text-sm sm:text-base font-medium"
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading}
            >
              <FcGoogle className="w-4 h-4 sm:w-5 sm:h-5" />
              {isGoogleLoading ? 'Signing up...' : 'Sign up with Google'}
            </Button>
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 py-4 sm:py-6 text-sm sm:text-base font-medium"
              onClick={handleAppleSignUp}
              disabled={isAppleLoading}
            >
              <FaApple className="w-4 h-4 sm:w-5 sm:h-5" />
              {isAppleLoading ? 'Signing up...' : 'Sign up with Apple ID'}
            </Button>
          </div>

          <div className="space-y-3 mb-6">
            {account?.address && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm">
                  ✓ Wallet connected! Redirecting to dashboard...
                </p>
              </div>
            )}
            {mounted && wallets.map((wallet) => (
              <Button
                key={wallet.name}
                variant="outline"
                className="w-full flex items-center gap-3 py-4 sm:py-5 text-sm sm:text-base font-medium justify-start"
                onClick={() => setConnectModalOpen(true)}
              >
                <Image
                  src={wallet.icon}
                  alt={wallet.name}
                  width={20}
                  height={20}
                  className="rounded sm:w-6 sm:h-6"
                />
                <span>{wallet.name}</span>
              </Button>
            ))}
          </div>

          <ConnectModal
            trigger={<div />}
            open={connectModalOpen}
            onOpenChange={setConnectModalOpen}
          />

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="mx-4 text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form className="space-y-4" onSubmit={handleEmailSignup}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                name="email"
                id="email"
                placeholder="example@company.com" 
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400" 
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={isVerifying}
              className="w-full py-3 text-sm sm:text-base font-medium bg-[#56A8FF] hover:bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {isVerifying ? 'Sending...' : 'Sign Up with Email'}
            </Button>
          </form>

          <div className="mt-6 sm:mt-8 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-[#56A8FF] hover:underline">Sign In</Link>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center bg-[#56A8FF] rounded-l-3xl w-full lg:w-1/2">
        <Image
          src="https://i.ibb.co/PZHSkCVG/Suilens-Logo-Mark-Suilens-Black.png"
          alt="SuiLens Logo"
          width={200}
          height={200}
          className="max-w-[150px] sm:max-w-[200px]"
        />
      </div>

      {showOtpDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Verify Your Email</h2>
            <p className="text-gray-600 mb-6 text-sm">
              We've sent a verification code to <strong>{email}</strong>. Please enter it below.
            </p>
            
            <form onSubmit={handleOtpVerification}>
              <div className="mb-4">
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-center text-lg tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-400"
                  maxLength={6}
                  required
                />
                {otpError && (
                  <p className="text-red-500 text-sm mt-1">{otpError}</p>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowOtpDialog(false)
                    setOtp("")
                    setOtpError("")
                  }}
                  className="flex-1"
                  disabled={isVerifying}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#56A8FF] hover:bg-blue-500"
                  disabled={isVerifying || otp.length !== 6}
                >
                  {isVerifying ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </form>
            
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={resendOtp}
                disabled={isVerifying}
                className="text-[#56A8FF] hover:underline text-sm"
              >
                Didn't receive the code? Resend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Global type declarations for Google Identity Services
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}