import { useCountdown } from '@/hooks/useCountdown';
import { Clock } from 'lucide-react';

interface CountdownDisplayProps {
    endTime: Date | string;
}

export function CountdownDisplay({ endTime }: CountdownDisplayProps) {
    const timeLeft = useCountdown(endTime);

    if (timeLeft.isEnded) {
        return (
            <div className="text-center py-2 bg-red-50 text-red-600 rounded-lg flex items-center justify-center gap-2 font-bold">
                <Clock className="w-5 h-5" />
                ĐÃ KẾT THÚC
            </div>
        );
    }

    return (
        <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-2 border border-blue-100">
                <div className="text-2xl font-bold text-blue-700">{timeLeft.days}</div>
                <div className="text-[10px] uppercase text-blue-500 font-semibold">Ngày</div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-2 border border-blue-100">
                <div className="text-2xl font-bold text-blue-700">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-[10px] uppercase text-blue-500 font-semibold">Giờ</div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-2 border border-blue-100">
                <div className="text-2xl font-bold text-blue-700">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-[10px] uppercase text-blue-500 font-semibold">Phút</div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-2 border border-blue-100">
                <div className="text-2xl font-bold text-red-600 animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-[10px] uppercase text-red-500 font-semibold">Giây</div>
            </div>
        </div>
    );
}
