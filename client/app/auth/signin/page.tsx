'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { ConnectModal, useCurrentAccount } from '@mysten/dapp-kit';
import { useUser } from "@/context/UserContext";
import { authenticateWithGoogle, authenticateWithWallet, sendOTP, verifyOTP } from '@/lib/auth';

// Modern Google OAuth interface
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

const wallets = [
	{ name: 'Slush', icon: '/download (2) 1.png', status: ''},
];

export default function SignInPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();
	const [isMobile, setIsMobile] = useState(false);
	const [mounted, setMounted] = useState(false);
	const [isGoogleLoading, setIsGoogleLoading] = useState(false);
	const { login, user } = useUser();
	const account = useCurrentAccount();
	const [showOTPForm, setShowOTPForm] = useState(false);
	const [otpEmail, setOtpEmail] = useState('');
	const [otp, setOtp] = useState('');
	const [isOTPLoading, setIsOTPLoading] = useState(false);

	const [connectModalOpen, setConnectModalOpen] = useState(false);

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
						context: 'signin',
						ux_mode: 'popup',
					});
					console.log('Google Identity Services initialized successfully');
				} catch (error) {
					console.error('Failed to initialize Google Identity Services:', error);
				}
			}
		};

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

	// Store token in database (you'll need to implement this API endpoint)
	const storeTokenInDatabase = async (token: string, userInfo: GoogleUserInfo) => {
		try {
			const response = await fetch('/api/auth/store-google-token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					token,
					userInfo,
					timestamp: new Date().toISOString(),
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to store token');
			}

			return await response.json();
		} catch (error) {
			console.error('Error storing token:', error);
			throw error;
		}
	};

	// Handle Google OAuth response
	const handleGoogleResponse = async (response: GoogleCredentialResponse) => {
		try {
			const authResult = await authenticateWithGoogle(response.credential);
			
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
				});
			}

			console.log('Google login successful:', authResult);
			router.push('/landing');
		} catch (error) {
			console.error('Google login error:', error);
			alert(`Login failed: ${error.message}`);
		} finally {
			setIsGoogleLoading(false);
		}
	};

	// Trigger Google OAuth flow without dialog box
	const handleGoogleSignIn = () => {
		const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
		
		if (!clientId) {
			console.error('Google Client ID is not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your environment variables.');
			alert('Google Sign-In is not configured. Please contact support.');
			return;
		}

		if (!window.google) {
			console.error('Google Identity Services not loaded');
			alert('Google Sign-In is not available. Please refresh the page and try again.');
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
				text: 'signin_with',
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
			console.error('Error during Google sign-in:', error);
			alert('An error occurred during Google Sign-In. Please try again.');
			setIsGoogleLoading(false);
		}
	};

	const handleWalletConnect = async () => {
		console.log("Starting wallet connection...");
		try {
			if (account) {
				const authResult = await authenticateWithWallet(account.address);
				
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
					});
				}
				
				console.log("Wallet authentication successful:", authResult);
				router.push('/landing');
			} else {
				console.error("No wallet connected.");
			}
		} catch (error) {
			console.error("Wallet authentication error:", error);
			alert(`Wallet authentication failed: ${error.message}`);
		}
	};

	const handleSendOTP = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsOTPLoading(true);
		
		try {
			await sendOTP(email);
			setOtpEmail(email);
			setShowOTPForm(true);
			console.log('OTP sent to:', email);
		} catch (error) {
			console.error('Send OTP error:', error);
			alert(`Failed to send OTP: ${error.message}`);
		} finally {
			setIsOTPLoading(false);
		}
	};

	const handleVerifyOTP = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsOTPLoading(true);
		
		try {
			const authResult = await verifyOTP(otpEmail, otp);
			
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
					authMethod: 'email',
					walletConnected: !!authResult.user.walletAddress,
				});
			}
			
			console.log('OTP verification successful:', authResult);
			router.push('/landing');
		} catch (error) {
			console.error('OTP verification error:', error);
			alert(`OTP verification failed: ${error.message}`);
		} finally {
			setIsOTPLoading(false);
		}
	};

	useEffect(() => {
		setMounted(true);
		setIsMobile(window.innerWidth < 640);

		const handleResize = () => {
			setIsMobile(window.innerWidth < 640);
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		console.log("useEffect triggered. Account:", account, "User:", user);
		if (account && !user) {
			// Auto-authenticate with wallet if no user is logged in
			handleWalletConnect();
		}
	}, [account, user]);

	return (
		<div className="min-h-screen font-inter bg-white">
			<div className="min-h-screen flex flex-col lg:flex-row">
				<div className="flex-1 flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12">
					<div className="flex justify-center mb-8 lg:hidden">
						<Image
							src="https://i.ibb.co/PZHSkCVG/Suilens-Logo-Mark-Suilens-Black.png"
							alt="SuiLens Logo"
							width={80}
							height={80}
							className="sm:w-24 sm:h-24"
							unoptimized
						/>
					</div>
					<div className="w-full max-w-md mx-auto lg:max-w-lg xl:max-w-xl">
						<div className="mb-8 lg:mb-10">
							<h1 className="text-[#1C1C1C] text-xl sm:text-2xl lg:text-2xl font-medium mb-2 text-center lg:text-left">
								Login to Suilens
							</h1>
							<p className="text-[#888888] text-sm sm:text-base text-center lg:text-left">
								Login with either socials or email.
							</p>
						</div>
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
							<Button
								variant="outline"
								className="flex-1 flex items-center justify-center gap-2 py-4 sm:py-6 text-sm sm:text-base font-medium"
								onClick={handleGoogleSignIn}
								disabled={isGoogleLoading}
							>
								<FcGoogle className="w-4 h-4 sm:w-5 sm:h-5" />
								<span className="hidden sm:inline text-sm font-medium">
									{isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}
								</span>
								<span className="sm:hidden">
									{isGoogleLoading ? 'Loading...' : 'Google'}
								</span>
							</Button>
							
							<Button
								variant="outline"
								className="flex-1 flex items-center justify-center gap-2 py-4 sm:py-6 text-sm sm:text-base font-medium"
							>
								<FaApple className="w-4 h-4 sm:w-5 sm:h-5 text-sm font-medium" />
								<span className="hidden sm:inline text-sm font-medium">
									Sign in with Apple ID
								</span>
								<span className="sm:hidden">Apple ID</span>
							</Button>
						</div>
						<div className="flex items-center my-6">
							<div className="flex-1 h-px bg-gray-200" />
							<span className="mx-4 text-[#101928] text-xs sm:text-lg font-normal">
								or continue with
							</span>
							<div className="flex-1 h-px bg-gray-200" />
						</div>
						<div className="space-y-2 sm:space-y-3 mb-6">
							{mounted &&
								wallets
									.slice(0, isMobile ? 3 : wallets.length)
									.map((wallet) =>
										wallet.name === 'Slush' ? (
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
													className="sm:w-6 sm:h-6 rounded"
												/>
												<span>{wallet.name}</span>
												{wallet.status && (
													<span className="text-gray-500 text-xs ml-auto">
														{wallet.status}
													</span>
												)}
											</Button>
										) : (
											<Button
												key={wallet.name}
												variant="outline"
												className="w-full flex items-center gap-3 py-4 sm:py-5 text-sm sm:text-base font-medium justify-start"
												disabled={wallet.status === 'Coming soon'}
											>
												<Image
													src={wallet.icon}
													alt={wallet.name}
													width={20}
													height={20}
													className="sm:w-6 sm:h-6 rounded"
												/>
												<span>{wallet.name}</span>
												{wallet.status && (
													<span className="text-gray-500 text-xs ml-auto">
														{wallet.status}
													</span>
												)}
											</Button>
										)
									)}
							{mounted && isMobile && wallets.length > 3 && (
								<details className="group">
									<summary className="cursor-pointer text-blue-600 text-sm font-medium py-2 list-none">
										<span className="group-open:hidden">Show more wallets</span>
										<span className="hidden group-open:inline">Show less</span>
									</summary>
									<div className="space-y-2 mt-2">
										{wallets.slice(3).map((wallet) =>
											wallet.name === 'Slush' ? (
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
														className="sm:w-6 sm:h-6 rounded"
													/>
													<span>{wallet.name}</span>
													{wallet.status && (
														<span className="text-gray-500 text-xs ml-auto">
															{wallet.status}
														</span>
													)}
												</Button>
											) : (
												<Button
													key={wallet.name + wallet.status}
													variant="outline"
													className="w-full flex items-center gap-3 py-4 text-sm font-medium justify-start"
													disabled={wallet.status === 'Coming soon'}
												>
													<Image
														src={wallet.icon}
														alt={wallet.name}
														width={20}
														height={20}
														className="rounded"
													/>
													<span>{wallet.name}</span>
													{wallet.status && (
														<span className="text-gray-500 text-xs ml-auto">
															{wallet.status}
														</span>
													)}
												</Button>
											)
										)}
									</div>
								</details>
							)}
						</div>
						<ConnectModal
							trigger={<div />}
							open={connectModalOpen}
							onOpenChange={setConnectModalOpen}
						/>

						{!showOTPForm ? (
							<form
								onSubmit={handleSendOTP}
								className="space-y-4 sm:space-y-6"
							>
								<div className="space-y-2">
									<Label
										htmlFor="email"
										className="text-gray-700 font-semibold text-sm sm:text-base"
									>
										Email Address
									</Label>
									<div className="relative">
										<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
										<Input
											id="email"
											type="email"
											placeholder="your@email.com"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
											className="pl-9 sm:pl-10 py-2.5 sm:py-3 text-base sm:text-lg rounded-xl border-2 focus:border-blue-400"
										/>
									</div>
								</div>
								
								<Button
									type="submit"
									disabled={isOTPLoading}
									className="w-full py-3 sm:py-4 text-base sm:text-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-xl disabled:opacity-50"
								>
									{isOTPLoading ? 'Sending...' : 'Send Login Code'}
								</Button>
							</form>
						) : (
							<form
								onSubmit={handleVerifyOTP}
								className="space-y-4 sm:space-y-6"
							>
								<div className="space-y-2">
									<Label className="text-gray-700 font-semibold text-sm sm:text-base">
										Enter the 6-digit code sent to {otpEmail}
									</Label>
									<Input
										type="text"
										placeholder="000000"
										value={otp}
										onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
										required
										maxLength={6}
										className="text-center text-2xl tracking-widest py-3 rounded-xl border-2 focus:border-blue-400"
									/>
								</div>
								
								<div className="flex gap-3">
									<Button
										type="button"
										variant="outline"
										onClick={() => {
											setShowOTPForm(false);
											setOtp('');
											setOtpEmail('');
										}}
										className="flex-1"
									>
										Back
									</Button>
									<Button
										type="submit"
										disabled={isOTPLoading || otp.length !== 6}
										className="flex-1 bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
									>
										{isOTPLoading ? 'Verifying...' : 'Verify Code'}
									</Button>
								</div>
								
								<div className="text-center">
									<button
										type="button"
										onClick={() => handleSendOTP({ preventDefault: () => {} } as React.FormEvent)}
										className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
										disabled={isOTPLoading}
									>
										Resend Code
									</button>
								</div>
							</form>
						)}
						
						<div className="text-center pt-4">
							<p className="text-gray-600 text-xs sm:text-sm">
								Don't have an account?{' '}
								<Link
									href="/auth/signup"
									className="text-blue-600 hover:text-blue-700 font-semibold"
								>
									Create one now
								</Link>
							</p>
						</div>
					</div>
				</div>
				<div className="hidden lg:flex flex-1 items-center justify-center bg-[#56A8FF] min-h-screen">
					<div className="text-center">
						<Image
							src="https://i.ibb.co/PZHSkCVG/Suilens-Logo-Mark-Suilens-Black.png"
							alt="SuiLens Logo"
							width={180}
							height={180}
							className="xl:w-52 xl:h-52 2xl:w-64 2xl:h-64"
							unoptimized
						/>
					</div>
				</div>
			</div>
		</div>
	);
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