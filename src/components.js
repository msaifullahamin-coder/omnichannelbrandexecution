import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', ...props }) => (
  <div className={`bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-4 md:p-5 ${className}`} {...props}>
    {children}
  </div>
);

export const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    danger: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
    admin: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400', 
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${variants[variant] || variants.default}`}>
      {children}
    </span>
  );
};

export const ProgressBar = ({ progress, colorClass = 'bg-emerald-500', className = '' }) => (
  <div className={`w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden ${className}`}>
    <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: "easeOut" }} className={`h-full rounded-full ${colorClass}`} />
  </div>
);