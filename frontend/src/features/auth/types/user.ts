export interface User {
    id: number;
    userName: string;
    userEmail: string;
    userPhone: string;
    userAddress: string;
    userStatus: string;
    identifiedStatus: string;
    userImage: string;
    walletBalance: number;
    ratingScore: number;
    ratingCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface UserState {
    user: User | null;
    loading: boolean;
    fetchUser: () => Promise<void>;
    updateProfile: (data: Omit<Partial<User>, 'userImage'> & { userImage?: File | string }) => Promise<void>;
}