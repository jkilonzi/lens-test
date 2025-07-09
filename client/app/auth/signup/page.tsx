"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { FcGoogle } from "react-icons/fc"
import { FaApple, FaWallet } from "react-icons/fa"
import { useCurrentAccount, ConnectModal } from "@mysten/dapp-kit"
import { useUser } from "@/context/UserContext"
import { useRouter } from 'next/navigation'
import { authenticateWithGoogle, authenticateWithWallet, sendOTP, verifyOTP } from '@/lib/auth'

const wallets = [
  { name: "Slush", icon: "/download (2) 1.png" },
]

export default function SignUpPage() {
  const router = useRouter()
  const { login, user } = useUser()
  const account = useCurrentAccount()
  const [loginType, setLoginType] = useState<'wallet' | 'email'>("wallet")
  const [showOtpDialog, setShowOtpDialog] = useState(false)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [otpError, setOtpError] = useState("")
  const [connectModalOpen, setConnectModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [showOtpDialog, setShowOtpDialog] = useState(false)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [otpError, setOtpError] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-redirect when wallet is connected
  useEffect(() => {
    const handleWalletConnection = async () => {
      if (account?.address && !user) {
        console.log("Wallet connected, auto-redirecting...", account.address)
        try {
          const authResult = await authenticateWithWallet(account.address)
          
          if (authResult.user) {
            await login({
              name: authResult.user.name,
              email: authResult.user.email,
              emails: [{ address: authResult.user.email, primary: true, verified: false }],
              avatarUrl: authResult.user.avatarUrl || '/placeholder-user.jpg',
              walletAddress: authResult.user.walletAddress || account.address,
              username: authResult.user.username,
              bio: authResult.user.bio,
              location: authResult.user.location,
            })
          }
          
          console.log("Wallet authentication successful, redirecting to landing...")
          router.push('/landing')
        } catch (error) {
          console.error("Error during wallet authentication:", error)
          alert(`Wallet authentication failed: ${error.message}`)
        }
      }
      else if (user && account?.address) {
        console.log("User already logged in, redirecting...")
        router.push('/landing')
      }
    }

    handleWalletConnection()
  }, [account?.address, user, login, router])

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)
    setOtpError("")
    
    try {
      const form = e.target as HTMLFormElement
      const formData = new FormData(form)
      const emailValue = formData.get('email') as string
      
      setEmail(emailValue)
      await sendOTP(emailValue)
      
      setShowOtpDialog(true)
      console.log("OTP sent to:", emailValue)
    } catch (error) {
      console.error("Error sending OTP:", error)
      setOtpError(`Failed to send OTP: ${error.message}`)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)
    setOtpError("")
    
    try {
      const authResult = await verifyOTP(email, otp)
      
      if (authResult.user) {
        await login({
          name: authResult.user.name,
          email: authResult.user.email,
          emails: [{ address: authResult.user.email, primary: true, verified: true }],
          avatarUrl: authResult.user.avatarUrl || '/placeholder-user.jpg',
          walletAddress: authResult.user.walletAddress || '',
          username: authResult.user.username,
          bio: authResult.user.bio,
          location: authResult.user.location,
        })
      }
      
      console.log("OTP verification successful:", authResult)
      router.push('/landing')
    } catch (error) {
      console.error("Error verifying OTP:", error)
      setOtpError(`Verification failed: ${error.message}`)
    } finally {
      setIsVerifying(false)
    }
  }

  const resendOtp = async () => {
    try {
      await sendOTP(email)
      setOtpError("")
      console.log("OTP resent to:", email)
    } catch (error) {
      console.error("Error resending OTP:", error)
      setOtpError(`Failed to resend OTP: ${error.message}`)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-stretch bg-white">
      {/* Left: Auth Card */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 py-8 lg:py-12 w-full lg:w-auto">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-8 lg:mb-10">
            <h1 className="text-xl sm:text-2xl font-bold mb-2">Get Started on Suilens</h1>
            <p className="text-gray-500 text-sm sm:text-base">
              Login with one of your socials to start interacting with Suilens
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 py-4 sm:py-6 text-sm sm:text-base font-medium"
            >
              <FcGoogle className="w-4 h-4 sm:w-5 sm:h-5" /> Sign up with Google
            </Button>
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 py-4 sm:py-6 text-sm sm:text-base font-medium"
            >
              <FaApple className="w-4 h-4 sm:w-5 sm:h-5" /> Sign up with Apple ID
            </Button>
          </div>

          {/* Wallet Section */}
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

          {/* Connect Modal */}
          <ConnectModal
            trigger={<div />}
            open={connectModalOpen}
            onOpenChange={setConnectModalOpen}
          />

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="mx-4 text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Email Section */}
          <form className="space-y-4" onSubmit={handleEmailSignup}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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

      {/* Right: Logo Section */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-[#56A8FF] rounded-l-3xl w-full lg:w-1/2">
        <Image
          src="https://i.ibb.co/PZHSkCVG/Suilens-Logo-Mark-Suilens-Black.png"
          alt="SuiLens Logo"
          width={200}
          height={200}
          className="max-w-[150px] sm:max-w-[200px]"
        />
      </div>

      {/* OTP Dialog */}
      {showOtpDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Verify Your Email</h2>
            <p className="text-gray-600 mb-6 text-sm">
              We've sent a verification code to <strong>{email}</strong>. Please enter it below.
            </p>
            
            <form onSubmit={handleOtpVerification}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
                <input
                  type="text"
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