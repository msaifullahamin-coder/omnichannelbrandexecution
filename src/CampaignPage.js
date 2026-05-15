import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Plus, Calendar, Target, TrendingUp, MoreVertical, Trash2, Edit3, Bot } from 'lucide-react';
import { Card, Badge } from './components';
import { formatRupiah } from './dummyData';

export const CampaignPage = ({ campaigns = [], updateActiveProjectData, personas = [] }) => {
  const [showModal, setShowModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '', startDate: '', endDate: '', budget: '', targetRoas: '', personaId: ''
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const campaign = {
      ...newCampaign,
      id: `camp-${Date.now()}`,
      status: 'Active',
      spent: 0,
      revenue: 0
    };
    updateActiveProjectData('campaigns', [...campaigns, campaign]);
    setShowModal(false);
    setNewCampaign({ name: '', startDate: '', endDate: '', budget: '', targetRoas: '', personaId: '' });
  };

  const handleDelete = (id) => {
    updateActiveProjectData('campaigns', campaigns.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Megaphone className="text-emerald-500" /> Campaign Manager
          </h2>
          <p className="text-slate-500 mt-1">Pusat kendali strategi marketing dan promo bulanan.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/20">
          <Plus size={18} /> Buat Campaign
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-4">
            <Megaphone size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Belum Ada Campaign</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-6">Mulai rencanakan promo Payday, Ramadhan, atau strategi Always-On Anda di sini.</p>
          <button onClick={() => setShowModal(true)} className="px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white rounded-xl font-bold transition-all">
            Buat Campaign Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map(camp => {
            const progress = camp.budget > 0 ? (camp.spent / camp.budget) * 100 : 0;
            const relatedPersona = personas.find(p => p.id === camp.personaId) || { name: 'Semua Audiens' };
            
            return (
              <motion.div key={camp.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 hover:border-emerald-500 transition-colors group relative">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant={camp.status === 'Active' ? 'success' : 'neutral'}>{camp.status}</Badge>
                  <button onClick={() => handleDelete(camp.id)} className="text-slate-400 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">{camp.name}</h3>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
                  <Calendar size={14} className="text-slate-400" /> {camp.startDate} s/d {camp.endDate}
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-500">Budget Terpakai</span>
                      <span className="text-slate-900 dark:text-white">{formatRupiah(camp.spent)} / {formatRupiah(camp.budget)}</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Target size={12}/> Target ROAS</p>
                      <p className="font-bold text-slate-900 dark:text-white">{camp.targetRoas}x</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Bot size={12}/> Target Persona</p>
                      <p className="font-bold text-slate-900 dark:text-white truncate">{relatedPersona.name}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal Buat Campaign */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-zinc-800">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Megaphone className="text-emerald-500"/> Setup Campaign Baru</h3>
              
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Nama Campaign</label>
                  <input required autoFocus value={newCampaign.name} onChange={e => setNewCampaign({...newCampaign, name: e.target.value})} placeholder="e.g., Promo Payday Mei 2026" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Tanggal Mulai</label>
                    <input required type="date" value={newCampaign.startDate} onChange={e => setNewCampaign({...newCampaign, startDate: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Tanggal Berakhir</label>
                    <input required type="date" value={newCampaign.endDate} onChange={e => setNewCampaign({...newCampaign, endDate: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Budget Iklan (Rp)</label>
                    <input required type="number" value={newCampaign.budget} onChange={e => setNewCampaign({...newCampaign, budget: e.target.value})} placeholder="10000000" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Target ROAS (x)</label>
                    <input required type="number" step="0.1" value={newCampaign.targetRoas} onChange={e => setNewCampaign({...newCampaign, targetRoas: e.target.value})} placeholder="3.5" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Target Persona</label>
                  <select required value={newCampaign.personaId} onChange={e => setNewCampaign({...newCampaign, personaId: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="">-- Pilih Target Audiens --</option>
                    {personas.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl transition-colors">Batal</button>
                  <button type="submit" className="flex-1 py-2.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/20 transition-colors">Buat Campaign</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};