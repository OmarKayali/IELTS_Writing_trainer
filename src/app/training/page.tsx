"use client";

import { useState, useEffect } from 'react';
import TypingEngine from '@/components/training/TypingEngine';
import { TRAINING_TASKS, TrainingTask } from '@/lib/ieltsPrompts';
import { useTheme } from '@/lib/ThemeContext';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function TrainingPage() {
    const [selectedTask, setSelectedTask] = useState<TrainingTask | null>(null);
    const [isClient, setIsClient] = useState(false);
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    useEffect(() => {
        const timer = setTimeout(() => setIsClient(true), 0);
        return () => clearTimeout(timer);
    }, []);

    if (!isClient) return null;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                {selectedTask ? (
                    <button
                        onClick={() => setSelectedTask(null)}
                        className={clsx(
                            "inline-flex items-center transition-colors font-medium",
                            isDarkMode ? "text-slate-400 hover:text-indigo-400" : "text-slate-500 hover:text-indigo-600"
                        )}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Tasks
                    </button>
                ) : (
                    <Link
                        href="/"
                        className={clsx(
                            "inline-flex items-center transition-colors font-medium",
                            isDarkMode ? "text-slate-400 hover:text-indigo-400" : "text-slate-500 hover:text-indigo-600"
                        )}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                )}
            </div>

            {!selectedTask ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="text-center mb-12">
                        <h1 className={clsx(
                            "text-4xl font-bold mb-4 transition-colors",
                            isDarkMode ? "text-white" : "text-slate-900"
                        )}>Training Drills</h1>
                        <p className={clsx(
                            "max-w-2xl mx-auto transition-colors",
                            isDarkMode ? "text-slate-400" : "text-slate-600"
                        )}>
                            Internalize high-scoring sentence structures through repetition.
                            Choose a focus area to begin detailed copywork.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {TRAINING_TASKS.map((task, idx) => (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => setSelectedTask(task)}
                                className="glass-card p-6 rounded-2xl cursor-pointer group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-50 rounded-bl-full transition-colors group-hover:bg-indigo-100"></div>

                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <span className={clsx(
                                        "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                                        task.difficulty === 'Easy' ? "bg-emerald-100 text-emerald-700" :
                                            task.difficulty === 'Medium' ? "bg-amber-100 text-amber-700" :
                                                "bg-rose-100 text-rose-700"
                                    )}>
                                        {task.difficulty}
                                    </span>
                                    {task.category === 'Full Essay' ? <BookOpen className="w-5 h-5 text-indigo-400" /> : <Zap className="w-5 h-5 text-indigo-400" />}
                                </div>

                                <h3 className={clsx(
                                    "text-xl font-bold mb-2 group-hover:text-indigo-500 transition-colors",
                                    isDarkMode ? "text-white" : "text-black"
                                )}>
                                    {task.title}
                                </h3>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                                    {task.category}
                                </div>
                                <p className={clsx(
                                    "text-sm line-clamp-3 leading-relaxed transition-colors",
                                    isDarkMode ? "text-slate-300" : "text-slate-700"
                                )}>
                                    {task.sourceText}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="mb-6">
                        <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">
                            Current Drill
                        </span>
                        <h2 className={clsx(
                            "text-2xl font-bold transition-colors",
                            isDarkMode ? "text-white" : "text-slate-900"
                        )}>{selectedTask.title}</h2>
                    </div>
                    <TypingEngine
                        task={selectedTask}
                    />
                </motion.div>
            )}
        </div>
    );
}
