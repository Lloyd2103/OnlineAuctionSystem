import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useAuthStore } from '@/stores/authStore';
import { useAuctionStore } from '@/stores/auctionStore';
import { useCountdown } from '@/hooks/useCountdown';
import { formatCurrency } from '@/lib/utils';
import { Heart, ShoppingCart, TrendingUp, User, Shield, Wallet, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Bid } from '@/types/bid';

// Reusable Countdown Display for the form
function CountdownDisplay({ endTime }: { endTime: Date | string }) {
    const timeLeft = useCountdown(endTime);

    if (timeLeft.isEnded) {
        return (
            <div className="text-center py-2 bg-red-50 text-red-600 rounded-lg flex items-center justify-center gap-2 font-bold">
                <Clock className="w-5 h-5" />
                ĐÃ KẾT THÚC
            </div>
        );
    }

    return (
        <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-2 border border-blue-100">
                <div className="text-2xl font-bold text-blue-700">{timeLeft.days}</div>
                <div className="text-[10px] uppercase text-blue-500 font-semibold">Ngày</div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-2 border border-blue-100">
                <div className="text-2xl font-bold text-blue-700">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-[10px] uppercase text-blue-500 font-semibold">Giờ</div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-2 border border-blue-100">
                <div className="text-2xl font-bold text-blue-700">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-[10px] uppercase text-blue-500 font-semibold">Phút</div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-2 border border-blue-100">
                <div className="text-2xl font-bold text-red-600 animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-[10px] uppercase text-red-500 font-semibold">Giây</div>
            </div>
        </div>
    );
}

