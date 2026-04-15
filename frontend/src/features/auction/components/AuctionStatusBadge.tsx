export function AuctionStatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        'Live': 'bg-green-500/10 text-green-600 border-green-500/20',
        'ACTIVE': 'bg-green-500/10 text-green-600 border-green-500/20',
        'Upcoming': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        'UPCOMING': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        'Ended': 'bg-gray-400/10 text-gray-500 border-gray-400/20',
        'ENDED': 'bg-gray-400/10 text-gray-500 border-gray-400/20',
        'All': 'bg-muted text-muted-foreground border-border',
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${map[status] ?? 'bg-muted text-muted-foreground border-border'}`}>
            {status}
        </span>
    );
}
