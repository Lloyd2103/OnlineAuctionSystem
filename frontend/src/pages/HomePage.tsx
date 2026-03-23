// import { Header } from '@/components/layout/Header'
import Header from '@/components/layout/topbar'

import { Hero } from '@/components/layout/Hero'
import { FilterBar } from '@/components/module/FilterBar'
import { AuctionGrid } from '@/components/module/AuctionGrid'
import { TrendingSections } from '@/components/module/TrendingSections'
import { Footer } from '@/components/layout/Footer'



const MainPage = () => {
    
    return (
    <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
            <Hero />
            <FilterBar />
            <AuctionGrid />
            <TrendingSections />

        </main>
        <Footer />
        </div>
    )
};

export default MainPage;