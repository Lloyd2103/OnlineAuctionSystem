import { UserProfilePage } from "@/components/form/ProfileForm";
import Header from "@/components/layout/topbar";
import { Footer } from "@/components/layout/Footer";


const ProfilePage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <div className="flex-1">
                <UserProfilePage/>
            </div>
            <Footer />
        </div>
    );
};

export default ProfilePage;