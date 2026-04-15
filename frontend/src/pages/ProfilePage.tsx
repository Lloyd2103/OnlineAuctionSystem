import { ProfileView } from "@/features/profile";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";


const ProfilePage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <div className="flex-1">
                <ProfileView />
            </div>
            <Footer />
        </div>
    );
};

export default ProfilePage;