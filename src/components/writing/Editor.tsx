import { ChangeEvent } from 'react';
import { useTheme } from '@/lib/ThemeContext';
import clsx from 'clsx';

interface EditorProps {
    value: string;
    onChange: (val: string) => void;
    disabled?: boolean;
    taskType?: 'Task 1' | 'Task 2';
}

export default function Editor({ value, onChange, disabled, taskType = 'Task 2' }: EditorProps) {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const wordCount = value.trim().split(/\s+/).filter(w => w.length > 0).length;

    // Word Count Logic based on User Request
    const getWordCountStatus = () => {
        if (taskType === 'Task 1') {
            if (wordCount < 150) return { color: 'text-rose-500', text: 'Below Min (150)' };
            if (wordCount <= 190) return { color: 'text-emerald-600', text: 'Perfect Length' };
            return { color: 'text-amber-500', text: 'Long (Risk of irrelevance)' };
        } else {
            if (wordCount < 250) return { color: 'text-rose-500', text: 'Below Min (250)' };
            if (wordCount <= 290) return { color: 'text-emerald-600', text: 'Perfect Length' };
            return { color: 'text-amber-500', text: 'Long (Time warning)' };
        }
    };

    const status = getWordCountStatus();

    return (
        <div className={clsx(
            "relative w-full h-full flex flex-col transition-colors",
            isDarkMode ? "bg-slate-900" : "bg-white"
        )}>
            <textarea
                className={clsx(
                    "flex-grow w-full p-8 md:p-12 text-lg leading-relaxed font-serif resize-none focus:outline-none transition-colors",
                    isDarkMode ? "bg-slate-900 text-slate-200 placeholder:text-slate-700" : "bg-white text-slate-800 placeholder:text-slate-300"
                )}
                placeholder="Start writing your essay here..."
                value={value}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
                disabled={disabled}
                spellCheck={false}
            />
            <div className={clsx(
                "absolute bottom-6 right-8 px-4 py-2 backdrop-blur border rounded-full text-xs font-bold shadow-sm pointer-events-none transition-all",
                isDarkMode ? "bg-slate-800/80 border-slate-700" : "bg-white/80 border-slate-100",
                status.color
            )}>
                {wordCount} words • {status.text}
            </div>
        </div>
    );
}
