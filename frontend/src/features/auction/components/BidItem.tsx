import { User } from 'lucide-react';
import { formatCurrency } from '@/libs/utils';
import type { Bid } from '@/features/bid';

interface BidItemProps {
    bid: Bid;
    isCurrentUser: boolean;
}

export function BidItem({ bid, isCurrentUser }: BidItemProps) {
    return (
        <div
            className={`p-4 rounded-2xl flex justify-between items-center transition-all ${isCurrentUser
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
                        {isCurrentUser ? (
                            <span className="text-primary">Bạn</span>
                        ) : (
                            <span>{bid.userName ? (bid.userName.length > 2 ? `${bid.userName.substring(0, 2)}***` : bid.userName) : 'Người dùng'}</span>
                        )}
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
    );
}
