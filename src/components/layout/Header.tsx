"use client";

import Link from 'next/link';
import { PenTool, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import clsx from 'clsx';

export default function Header() {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className={clsx(
            "border-b transition-colors duration-300 shadow-sm",
            theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2 group">
                    <PenTool className={clsx(
                        "h-6 w-6 transition-colors",
                        theme === 'dark' ? "text-blue-400" : "text-blue-600"
                    )} />
                    <span className={clsx(
                        "font-semibold text-lg transition-colors",
                        theme === 'dark' ? "text-white" : "text-gray-900"
                    )}>IELTS Writing Trainer</span>
                </Link>
                <div className="flex items-center space-x-6">
                    {/* Nav section removed - Home link is redundant with logo */}

                    <button
                        onClick={toggleTheme}
                        className={clsx(
                            "p-2 rounded-lg transition-all border",
                            theme === 'dark'
                                ? "bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700"
                                : "bg-white text-indigo-500 border-gray-200 hover:bg-gray-50 shadow-sm"
                        )}
                        aria-label="Toggle Theme"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </header>
    );
}
