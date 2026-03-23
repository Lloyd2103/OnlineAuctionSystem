// import { create } from "zustand";
// import { toast } from 'sonner';

// import type { UserState } from "@/types/user";
// import { userService } from "@/services/userService";

// export const useUserStore = create<UserState>((set) => ({
//     user: null,
//     loading: false,

//     fetchUser: async () => {
//         try {
//             set({ loading: true });
//             const user = await userService.fetchUser();
//             set({ user });
//         } catch (error) {
//             console.error("Failed to fetch user:", error);
//             set({ user: null });
//         } finally {
//             set({ loading: false });
//         }
//     },

//     updateProfile: async (userName, userEmail, userPhone, userAddress, userStatus, userImage) => {  
//         try {
//             set({ loading: true });
//             const updatedUser = await userService.updateProfile(userName, userEmail, userPhone, userAddress, userStatus, userImage);
//             set({ user: updatedUser });
//             toast.success("Profile updated successfully!");
//         } catch (error) {
//             console.error("Failed to update profile:", error);
//             toast.error("Profile update failed. Please try again.");
//         } finally {
//             set({ loading: false });
//         }
//     },
// }));