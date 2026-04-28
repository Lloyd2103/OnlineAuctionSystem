import { useParams, useNavigate } from 'react-router';
import { Heart, ShoppingCart, TrendingUp, User, Shield, Wallet, AlertCircle, Loader2, Package, MapPin } from 'lucide-react';
import { formatCurrency } from '@/libs/utils';
import { useLiveAuctionLogic } from '../hooks/useLiveAuctionLogic';
import { CountdownDisplay } from './CountdownDisplay';
import { BidItem } from './BidItem';

export function LiveAuction() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {
        auction,
        loading,
        user,
        isAuthenticated,
        bids,
        bidAmount,
        setBidAmount,
        hasDeposit,
        currentPrice,
        bidIncrement,
        isHighestBidder,
        itemImage,
        category,
        sellerName,
        handlePlaceBid,
        handleDeposit,
        handleBuyNow
    } = useLiveAuctionLogic(id);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest">Đang tải thông tin cuộc đấu giá...</p>
            </div>
        );
    }

    if (!auction) return null;

    const getAttributes = (attributes: string | undefined) => {
        if (!attributes) return null;
        try {
            return typeof attributes === 'string'
                ? JSON.parse(attributes)
                : attributes;
        } catch (e) {
            console.error("Failed to parse attributes", e);
            return null;
        }
    };
    const attributes = getAttributes(auction.item?.attributes);

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
                                    Người bán: <span
                                        className="font-semibold text-gray-700 cursor-pointer hover:text-primary transition-colors"
                                        onClick={() => navigate(`/profile/${auction.ownerId}`)}
                                    >
                                        {sellerName}
                                    </span>
                                </p>
                            </div>
                            <button className="p-4 rounded-2xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border border-gray-100 group">
                                <Heart className="w-6 h-6 group-hover:fill-current" />
                            </button>
                        </div>

                        <div className="border-t border-gray-100 pt-8 mt-4">
                            <h2 className="text-xl font-bold mb-4 text-gray-900 border-l-4 border-primary pl-4">Mô tả sản phẩm</h2>
                            <p className="text-gray-600 leading-relaxed mb-8 text-lg">{auction.item?.itemDescription}</p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">Danh mục</div>
                                    <div className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        {category}
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">Tình trạng</div>
                                    <div className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                                        <Package className="w-4 h-4 text-primary" />
                                        {auction.item?.itemStatus || 'Mới'}
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">Lượt đấu giá</div>
                                    <div className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                                        <TrendingUp className="w-4 h-4 text-primary" />
                                        {bids.length}
                                    </div>
                                </div>
                                <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                                    <div className="text-xs text-yellow-700 mb-1 uppercase tracking-wider font-bold">Tiền cọc</div>
                                    <div className="font-extrabold text-yellow-900 flex items-center gap-2 text-sm">
                                        <Shield className="w-4 h-4 text-yellow-600" />
                                        {formatCurrency(auction.mandatoryDeposit || 500)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 p-6 bg-white rounded-2xl border border-gray-200">
                            <h3 className="text-lg font-bold mb-6">Thông số chi tiết</h3>
                            <table className="w-full text-left border-collapse">
                                <tbody>
                                {Object.entries(attributes).map(([key, value], index) => (
                                    <tr key={key} className={index % 2 === 0 ? 'bg-gray-50/50' : ''}>
                                    <td className="py-3 px-4 text-xs font-bold text-gray-500 uppercase w-1/3">{key}</td>
                                    <td className="py-3 px-4 text-sm font-semibold text-gray-800">{String(value)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
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
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent animate-pulse"></div>
                        </div>

                        {/* Bid Form or Deposit Required */}
                        <div className="space-y-6 relative">
                            {/* TRƯỜNG HỢP 1: PHIÊN ĐẤU GIÁ ĐÃ KẾT THÚC */}
                            {(auction.auctionStatus === 'ENDED' || auction.auctionStatus === 'FINISHED') && (
                                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
                                    <h3 className="font-bold text-gray-900 mb-2">Phiên đấu giá đã kết thúc</h3>
                                    
                                    {isHighestBidder && user ? (
                                        <>
                                            <p className="text-green-600 font-bold mb-4">Chúc mừng! Bạn là người thắng cuộc!</p>
                                            <button
                                                onClick={() => navigate(`/transaction?tab=payments&auctionId=${id}&amount=${currentPrice}`)}
                                                className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
                                            >
                                                <Wallet className="w-5 h-5" />
                                                Thanh toán ngay
                                            </button>
                                        </>
                                    ) : (
                                        <p className="text-gray-500 text-sm">Cảm ơn bạn đã quan tâm đến phiên đấu giá này.</p>
                                    )}
                                </div>
                            )}

                            {/* TRƯỜNG HỢP 2: ĐANG DIỄN RA NHƯNG CHƯA ĐẶT CỌC */}
                            {auction.auctionStatus === 'ACTIVE' && !hasDeposit && (
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
                            )}

                        {/* TRƯỜNG HỢP 3: ĐANG DIỄN RA VÀ ĐÃ ĐẶT CỌC (HIỆN FORM ĐẶT GIÁ) */}
                        {auction.auctionStatus === 'ACTIVE' && hasDeposit && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                        Đặt giá của bạn
                                    </label>
                                    <span className="text-xs text-primary font-bold">
                                        Bước giá tối thiểu: +{formatCurrency(bidIncrement)}
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
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    {[1, 2, 5].map((multiplier) => (
                                        <button
                                            key={multiplier}
                                            onClick={() => setBidAmount(currentPrice + (bidIncrement * multiplier))}
                                            className="py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl border border-gray-200 transition-all text-xs active:scale-95"
                                        >
                                            +{multiplier}x Bước giá
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={handlePlaceBid}
                                    disabled={!isAuthenticated}
                                    className="w-full py-5 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition shadow-xl shadow-primary/20 flex items-center justify-center gap-3 text-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {!isAuthenticated ? 'Vui lòng đăng nhập' : 'ĐẶT GIÁ NGAY'}
                                </button>
                            </div>
                        )}

                            {/* Buy Now & Wallet */}
                            <div className="pt-6 border-t border-gray-100 space-y-4">
                                {/* Chỉ hiện nút Mua Ngay nếu đấu giá đang diễn ra (ACTIVE) và có giá mua ngay */}
                                {auction.auctionStatus === 'ACTIVE' && auction.instantBuyPrice > 0 && (
                                    <button
                                        onClick={handleBuyNow}
                                        className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-green-100"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        MUA NGAY - {formatCurrency(auction.instantBuyPrice)}
                                    </button>
                                )}

                                {/* Nếu đã kết thúc, hiện thông báo thay vì hiện cái nút bị disabled */}
                                {(auction.auctionStatus === 'FINISHED' || auction.auctionStatus === 'ENDED') && (
                                    <div className="w-full py-4 bg-gray-100 text-gray-500 font-medium rounded-xl flex items-center justify-center gap-2">
                                        <span className="text-sm">Phiên đấu giá đã kết thúc</span>
                                    </div>
                                )}

                                {/* Phần hiển thị ví tiền */}
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
                                    bids.map((bid) => (
                                        <BidItem
                                            key={bid.id}
                                            bid={bid}
                                            isCurrentUser={Boolean(user && String(bid.bidderId) === String(user.id))}
                                        />
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
