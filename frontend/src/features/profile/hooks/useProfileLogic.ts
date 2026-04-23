import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { authService } from '../../auth/api/authService';
import { auctionService } from '../../auction/api/auctionService';
import { userAdminService } from '../api/userAdminService';
import { toast } from 'sonner';
import type { User } from '@/features/auth/types/user';
import type { Auction } from '../../auction/types/auction';

export function useProfileLogic(urlId?: string) {
    const currentUser = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);

    const [profileUser, setProfileUser] = useState<User | null>(currentUser);
    const isOwnProfile = !urlId || (currentUser?.id && urlId === currentUser.id.toString());

    const [loading, setLoading] = useState(false);
    const [userAuctions, setUserAuctions] = useState<Auction[]>([]);
    const [auctionsPage, setAuctionsPage] = useState(1);
    const [auctionsMeta, setAuctionsMeta] = useState({ totalItems: 0, totalPages: 0 });
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const loadProfile = useCallback(async () => {
        try {
            if (!isOwnProfile && urlId) {
                const fetchedUser = await authService.fetchUserById(urlId);
                if (fetchedUser) {
                    setProfileUser(fetchedUser);
                }
            } else {
                setProfileUser(currentUser);
            }
        } catch (error) {
            console.error("Failed to load profile:", error);
        }
    }, [urlId, currentUser, isOwnProfile]);

    const loadAuctions = useCallback(async (page = auctionsPage) => {
        const idToFetch = urlId || currentUser?.id;
        if (idToFetch) {
            try {
                const result = await auctionService.fetchAuctionsByOwnerId(idToFetch, { page, limit: 6 });
                setUserAuctions(result.data || []);
                setAuctionsMeta({ totalItems: result.totalItems, totalPages: result.totalPages });
            } catch (error) {
                console.error("Failed to load auctions:", error);
            }
        }
    }, [urlId, currentUser?.id, auctionsPage]);

    useEffect(() => {
        loadProfile();
        loadAuctions();
    }, [loadProfile, loadAuctions]);

    const handleUpdateProfile = async (data: { userName: string; userPhone: string; userAddress: string; userImage?: File }) => {
        try {
            setLoading(true);
            const response = await authService.updateProfile(data);
            if (response) {
                setUser(response);
                setProfileUser(response);
            }
        } catch (error) {
            console.error("Update profile failed", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitRating = async (targetId: number, value: number) => {
        try {
            await userAdminService.submitRating(targetId, value);
            toast.success('Rating submitted successfully!');
            loadProfile();
        } catch (error) {
            console.error('Failed to submit rating:', error);
            toast.error('Failed to submit rating.');
        }
    };

    return {
        profileUser,
        isOwnProfile,
        userAuctions,
        auctionsPage,
        setAuctionsPage,
        auctionsMeta,
        loading,
        showRatingModal,
        setShowRatingModal,
        showEditModal,
        setShowEditModal,
        handleUpdateProfile,
        handleSubmitRating,
        refreshProfile: loadProfile,
        refreshAuctions: loadAuctions
    };
}
