import { ItemManagement } from "@/features/item";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const ItemPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <div className="flex-1">
                <ItemManagement />
            </div>
            <Footer />
        </div>
    );
};

export default ItemPage;