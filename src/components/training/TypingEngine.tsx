"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { calculateWPM, calculateAccuracy } from '@/lib/typingUtils';
import { TrainingTask } from '@/lib/ieltsPrompts';
import clsx from 'clsx';
import { RefreshCcw, Home, Keyboard as KeyboardIcon } from 'lucide-react';
import Link from 'next/link';
import Keyboard from './Keyboard';
import { useTheme } from '@/lib/ThemeContext';

interface TypingEngineProps {
    task: TrainingTask;
    onComplete?: (stats: { wpm: number; accuracy: number; timeMs: number }) => void;
}

// Memoized Character Component to prevent re-rendering of entire text
interface CharacterProps {
    char: string;
    index: number;
    inputChar?: string;
    isCursor: boolean;
    wasMistake: boolean;
    isFocused: boolean;
}

const Character = React.memo(function Character({ char, index, inputChar, isCursor, wasMistake, isFocused }: CharacterProps) {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    let status = 'pending';
    if (inputChar !== undefined) {
        status = inputChar === char ? 'correct' : 'incorrect';
    }

    // Only cursor pulsing needs to animate, other states are static
    return (
        <span
            id={isCursor ? "active-cursor" : undefined}
            className={clsx(
                "relative rounded-sm transition-colors duration-200",
                // Correct & Never Mistaken -> Default Text
                status === 'correct' && !wasMistake && (isDarkMode ? "text-slate-200" : "text-slate-700"),

                // Correct & Was Mistaken -> Yellow (Correction)
                status === 'correct' && wasMistake && "bg-amber-100 text-amber-700",

                // Incorrect -> Red (Error)
                status === 'incorrect' && "bg-rose-100 text-rose-600",

                // Pending -> Gray
                status === 'pending' && (isDarkMode ? "text-slate-600" : "text-slate-300"),

                // Cursor
                isCursor && isFocused && "after:content-[''] after:absolute after:left-0 after:top-1 after:bottom-1 after:w-[2px] after:bg-blue-600 after:animate-pulse z-10"
            )}
        >
            {char}
        </span>
    );
});

