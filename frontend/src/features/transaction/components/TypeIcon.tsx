import { ArrowUpRight, ArrowDownLeft, Gavel, RotateCcw, HelpCircle } from 'lucide-react';

export function TypeIcon({ type }: { type: string }) {
    switch (type) {
        case 'DEPOSIT': return <div className="p-2 bg-green-500/10 text-green-600 rounded-lg"><ArrowDownLeft size={16} /></div>;
        case 'WITHDRAWAL': return <div className="p-2 bg-red-500/10 text-red-600 rounded-lg"><ArrowUpRight size={16} /></div>;
        case 'AUCTION_PAYMENT': return <div className="p-2 bg-violet-500/10 text-violet-600 rounded-lg"><Gavel size={16} /></div>;
        case 'REFUND': return <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-lg"><RotateCcw size={16} /></div>;
        default: return <div className="p-2 bg-muted text-muted-foreground rounded-lg"><HelpCircle size={16} /></div>;
    }
}
