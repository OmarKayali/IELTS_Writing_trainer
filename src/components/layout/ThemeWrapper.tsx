"use client";

import { useTheme } from "@/lib/ThemeContext";
import clsx from "clsx";

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();

    return (
        <div className={clsx(
            "min-h-screen flex flex-col transition-colors duration-300",
            theme === 'dark' ? "bg-black text-white" : "bg-gray-50 text-slate-900"
        )}>
            {children}
        </div>
    );
}
