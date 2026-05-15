import React, { useState } from 'react';
import { Bot, AlertCircle } from 'lucide-react';
import { Card } from './components';

export const LoginPage = ({ users, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('Username atau password salah!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-2xl border-emerald-500/20">
        <div className="flex justify-center mb-6">
           <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
             <Bot size={28} />
           </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">Welcome to OmniCore AI</h2>
        <p className="text-center text-sm text-slate-500 mb-8">Silakan login untuk mengakses dashboard.</p>

        {error && (
          <div className="mb-4 p-3 bg-rose-100 text-rose-700 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1 uppercase">Username</label>
            <input 
              required 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" 
              placeholder="Masukkan username" 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1 uppercase">Password</label>
            <input 
              required 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" 
              placeholder="••••••••" 
            />
          </div>
          <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-colors mt-2">
            Login
          </button>
        </form>

        <div className="mt-6 text-center border-t border-slate-100 dark:border-zinc-800 pt-4">
          <p className="text-xs text-slate-400 mb-2">Gunakan akun dummy:</p>
          <div className="flex justify-center gap-4 text-xs">
             <div className="bg-slate-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg">
                <span className="font-medium text-slate-500">Admin: </span>
                <span className="text-emerald-600 font-bold">saifull / 123</span>
             </div>
             <div className="bg-slate-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg">
                <span className="font-medium text-slate-500">User: </span>
                <span className="text-blue-600 font-bold">azka / 123</span>
             </div>
          </div>
        </div>
      </Card>
    </div>
  );
};