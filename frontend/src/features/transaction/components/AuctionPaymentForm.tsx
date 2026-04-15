import { CreditCard, Gavel, Loader2, Landmark, Coins } from 'lucide-react';

interface AuctionPaymentFormProps {
    auctionId: string;
    onAuctionIdChange: (id: string) => void;
    amount: string;
    onAmountChange: (amt: string) => void;
    method: string;
    onMethodChange: (method: string) => void;
    onSubmit: () => void;
    processing: boolean;
}

const PAYMENT_METHODS = ['Bank Transfer', 'Credit Card', 'Crypto', 'PayPal'];

export function AuctionPaymentForm({
    auctionId, onAuctionIdChange,
    amount, onAmountChange,
    method, onMethodChange,
    onSubmit,
    processing
}: AuctionPaymentFormProps) {
    return (
        <div className="bg-card rounded-2xl border p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-violet-600/10 text-violet-600"><Gavel size={20} /></div>
                <div>
                    <h2 className="font-bold text-lg">Make Auction Payment</h2>
                    <p className="text-xs text-muted-foreground">Pay for items you've won in auctions</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div>
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1.5 ml-1">Auction ID</label>
                    <input
                        type="text"
                        value={auctionId}
                        onChange={(e) => onAuctionIdChange(e.target.value)}
                        placeholder="e.g. 1023"
                        className="w-full px-4 py-2.5 rounded-xl border bg-muted/20 focus:ring-2 focus:ring-violet-600/20 outline-none transition-all font-semibold"
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1.5 ml-1">Amount</label>
                    <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">$</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => onAmountChange(e.target.value)}
                            placeholder="0.00"
                            className="w-full pl-7 pr-4 py-2.5 rounded-xl border bg-muted/20 focus:ring-2 focus:ring-violet-600/20 outline-none transition-all font-bold"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1.5 ml-1">Method</label>
                    <select
                        value={method}
                        onChange={(e) => onMethodChange(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border bg-muted/20 focus:ring-2 focus:ring-violet-600/20 outline-none transition-all font-semibold appearance-none"
                    >
                        {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
                <button
                    onClick={onSubmit}
                    disabled={processing || !auctionId || !amount}
                    className="w-full flex items-center justify-center gap-2 bg-violet-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-violet-700 transition-all disabled:opacity-50 h-[46px]"
                >
                    {processing ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
                    Pay Now
                </button>
            </div>
            
            <div className="mt-6 pt-6 border-t grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-muted/30">
                    <Landmark size={15} className="text-muted-foreground" />
                    <span className="text-[10px] font-medium text-muted-foreground">Secure Bank Level Encryption</span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-muted/30">
                    <Coins size={15} className="text-muted-foreground" />
                    <span className="text-[10px] font-medium text-muted-foreground">Automatic Refund Protection</span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-muted/30 text-center justify-center">
                    <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest">Verified Merchant</span>
                </div>
            </div>
        </div>
    );
}
