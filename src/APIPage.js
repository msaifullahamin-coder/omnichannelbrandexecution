import React from 'react';
import { Link2, RefreshCcw, Plus } from 'lucide-react';
import { Card, Badge } from './components';
import { apiConnections } from './dummyData';

export const APIPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">API & Connections</h2>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">Manage integrations with external marketing tools & platforms</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto">
          <Link2 size={16} /> New Connection
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apiConnections.map((api) => (
          <Card key={api.id} className="relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-xl text-slate-600 dark:text-zinc-300">
                <api.icon size={24} />
              </div>
              <Badge variant={api.status === 'connected' ? 'success' : api.status === 'pending' ? 'warning' : 'danger'}>
                {api.status}
              </Badge>
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-zinc-100 mb-1">{api.name}</h3>
            <p className="text-sm text-slate-500 mb-6">{api.type}</p>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-zinc-800">
              <div className="flex items-center text-xs text-slate-400">
                <RefreshCcw size={12} className="mr-1" /> Last sync: {api.lastSync}
              </div>
              <button className={`text-sm font-medium ${api.status === 'connected' ? 'text-rose-500 hover:text-rose-600' : 'text-emerald-500 hover:text-emerald-600'}`}>
                {api.status === 'connected' ? 'Disconnect' : 'Connect'}
              </button>
            </div>
            {api.status === 'connected' && <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 blur-2xl rounded-full pointer-events-none" />}
          </Card>
        ))}
        
        <Card className="border-dashed border-2 border-slate-200 dark:border-zinc-800 bg-transparent hover:bg-slate-50 dark:hover:bg-zinc-800/50 flex flex-col items-center justify-center cursor-pointer transition-colors min-h-[220px]">
          <div className="p-4 bg-slate-100 dark:bg-zinc-800 rounded-full text-slate-400 mb-4 group-hover:scale-110 transition-transform">
            <Plus size={24} />
          </div>
          <h3 className="font-medium text-slate-600 dark:text-zinc-300">Add Integration</h3>
          <p className="text-xs text-slate-400 mt-1 text-center px-4">Connect to HubSpot CRM, Mailchimp, or custom Webhooks.</p>
        </Card>
      </div>
    </div>
  );
};