export function LiveAuction() {
    const { id } = useParams();
    const { user, isAuthenticated } = useAuthStore();
    const { currentAuction: auction, fetchAuctionById, loading } = useAuctionStore();

    const [bids, setBids] = useState<Bid[]>([]);
    const [bidAmount, setBidAmount] = useState(0);
    const [hasDeposit, setHasDeposit] = useState(false);
    const [currentPrice, setCurrentPrice] = useState(0);

    useEffect(() => {
        if (id) {
            fetchAuctionById(id);
        }
    }, [id, fetchAuctionById]);

    console.log(auction);

    useEffect(() => {
        if (auction) {
            const initialPrice = Number(auction.currentPrice || auction.startingPrice || 0);
            setCurrentPrice(initialPrice);
            
            // If the auction has bids from the backend, use them
            if (auction.bids) {
                const sortedBids = [...auction.bids].sort((a: any, b: any) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setBids(sortedBids);
                if (sortedBids.length > 0) {
                    setCurrentPrice(Number(sortedBids[0].bidAmount));
                }
            }
        }
    }, [auction]);

    const bidIncrement = auction ? Number(auction.incrementPrice) : 100;

    useEffect(() => {
        if (currentPrice > 0) {
            setBidAmount(currentPrice + bidIncrement);
        }
    }, [currentPrice, bidIncrement]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest">Đang tải thông tin cuộc đấu giá...</p>
            </div>
        );
    }

    // if (!auction && !loading) {
    //     return <Navigate to="/marketplace" />;
    // }

    if (!auction) return null;

    const handlePlaceBid = () => {
        if (!isAuthenticated) {
            toast.error('Vui lòng đăng nhập để đấu giá');
            return;
        }

        if (!hasDeposit) {
            toast.error('Bạn cần đặt cọc trước khi đấu giá!');
            return;
        }

        if (user && user.walletBalance < bidAmount) {
            toast.error('Số dư ví không đủ! Vui lòng nạp thêm tiền.');
            return;
        }

        if (bidAmount < currentPrice + bidIncrement) {
            toast.error(`Giá đấu tối thiểu là ${formatCurrency(currentPrice + bidIncrement)}`);
            return;
        }

        // Normally we would call a bid service here
        toast.info('Tính năng đang được xử lý bởi backend...');
        
        // Optimistic update for testing UX
        const newBid = {
            id: `bid-${Date.now()}`,
            bidderId: user!.id.toString(),
            bidderName: user!.userName || 'Bản thân',
            bidAmount: bidAmount,
            isWinningBid: true,
            createdAt: new Date(),
        };

        setBids((prev) => [newBid, ...prev.map(b => ({ ...b, isWinningBid: false }))]);
        setCurrentPrice(bidAmount);
        toast.success('Đấu giá thành công! 🎉');
    };

    const handleDeposit = () => {
        if (!isAuthenticated) {
            toast.error('Vui lòng đăng nhập để đặt cọc');
            return;
        }

        const depositRequired = auction.mandatoryDeposit || 500;
        if (user && user.walletBalance < depositRequired) {
            toast.error(`Số dư ví không đủ! Cần ${formatCurrency(depositRequired)} để đặt cọc.`);
            return;
        }

        setHasDeposit(true);
        toast.success(`Đã đặt cọc ${formatCurrency(depositRequired)} thành công!`);
    };

    const handleBuyNow = () => {
        if (!isAuthenticated) {
            toast.error('Vui lòng đăng nhập để mua ngay');
            return;
        }

        if (!hasDeposit) {
            toast.error('Bạn cần đặt cọc trước khi mua!');
            return;
        }

        const buyNowPrice = auction.instantBuyPrice;
        if (user && user.walletBalance < (buyNowPrice || 0)) {
            toast.error('Số dư ví không đủ!');
            return;
        }

        toast.success(`Chúc mừng! Bạn đã mua ${auction.title} với giá ${formatCurrency(buyNowPrice!)}`);
    };

    const isHighestBidder = user && bids[0]?.bidderId === user.id.toString();
    const itemImage = auction.item?.itemImage || auction.item?.itemImage;
    const category = auction.item?.category || auction.item?.category || 'Khác';

    const sellerName = auction.ownerId || 'N/A';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50/50 min-h-screen">
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Images & Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Main Image */}
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 group">
                        <div className="aspect-[16/10] bg-gray-100 relative">
                            <img
                                src={itemImage}
                                alt={auction.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                                    <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                                    LIVE
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Item Details */}
                    <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex-1">
                                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                                    {category}
                                </span>
                                <h1 className="text-4xl font-extrabold text-gray-900 mb-2 leading-tight">{auction.title}</h1>
                                <p className="text-gray-500 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Người bán: <span className="font-semibold text-gray-700">{sellerName}</span>
                                </p>
                            </div>
                            <button
                                className="p-4 rounded-2xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border border-gray-100 group"
                            >
                                <Heart className="w-6 h-6 group-hover:fill-current" />
                            </button>
                        </div>

                        <div className="border-t border-gray-100 pt-8 mt-4">
                            <h2 className="text-xl font-bold mb-4 text-gray-900 border-l-4 border-primary pl-4">Mô tả sản phẩm</h2>
                            <p className="text-gray-600 leading-relaxed mb-8 text-lg">{auction.description}</p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                {/* <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">Tình trạng</div>
                                    <div className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                                        <Package className="w-4 h-4 text-primary" />
                                        {condition}
                                    </div>
                                </div> */}
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">Lượt đấu</div>
                                    <div className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                                        <TrendingUp className="w-4 h-4 text-primary" />
                                        {bids.length}
                                    </div>
                                </div>
                                <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100 md:col-span-2">
                                    <div className="text-xs text-yellow-700 mb-1 uppercase tracking-wider font-bold">Tiền cọc yêu cầu</div>
                                    <div className="font-extrabold text-yellow-900 flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-yellow-600" />
                                        {formatCurrency(auction.mandatoryDeposit || 500)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Bidding */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-24 border border-blue-50 space-y-8 overflow-hidden">
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-purple-50 rounded-full blur-3xl opacity-50"></div>

                        {/* Countdown */}
                        <div className="relative">
                            <div className="text-center mb-4">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Thời gian còn lại</span>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                                <CountdownDisplay endTime={auction.endTime} />
                            </div>
                        </div>

                        {/* Current Price */}
                        <div className="text-center py-6 bg-gray-900 rounded-2xl relative overflow-hidden shadow-2xl">
                            <div className="relative z-10">
                                <div className="text-sm text-gray-400 mb-2 uppercase tracking-widest font-bold">Giá hiện tại</div>
                                <div className="text-5xl font-black text-white mb-2 tabular-nums tracking-tight">
                                    {formatCurrency(currentPrice)}
                                </div>
                                {isHighestBidder && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold border border-green-500/30">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        BẠN ĐANG DẪN ĐẦU
                                    </div>
                                )}
                            </div>
                            {/* Animated Background Pulse */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent animate-pulse"></div>
                        </div>

                        {/* Bid Form or Deposit Required */}
                        <div className="space-y-6 relative">
                            {!hasDeposit ? (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="p-2 bg-yellow-100 rounded-xl">
                                            <AlertCircle className="w-6 h-6 text-yellow-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-yellow-900 mb-1">Yêu cầu đặt cọc</h3>
                                            <p className="text-sm text-yellow-700">
                                                Bạn cần đặt cọc để tham gia. Tiền cọc sẽ được hoàn trả nếu bạn không thắng.
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleDeposit}
                                        className="w-full py-4 bg-yellow-600 text-white font-bold rounded-xl hover:bg-yellow-700 transition shadow-lg shadow-yellow-200 flex items-center justify-center gap-2 active:scale-[0.98]"
                                    >
                                        <Shield className="w-5 h-5" />
                                        Đặt cọc ngay
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                            Đặt giá của bạn
                                        </label>
                                        <span className="text-xs text-primary font-bold">
                                            Bước giá: +{formatCurrency(bidIncrement)}
                                        </span>
                                    </div>
                                    <div className="relative group">
                                        <input
                                            type="number"
                                            value={bidAmount}
                                            onChange={(e) => setBidAmount(parseInt(e.target.value))}
                                            min={currentPrice + bidIncrement}
                                            step={bidIncrement}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-2xl font-black text-gray-900"
                                        />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xl uppercase">₫</div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        {[1, 2, 5].map((multiplier) => (
                                            <button
                                                key={multiplier}
                                                onClick={() => setBidAmount(currentPrice + (bidIncrement * multiplier))}
                                                className="py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl border border-gray-200 transition-all text-xs active:scale-95"
                                            >
                                                +{multiplier}x
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={handlePlaceBid}
                                        disabled={!isAuthenticated}
                                        className="w-full py-5 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition shadow-xl shadow-primary/20 flex items-center justify-center gap-3 text-lg active:scale-[0.98]"
                                    >
                                        {!isAuthenticated ? 'Đăng nhập để đấu giá' : 'ĐẶT GIÁ NGAY'}
                                    </button>
                                </div>
                            )}

                            {/* Buy Now & Wallet */}
                            <div className="pt-6 border-t border-gray-100 space-y-4">
                                {auction.instantBuyPrice ? (
                                    <button
                                        onClick={handleBuyNow}
                                        className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-green-100"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        MUA NGAY - {formatCurrency(auction.instantBuyPrice)}
                                    </button>
                                ) : null}

                                {isAuthenticated && user && (
                                    <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                                        <div className="flex items-center gap-3 text-blue-900">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <Wallet className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <span className="text-sm font-bold uppercase tracking-tight">Số dư ví</span>
                                        </div>
                                        <span className="font-black text-blue-700 text-lg tabular-nums">
                                            {formatCurrency(user.walletBalance || 0)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bid History */}
                        <div className="pt-8 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-primary" />
                                    Lịch sử đấu giá
                                </h3>
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full font-bold text-gray-500">
                                    {bids.length} lượt
                                </span>
                            </div>
                            <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                {bids.length > 0 ? (
                                    bids.map((bid: Bid) => (
                                        <div
                                            key={bid.id}
                                            className={`p-4 rounded-2xl flex justify-between items-center transition-all ${user && bid.bidderId === user.id.toString()
                                                    ? 'bg-blue-50 border border-blue-200'
                                                    : bid.isWinningBid
                                                        ? 'bg-green-50 border border-green-200 scale-[1.02] shadow-sm'
                                                        : 'bg-gray-50 border border-transparent'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                                                    <User className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
                                                        {bid.bidderName}
                                                        {bid.isWinningBid && (
                                                            <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">
                                                                Dẫn đầu
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                                        {new Date(bid.createdAt).toLocaleTimeString('vi-VN')}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="font-black text-primary text-lg tabular-nums">
                                                {formatCurrency(Number(bid.bidAmount))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 flex flex-col items-center gap-3 text-gray-400">
                                        <TrendingUp className="w-12 h-12 opacity-10" />
                                        <p className="text-sm font-bold italic">Chưa có lượt đấu giá nào. Bắt đầu ngay!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
