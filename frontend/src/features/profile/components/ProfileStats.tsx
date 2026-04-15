import { Star, Gavel, Package, User2 } from 'lucide-react';
import type { User } from '@/features/auth/types/user';

interface ProfileStatsProps {
    user: User | null;
    auctionCount: number;
}

export function ProfileStats({ user, auctionCount }: ProfileStatsProps) {
    return (
        <aside className="space-y-6">
            <div className="bg-card p-6 rounded-2xl border shadow-sm">
                <h2 className="font-bold text-lg mb-4">About</h2>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <User2 size={16} className="text-yellow-500" /> User Status
                    </span>
                    <span className="font-bold">
                        {user?.userStatus}
                    </span>
                </div>
                <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                            <Star size={16} className="text-yellow-500" /> Seller Rating
                        </span>
                        <span className="font-bold">
                            {user?.ratingScore || '0.0'}/5.0 ({user?.ratingCount || 0} reviews)
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                            <Gavel size={16} /> Total Auctions
                        </span>
                        <span className="font-bold">{auctionCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                            <Package size={16} /> Items Sold
                        </span>
                        <span className="font-bold">0</span> {/* Placeholder for now */}
                    </div>
                </div>
            </div>
        </aside>
    );
}
