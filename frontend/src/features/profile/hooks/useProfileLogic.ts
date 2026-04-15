import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { authService } from '../../auth/api/authService';
import { auctionService } from '../../auction/api/auctionService';
import { toast } from 'sonner';
import type { User } from '@/features/auth/types/user';
import type { Auction } from '../../auction/types';

export function useProfileLogic(urlId?: string) {
    const currentUser = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);

    const [profileUser, setProfileUser] = useState<User | null>(currentUser);
    const isOwnProfile = !urlId || (currentUser?.id && urlId === currentUser.id.toString());

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [userAuctions, setUserAuctions] = useState<Auction[]>([]);

    const loadProfile = useCallback(async () => {
        try {
            if (!isOwnProfile && urlId) {
                const fetchedUser = await authService.fetchUserById(urlId);
                if (fetchedUser) {
                    setProfileUser(fetchedUser);
                    setPreviewUrl(fetchedUser.userImage || null);
                }
            } else {
                setProfileUser(currentUser);
                setPreviewUrl(currentUser?.userImage || null);
            }
        } catch (error) {
            console.error("Failed to load profile:", error);
        }
    }, [urlId, currentUser, isOwnProfile]);

    const loadAuctions = useCallback(async () => {
        const idToFetch = urlId || currentUser?.id;
        if (idToFetch) {
            try {
                const data = await auctionService.fetchAuctionsByOwnerId(idToFetch);
                setUserAuctions(data.auctions || []);
            } catch (error) {
                console.error("Failed to load auctions:", error);
            }
        }
    }, [urlId, currentUser?.id]);

    useEffect(() => {
        loadProfile();
        loadAuctions();
    }, [loadProfile, loadAuctions]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !profileUser) return;
        try {
            setLoading(true);
            const response = await authService.updateProfile({
                userName: profileUser.userName || '',
                userEmail: profileUser.userEmail || '',
                userPhone: profileUser.userPhone || '',
                userAddress: profileUser.userAddress || '',
                userStatus: profileUser.userStatus || '',
                userImage: selectedFile
            });
            if (response) {
                setUser(response);
                toast.success("Profile image updated!");
                setSelectedFile(null);
            }
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Failed to upload image.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelImage = () => {
        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }
        setSelectedFile(null);
        setPreviewUrl(profileUser?.userImage || null);
    };

    return {
        profileUser,
        isOwnProfile,
        userAuctions,
        image: {
            previewUrl,
            selectedFile,
            loading,
            handleFileChange,
            handleUpload,
            handleCancel: handleCancelImage
        },
        refreshProfile: loadProfile,
        refreshAuctions: loadAuctions
    };
}
