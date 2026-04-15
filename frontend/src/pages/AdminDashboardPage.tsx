import { AdminDashboard } from "@/features/profile/components/AdminDashboard";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const AdminDashboardPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <div className="flex-1">
                <AdminDashboard />
            </div>
            <Footer />
        </div>
    );
};

export default AdminDashboardPage;