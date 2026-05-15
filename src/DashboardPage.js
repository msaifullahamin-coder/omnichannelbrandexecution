import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Info, ArrowUpRight, ArrowDownRight, X, ArrowRight, Zap } from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, Line 
} from 'recharts';
import { Card, Badge, ProgressBar } from './components';
import { overviewStats, revenueData, funnelData, COLORS, formatRupiah } from './dummyData';
export const DashboardPage = ({ phases, navigateToRoadmap }) => {
  const [showProgressModal, setShowProgressModal] = useState(false);

  // 1. Hitung Total Progress
  const totalRoadmapProgress = phases.length > 0 
    ? Math.round(phases.reduce((acc, p) => acc + p.progress, 0) / phases.length) 
    : 0;

  // 2. Hitung Total Budget & Realisasi dari semua Phase
  const totalBudget = phases.reduce((acc, p) => acc + (p.budget || 0), 0);
  const totalRealisasi = phases.reduce((acc, p) => acc + (p.realisasi || 0), 0);
  const persentaseBudget = totalBudget > 0 ? Math.round((totalRealisasi / totalBudget) * 100) : 0;

  // 3. Susun Ulang Kartu Dashboard
  const dynamicStats = [
    { 
      title: 'Total Progress', 
      value: `${totalRoadmapProgress}%`, 
      change: '+5%', 
      icon: Target, 
      trend: 'up',
      onClick: () => setShowProgressModal(true) 
    },
    { 
      title: 'Budget Used', 
      value: formatRupiah(totalRealisasi), 
      subtext: `of ${formatRupiah(totalBudget)}`, 
      change: `${persentaseBudget}%`, 
      icon: Zap, 
      trend: persentaseBudget > 100 ? 'down' : 'neutral',
      onClick: () => navigateToRoadmap() // Ini yang bikin bisa diklik dan lompat ke Roadmap
    },
    ...overviewStats.slice(2) // Sisanya (Leads & ROAS) tetap pakai data dummy
  ];

  return (
    <div className="space-y-6 relative">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dynamicStats.map((stat, idx) => (
          <Card 
            key={idx} 
            className={`flex flex-col relative overflow-hidden group transition-all duration-300 ${stat.onClick ? 'cursor-pointer hover:border-emerald-500/50 hover:shadow-emerald-500/10 hover:shadow-lg' : ''}`}
            onClick={stat.onClick}
          >
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                   {stat.title}
                   {stat.onClick && <Info size={12} className="text-emerald-500" />}
                </p>
                <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-zinc-100">{stat.value}</h3>
                {stat.subtext && <p className="text-xs text-slate-400 mt-1">{stat.subtext}</p>}
              </div>
              <div className={`p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm relative z-10">
              <span className={`flex items-center font-medium ${stat.trend === 'up' ? 'text-emerald-500' : 'text-amber-500'}`}>
                {stat.trend === 'up' ? <ArrowUpRight size={16} className="mr-1"/> : <ArrowDownRight size={16} className="mr-1"/>}
                {stat.change}
              </span>
              <span className="text-slate-400 dark:text-zinc-500 ml-2">vs last month</span>
            </div>
          </Card>
        ))}
      </div>

      {/* POP-UP MODAL RINCIAN PROGRESS */}
      <AnimatePresence>
        {showProgressModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="w-full max-w-2xl bg-white dark:bg-zinc-950 rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-zinc-800 flex flex-col max-h-[85vh]"
            >
              <div className="flex justify-between items-center mb-6 shrink-0 border-b border-slate-100 dark:border-zinc-800 pb-4">
                <div>
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                     <Target size={20} className="text-emerald-500"/> Detail Rincian Progress
                   </h3>
                   <p className="text-sm text-slate-500 mt-1">Status eksekusi berdasarkan Fase Roadmap.</p>
                </div>
                <button type="button" onClick={() => setShowProgressModal(false)} className="text-slate-400 hover:text-rose-500 p-2 bg-slate-50 dark:bg-zinc-900 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {phases.map((phase) => {
                   let badgeVariant = 'default';
                   let statusText = 'Belum Dimulai';

                   if (phase.progress === 100) { 
                     badgeVariant = 'success';
                     statusText = 'Selesai'; 
                   } else if (phase.progress >= 50) { 
                     badgeVariant = 'info';
                     statusText = 'Tepat Waktu'; 
                   } else if (phase.progress > 0) { 
                     badgeVariant = 'warning';
                     statusText = 'Terlambat'; 
                   }

                   return (
                     <div key={phase.id} className="p-4 bg-slate-50 dark:bg-zinc-900/50 rounded-xl border border-slate-100 dark:border-zinc-800 hover:border-emerald-500/30 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                           <h4 className="font-bold text-sm text-slate-900 dark:text-zinc-100">{phase.title}</h4>
                           <Badge variant={badgeVariant}>{statusText}</Badge>
                        </div>
                        <div className="flex items-center gap-3">
                           <ProgressBar progress={phase.progress} colorClass={phase.progress === 100 ? 'bg-emerald-500' : phase.progress > 0 ? 'bg-amber-500' : 'bg-slate-300'} className="flex-1 h-2" />
                           <span className="text-xs font-bold text-slate-600 dark:text-zinc-400 w-8 text-right">{phase.progress}%</span>
                        </div>
                     </div>
                   );
                })}
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 shrink-0 mt-4">
                <button 
                  onClick={() => { setShowProgressModal(false); navigateToRoadmap(); }} 
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/20 transition-colors"
                >
                  Lihat Detail Roadmap <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Omnichannel Campaign Performance</h3>
              <p className="text-sm text-slate-500">Leads vs Total Budget Spent (7 Days)</p>
            </div>
            <select className="bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1 text-sm w-full sm:w-auto">
              <option>Last 7 Days</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="leads" stroke={COLORS.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                <Line type="monotone" dataKey="budget" stroke={COLORS.secondary} strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Funnel Conversion</h3>
            <p className="text-sm text-slate-500">Cross-Platform Journey Status</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#333" opacity={0.1} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 11}} width={100} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#18181b', borderRadius: '8px' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === funnelData.length - 1 ? COLORS.secondary : COLORS.primary} fillOpacity={1 - (index * 0.15)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};