"use client";

import React from 'react';
import clsx from 'clsx';
import { useTheme } from '@/lib/ThemeContext';

interface KeyboardProps {
    pressedKeys: Set<string>;
}

interface KeyDef {
    key: string;
    width: number;
    label?: string;
    shift?: string;
    side?: 'left' | 'right';
}

// Windows QWERTY keyboard layout - all rows sum to 15 units for rectangular shape
const KEYBOARD_LAYOUT: KeyDef[][] = [
    // Row 1: Number row (total: 15)
    [
        { key: '`', shift: '~', width: 1 },
        { key: '1', shift: '!', width: 1 },
        { key: '2', shift: '@', width: 1 },
        { key: '3', shift: '#', width: 1 },
        { key: '4', shift: '$', width: 1 },
        { key: '5', shift: '%', width: 1 },
        { key: '6', shift: '^', width: 1 },
        { key: '7', shift: '&', width: 1 },
        { key: '8', shift: '*', width: 1 },
        { key: '9', shift: '(', width: 1 },
        { key: '0', shift: ')', width: 1 },
        { key: '-', shift: '_', width: 1 },
        { key: '=', shift: '+', width: 1 },
        { key: 'Backspace', label: 'Backspace', width: 2 },
    ],
    // Row 2: QWERTY row (total: 15)
    [
        { key: 'Tab', label: 'Tab', width: 1.5 },
        { key: 'q', width: 1 },
        { key: 'w', width: 1 },
        { key: 'e', width: 1 },
        { key: 'r', width: 1 },
        { key: 't', width: 1 },
        { key: 'y', width: 1 },
        { key: 'u', width: 1 },
        { key: 'i', width: 1 },
        { key: 'o', width: 1 },
        { key: 'p', width: 1 },
        { key: '[', shift: '{', width: 1 },
        { key: ']', shift: '}', width: 1 },
        { key: '\\', shift: '|', width: 1.5 },
    ],
    // Row 3: ASDF row (total: 15)
    [
        { key: 'CapsLock', label: 'Caps', width: 1.75 },
        { key: 'a', width: 1 },
        { key: 's', width: 1 },
        { key: 'd', width: 1 },
        { key: 'f', width: 1 },
        { key: 'g', width: 1 },
        { key: 'h', width: 1 },
        { key: 'j', width: 1 },
        { key: 'k', width: 1 },
        { key: 'l', width: 1 },
        { key: ';', shift: ':', width: 1 },
        { key: "'", shift: '"', width: 1 },
        { key: 'Enter', label: 'Enter', width: 2.25 },
    ],
    // Row 4: ZXCV row (total: 15)
    [
        { key: 'Shift', label: 'Shift', width: 2.25, side: 'left' },
        { key: 'z', width: 1 },
        { key: 'x', width: 1 },
        { key: 'c', width: 1 },
        { key: 'v', width: 1 },
        { key: 'b', width: 1 },
        { key: 'n', width: 1 },
        { key: 'm', width: 1 },
        { key: ',', shift: '<', width: 1 },
        { key: '.', shift: '>', width: 1 },
        { key: '/', shift: '?', width: 1 },
        { key: 'Shift', label: 'Shift', width: 2.75, side: 'right' },
    ],
    // Row 5: Bottom row (Standard 60% Layout - Total 15)
    [
        { key: 'Control', label: 'Ctrl', width: 1.25, side: 'left' },
        { key: 'Meta', label: 'Win', width: 1.25 },
        { key: 'Alt', label: 'Alt', width: 1.25, side: 'left' },
        { key: ' ', label: '', width: 6.25 }, // Spacebar
        { key: 'Alt', label: 'Alt', width: 1.25, side: 'right' },
        { key: 'Meta', label: 'Win', width: 1.25, side: 'right' },
        { key: 'ContextMenu', label: 'Menu', width: 1.25 },
        { key: 'Control', label: 'Ctrl', width: 1.25, side: 'right' },
    ],
];

const Keyboard = React.memo<KeyboardProps>(function Keyboard({ pressedKeys }: KeyboardProps) {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const isKeyPressed = (keyDef: KeyDef) => {
        const keyLower = keyDef.key.toLowerCase();

        for (const pressed of pressedKeys) {
            const pressedLower = pressed.toLowerCase();
            if (pressedLower === keyLower) return true;
            if (keyDef.key.length === 1 && pressedLower === keyDef.key.toLowerCase()) return true;
        }
        return false;
    };

    return (
        <div className="w-full flex flex-col items-center gap-[3px] select-none">
            {KEYBOARD_LAYOUT.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-[3px] w-full justify-center">
                    {row.map((keyDef, keyIndex) => {
                        const isPressed = isKeyPressed(keyDef);
                        const displayLabel = keyDef.label !== undefined ? keyDef.label : keyDef.key.toUpperCase();
                        const isLetter = keyDef.key.length === 1 && /[a-z]/i.test(keyDef.key);
                        // Calculate percentage width based on 15 total units
                        const widthPercent = (keyDef.width / 15) * 100;

                        return (
                            <div
                                key={`${keyDef.key}-${keyDef.side || keyIndex}`}
                                className={clsx(
                                    "flex flex-col items-center justify-center rounded-md border text-xs font-medium transition-all duration-75",
                                    "h-14",
                                    isPressed
                                        ? (isDarkMode ? "bg-slate-600 text-white border-slate-500 shadow-inner scale-[0.97]" : "bg-slate-700 text-white border-slate-800 shadow-inner scale-[0.97]")
                                        : (isDarkMode ? "bg-slate-800 text-slate-200 border-slate-700 shadow-sm" : "bg-white text-slate-600 border-slate-300 shadow-sm")
                                )}
                                style={{ width: `calc(${widthPercent}% - 3px)` }}
                            >
                                {keyDef.shift && (
                                    <span className={clsx(
                                        "text-[9px] -mb-0.5",
                                        isPressed ? "text-slate-300" : "text-slate-400"
                                    )}>{keyDef.shift}</span>
                                )}
                                <span className={clsx(
                                    isLetter ? "text-sm font-semibold" : "text-[10px]",
                                    isPressed && "text-white"
                                )}>
                                    {displayLabel}
                                </span>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
});

export default Keyboard;
