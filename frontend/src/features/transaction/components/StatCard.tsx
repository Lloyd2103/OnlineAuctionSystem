export function StatCard({ label, value, icon, subValue, trend }: { 
    label: string, value: string, icon: React.ReactNode, subValue?: string, trend?: 'up' | 'down' 
}) {
    return (
        <div className="bg-card p-5 rounded-2xl border shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">{icon}</div>
                {trend && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${trend === 'up' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                        {trend === 'up' ? '+12%' : '-3%'}
                    </span>
                )}
            </div>
            <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-bold mt-1">{value}</p>
                {subValue && <p className="text-[10px] text-muted-foreground mt-1">{subValue}</p>}
            </div>
        </div>
    );
}
