import { AuctionManagement } from "@/components/form/AuctionManagementForm";
import Header from "@/components/layout/topbar";
import { Footer } from "@/components/layout/Footer";

const AuctionPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <div className="flex-1">
                <AuctionManagement />
            </div>
            <Footer />
        </div>
    );
};

export default AuctionPage;