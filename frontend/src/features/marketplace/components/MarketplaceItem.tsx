import { Link } from 'react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { formatPrice, formatRelativeTime, truncateText } from '@/libs/utils';
import type { AuctionListItem } from '../types';

interface MarketplaceItemProps {
    auction: AuctionListItem;
    viewMode: 'grid' | 'list';
}

export function MarketplaceItem({ auction, viewMode }: MarketplaceItemProps) {
    if (viewMode === 'grid') {
        return (
            <Link to={`/auction/${auction.auctionId}`}>
                <Card className="overflow-hidden hover:shadow-lg transition cursor-pointer h-full">
                    <div className="relative">
                        <img
                            src={auction.itemImage || '/placeholder.png'}
                            alt={auction.itemName}
                            className="w-full h-48 object-cover"
                        />
                        <Badge className="absolute top-3 right-3 bg-red-500">
                            {auction.status}
                        </Badge>
                    </div>
                    <CardContent className="p-4 space-y-3">
                        <div>
                            <h3 className="font-semibold line-clamp-2">{auction.itemName}</h3>
                            <p className="text-sm text-gray-600">by {auction.sellerName}</p>
                        </div>
                        <div className="space-y-2">
                            <div>
                                <p className="text-xs text-gray-500">Current Bid</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {formatPrice(auction.currentHighestBid)}
                                </p>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                    {auction.bidCount} {auction.bidCount === 1 ? 'bid' : 'bids'}
                                </span>
                                <span className="font-semibold text-red-500 flex items-center gap-1">
                                    <Clock size={14} />
                                    {formatRelativeTime(new Date(auction.endTime))}
                                </span>
                            </div>
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            Place Bid
                        </Button>
                    </CardContent>
                </Card>
            </Link>
        );
    }

    return (
        <Link to={`/auction/${auction.auctionId}`}>
            <Card className="hover:shadow-lg transition cursor-pointer">
                <CardContent className="p-4 flex gap-4">
                    <img
                        src={auction.itemImage || '/placeholder.png'}
                        alt={auction.itemName}
                        className="w-24 h-24 rounded object-cover"
                    />
                    <div className="flex-1 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold">{truncateText(auction.itemName, 60)}</h3>
                            <p className="text-sm text-gray-600">by {auction.sellerName}</p>
                            <div className="flex gap-2 mt-2">
                                <Badge>{auction.status}</Badge>
                                <span className="text-xs text-gray-500">
                                    {auction.bidCount} bids
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Current Bid</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {formatPrice(auction.currentHighestBid)}
                            </p>
                            <p className="text-sm text-red-500 mt-2">
                                {formatRelativeTime(new Date(auction.endTime))}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
