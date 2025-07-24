// Authentication API client functions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3009';

async function getCsrfToken() {
  const response = await fetch(`${API_BASE_URL}/csrf-token`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch CSRF token');
  }
  const data = await response.json();
  return data.csrfToken;
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
): Promise<Response> {
  const csrfToken = await getCsrfToken();
  const response = await fetch(`${API_BASE_URL}/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'CSRF-Token': csrfToken,
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
): Promise<Response> {
  const csrfToken = await getCsrfToken();
  const response = await fetch(`${API_BASE_URL}/auth/wallet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'CSRF-Token': csrfToken,
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
  const csrfToken = await getCsrfToken();
  const response = await fetch(`${API_BASE_URL}/auth/otp/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'CSRF-Token': csrfToken,
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
): Promise<Response> {
  const csrfToken = await getCsrfToken();
  const response = await fetch(`${API_BASE_URL}/auth/otp/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'CSRF-Token': csrfToken,
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
export async function checkAuthStatus(): Promise<Response> {
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
  const csrfToken = await getCsrfToken();
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'CSRF-Token': csrfToken,
    },
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
  const csrfToken = await getCsrfToken();
  const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: {
      'CSRF-Token': csrfToken,
    },
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Token refresh failed');
  }

  return data;
}
