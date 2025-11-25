export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface ErrorResponse {
  message: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}
