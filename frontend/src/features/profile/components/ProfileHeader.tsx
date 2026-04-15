import { MapPin, Phone, Calendar } from 'lucide-react';
import type { User } from '@/features/auth/types/user';

interface ProfileHeaderProps {
    user: User | null;
    isOwnProfile: boolean;
    image: {
        previewUrl: string | null;
        selectedFile: File | null;
        loading: boolean;
        handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        handleUpload: () => void;
        handleCancel: () => void;
    };
}

export function ProfileHeader({ user, isOwnProfile, image }: ProfileHeaderProps) {
    if (!user) return null;

    return (
        <div className="bg-card border-b rounded-2xl overflow-hidden shadow-sm">
            <div className="relative h-48 md:h-64 bg-gradient-to-r from-primary/20 to-bid/20">
                <div className="absolute -bottom-16 left-4 md:left-8">
                    <div className="relative group">
                        <img
                            src={image.previewUrl || '/default-avatar.png'}
                            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-card bg-muted object-cover"
                            alt="Avatar"
                        />

                        {isOwnProfile && (
                            <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                <span className="text-white text-xs font-medium">Change Avatar</span>
                                <input type="file" className="hidden" onChange={image.handleFileChange} accept="image/*" />
                            </label>
                        )}
                    </div>

                    {image.selectedFile && (
                        <div className="mt-2 flex gap-2 justify-center sm:justify-start">
                            <button
                                onClick={image.handleUpload}
                                disabled={image.loading}
                                className="text-xs bg-green-500 text-white px-3 py-1 rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-sm"
                            >
                                {image.loading ? 'Uploading...' : 'Confirm'}
                            </button>
                            <button
                                onClick={image.handleCancel}
                                className="text-xs bg-red-500 text-white px-3 py-1 rounded-lg font-semibold hover:bg-red-600 transition-colors shadow-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pt-20 pb-6 md:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">{user.userName}</h1>
                        <p className="text-muted-foreground">{user.userEmail}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                            {user.userAddress && <span className="flex items-center gap-1"><MapPin size={14} /> {user.userAddress}</span>}
                            {user.userPhone && <span className="flex items-center gap-1"><Phone size={14} /> {user.userPhone}</span>}
                            <span className="flex items-center gap-1"><Calendar size={14} /> Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {isOwnProfile ? (
                            <button className="px-6 py-2 border border-primary text-primary rounded-xl font-medium hover:bg-primary/10 transition-colors">
                                Edit Profile
                            </button>
                        ) : (
                            <>
                                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity">
                                    Follow
                                </button>
                                <button className="px-6 py-2 border rounded-xl font-medium hover:bg-muted transition-colors">
                                    Message
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
