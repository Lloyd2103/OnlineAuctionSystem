import { ItemManagement } from "@/components/form/ItemManagementForm";
import Header from "@/components/layout/topbar";
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