export default function TypingEngine({ task, onComplete }: TypingEngineProps) {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const targetText = task.sourceText;

    // Memoize char array to prevent splitting on every render
    const charArray = useMemo(() => targetText.split(''), [targetText]);

    const [input, setInput] = useState('');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [endTime, setEndTime] = useState<number | null>(null);
    const [errorIndices, setErrorIndices] = useState<Set<number>>(new Set());
    const [isFocused, setIsFocused] = useState(false);
    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
    const [showKeyboard, setShowKeyboard] = useState(true);
    const [cursorPosition, setCursorPosition] = useState(0);

    // Hidden input to capture mobile/IME (standard web practice for typers)
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    // Focus management
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    // Keyboard press tracking
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            setPressedKeys(prev => {
                const newSet = new Set(prev);
                newSet.add(e.key);
                return newSet;
            });
            // Update cursor position on arrow keys (delayed to allow event to process)
            setTimeout(() => {
                if (inputRef.current) {
                    setCursorPosition(inputRef.current.selectionStart || 0);
                }
            }, 0);
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            setPressedKeys(prev => {
                const newSet = new Set(prev);
                newSet.delete(e.key);
                return newSet;
            });
            if (inputRef.current) {
                setCursorPosition(inputRef.current.selectionStart || 0);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Auto-scroll to cursor
    useEffect(() => {
        if (isFocused) {
            document.getElementById('active-cursor')?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }, [cursorPosition, isFocused]);

    // Reset
    const handleReset = useCallback(() => {
        setInput('');
        setCursorPosition(0);
        setStartTime(null);
        setEndTime(null);
        setErrorIndices(new Set());
        inputRef.current?.focus();
    }, []);

    // Input Handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (endTime) return; // Game over

        const val = e.target.value;

        // Prevent deleting correct characters ? Requirements said "Backspace is allowed and affects accuracy"
        // We allow standard editing but need to track errors.

        if (!startTime) {
            setStartTime(Date.now());
        }

        // Logic: compare val with targetText
        // If val length > targetText length, truncate? 
        // Usually copywork stops at length.
        if (val.length > targetText.length) return;

        // Check strict equality for new char
        const newIndex = val.length - 1;
        if (newIndex >= 0 && val.length > input.length) {
            // Adding a char
            if (val[newIndex] !== targetText[newIndex]) {
                // Error
                setErrorIndices(prev => {
                    const newSet = new Set(prev);
                    newSet.add(newIndex);
                    return newSet;
                });
            }
        }


        setInput(val);

        // Update cursor position
        if (e.target.selectionStart !== null) {
            setCursorPosition(e.target.selectionStart);
        }

        // Completion Check
        if (val.length === targetText.length) {
            const end = Date.now();
            setEndTime(end);
            if (onComplete && startTime) {
                onComplete({
                    wpm: calculateWPM(val.length, startTime, end),
                    accuracy: calculateAccuracy(val.length - errorIndices.size, val.length), // Approx
                    timeMs: end - startTime
                });
            }
        }
    };

    // Metrics
    const currentWPM = startTime ? calculateWPM(input.length, startTime) : 0;
    // Accuracy: (Correct Chars / Total Typed Chars) ? Or (Length - Errors) / Length?
    // Simple view: (Input Length - Error Count) / Input Length
    const currentAccuracy = calculateAccuracy(input.length - errorIndices.size, input.length);

    // Completion UI
    if (endTime) {
        return (
            <div className="max-w-2xl mx-auto mt-12 text-center">
                <div className={clsx(
                    "rounded-xl shadow-lg p-8 border transition-colors",
                    isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"
                )}>
                    <h2 className={clsx(
                        "text-3xl font-bold mb-6",
                        isDarkMode ? "text-white" : "text-gray-900"
                    )}>Task Complete!</h2>
                    <div className="grid grid-cols-3 gap-8 mb-8">
                        <div>
                            <div className="text-4xl font-bold text-blue-600">{currentWPM}</div>
                            <div className="text-sm text-gray-500 uppercase tracking-wide mt-1">WPM</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-green-600">{currentAccuracy}%</div>
                            <div className="text-sm text-gray-500 uppercase tracking-wide mt-1">Accuracy</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-purple-600">
                                {startTime && ((endTime - startTime) / 1000).toFixed(1)}s
                            </div>
                            <div className="text-sm text-gray-500 uppercase tracking-wide mt-1">Time</div>
                        </div>
                    </div>

                    {/* Review Section */}
                    <div className={clsx(
                        "mb-8 text-left p-6 rounded-xl border font-mono text-lg leading-relaxed max-h-64 overflow-y-auto transition-colors",
                        isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
                    )}>
                        <div className={clsx(
                            "text-xs font-bold uppercase tracking-widest mb-2 sticky top-0 pb-2 transition-colors",
                            isDarkMode ? "text-slate-500 bg-slate-800" : "text-slate-400 bg-slate-50"
                        )}>Review</div>
                        {targetText.split('').map((char, index) => {
                            const wasMistake = errorIndices.has(index);
                            return (
                                <span
                                    key={index}
                                    className={clsx(
                                        wasMistake ? "bg-amber-100 text-amber-700" : (isDarkMode ? "text-slate-200" : "text-slate-700")
                                    )}
                                >
                                    {char}
                                </span>
                            )
                        })}
                    </div>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={handleReset}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                        >
                            <RefreshCcw className="w-4 h-4 mr-2" />
                            Try Again
                        </button>
                        <Link
                            href="/"
                            className={clsx(
                                "px-6 py-2 rounded-lg flex items-center transition-colors",
                                isDarkMode ? "bg-slate-800 text-slate-200 hover:bg-slate-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            )}
                        >
                            <Home className="w-4 h-4 mr-2" />
                            Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Active Typing UI
    return (
        <div
            className="max-w-4xl mx-auto mt-8"
            onClick={() => inputRef.current?.focus()}
        >
            <div className="mb-4 flex justify-between items-center text-sm font-medium text-gray-500">
                <div>WPM: <span className="text-gray-900">{currentWPM}</span></div>
                <div className="w-full max-w-md mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${(input.length / targetText.length) * 100}%` }}
                    />
                </div>
                <div>Acc: <span className="text-gray-900">{currentAccuracy}%</span></div>
            </div>

            <div className={clsx(
                "relative font-mono text-xl leading-relaxed p-8 rounded-xl shadow-sm border transition-colors cursor-text h-96 resize-y overflow-y-auto",
                isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200",
                isFocused ? "border-blue-500 ring-4 ring-blue-50" : (isDarkMode ? "opacity-90" : "opacity-80")
            )}>
                {/* Hidden Input */}
                {/* Hidden Input changed to Textarea for multiline support */}
                <textarea
                    ref={inputRef as any}
                    value={input}
                    onChange={handleChange as any}
                    onClick={(e) => setCursorPosition(e.currentTarget.selectionStart)}
                    onSelect={(e) => setCursorPosition(e.currentTarget.selectionStart)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className="absolute inset-0 opacity-0 cursor-text resize-none w-full h-full"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                />

                {/* Text Rendering */}
                <div className="whitespace-pre-wrap break-words select-none">
                    {charArray.map((char, index) => (
                        <Character
                            key={index}
                            char={char}
                            index={index}
                            inputChar={input[index]}
                            isCursor={index === cursorPosition}
                            wasMistake={errorIndices.has(index)}
                            isFocused={isFocused}
                        />
                    ))}
                </div>

                {!isFocused && (
                    <div className={clsx(
                        "absolute inset-0 flex items-center justify-center backdrop-blur-[1px] transition-colors",
                        isDarkMode ? "bg-black/60" : "bg-white/50"
                    )}>
                        <div className={clsx(
                            "font-medium transition-colors",
                            isDarkMode ? "text-slate-400" : "text-gray-500"
                        )}>Click to resume typing</div>
                    </div>
                )}
            </div>

            <div className="mt-4 text-center text-gray-400 text-sm">
                Type the text exactly as shown above.
            </div>

            {/* Keyboard Toggle */}
            <div className="mt-6 flex justify-center">
                <button
                    onClick={() => setShowKeyboard(!showKeyboard)}
                    className={clsx(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm border",
                        showKeyboard
                            ? "bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200"
                            : (isDarkMode ? "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50")
                    )}
                >
                    <KeyboardIcon className="w-4 h-4" />
                    {showKeyboard ? 'Hide Keyboard' : 'Show Keyboard'}
                </button>
            </div>

            {/* Visual Keyboard */}
            {showKeyboard && (
                <div className="mt-4">
                    <Keyboard pressedKeys={pressedKeys} />
                </div>
            )}
        </div>
    );
}
