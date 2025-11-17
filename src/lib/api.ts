const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get token from localStorage
    const token = localStorage.getItem('accessToken');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Debug logging in development
    if (import.meta.env.DEV) {
      console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
      if (options.body) {
        console.log('📤 Request body:', options.body);
      }
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      let errorMessage = 'An error occurred';
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch {
        errorMessage = `HTTP error! status: ${response.status}`;
      }
      
      // Debug logging in development
      if (import.meta.env.DEV) {
        console.error(`❌ API Error: ${response.status} ${response.statusText}`);
        console.error('Error message:', errorMessage);
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Debug logging in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${options.method || 'GET'} ${url}`);
    }
    
    return data;
  }

  // Listings API
  async getListings(params?: {
    category?: string;
    condition?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    campus?: string;
  }): Promise<any[]> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    return this.request<any[]>(`/listings${queryString ? `?${queryString}` : ''}`);
  }

  async getFeaturedListings(): Promise<any[]> {
    return this.request<any[]>('/listings/featured');
  }

  async getListingById(id: string): Promise<any> {
    return this.request<any>(`/listings/${id}`);
  }

  async createListing(listing: any): Promise<any> {
    return this.request<any>('/listings', {
      method: 'POST',
      body: JSON.stringify(listing),
    });
  }

  async addReview(listingId: string, review: any): Promise<any> {
    return this.request<any>(`/listings/${listingId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    });
  }

  // Users API
  async login(email: string, password: string): Promise<any> {
    return this.request<any>('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    campus?: string;
  }): Promise<any> {
    return this.request<any>('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUserById(id: string): Promise<any> {
    return this.request<any>(`/users/${id}`);
  }

  // Messages API
  async getConversations(): Promise<any[]> {
    return this.request<any[]>('/messages/conversations');
  }

  async getConversationMessages(conversationId: string): Promise<any[]> {
    return this.request<any[]>(`/messages/conversation/${conversationId}`);
  }

  async sendMessage(messageData: {
    receiverId: string;
    receiverName: string;
    text: string;
    listingId?: string;
    listingTitle?: string;
  }): Promise<any> {
    return this.request<any>('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async markMessagesAsRead(conversationId: string): Promise<any> {
    return this.request<any>(`/messages/read/${conversationId}`, {
      method: 'PUT',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

