import { BrowserRouter, Route, Routes} from "react-router";
import { Toaster } from "sonner";
import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";
import HomePage from "@/pages/HomePage";
import LiveAuctionPage from "@/pages/LiveAuctionPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ProfilePage from "@/pages/ProfilePage";
import AuctionPage from "@/pages/AuctionPage";
import ItemPage from "@/pages/ItemPage";
import TransactionPage from "@/pages/TransactionPage";

function App() {
  return <>
    <Toaster richColors />
    <BrowserRouter>
        <Routes>
          {/* public routes */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/live-auction/:id" element={<LiveAuctionPage />} />

        {/* protected routes */}
        <Route element={<ProtectedRoute />} >
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/auction" element={<AuctionPage />} />
          <Route path="/item" element={<ItemPage />} />
          <Route path="/transaction" element={<TransactionPage />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  </>
}

export default App
