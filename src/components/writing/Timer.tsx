import { formatTime } from '@/lib/typingUtils';
import clsx from 'clsx';
import { Clock } from 'lucide-react';

interface TimerProps {
    secondsRemaining: number;
}

export default function Timer({ secondsRemaining }: TimerProps) {
    const isLowTime = secondsRemaining < 120; // Last 2 mins

    return (
        <div className={clsx(
            "flex flex-col items-center justify-center p-4 rounded-2xl w-full transition-colors duration-500",
            isLowTime ? "bg-rose-50 border border-rose-100" : "bg-indigo-50/50 border border-indigo-50"
        )}>
            <div className="flex items-center gap-2 mb-1">
                <Clock className={clsx("w-4 h-4", isLowTime ? "text-rose-500" : "text-indigo-400")} />
                <span className={clsx("text-xs font-bold uppercase tracking-widest", isLowTime ? "text-rose-500" : "text-indigo-400")}>
                    Time Remaining
                </span>
            </div>
            <div className={clsx(
                "text-4xl font-black font-mono tracking-tight tabular-nums",
                isLowTime ? "text-rose-600 animate-pulse" : "text-slate-700"
            )}>
                {/* Convert to ms for the utility function if it expects ms, or assuming I fix usage in parent to use proper formatter or fix utility */}
                {/* Previous step fixed formatTime to work with ms, but I passed s*1000. 
                    Let's stick to the contract: formatTime takes ms. 
                    So we pass secondsRemaining * 1000 here. 
                */}
                {formatTime(secondsRemaining * 1000)}
            </div>
        </div>
    );
}
