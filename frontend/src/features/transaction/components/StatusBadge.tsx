export function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        'COMPLETED': 'bg-green-500/10 text-green-600 border-green-500/20',
        'PENDING': 'bg-yellow-500/10 text-yellow-600 border-yellow-400/20',
        'FAILED': 'bg-destructive/10 text-destructive border-destructive/20',
        'REFUNDED': 'bg-indigo-500/10 text-indigo-600 border-indigo-400/20',
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border inline-flex ${map[status] ?? 'bg-muted text-muted-foreground border-border'}`}>
            {status}
        </span>
    );
}
