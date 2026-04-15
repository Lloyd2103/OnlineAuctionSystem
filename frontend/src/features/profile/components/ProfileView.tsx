import { useParams } from 'react-router';
import { useProfileLogic } from '../hooks/useProfileLogic';
import { ProfileHeader } from './ProfileHeader';
import { ProfileStats } from './ProfileStats';
import { ProfileAuctions } from './ProfileAuctions';

export function ProfileView() {
    const { id: urlId } = useParams<{ id: string }>();
    const {
        profileUser,
        isOwnProfile,
        userAuctions,
        image,
    } = useProfileLogic(urlId);

    return (
        <div className="p-6 bg-background min-h-screen max-w-7xl mx-auto space-y-8">
            <ProfileHeader 
                user={profileUser} 
                isOwnProfile={Boolean(isOwnProfile)} 
                image={image} 
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                    <ProfileStats 
                        user={profileUser} 
                        auctionCount={userAuctions.length} 
                    />
                </div>
                <div className="lg:col-span-8">
                    <ProfileAuctions 
                        auctions={userAuctions} 
                    />
                </div>
            </div>
        </div>
    );
}
