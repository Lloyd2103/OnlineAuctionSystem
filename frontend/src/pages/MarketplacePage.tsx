import { Marketplace } from "@/features/marketplace/components/MarketplaceForm";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const MarketplacePage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <div className="flex-1">
                <Marketplace />
            </div>
            <Footer />
        </div>
    );
};

export default MarketplacePage;