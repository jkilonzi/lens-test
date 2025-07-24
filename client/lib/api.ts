// API client functions for event management

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3009';

interface ApiResponse<T = any> {
  message?: string;
  error?: string;
  data?: T;
}

interface Event {
  id: string;
  title: string;
  description?: string;
  image?: string;
  date: string;
  time: string;
  endDate?: string;
  endTime?: string;
  location?: string;
  category?: string;
  capacity?: number;
  ticketPrice?: number;
  isFree: boolean;
  requiresApproval: boolean;
  isPrivate: boolean;
  timezone: string;
  poapName?: string;
  poapDescription?: string;
  poapImage?: string;
  status: string;
  qrCode?: string;
  eventUrl?: string;
  suiEventId?: string;
  creatorWalletAddress?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: number;
    name: string;
    username: string;
    avatarUrl: string;
    walletAddress: string;
  };
}

interface CreateEventData {
  title: string;
  description?: string;
  date: string;
  time: string;
  endDate?: string;
  endTime?: string;
  location?: string;
  category?: string;
  capacity?: number;
  ticketPrice?: number;
  isFree?: boolean;
  requiresApproval?: boolean;
  isPrivate?: boolean;
  timezone?: string;
  poapName?: string;
  poapDescription?: string;
  poapImage?: string;
  qrCode?: string;
  eventUrl?: string;
  suiEventId?: string;
  creatorWalletAddress?: string;
}

// Create a new event
export async function createEvent(eventData: CreateEventData): Promise<{ event: Event }> {
  const response = await fetch(`${API_BASE_URL}/events/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(eventData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to create event');
  }

  return data;
}

// Get all events with optional filtering
export async function getAllEvents(params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}): Promise<{
  events: Event[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.category) searchParams.append('category', params.category);
  if (params?.search) searchParams.append('search', params.search);

  const response = await fetch(`${API_BASE_URL}/events?${searchParams.toString()}`, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch events');
  }

  return data;
}

// Get a specific event by ID
export async function getEventById(id: string): Promise<{ event: Event }> {
  const response = await fetch(`${API_BASE_URL}/events/${id}`, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch event');
  }

  return data;
}

// Get user's events
export async function getUserEvents(): Promise<{ events: Event[] }> {
  const response = await fetch(`${API_BASE_URL}/events/user-events`, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch user events');
  }

  return data;
}

// Update an event
export async function updateEvent(id: string, eventData: Partial<CreateEventData>): Promise<{ event: Event }> {
  const response = await fetch(`${API_BASE_URL}/events/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(eventData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to update event');
  }

  return data;
}

// Delete an event
export async function deleteEvent(id: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/events/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete event');
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