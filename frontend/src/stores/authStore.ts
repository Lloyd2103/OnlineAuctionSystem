import { create } from "zustand";
import { persist } from 'zustand/middleware'
import { toast } from 'sonner';
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/auth";
import type { User } from "@/types/user";

export const useAuthStore = create<AuthState>() (

    persist((set, get) => ({

        accessToken: null,
        user: null,
        isAuthenticated:false,
        loading: false,

        setAccessToken: (accessToken) => {
            set({ accessToken });
        },

        setUser: (user) => {
            set({ user });
        },

        clearState: () => set({ accessToken: null, user: null, loading: false }),

        signUp: async (userName, userEmail, userPhone, userAddress, hashedPassword) => {
            try {
                set({ loading: true });
                await authService.signUp(userName, userEmail, userPhone, userAddress, hashedPassword);
                toast.success("Signup successful! Please log in.");
            } catch (error) {
                console.error(error);
                toast.error("Signup failed. Please try again.");
            } finally {
                set({ loading: false });
            }
        },

        signIn: async (email: string, password: string) => {
            try {
                set({ loading: true });
                const { accessToken } = await authService.signIn(email, password);
                get().setAccessToken(accessToken);

                await get().fetchUser();
                toast.success("Login successful!");
            } catch (error) {
                console.error(error);
                toast.error("Login failed. Please check your credentials and try again.");
            }
            finally {
                set({ loading: false });
            }
        },

        signOut: async () => {
            try {
                get().clearState();
                await authService.signOut();
                toast.success("Logged out successfully!");
            } catch (error) {
                console.error(error);
                toast.error("Logout failed. Please try again.");
            }
        },

        refresh: async () => {
            // Nếu đang loading hoặc đã có user rồi thì hạn chế gọi lại
            if (get().loading) return; 

            try {
                set({ loading: true });
                const accessToken = await authService.refresh();
                set({ accessToken, isAuthenticated: true });

                // Chỉ fetchUser nếu thực sự cần
                if (!get().user) {
                    await get().fetchUser();
                }
            } catch (error) {
                console.error("Refresh failed:", error);

                get().clearState();
            } finally {
                set({ loading: false });
            }
        },

        fetchUser: async () => {
            try {
                set({ loading: true });
                const user = await authService.fetchUser();
                set({ user});
            } catch (error) {
                console.error( error);
                set({ user: null, accessToken: null });
                toast.error("Failed to fetch user data. Please try again.");
            } finally {
                set({ loading: false });
            }
        },

            updateProfile: async (data: Omit<Partial<User>, 'userImage'> & { userImage?: File | string }) => {
                try {
                    set({ loading: true });

                    const updatedUser = await authService.updateProfile(data);

                    set((state) => ({
                        user: state.user ? { ...state.user, ...updatedUser } : updatedUser,
                        loading: false
                    }));

                    toast.success("Profile updated successfully!");
                } catch (error) {
                    console.error(error);
                    set({ loading: false });
                    toast.error("Failed to update profile.");
                }
            },
        }),
    {
        name: 'auth-storage',
        partialize: (state) => ({
            user: state.user,
            accessToken: state.accessToken,

        }),
    }
    ),
);