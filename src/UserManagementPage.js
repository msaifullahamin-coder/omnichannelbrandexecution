import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Shield, User as UserIcon, Key, Folder, CheckSquare, Square, X } from 'lucide-react';

export const UserManagementPage = ({ users, setUsers, currentUser, projects = [], setProjects }) => {
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fungsi buka pop-up centang akses
  const handleOpenAccess = (user) => {
    setSelectedUser(user);
    setShowAccessModal(true);
  };

  // Fungsi saat kotak dicentang / dihilangkan centangnya
  const handleToggleAccess = (projectId, currentlyHasAccess) => {
    setProjects(prevProjects => prevProjects.map(p => {
      if (p.id === projectId) {
        let newMembers;
        if (currentlyHasAccess) {
          // Cabut akses (Hapus nama dari daftar members)
          newMembers = p.members.filter(m => m !== selectedUser.username);
        } else {
          // Beri akses (Masukkan nama ke daftar members)
          newMembers = [...p.members, selectedUser.username];
        }
        return { ...p, members: newMembers };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Manage Team & Access</h2>
          <p className="text-slate-500 mt-1">Kelola anggota tim dan hak akses mereka ke setiap project.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/20">
          <Plus size={18} /> Tambah User
        </button>
      </div>

      {/* Tabel Daftar Pengguna */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-zinc-950/50 border-b border-slate-200 dark:border-zinc-800 text-xs uppercase tracking-wider text-slate-500 font-bold">
              <th className="p-4">User Info</th>
              <th className="p-4">Role</th>
              <th className="p-4">Akses Project</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
            {users.map((user) => {
              // Hitung user ini punya akses ke berapa project
              const accessibleProjectsCount = projects.filter(p => p.members && p.members.includes(user.username)).length;
              
              return (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full border border-slate-200 dark:border-zinc-700 object-cover" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-zinc-100">{user.name}</div>
                        <div className="text-xs text-slate-500">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${user.role === 'admin' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'}`}>
                      {user.role === 'admin' ? <Shield size={12}/> : <UserIcon size={12}/>}
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    {user.role === 'admin' ? (
                      <span className="text-xs font-bold text-slate-400">Semua Project (Bebas)</span>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">
                          {accessibleProjectsCount} Project
                        </span>
                        <button 
                          onClick={() => handleOpenAccess(user)}
                          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 px-2 py-1 rounded-md transition-colors"
                        >
                          <Key size={12} /> Atur Akses
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"><Edit2 size={16} /></button>
                      {user.username !== currentUser.username && (
                        <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL ATUR AKSES PROJECT */}
      <AnimatePresence>
        {showAccessModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-zinc-800">
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Key size={20} className="text-emerald-500" /> Akses Project
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">Centang project yang bisa dibuka oleh <b>{selectedUser.name}</b>.</p>
                </div>
                <button onClick={() => setShowAccessModal(false)} className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg"><X size={20} /></button>
              </div>

              {projects.length === 0 ? (
                <p className="text-center text-slate-500 py-4 text-sm">Belum ada project yang dibuat.</p>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar pr-2">
                  {projects.map(project => {
                    // Cek apakah user ini sudah ada di dalam daftar members project ini
                    const hasAccess = project.members && project.members.includes(selectedUser.username);
                    const isOwner = project.owner === selectedUser.username;

                    return (
                      <div 
                        key={project.id} 
                        onClick={() => !isOwner && handleToggleAccess(project.id, hasAccess)}
                        className={`flex items-center justify-between p-3 border rounded-xl transition-all ${isOwner ? 'bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 opacity-70 cursor-not-allowed' : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-700 hover:border-emerald-500 cursor-pointer shadow-sm'}`}
                      >
                        <div className="flex items-center gap-3">
                          <Folder size={18} className={hasAccess ? 'text-emerald-500' : 'text-slate-400'} />
                          <div>
                            <p className={`text-sm font-bold ${hasAccess ? 'text-slate-900 dark:text-zinc-100' : 'text-slate-500'}`}>{project.name}</p>
                            {isOwner && <p className="text-[10px] text-emerald-600 uppercase font-black tracking-wider">Project Owner</p>}
                          </div>
                        </div>
                        
                        <div>
                          {isOwner ? (
                            <CheckSquare size={20} className="text-slate-300 dark:text-zinc-700" />
                          ) : hasAccess ? (
                            <CheckSquare size={20} className="text-emerald-600" />
                          ) : (
                            <Square size={20} className="text-slate-300 dark:text-zinc-600" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800">
                <button onClick={() => setShowAccessModal(false)} className="w-full py-2.5 text-sm font-bold bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl transition-colors text-slate-700 dark:text-zinc-300">
                  Selesai
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};