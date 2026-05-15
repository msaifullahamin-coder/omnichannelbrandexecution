import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, TrendingUp, TrendingDown, DollarSign, Plus, 
  ArrowUpRight, ArrowDownRight, Calendar, Tag, Trash2, PieChart 
} from 'lucide-react';
import { Card, Badge } from './components';
import { formatRupiah } from './dummyData';

export const FinancePage = ({ activeProject, enrichedPhases, updateActiveProjectData }) => {
  const [showAddRevenue, setShowAddRevenue] = useState(false);
  const [newRevenue, setNewRevenue] = useState({ title: '', amount: '', date: new Date().toISOString().split('T')[0] });

  // 1. Ambil Data dari Project
  const revenues = activeProject.revenues || [];
  const totalBudget = enrichedPhases.reduce((acc, p) => acc + (p.budget || 0), 0);
  const totalSpent = (activeProject.pdcaIterations || []).reduce((acc, p) => acc + Number(p.cost || 0), 0);
  const totalRevenue = revenues.reduce((acc, r) => acc + Number(r.amount || 0), 0);
  
  // 2. Kalkulasi Profit & ROI
  const netProfit = totalRevenue - totalSpent;
  const roi = totalSpent > 0 ? ((netProfit / totalSpent) * 100).toFixed(1) : 0;

  const handleAddRevenue = (e) => {
    e.preventDefault();
    const entry = { ...newRevenue, id: Date.now(), amount: Number(newRevenue.amount) };
    updateActiveProjectData('revenues', [...revenues, entry]);
    setNewRevenue({ title: '', amount: '', date: new Date().toISOString().split('T')[0] });
    setShowAddRevenue(false);
  };

  const handleDeleteRevenue = (id) => {
    updateActiveProjectData('revenues', revenues.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Financial Insights</h2>
          <p className="text-slate-500 mt-1">Pantau arus kas, budget, dan profitabilitas project <b>{activeProject.name}</b>.</p>
        </div>
        <button 
          onClick={() => setShowAddRevenue(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={18} /> Catat Pemasukan
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-l-4 border-l-blue-500">
           <div className="flex justify-between items-start mb-2">
             <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-lg"><TrendingUp size={20}/></div>
             <Badge variant="neutral">Revenue</Badge>
           </div>
           <div className="text-2xl font-black text-slate-900 dark:text-white">{formatRupiah(totalRevenue)}</div>
           <p className="text-xs text-slate-500 mt-1">Total uang masuk dicatat</p>
        </Card>

        <Card className="p-5 border-l-4 border-l-rose-500">
           <div className="flex justify-between items-start mb-2">
             <div className="p-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 rounded-lg"><TrendingDown size={20}/></div>
             <Badge variant="neutral">Expenses</Badge>
           </div>
           <div className="text-2xl font-black text-slate-900 dark:text-white">{formatRupiah(totalSpent)}</div>
           <p className="text-xs text-slate-500 mt-1">dari budget {formatRupiah(totalBudget)}</p>
        </Card>

        <Card className={`p-5 border-l-4 ${netProfit >= 0 ? 'border-l-emerald-500' : 'border-l-rose-500'}`}>
           <div className="flex justify-between items-start mb-2">
             <div className={`p-2 rounded-lg ${netProfit >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                <Wallet size={20}/>
             </div>
             <Badge variant={netProfit >= 0 ? 'success' : 'danger'}>Net Profit</Badge>
           </div>
           <div className="text-2xl font-black text-slate-900 dark:text-white">{formatRupiah(netProfit)}</div>
           <p className="text-xs text-slate-500 mt-1">Keuntungan bersih</p>
        </Card>

        <Card className="p-5 border-l-4 border-l-amber-500">
           <div className="flex justify-between items-start mb-2">
             <div className="p-2 bg-amber-50 dark:bg-amber-500/10 text-amber-600 rounded-lg"><PieChart size={20}/></div>
             <Badge variant="warning">ROI</Badge>
           </div>
           <div className="text-2xl font-black text-slate-900 dark:text-white">{roi}%</div>
           <p className="text-xs text-slate-500 mt-1">Return on Investment</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Daftar Pemasukan */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 flex justify-between items-center">
               <h3 className="font-bold flex items-center gap-2"><DollarSign size={18} className="text-blue-500"/> Riwayat Pemasukan</h3>
               <span className="text-xs text-slate-500 font-medium">{revenues.length} Transaksi</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-zinc-800">
              {revenues.length === 0 ? (
                <div className="p-10 text-center text-slate-400">Belum ada pemasukan yang dicatat.</div>
              ) : (
                revenues.map(r => (
                  <div key={r.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center">
                        <ArrowUpRight size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{r.title}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1"><Calendar size={12}/> {r.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="font-black text-emerald-600">+{formatRupiah(r.amount)}</span>
                       <button onClick={() => handleDeleteRevenue(r.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                         <Trash2 size={16} />
                       </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Kolom Kanan: Ringkasan Pengeluaran Per Phase */}
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Tag size={18} className="text-rose-500"/> Budget vs Realisasi</h3>
            <div className="space-y-4">
               {enrichedPhases.map(p => (
                 <div key={p.id} className="space-y-1">
                   <div className="flex justify-between text-xs font-bold">
                     <span className="truncate w-32">{p.title}</span>
                     <span className={p.realisasi > p.budget ? 'text-rose-500' : 'text-slate-600'}>
                        {Math.round((p.realisasi / (p.budget || 1)) * 100)}%
                     </span>
                   </div>
                   <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${p.realisasi > p.budget ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min((p.realisasi / (p.budget || 1)) * 100, 100)}%` }}
                      />
                   </div>
                   <div className="flex justify-between text-[10px] text-slate-500">
                     <span>Realisasi: {formatRupiah(p.realisasi)}</span>
                     <span>Budget: {formatRupiah(p.budget)}</span>
                   </div>
                 </div>
               ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal Tambah Pemasukan */}
      <AnimatePresence>
        {showAddRevenue && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-zinc-800">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus size={20} className="text-blue-500"/> Catat Pemasukan</h3>
              <form onSubmit={handleAddRevenue} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Nama Transaksi / Sumber</label>
                  <input required value={newRevenue.title} onChange={e => setNewRevenue({...newRevenue, title: e.target.value})} placeholder="Misal: Penjualan Mushaf 500pcs" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Jumlah (Rp)</label>
                  <input type="number" required value={newRevenue.amount} onChange={e => setNewRevenue({...newRevenue, amount: e.target.value})} placeholder="15000000" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Tanggal</label>
                  <input type="date" required value={newRevenue.date} onChange={e => setNewRevenue({...newRevenue, date: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={() => setShowAddRevenue(false)} className="flex-1 py-2.5 text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl transition-colors">Batal</button>
                  <button type="submit" className="flex-1 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-colors">Simpan</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};