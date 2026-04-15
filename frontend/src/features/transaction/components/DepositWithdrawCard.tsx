import { CreditCard, ArrowDownToLine, ArrowUpFromLine, Loader2, Info } from 'lucide-react';

interface DepositWithdrawCardProps {
    balance: number;
    depositAmount: string;
    onDepositAmountChange: (amt: string) => void;
    withdrawAmount: string;
    onWithdrawAmountChange: (amt: string) => void;
    onDeposit: () => void;
    onWithdraw: () => void;
    processing: boolean;
}

export function DepositWithdrawCard({
    balance,
    depositAmount, onDepositAmountChange,
    withdrawAmount, onWithdrawAmountChange,
    onDeposit, onWithdraw,
    processing
}: DepositWithdrawCardProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Deposit */}
            <div className="bg-card rounded-2xl border p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-green-500/10 text-green-600"><ArrowDownToLine size={20} /></div>
                    <div>
                        <h2 className="font-bold text-lg">Deposit Funds</h2>
                        <p className="text-xs text-muted-foreground">Add money to your wallet</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Amount (USD)</label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-muted-foreground text-sm">$</span>
                            <input
                                type="number"
                                value={depositAmount}
                                onChange={(e) => onDepositAmountChange(e.target.value)}
                                placeholder="0.00"
                                className="w-full pl-7 pr-4 py-3 rounded-xl border bg-muted/20 focus:ring-2 focus:ring-green-500/20 outline-none transition-all font-bold text-lg"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {[10, 50, 100, 500].map(amt => (
                            <button
                                key={amt}
                                onClick={() => onDepositAmountChange(amt.toString())}
                                className="flex-1 py-1.5 rounded-lg border text-xs font-semibold hover:bg-muted transition-colors"
                            >+${amt}</button>
                        ))}
                    </div>
                    <button
                        onClick={onDeposit}
                        disabled={processing || !depositAmount}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all disabled:opacity-50"
                    >
                        {processing ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
                        Deposit Now
                    </button>
                    <div className="p-3 rounded-lg bg-blue-500/5 flex gap-2 border border-blue-500/10">
                        <Info size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
                        <p className="text-[10px] text-blue-600/80 leading-relaxed font-medium">Funds are typically cleared instantly. Some methods may take 1-3 business days.</p>
                    </div>
                </div>
            </div>

            {/* Withdraw */}
            <div className="bg-card rounded-2xl border p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-red-500/10 text-red-600"><ArrowUpFromLine size={20} /></div>
                    <div>
                        <h2 className="font-bold text-lg">Withdraw Funds</h2>
                        <p className="text-xs text-muted-foreground">Send money to your bank account</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Amount (USD)</label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-muted-foreground text-sm">$</span>
                            <input
                                type="number"
                                value={withdrawAmount}
                                onChange={(e) => onWithdrawAmountChange(e.target.value)}
                                placeholder="0.00"
                                className="w-full pl-7 pr-4 py-3 rounded-xl border bg-muted/20 focus:ring-2 focus:ring-red-500/20 outline-none transition-all font-bold text-lg"
                            />
                        </div>
                        <div className="flex justify-between mt-1.5">
                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Limit: Unrestricted</span>
                            <button
                                onClick={() => onWithdrawAmountChange(balance.toString())}
                                className="text-[10px] text-primary font-bold hover:underline"
                            >Withdraw MAX</button>
                        </div>
                    </div>
                    <button
                        onClick={onWithdraw}
                        disabled={processing || !withdrawAmount || parseFloat(withdrawAmount) > balance}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-all disabled:opacity-50"
                    >
                        {processing ? <Loader2 size={18} className="animate-spin" /> : <ArrowUpFromLine size={18} />}
                        Withdraw Now
                    </button>
                    <div className="p-3 rounded-lg bg-muted text-muted-foreground/80 flex gap-2 border">
                        <Info size={14} className="flex-shrink-0 mt-0.5" />
                        <p className="text-[10px] leading-relaxed font-medium">Withdrawals are processed within 24-48 hours. Withdrawal fee of 1.5% may apply.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
