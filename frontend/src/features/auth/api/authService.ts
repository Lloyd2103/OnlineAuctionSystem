import api from "@/lib/axios";
import type { User } from "@/features/auth/types/user";

export const authService = {
    signUp: async (name: string, email: string, phone: string, address: string, password: string) => {
        const res = await api.post("/auth/signup", {
            userName: name,
            userEmail: email,
            userPhone: phone,
            userAddress: address,
            password,
        }, { withCredentials: true }
        );
        return res.data;
    },

    signIn: async (email: string, password: string) => {
        const res = await api.post("/auth/signin", {
            userEmail: email,
            password,
            withCredentials: true,
        }, { withCredentials: true }
        );
        return res.data;
    },

    signOut: async () => {
        const res = await api.post("/auth/signout", {}, { withCredentials: true });
        return res.data;
    },

    fetchUser: async () => {
        try {
            const res = await api.get("/users/profile", { withCredentials: true });
            return res.data.user;
        } catch (error) {
            console.error("Lỗi lấy thông tin user:", error);
            return null;
        }
    },
    fetchUserById: async (id: string) => {
        try {
            const res = await api.get(`/users/${id}`);
            return res.data.user;
        } catch (error) {
            console.error("Lỗi lấy thông tin user theo ID:", error);
            return null;
        }
    },
    refresh: async () => {
        try {
            const res = await api.post("/auth/refresh", { withCredentials: true });
            return res.data.accessToken;
        } catch (error) {
            console.error("Lỗi refresh token:", error);
            return null as unknown as string;
        }
    },
    updateProfile: async (data: Omit<Partial<User>, 'userImage'> & { userImage?: File | string }) => {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (value instanceof File) {
                    formData.append(key, value);
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        const res = await api.put("/users/profile", formData, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });

        return res.data.user || res.data;
    }
}
