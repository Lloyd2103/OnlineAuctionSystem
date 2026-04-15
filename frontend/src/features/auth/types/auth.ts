import type { User } from "./user";

export interface AuthState {
    accessToken: string | null;
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    setAccessToken: (accessToken: string | null) => void;
    setUser: (user: User | null) => void;
    clearState: () => void;
    signUp: (name: string, email: string, phone: string, address: string, password: string) => Promise<void>;
    signIn: (userEmail: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    fetchUser: () => Promise<void>;
    refresh: () => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
}