export function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        'Available': 'bg-green-500/10 text-green-600 border-green-500/20',
        'In Auction': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        'Pending': 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
        'Sold': 'bg-gray-500/10 text-gray-500 border-gray-400/20',
    };
    return (
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm ${map[status] ?? 'bg-muted text-muted-foreground border-border'}`}>
            {status}
        </span>
    );
}
