"use client";

import Link from "next/link";
import { ArrowRight, Keyboard, PenTool } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/ThemeContext";
import clsx from "clsx";

export default function Home() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-8 relative overflow-hidden">

      {/* Background Decor */}
      <div className={clsx(
        "absolute top-0 left-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob transition-colors duration-500",
        isDarkMode ? "bg-indigo-900" : "bg-indigo-200"
      )}></div>
      <div className={clsx(
        "absolute top-0 right-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 transition-colors duration-500",
        isDarkMode ? "bg-violet-900" : "bg-violet-200"
      )}></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16 relative z-10"
      >
        <h1 className={clsx(
          "text-5xl md:text-7xl font-bold mb-6 tracking-tight transition-colors duration-500",
          isDarkMode ? "text-white" : "text-slate-900"
        )}>
          Master IELTS <span className="text-gradient">Writing</span>
        </h1>
        <p className={clsx(
          "text-xl max-w-2xl mx-auto leading-relaxed transition-colors duration-500",
          isDarkMode ? "text-slate-400" : "text-slate-600"
        )}>
          Achieve Band 9.0 through scientifically designed copywork training and
          AI-powered exam simulation.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full z-10">
        <Link href="/training">
          <motion.div
            whileHover={{ y: -5 }}
            className="glass-card p-8 rounded-2xl h-full flex flex-col items-start group cursor-pointer"
          >
            <div className={clsx(
              "w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300",
              isDarkMode ? "bg-indigo-900/50 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white" : "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"
            )}>
              <Keyboard className="w-6 h-6" />
            </div>
            <h2 className={clsx(
              "text-2xl font-bold mb-3 transition-colors duration-300",
              isDarkMode ? "text-white" : "text-slate-900"
            )}>Training Mode</h2>
            <p className={clsx(
              "mb-6 flex-grow transition-colors duration-300",
              isDarkMode ? "text-slate-400" : "text-slate-600"
            )}>
              Internalize high-band sentence structures through precise copywork.
              Track your WPM and Accuracy in real-time.
            </p>
            <div className="flex items-center text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform">
              Start Practice <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          </motion.div>
        </Link>

        <Link href="/writing">
          <motion.div
            whileHover={{ y: -5 }}
            className="glass-card p-8 rounded-2xl h-full flex flex-col items-start group cursor-pointer"
          >
            <div className={clsx(
              "w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300",
              isDarkMode ? "bg-violet-900/50 text-violet-400 group-hover:bg-violet-500 group-hover:text-white" : "bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white"
            )}>
              <PenTool className="w-6 h-6" />
            </div>
            <h2 className={clsx(
              "text-2xl font-bold mb-3 transition-colors duration-300",
              isDarkMode ? "text-white" : "text-slate-900"
            )}>Writing Mode</h2>
            <p className={clsx(
              "mb-6 flex-grow transition-colors duration-300",
              isDarkMode ? "text-slate-400" : "text-slate-600"
            )}>
              Simulate the real exam environment with Task 1 & 2.
              Get instant AI grading and feedback powered by Llama 3.
            </p>
            <div className="flex items-center text-violet-600 font-semibold group-hover:translate-x-1 transition-transform">
              Take Exam <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
