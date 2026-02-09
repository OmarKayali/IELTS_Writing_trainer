"use client";

import { useState, useCallback, useEffect } from 'react';
import { WritingTask } from '@/lib/ieltsPrompts';
import Timer from './Timer';
import Editor from './Editor';
import ResultCard from './ResultCard';
import { Play, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import Link from 'next/link';
import { formatTime } from '@/lib/typingUtils';
import { useTheme } from '@/lib/ThemeContext';
import { IELTSEvaluation } from '@/lib/ieltsTypes';

interface WritingSessionProps {
    tasks: WritingTask[];
}

export default function WritingSession({ tasks }: WritingSessionProps) {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const [stage, setStage] = useState<'select' | 'writing' | 'analyzing' | 'result'>('select');
    const [selectedTask, setSelectedTask] = useState<WritingTask | null>(null);
    const [content, setContent] = useState('');
    const [result, setResult] = useState<IELTSEvaluation | null>(null);
    const [error, setError] = useState('');
    const [secondsLeft, setSecondsLeft] = useState(0);

    // Start Exam
    const handleStart = (task: WritingTask) => {
        setSelectedTask(task);
        setStage('writing');
        setContent('');
        setError('');
        setSecondsLeft(task.type === 'Task 1' ? 1200 : 2400);
    };

    // Back button handler
    const handleBack = () => {
        if (stage === 'result') {
            setStage('writing');
        } else if (stage === 'writing') {
            setStage('select');
            setSelectedTask(null);
            setContent('');
            setSecondsLeft(0);
        }
    };

    // Timer Interval Logic
    useEffect(() => {
        if (stage !== 'writing') return;

        const interval = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 0) return 0;
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [stage]);

    // Submit Logic
    const handleSubmit = useCallback(async () => {
        if (!content.trim()) return;

        setStage('analyzing');

        try {
            const response = await fetch('/api/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: selectedTask?.prompt,
                    taskType: selectedTask?.type,
                    dataOutline: selectedTask?.dataOutline,
                    essay: content
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Server Error: ${response.status}`);
            }

            const evaluationData = await response.json();
            setResult(evaluationData);
            setStage('result');
        } catch (err) {
            console.error(err);
            const msg = err instanceof Error ? err.message : 'Unknown error';
            setError(`Error: ${msg}`);
            setStage('writing'); // Go back to let them retry
        }
    }, [content, selectedTask]);

    // Calculate Time Taken
    const getTotalSeconds = () => selectedTask?.type === 'Task 1' ? 1200 : 2400;
    const timeTakenSeconds = selectedTask ? getTotalSeconds() - secondsLeft : 0;
    const timeTakenFormatted = formatTime(timeTakenSeconds * 1000);

    // Header Logic
    const renderHeader = () => (
        <div className="mb-6">
            {stage === 'select' ? (
                <Link
                    href="/"
                    className={clsx(
                        "inline-flex items-center transition-colors",
                        isDarkMode ? "text-slate-400 hover:text-indigo-400" : "text-gray-500 hover:text-gray-900"
                    )}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>
            ) : (
                <button
                    onClick={handleBack}
                    className={clsx(
                        "inline-flex items-center transition-colors",
                        isDarkMode ? "text-slate-400 hover:text-indigo-400" : "text-gray-500 hover:text-gray-900"
                    )}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {stage === 'result' ? 'Back to Essay' : 'Back to Tasks'}
                </button>
            )}
        </div>
    );

    if (stage === 'select') {
        return (
            <div className="max-w-5xl mx-auto py-12">
                {renderHeader()}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h2 className={clsx(
                        "text-4xl font-bold mb-4 transition-colors",
                        isDarkMode ? "text-white" : "text-slate-900"
                    )}>Choose Your Challenge</h2>
                    <p className={clsx(
                        "transition-colors",
                        isDarkMode ? "text-slate-400" : "text-slate-600"
                    )}>Select a writing task to begin your simulated exam session.</p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {tasks.map((task, idx) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card p-8 rounded-2xl cursor-pointer group relative overflow-hidden"
                            onClick={() => handleStart(task)}
                        >
                            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="flex justify-between items-start mb-4">
                                <span className={clsx(
                                    "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider",
                                    task.type === 'Task 1' ? "bg-indigo-100 text-indigo-700" : "bg-violet-100 text-violet-700"
                                )}>
                                    {task.type}
                                </span>
                                <div className={clsx(
                                    "w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all",
                                    isDarkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-500"
                                )}>
                                    <Play className="w-4 h-4 ml-1" />
                                </div>
                            </div>
                            <p className={clsx(
                                "font-medium leading-relaxed line-clamp-3 transition-colors",
                                isDarkMode ? "text-slate-300 group-hover:text-white" : "text-black"
                            )}>
                                {task.prompt}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    }

    if (stage === 'result' && result) {
        return (
            <div className="max-w-4xl mx-auto py-8">
                <ResultCard
                    result={result}
                    taskType={selectedTask?.type}
                    userEssay={content}
                    onBack={handleBack}
                    timeTaken={timeTakenFormatted}
                />
            </div>
        );
    }

    // Writing View
    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col gap-6 py-4">
            {renderHeader()}

            <div className="flex flex-col md:flex-row gap-6 h-full">
                {/* Left Interface */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="md:w-1/3 flex flex-col gap-6 h-full"
                >
                    {/* Task Card */}
                    <div className="glass-card p-6 rounded-2xl relative overflow-hidden group flex flex-col h-full max-h-[50vh]">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-100 to-transparent rounded-bl-full pointer-events-none"></div>

                        <div className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-3 flex-shrink-0">Current Task</div>

                        {selectedTask?.imageUrl && (
                            <div className="mb-4 rounded-lg overflow-hidden border border-slate-200 flex-shrink-1 min-h-[100px] max-h-[60%] overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={selectedTask.imageUrl}
                                    alt="Task Diagram"
                                    className="w-full h-full object-contain bg-white"
                                />
                            </div>
                        )}

                        <div className={clsx(
                            "text-sm whitespace-pre-wrap leading-relaxed font-medium overflow-y-auto pr-2 custom-scrollbar transition-colors flex-1",
                            isDarkMode ? "text-slate-200" : "text-slate-900"
                        )}>
                            {selectedTask?.prompt}
                        </div>
                    </div>

                    {/* Timer & Controls */}
                    <div className="glass p-6 rounded-2xl flex flex-col items-center space-y-6 flex-shrink-0">
                        <Timer secondsRemaining={secondsLeft} />
                        <button
                            onClick={handleSubmit}
                            disabled={stage === 'analyzing' || !content.trim()}
                            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {stage === 'analyzing' ? (
                                <>
                                    <Loader2 className="animate-spin w-5 h-5 mr-2" />
                                    AI Analysis in Progress...
                                </>
                            ) : (
                                "Submit Essay"
                            )}
                        </button>
                        {error && (
                            <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg text-xs text-rose-600 flex items-center w-full">
                                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                                {error}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Right Editor */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="md:w-2/3 h-full"
                >
                    <div className="h-full glass rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5">
                        <Editor
                            value={content}
                            onChange={setContent}
                            disabled={stage === 'analyzing'}
                            taskType={selectedTask?.type}
                        />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
