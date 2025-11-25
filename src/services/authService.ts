import type { RegisterData, LoginData, AuthResponse, User } from '../types/auth';

const API_URL = 'http://localhost:3000';

export const authService = {
  async register(data: RegisterData): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Registration failed');
    }

    return result;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Login failed');
    }

    console.log('AuthService Login Result:', result);

    // Store token in localStorage
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));

    return result;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getUserInfo(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  async verifyToken(): Promise<{ valid: boolean; user?: User }> {
    const token = this.getToken();
    
    if (!token) {
      return { valid: false };
    }

    try {
      const response = await fetch(`${API_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        this.logout();
        return { valid: false };
      }

      const result = await response.json();
      
      // Update user data in localStorage
      if (result.user) {
        localStorage.setItem('user', JSON.stringify(result.user));
      }

      return { valid: true, user: result.user };
    } catch {
      this.logout();
      return { valid: false };
    }
  },
};
