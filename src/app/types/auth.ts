export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "organizer" | "member";
  phoneNumber?: string;
  beerReputationScore?: number;
  unpaidBalance?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface LoginPayload {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "success" | "error";
  error: unknown;
}
