import { useState } from 'react';
import { MapPin, Phone, Calendar, Star } from 'lucide-react';
import type { User } from '@/features/auth/types/user';
import { RatingModal } from './RatingModal';
import { EditProfileModal } from './EditProfileModal';

interface ProfileHeaderProps {
    user: User | null;
    isOwnProfile: boolean;
    onSubmitRating?: (targetId: number, value: number) => Promise<void>;
    showEditModal?: boolean;
    setShowEditModal?: (show: boolean) => void;
    onUpdateProfile?: (data: { userName: string; userPhone: string; userAddress: string; userImage?: File }) => Promise<void>;
}

export function ProfileHeader({ 
    user, 
    isOwnProfile, 
    onSubmitRating, 
    showEditModal,
    setShowEditModal,
    onUpdateProfile 
}: ProfileHeaderProps) {
    const [showRatingModal, setShowRatingModal] = useState(false);
    if (!user) return null;

    return (
        <div className="bg-card border-b rounded-2xl overflow-hidden shadow-sm">
            <div className="relative h-48 md:h-64 bg-gradient-to-r from-primary/20 to-bid/20">
                <div className="absolute -bottom-16 left-4 md:left-8">
                    <div className="relative group">
                        <img
                            src={user.userImage || '/default-avatar.png'}
                            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-card bg-muted object-cover"
                            alt="Avatar"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pt-20 pb-6 md:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">{user.userName}</h1>
                        <p className="text-muted-foreground">{user.userEmail}</p>

                        {/* Rating display */}
                        <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={14}
                                    className={`${
                                        star <= Math.round(user.ratingScore || 0)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-muted-foreground'
                                    }`}
                                />
                            ))}
                            <span className="text-sm text-muted-foreground ml-1">
                                {user.ratingScore ? Number(user.ratingScore).toFixed(1) : '0.0'}
                                {user.ratingCount > 0 && ` (${user.ratingCount} ratings)`}
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                            {user.userAddress && <span className="flex items-center gap-1"><MapPin size={14} /> {user.userAddress}</span>}
                            {user.userPhone && <span className="flex items-center gap-1"><Phone size={14} /> {user.userPhone}</span>}
                            <span className="flex items-center gap-1"><Calendar size={14} /> Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {isOwnProfile ? (
                            <button 
                                onClick={() => setShowEditModal?.(true)}
                                className="px-6 py-2 border border-primary text-primary rounded-xl font-medium hover:bg-primary/10 transition-colors"
                            >
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
                                {onSubmitRating && (
                                    <button
                                        onClick={() => setShowRatingModal(true)}
                                        className="px-6 py-2 border border-yellow-400 text-yellow-600 rounded-xl font-medium hover:bg-yellow-50 transition-colors flex items-center gap-2"
                                    >
                                        <Star size={16} className="fill-yellow-400 text-yellow-400" />
                                        Rate Seller
                                    </button>
                                )}
                            </>
                        )}
                    </div>

                    {/* Rating Modal */}
                    {showRatingModal && onSubmitRating && (
                        <RatingModal
                            targetUserId={user.id}
                            targetUserName={user.userName}
                            onSubmit={onSubmitRating}
                            onClose={() => setShowRatingModal(false)}
                        />
                    )}

                    {/* Edit Profile Modal */}
                    {showEditModal && onUpdateProfile && (
                        <EditProfileModal
                            user={user}
                            isOpen={showEditModal}
                            onClose={() => setShowEditModal?.(false)}
                            onUpdate={onUpdateProfile}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
