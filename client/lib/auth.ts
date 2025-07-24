// Authentication API client functions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3009';

interface AuthResponse {
  message: string;
  userId: number;
  role: string;
  user?: {
    id: number;
    email: string;
    name: string;
    username: string;
    avatarUrl: string;
    walletAddress?: string;
    bio?: string;
    location?: string;
  };
}

interface AuthError {
  error: string;
  errors?: Array<{ message: string; path: string[] }>;
}

// Google Authentication
export async function authenticateWithGoogle(
  googleToken: string,
  additionalData?: {
    name?: string;
    avatarUrl?: string;
    bio?: string;
    location?: string;
  }
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      googleToken,
      ...additionalData,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Google authentication failed');
  }

  return data;
}

// Wallet Authentication
export async function authenticateWithWallet(
  walletAddress: string,
  additionalData?: {
    name?: string;
    avatarUrl?: string;
    bio?: string;
    location?: string;
  }
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/wallet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      walletAddress,
      ...additionalData,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Wallet authentication failed');
  }

  return data;
}

// Send OTP
export async function sendOTP(email: string): Promise<{ message: string; email: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/otp/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to send OTP');
  }

  return data;
}

// Verify OTP
export async function verifyOTP(
  email: string,
  otp: string,
  additionalData?: {
    name?: string;
    avatarUrl?: string;
    bio?: string;
    location?: string;
  }
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/otp/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      email,
      otp,
      ...additionalData,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'OTP verification failed');
  }

  return data;
}

// Check Authentication Status
export async function checkAuthStatus(): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/check-auth`, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Authentication check failed');
  }

  return data;
}

// Logout
export async function logout(): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Logout failed');
  }

  return data;
}

// Refresh Token
export async function refreshToken(): Promise<{ token: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Token refresh failed');
  }

  return data;
}

// Update user's wallet address
export async function updateUserWallet(walletAddress: string): Promise<{ user: any }> {
  const response = await fetch(`${API_BASE_URL}/auth/update-wallet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ walletAddress }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to update wallet');
  }

  return data;
}