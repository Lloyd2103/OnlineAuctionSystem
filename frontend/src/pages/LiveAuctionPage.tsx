import Header from '@/components/layout/topbar'
import { Footer } from '@/components/layout/Footer'
import { LiveAuction } from '@/components/form/LiveAuctionForm'

const LiveAuctionPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1">
                <LiveAuction />
            </main>
            <Footer />
        </div>
    )
};

export default LiveAuctionPage;
