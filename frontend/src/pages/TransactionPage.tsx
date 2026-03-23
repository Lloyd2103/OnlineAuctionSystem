import { TransactionManagement } from "@/components/form/TransactionManagement";
import Header from "@/components/layout/topbar";
import { Footer } from "@/components/layout/Footer";

const TransactionPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <div className="flex-1">
                <TransactionManagement />
            </div>
            <Footer />
        </div>
    );
};

export default TransactionPage;
