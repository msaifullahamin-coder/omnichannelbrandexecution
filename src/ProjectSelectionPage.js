import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, Plus, LayoutDashboard, LogOut, Bot, Trash2, Users, 
  Settings, Image as ImageIcon, Activity, TrendingUp, TrendingDown, Wallet, PieChart 
} from 'lucide-react';

// Fungsi format rupiah lokal biar nggak error
const formatRp = (angka) => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 
  }).format(angka || 0);
};

export const ProjectSelectionPage = ({ projects, onSelectProject, onCreateProject, onDeleteProject, currentUser, onLogout, onManageTeam, onUpdateProfile }) => {
  const [showNewModal, setShowNewModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({ name: currentUser.name, password: currentUser.password, avatar: currentUser.avatar });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    onCreateProject(newProjectName);
    setNewProjectName('');
    setShowNewModal(false);
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    onUpdateProfile({ ...currentUser, ...profileData });
    setShowProfileModal(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileData({ ...profileData, avatar: reader.result });
      reader.readAsDataURL(file);
    }
  };

  // === KALKULASI CONSOLIDATED REPORT (KHUSUS ADMIN) ===
  const adminConsolidated = projects.map(proj => {
    const budget = (proj.tasks || []).reduce((acc, t) => acc + Number(t.budget || 0), 0);
    const spent = (proj.pdcaIterations || []).reduce((acc, p) => acc + Number(p.cost || 0), 0);
    const rev = (proj.revenues || []).reduce((acc, r) => acc + Number(r.amount || 0), 0);
    const profit = rev - spent;
    const roi = spent > 0 ? ((profit / spent) * 100).toFixed(1) : 0;
    return { ...proj, budget, spent, rev, profit, roi };
  });

  const globalBudget = adminConsolidated.reduce((acc, p) => acc + p.budget, 0);
  const globalSpent = adminConsolidated.reduce((acc, p) => acc + p.spent, 0);
  const globalRev = adminConsolidated.reduce((acc, p) => acc + p.rev, 0);
  const globalProfit = globalRev - globalSpent;
  const globalRoi = globalSpent > 0 ? ((globalProfit / globalSpent) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans text-slate-900 dark:text-zinc-100 selection:bg-emerald-500/30 pb-20">
      
      {/* Topbar Lobby */}
      <header className="h-16 flex items-center justify-between px-6 lg:px-12 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 sticky top-0 z-30">
        <div className="flex items-center gap-3 font-bold text-xl text-emerald-600 dark:text-emerald-400">
           <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
             <Bot size={20} />
           </div>
           OmniCore Workspace
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
           {currentUser.role === 'admin' && (
             <button onClick={onManageTeam} className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors border-r border-slate-200 dark:border-zinc-800 pr-4">
               <Users size={16} /> Manage Team
             </button>
           )}
           <button onClick={() => setShowProfileModal(true)} className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors border-r border-slate-200 dark:border-zinc-800 pr-4">
             <Settings size={16} /> My Profile
           </button>
           <div className="hidden sm:flex items-center gap-3 px-2 border-r border-slate-200 dark:border-zinc-800 pr-4">
              <img src={currentUser.avatar} alt="Profile" className="w-8 h-8 rounded-full border border-slate-200 dark:border-zinc-700 object-cover" />
              <div className="flex-1 min-w-0">
                 <p className="text-sm font-bold text-slate-900 dark:text-zinc-100 truncate">{currentUser.name}</p>
              </div>
           </div>
           <button onClick={onLogout} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-rose-500 transition-colors">
             <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
           </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 lg:p-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
            Selamat datang, {currentUser.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-500 text-lg">Pilih workspace project untuk mulai bekerja atau buat baru.</p>
        </div>

        {/* ============================================================== */}
        {/* EXECUTIVE DASHBOARD (HANYA MUNCUL JIKA ROLE ADALAH 'admin') */}
        {/* ============================================================== */}
        {currentUser.role === 'admin' && (
          <div className="mb-12 p-6 lg:p-8 bg-slate-900 dark:bg-zinc-900 rounded-3xl shadow-2xl text-white relative overflow-hidden">
            {/* Dekorasi Background */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
            
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
              <Activity className="text-emerald-400" /> Executive Financial Summary
            </h2>
            
            {/* Global Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 relative z-10">
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><TrendingUp size={14} className="text-blue-400"/> Total Revenue</p>
                <p className="text-2xl font-black text-white">{formatRp(globalRev)}</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><TrendingDown size={14} className="text-rose-400"/> Total Spent</p>
                <p className="text-2xl font-black text-white">{formatRp(globalSpent)}</p>
                <p className="text-[10px] text-slate-500 mt-1">dari budget {formatRp(globalBudget)}</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><Wallet size={14} className={globalProfit >= 0 ? "text-emerald-400" : "text-rose-400"}/> Net Profit</p>
                <p className={`text-2xl font-black ${globalProfit >= 0 ? "text-emerald-400" : "text-rose-400"}`}>{formatRp(globalProfit)}</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><PieChart size={14} className="text-amber-400"/> Global ROI</p>
                <p className="text-2xl font-black text-amber-400">{globalRoi}%</p>
              </div>
            </div>

            {/* Resume / Breakdown Per Project */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden relative z-10">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="p-4 font-bold">Nama Project</th>
                      <th className="p-4 font-bold text-right">Budget</th>
                      <th className="p-4 font-bold text-right">Realisasi</th>
                      <th className="p-4 font-bold text-right">Revenue</th>
                      <th className="p-4 font-bold text-right">Net Profit</th>
                      <th className="p-4 font-bold text-right">ROI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {adminConsolidated.map(p => (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-bold text-white">{p.name}</td>
                        <td className="p-4 text-right text-slate-300">{formatRp(p.budget)}</td>
                        <td className="p-4 text-right text-rose-300">{formatRp(p.spent)}</td>
                        <td className="p-4 text-right text-blue-300">{formatRp(p.rev)}</td>
                        <td className={`p-4 text-right font-bold ${p.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{formatRp(p.profit)}</td>
                        <td className="p-4 text-right text-amber-300">{p.roi}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* DAFTAR PROJECT YANG BISA DIAKSES */}
        <div className="flex items-center gap-2 mb-6">
          <Folder size={20} className="text-emerald-600" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Workspace Anda</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setShowNewModal(true)}
            className="h-48 border-2 border-dashed border-slate-300 dark:border-zinc-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-transparent hover:bg-emerald-50 dark:hover:bg-emerald-900/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors group shadow-sm"
          >
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            <h3 className="font-bold text-slate-700 dark:text-zinc-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">Buat Project Baru</h3>
          </motion.div>

          {projects.map((project) => (
            <motion.div 
              key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.02, y: -4 }}
              className="h-48 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col cursor-pointer shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-500/50 transition-all group relative"
              onClick={() => onSelectProject(project.id)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  <Folder size={24} />
                </div>
                {projects.length > 1 && project.owner === currentUser.username && (
                  <button onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id); }} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100" title="Hapus Project">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 truncate">{project.name}</h3>
              <div className="mt-auto flex items-center gap-4 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded-md"><LayoutDashboard size={12}/> {project.phases.length} Phases</span>
                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded-md"><Bot size={12}/> {project.personas.length} Personas</span>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Modal Profile Settings (Tidak diubah, tetap pakai yang tadi) */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-zinc-800">
              <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Profile Settings</h3>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="flex items-center gap-4 bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-200 dark:border-zinc-700">
                   <img src={profileData.avatar} className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500/30" alt="preview" />
                   <div className="flex-1">
                     <label className="text-xs font-bold text-slate-500 block mb-2">Ubah Foto Profil</label>
                     <label className="flex items-center justify-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs font-medium cursor-pointer hover:bg-slate-100 transition-colors">
                        <ImageIcon size={14}/> Upload Foto
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                     </label>
                   </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Nama Lengkap</label>
                  <input required value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Password Baru</label>
                  <input type="password" value={profileData.password} onChange={(e) => setProfileData({...profileData, password: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800">
                  <button type="button" onClick={() => setShowProfileModal(false)} className="flex-1 py-2.5 text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl transition-colors">Batal</button>
                  <button type="submit" className="flex-1 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-colors">Simpan</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Buat Project */}
      <AnimatePresence>
        {showNewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-zinc-800">
              <h3 className="text-xl font-bold mb-2">Nama Project Baru</h3>
              <p className="text-sm text-slate-500 mb-6">Workspace baru akan dibuat dengan layout kosong.</p>
              <form onSubmit={handleCreate}>
                <input autoFocus required value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} placeholder="e.g., Kampanye Ramadhan 2026" className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 mb-6" />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowNewModal(false)} className="flex-1 py-2.5 text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl transition-colors">Batal</button>
                  <button type="submit" className="flex-1 py-2.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/20 transition-colors">Buat Project</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};