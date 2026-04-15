import { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '@/features/auth/stores/authStore'; // Store remains global for now as per user instruction "Nguyên tắc 80/20"
import { useAuctionStore } from '@/features/auction/stores/auctionStore';
import { useSocket } from '@/hooks/useSocket';
import { toast } from 'sonner';
import { auctionService } from '@/features/auction/api/auctionService';
import { transactionService } from '@/features/transaction/api/transactionService';
import { formatCurrency } from '@/lib/utils';
import type { Bid, Auction } from '@/features/auction/types';
import type { User } from '@/features/auth/types/user';

export interface UseLiveAuctionLogicReturn {
    auction: Auction | null;
    loading: boolean;
    user: User | null;
    isAuthenticated: boolean;
    bids: Bid[];
    bidAmount: number;
    setBidAmount: (amount: number) => void;
    hasDeposit: boolean;
    currentPrice: number;
    bidIncrement: number;
    isHighestBidder: boolean;
    itemImage: string;
    category: string;
    sellerName: string | number;
    handlePlaceBid: () => void;
    handleDeposit: () => Promise<void>;
    handleBuyNow: () => void;
}

export function useLiveAuctionLogic(id: string | undefined): UseLiveAuctionLogicReturn {
    const { user, isAuthenticated, fetchUser } = useAuthStore();
    const { currentAuction: auction, fetchAuctionById, loading } = useAuctionStore();
    const [hasDeposit, setHasDeposit] = useState(false);
    const { socket, placeBid } = useSocket(id, hasDeposit);
    const [bidAmount, setBidAmount] = useState(0);
    const [newBids, setNewBids] = useState<Bid[]>([]);

    const bids = useMemo(() => {
        const initialBids = auction?.bids?.map((bid: Bid) => ({
            ...bid,
            userName: bid.bidder?.userName
        })) || [];

        const combined = [...newBids, ...initialBids];

        return combined.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [auction?.bids, newBids]);

    useEffect(() => {
        const checkDepositStatus = async () => {
            if (isAuthenticated && id) {
                try {
                    const response = await auctionService.getDepositStatus(id);
                    setHasDeposit(!!response.status);
                } catch (error) {
                    console.error("Lỗi kiểm tra đặt cọc", error);
                }
            }
        };
        checkDepositStatus();
    }, [id, isAuthenticated]);

    useEffect(() => {
        if (!socket) return;
        socket.on('new_bid', (data) => {
            const bidderId = data.bidderId ? data.bidderId.toString() : (user?.id?.toString() ?? '');
            const userName = data.bidderName;
            const newBidEvent: Bid = {
                id: `bid-${Date.now()}`,
                auctionId: id!,
                bidderId,
                userName,
                bidAmount: Number(data.highestBid),
                isWinningBid: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            setNewBids(prev => [newBidEvent, ...prev.map(b => ({ ...b, isWinningBid: false }))]);
        });

        socket.on('auction_started', (data) => {
            toast.success(data.message);
            if (id) fetchAuctionById(Number(id));
        });

        socket.on('auction_ended', (data) => {
            if (data.winnerId === user?.id?.toString()) {
                toast.success('Congratulations! You won this auction!');
            } else {
                toast.info(data.message);
            }
            if (id) fetchAuctionById(Number(id));
        });

        socket.on('bid_success', (data) => {
            toast.success(data.message);
        });

        socket.on('bid_error', (data) => {
            toast.error(data.message);
        });

        return () => {
            socket.off('new_bid');
            socket.off('auction_started');
            socket.off('auction_ended');
            socket.off('bid_success');
            socket.off('bid_error');
        };
    }, [socket, id, fetchAuctionById, user?.id]);

    useEffect(() => {
        if (id) {
            fetchAuctionById(Number(id));
        }
    }, [id, fetchAuctionById]);

    const bidIncrement = auction ? Number(auction.incrementPrice) : 100;

    const currentPrice = useMemo(() => {
        if (!auction) return 0;
        const highestBid = auction.bids?.length 
            ? Math.max(...auction.bids.map(b => b.bidAmount))
            : auction.startingPrice;
        return Number(highestBid);
    }, [auction]);

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

        const optimisticBid: Bid = {
            id: `bid-${Date.now()}`,
            auctionId: id!,
            bidderId: user!.id.toString(),
            userName: user!.userName,
            bidAmount: bidAmount,
            isWinningBid: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        setNewBids(prev => [optimisticBid, ...prev.map(b => ({ ...b, isWinningBid: false }))]);
        setBidAmount(bidAmount + bidIncrement);
        placeBid(bidAmount);
    };

    const handleDeposit = async () => {
        if (!isAuthenticated) {
            toast.error('Vui lòng đăng nhập để đặt cọc');
            return;
        }

        const depositRequired = auction?.mandatoryDeposit || 500;

        try {
            await transactionService.payDeposit(Number(id));
            setHasDeposit(true);
            fetchUser();
            toast.success(`Đã đặt cọc ${formatCurrency(depositRequired)} thành công!`);
        } catch (error) {
            console.log(error);
            toast.error('Đặt cọc thất bại');
        }
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

        const buyNowPrice = auction?.instantBuyPrice;
        if (user && user.walletBalance < (buyNowPrice || 0)) {
            toast.error('Số dư ví không đủ!');
            return;
        }

        auctionService.buyNow(id!)
            .then(() => {
                toast.success(`Chúc mừng! Bạn đã mua ${auction?.title} với giá ${formatCurrency(buyNowPrice!)}`);
                fetchAuctionById(Number(id));
            })
            .catch((error) => {
                console.log(error);
                toast.error('Mua thất bại');
            });
    };

    const isHighestBidder = Boolean(user && bids[0]?.bidderId === user.id.toString());
    const itemImage = auction?.item?.itemImage || '';
    const category = auction?.item?.category || 'Khác';
    const sellerName = auction?.ownerId || 'N/A';

    return {
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
    };
}
