import { IELTSEvaluation } from "@/lib/ieltsPrompts";
import { CheckCircle, AlertTriangle, BookOpen, Star, Award, TrendingUp, AlertCircleIcon, Sparkles, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTheme } from "@/lib/ThemeContext";

interface ResultCardProps {
    result: IELTSEvaluation;
    taskType?: 'Task 1' | 'Task 2';
    userEssay?: string;
    onBack?: () => void;
    timeTaken?: string;
}

export default function ResultCard({ result, taskType, userEssay, onBack, timeTaken }: ResultCardProps) {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    const [expandedSections, setExpandedSections] = useState({
        userEssay: true,
        errorPatterns: false,
        vocabImprovements: false,
        modelAnswer: true
    });

    if (!result || !result.criteria) return null;

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const criteriaList = [
        {
            label: taskType === 'Task 1' ? "Task Achievement" : "Task Response",
            score: result.criteria.taskAchievement || result.criteria.taskResponse,
            icon: CheckCircle,
            color: "text-emerald-500",
            bg: "bg-emerald-50"
        },
        { label: "Coherence", score: result.criteria.coherence, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "Lexical", score: result.criteria.lexical, icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
        { label: "Grammar", score: result.criteria.grammar, icon: AlertTriangle, color: "text-indigo-500", bg: "bg-indigo-50" },
    ];

    // Determine word count status using taskType prop
    const getWordCountStatus = () => {
        if (!result.wordCount) return { color: 'text-gray-500', bg: 'bg-gray-100', label: 'Unknown' };

        const isTask1 = taskType === 'Task 1';
        const min = isTask1 ? 150 : 250;
        const idealMin = isTask1 ? 160 : 260;
        const idealMax = isTask1 ? 190 : 290;
        const max = isTask1 ? 220 : 320;

        if (result.wordCount < min) {
            return { color: 'text-rose-600', bg: 'bg-rose-100', label: `Below minimum (${min})` };
        } else if (result.wordCount >= idealMin && result.wordCount <= idealMax) {
            return { color: 'text-emerald-600', bg: 'bg-emerald-100', label: 'Optimal range' };
        } else if (result.wordCount > max) {
            return { color: 'text-amber-600', bg: 'bg-amber-100', label: 'Over recommended' };
        } else {
            return { color: 'text-blue-600', bg: 'bg-blue-100', label: 'Acceptable' };
        }
    };

    const wordCountStatus = getWordCountStatus();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full space-y-8"
        >
            {/* Back Button */}
            {onBack && (
                <button
                    onClick={onBack}
                    className={clsx(
                        "flex items-center gap-2 text-sm font-semibold transition-colors group",
                        isDarkMode ? "text-slate-400 hover:text-indigo-400" : "text-slate-600 hover:text-indigo-600"
                    )}
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Essay (Timer Paused)
                </button>
            )}

            {/* Header Score */}
            <div className={clsx(
                "glass p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between relative overflow-hidden",
                isDarkMode ? "before:bg-slate-800/50" : "before:bg-white/50"
            )}>
                <div className={clsx(
                    "absolute top-0 right-0 w-64 h-64 rounded-bl-full pointer-events-none transition-colors duration-500",
                    isDarkMode ? "bg-indigo-900/20" : "bg-gradient-to-br from-indigo-100 to-transparent opacity-50"
                )}></div>

                <div className="z-10 text-center md:text-left mb-6 md:mb-0">
                    <h2 className={clsx(
                        "text-3xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2 transition-colors",
                        isDarkMode ? "text-white" : "text-slate-900"
                    )}>
                        <Award className="w-8 h-8 text-indigo-600" />
                        Assessment Complete
                    </h2>
                    <p className={clsx(
                        "transition-colors",
                        isDarkMode ? "text-slate-400" : "text-slate-600"
                    )}>Here is your official band score estimation.</p>
                </div>

                <div className="flex flex-col items-center z-10">
                    <div className="relative">
                        <div className={clsx(
                            "w-32 h-32 rounded-full border-8 flex items-center justify-center shadow-xl transition-colors",
                            isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-indigo-100"
                        )}>
                            <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 to-violet-600">
                                {result.overallBand}
                            </span>
                        </div>
                        <div className="absolute -bottom-2 px-4 py-1 bg-indigo-600 text-white text-sm font-bold rounded-full shadow-lg">
                            Band Score
                        </div>
                    </div>
                </div>
            </div>

            {/* Word Count & Time Indicator */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.wordCount && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={clsx("glass p-4 rounded-2xl border-l-4", {
                            "border-l-rose-500": wordCountStatus.color.includes('rose'),
                            "border-l-emerald-500": wordCountStatus.color.includes('emerald'),
                            "border-l-amber-500": wordCountStatus.color.includes('amber'),
                            "border-l-blue-500": wordCountStatus.color.includes('blue'),
                        })}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={clsx("px-3 py-1 rounded-full text-sm font-bold", wordCountStatus.bg, wordCountStatus.color)}>
                                    {result.wordCount} words
                                </div>
                                <span className={clsx("text-sm font-medium", wordCountStatus.color)}>
                                    {wordCountStatus.label}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {timeTaken && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={clsx(
                            "glass p-4 rounded-2xl border-l-4 border-l-indigo-500 flex items-center justify-between transition-colors",
                            isDarkMode ? "bg-slate-900/50" : ""
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className={clsx(
                                "px-3 py-1 rounded-full text-sm font-bold transition-colors",
                                isDarkMode ? "bg-indigo-900/50 text-indigo-300" : "bg-indigo-100 text-indigo-700"
                            )}>
                                ⏱ Time Taken
                            </div>
                            <span className={clsx(
                                "text-xl font-mono font-bold transition-colors",
                                isDarkMode ? "text-slate-200" : "text-slate-700"
                            )}>
                                {timeTaken}
                            </span>
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* User's Essay (Collapsible) */}
                    {userEssay && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass p-6 rounded-2xl border-l-4 border-l-blue-500"
                        >
                            <button
                                onClick={() => toggleSection('userEssay')}
                                className={clsx(
                                    "w-full flex items-center justify-between text-lg font-bold mb-4 transition-colors",
                                    isDarkMode ? "text-white" : "text-slate-800"
                                )}
                            >
                                <div className="flex items-center">
                                    <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                                    Your Essay
                                </div>
                                {expandedSections.userEssay ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                            {expandedSections.userEssay && (
                                <div className={clsx(
                                    "prose prose-sm prose-slate max-w-none leading-loose whitespace-pre-wrap font-serif p-4 rounded-lg transition-colors",
                                    isDarkMode ? "text-slate-300 bg-slate-800/50" : "text-slate-600 bg-white/30"
                                )}>
                                    {userEssay}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Criteria Breakdown */}
                    <div className="glass p-6 rounded-2xl">
                        <h3 className={clsx(
                            "text-lg font-bold mb-4 flex items-center transition-colors",
                            isDarkMode ? "text-white" : "text-slate-800"
                        )}>
                            <Star className="w-5 h-5 mr-2 text-amber-500" /> Criteria Breakdown
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {criteriaList.map((c) => (
                                <div key={c.label} className={clsx(
                                    "p-4 rounded-xl border shadow-sm flex flex-col items-center transition-colors",
                                    isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-white/50 border-white/20"
                                )}>
                                    <div className={clsx("p-2 rounded-full mb-2 transition-colors", isDarkMode ? "bg-slate-700" : c.bg)}>
                                        <c.icon className={clsx("w-5 h-5", c.color)} />
                                    </div>
                                    <div className="text-sm text-slate-500 font-medium mb-1">{c.label}</div>
                                    <div className={clsx("text-xl font-bold transition-colors", isDarkMode ? "text-white" : "text-slate-800")}>{c.score}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Band Upgrade Path */}
                    {result.bandUpgrades && result.bandUpgrades.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass p-6 rounded-2xl border-l-4 border-l-indigo-500"
                        >
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2 text-indigo-500" />
                                Path to Band {result.bandUpgrades[0].targetBand}
                            </h3>
                            <ul className="space-y-2">
                                {result.bandUpgrades[0].suggestions.map((suggestion, i) => (
                                    <li key={i} className="flex items-start text-slate-700 text-sm leading-relaxed">
                                        <span className="mr-3 text-indigo-500 font-bold">✓</span>
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )}

                    {/* Strengths & Areas for Improvement */}
                    <div className="glass p-6 rounded-2xl">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Examiner Feedback</h3>

                        {/* Strengths */}
                        {result.feedback?.strengths && result.feedback.strengths.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-sm font-semibold text-emerald-700 mb-2">✓ Strengths</h4>
                                <ul className="space-y-2">
                                    {result.feedback.strengths.map((item: string, i: number) => (
                                        <li key={i} className="text-slate-700 text-sm leading-relaxed pl-4 border-l-2 border-emerald-300">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Areas for Improvement */}
                        {result.feedback?.improvements && result.feedback.improvements.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-sm font-semibold text-rose-700 mb-2">⚠ Areas for Improvement</h4>
                                <ul className="space-y-2">
                                    {result.feedback.improvements.map((item: string, i: number) => (
                                        <li key={i} className={clsx(
                                            "text-sm leading-relaxed pl-4 border-l-2 transition-colors",
                                            isDarkMode ? "text-slate-300 border-rose-500/50" : "text-slate-700 border-rose-300"
                                        )}>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Actionable Tips */}
                        {result.feedback?.tips && result.feedback.tips.length > 0 && (
                            <div>
                                <h4 className="text-sm font-semibold text-indigo-700 mb-2">💡 Tips to Improve</h4>
                                <ul className="space-y-2">
                                    {result.feedback.tips.map((item: string, i: number) => (
                                        <li key={i} className="text-slate-700 text-sm leading-relaxed pl-4 border-l-2 border-indigo-300">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Error Patterns (Collapsible) */}
                    {result.errorPatterns && result.errorPatterns.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass p-6 rounded-2xl border-l-4 border-l-rose-500"
                        >
                            <button
                                onClick={() => toggleSection('errorPatterns')}
                                className="w-full flex items-center justify-between text-lg font-bold text-slate-800 mb-4"
                            >
                                <div className="flex items-center">
                                    <AlertCircleIcon className="w-5 h-5 mr-2 text-rose-500" />
                                    Error Patterns
                                </div>
                                {expandedSections.errorPatterns ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                            {expandedSections.errorPatterns && (
                                <div className="space-y-3">
                                    {result.errorPatterns.map((pattern, i) => (
                                        <div key={i} className="bg-white/50 p-3 rounded-lg">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={clsx("px-2 py-0.5 rounded text-xs font-bold uppercase", {
                                                    "bg-rose-100 text-rose-700": pattern.severity === 'severe',
                                                    "bg-amber-100 text-amber-700": pattern.severity === 'moderate',
                                                    "bg-blue-100 text-blue-700": pattern.severity === 'minor',
                                                })}>
                                                    {pattern.severity}
                                                </span>
                                                <span className="text-xs text-slate-500 uppercase">{pattern.type}</span>
                                            </div>
                                            <p className="text-sm font-medium text-slate-800 mb-1">{pattern.description}</p>
                                            <div className="text-xs text-slate-600 space-y-1">
                                                {pattern.examples.map((ex, j) => (
                                                    <div key={j} className="font-mono bg-slate-100 px-2 py-1 rounded">{ex}</div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Vocabulary Improvements (Collapsible) */}
                    {result.vocabularyImprovements && result.vocabularyImprovements.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass p-6 rounded-2xl border-l-4 border-l-violet-500"
                        >
                            <button
                                onClick={() => toggleSection('vocabImprovements')}
                                className="w-full flex items-center justify-between text-lg font-bold text-slate-800 mb-4"
                            >
                                <div className="flex items-center">
                                    <Sparkles className="w-5 h-5 mr-2 text-violet-500" />
                                    Vocabulary Improvements
                                </div>
                                {expandedSections.vocabImprovements ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                            {expandedSections.vocabImprovements && (
                                <div className="space-y-3">
                                    {result.vocabularyImprovements.map((vocab, i) => (
                                        <div key={i} className="bg-white/50 p-3 rounded-lg">
                                            <div className="flex items-start gap-2 mb-2">
                                                <span className="text-rose-600 font-mono text-sm line-through">{vocab.original}</span>
                                                <span className="text-slate-400">→</span>
                                                <div className="flex flex-wrap gap-1">
                                                    {vocab.alternatives.map((alt, j) => (
                                                        <span key={j} className="text-emerald-600 font-mono text-sm bg-emerald-50 px-2 py-0.5 rounded">
                                                            {alt}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-500 italic mb-1">&quot;{vocab.context}&quot;</p>
                                            <p className="text-xs text-slate-600">{vocab.reason}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>

                {/* Right Column - Model Answer */}
                <div className={clsx(
                    "glass p-8 rounded-2xl border-l-4 border-l-emerald-500 h-fit sticky top-6 transition-colors",
                    isDarkMode ? "bg-slate-900/50" : ""
                )}>
                    <button
                        onClick={() => toggleSection('modelAnswer')}
                        className={clsx(
                            "w-full flex items-center justify-between text-lg font-bold mb-4 transition-colors",
                            isDarkMode ? "text-white" : "text-slate-800"
                        )}
                    >
                        <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2 text-emerald-500" />
                            Band 9.0 Model Answer
                        </div>
                        {expandedSections.modelAnswer ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    {expandedSections.modelAnswer && (
                        <div className={clsx(
                            "prose prose-sm prose-slate max-w-none leading-loose whitespace-pre-wrap font-serif transition-colors",
                            isDarkMode ? "text-slate-300" : "text-slate-600"
                        )}>
                            {result.modelAnswer}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
