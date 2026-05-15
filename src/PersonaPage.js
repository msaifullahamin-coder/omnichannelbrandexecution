import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Users, Bot, FileText, Link2, Globe, 
  MoreVertical, Sparkles, Loader2, CheckCircle2, Upload, AlertCircle, Plus 
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, Badge, ProgressBar } from './components';
import { COLORS, personas } from './dummyData';

export const PersonaPage = ({ highlightPersonaName, setHighlightPersonaName }) => {
  const [showAiModal, setShowAiModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processSuccess, setProcessSuccess] = useState(false);

  // Efek untuk memfokuskan / menyorot persona tertentu yang dipilih dari PDCA
  useEffect(() => {
    if (highlightPersonaName) {
      setTimeout(() => {
        // Menggunakan regex untuk menghapus spasi dan mengubah jadi format ID yang valid
        const safeId = highlightPersonaName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        const el = document.getElementById(`persona-row-${safeId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('bg-emerald-50', 'dark:bg-emerald-900/20', 'ring-2', 'ring-emerald-500', 'transition-all', 'duration-300');
          setTimeout(() => {
            el.classList.remove('bg-emerald-50', 'dark:bg-emerald-900/20', 'ring-2', 'ring-emerald-500');
            setHighlightPersonaName(null);
          }, 2500);
        } else {
          setHighlightPersonaName(null); // Clear jika tidak ketemu
        }
      }, 100); // Beri sedikit jeda agar DOM terender sempurna
    }
  }, [highlightPersonaName, setHighlightPersonaName]);

  const handleSimulateProcess = (type) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setProcessSuccess(true);
      setTimeout(() => {
        setProcessSuccess(false);
        if(type === 'ai') setShowAiModal(false);
        if(type === 'import') setShowImportModal(false);
      }, 2000);
    }, 2500); // Simulasi loading 2.5 detik
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">Persona Intelligence</h2>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">Database of 2,000+ mapped audience profiles</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
           <button className="p-2 border border-slate-200 dark:border-zinc-800 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 hidden sm:block">
             <Search size={20} className="text-slate-500" />
           </button>
           <button className="flex flex-1 sm:flex-none justify-center items-center gap-2 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
             <Users size={16} /> Cluster Personas
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white border-none">
          <h3 className="text-emerald-100 text-sm font-medium mb-1">Total Persona Data</h3>
          <p className="text-4xl font-bold">2,450</p>
          <div className="mt-4 pt-4 border-t border-emerald-500/30">
            <p className="text-xs text-emerald-100">Top Segment: Urban Muslimah (65%)</p>
          </div>
        </Card>
        <Card>
           <h3 className="text-sm font-medium text-slate-500 mb-4">Demographic Breakdown</h3>
           <div className="h-24 flex items-center gap-4">
              <ResponsiveContainer width="40%" height="100%">
                <PieChart>
                  <Pie data={[{value: 65}, {value: 35}]} innerRadius={25} outerRadius={40} dataKey="value">
                    <Cell fill={COLORS.primary} />
                    <Cell fill={COLORS.secondary} />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="text-sm space-y-1">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-600"></span> Female (65%)</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Male (35%)</div>
              </div>
           </div>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-slate-500 mb-4">Top Pain Points</h3>
          <div className="space-y-3">
             <div>
               <div className="flex justify-between text-xs mb-1"><span>Takut salah tajwid</span><span>85%</span></div>
               <ProgressBar progress={85} />
             </div>
             <div>
               <div className="flex justify-between text-xs mb-1"><span>Belajar ngaji mahal/malu</span><span>62%</span></div>
               <ProgressBar progress={62} colorClass="bg-amber-500" />
             </div>
          </div>
        </Card>
      </div>

      {/* 4 OPSI PERSONA ENGINEERING (DATA SOURCES) */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 mb-3 uppercase tracking-wider">Acquisition Methods</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* 1. AI Auto-Generation (Interactive) */}
          <div 
            onClick={() => setShowAiModal(true)}
            className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-emerald-500/30 hover:border-emerald-500 shadow-sm cursor-pointer transition-all hover:-translate-y-1 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-xl rounded-full pointer-events-none group-hover:bg-emerald-500/20 transition-colors" />
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Bot size={20} />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-zinc-100 text-sm mb-1">AI Generation</h4>
            <p className="text-xs text-slate-500">Generate realistic personas using AI prompts.</p>
          </div>

          {/* 2. CSV/Excel Import (Interactive) */}
          <div 
            onClick={() => setShowImportModal(true)}
            className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 hover:border-blue-500/50 shadow-sm cursor-pointer transition-all hover:-translate-y-1 group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
              <FileText size={20} />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-zinc-100 text-sm mb-1">Import Data</h4>
            <p className="text-xs text-slate-500">Upload CSV/Excel of existing customers.</p>
          </div>

          {/* 3. Meta API Connection (Disabled) */}
          <div className="bg-slate-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 opacity-60 cursor-not-allowed relative">
            <div className="absolute top-3 right-3">
              <Badge variant="warning">Soon</Badge>
            </div>
            <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-zinc-800 text-slate-400 flex items-center justify-center mb-3">
              <Link2 size={20} />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-zinc-100 text-sm mb-1">Meta API Sync</h4>
            <p className="text-xs text-slate-500">Sync with Facebook Audience Insights.</p>
          </div>

          {/* 4. Social Listening (Disabled) */}
          <div className="bg-slate-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 opacity-60 cursor-not-allowed relative">
            <div className="absolute top-3 right-3">
              <Badge variant="warning">Soon</Badge>
            </div>
            <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-zinc-800 text-slate-400 flex items-center justify-center mb-3">
              <Globe size={20} />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-zinc-100 text-sm mb-1">Social Listening</h4>
            <p className="text-xs text-slate-500">Deep web search for pain points & trends.</p>
          </div>

        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap sm:whitespace-normal">
            <thead className="text-xs text-slate-500 bg-slate-50 dark:bg-zinc-800/50 uppercase">
              <tr>
                <th className="px-4 sm:px-6 py-4">Profile</th>
                <th className="px-4 sm:px-6 py-4">Segment</th>
                <th className="px-4 sm:px-6 py-4">Key Pain Point</th>
                <th className="px-4 sm:px-6 py-4 hidden sm:table-cell">Interests</th>
                <th className="px-4 sm:px-6 py-4 text-center">Score</th>
                <th className="px-4 sm:px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {personas.map((p, i) => (
                <tr 
                  id={`persona-row-${p.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`} 
                  key={p.id} 
                  className="border-b border-slate-100 dark:border-zinc-800 hover:bg-slate-50/50 dark:hover:bg-zinc-800/20"
                >
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={`https://i.pravatar.cc/100?img=${i+20}`} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" alt="" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-zinc-100">{p.name}</p>
                        <p className="text-xs text-slate-500">Age: {p.age}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4"><Badge>{p.type}</Badge></td>
                  <td className="px-4 sm:px-6 py-4 text-slate-600 dark:text-zinc-400 truncate max-w-[150px] sm:max-w-none">{p.pain}</td>
                  <td className="px-4 sm:px-6 py-4 text-slate-600 dark:text-zinc-400 hidden sm:table-cell">{p.interest}</td>
                  <td className="px-4 sm:px-6 py-4 text-center">
                    <span className={`font-bold ${p.score > 85 ? 'text-emerald-500' : 'text-amber-500'}`}>{p.score}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-emerald-500"><MoreVertical size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL: AI GENERATION */}
      <AnimatePresence>
        {showAiModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-2xl border border-emerald-500/20"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg"><Sparkles size={20}/></div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Persona Generator</h3>
                </div>
                <button disabled={isProcessing} onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-slate-600"><Plus size={24} className="rotate-45" /></button>
              </div>
              
              {!processSuccess ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Target Description / Prompt</label>
                    <textarea 
                      rows="4" 
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                      defaultValue="Buatkan saya 50 persona untuk produk Mushaf Tajwid seharga Rp 150.000. Target audiens: Milenial & Gen Z Muslimah yang ingin belajar ngaji dari nol tapi malu."
                    ></textarea>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
                    <button disabled={isProcessing} onClick={() => setShowAiModal(false)} className="w-full sm:w-auto px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg">Cancel</button>
                    <button 
                      onClick={() => handleSimulateProcess('ai')} 
                      disabled={isProcessing}
                      className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all"
                    >
                      {isProcessing ? <><Loader2 size={16} className="animate-spin" /> Generating Data...</> : 'Generate Personas'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">50 Personas Generated!</h4>
                   <p className="text-sm text-slate-500">The new personas have been analyzed and added to the database.</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: IMPORT CSV */}
      <AnimatePresence>
        {showImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-zinc-800"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><Upload size={20}/></div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Import Leads Data</h3>
                </div>
                <button disabled={isProcessing} onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600"><Plus size={24} className="rotate-45" /></button>
              </div>
              
              {!processSuccess ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-200 dark:border-zinc-700 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 dark:bg-zinc-950 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
                     <FileText size={32} className="text-slate-400 mb-3" />
                     <p className="text-sm font-medium text-slate-700 dark:text-zinc-300">Click to upload or drag and drop</p>
                     <p className="text-xs text-slate-500 mt-1">CSV, XLS, or XLSX (Max 10MB)</p>
                     <input type="file" className="hidden" />
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-lg">
                    <AlertCircle size={16} className="text-amber-600 shrink-0" />
                    <p className="text-xs text-amber-700 dark:text-amber-400">AI will automatically analyze, enrich, and cluster your raw lead data into defined personas.</p>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
                    <button disabled={isProcessing} onClick={() => setShowImportModal(false)} className="w-full sm:w-auto px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg">Cancel</button>
                    <button 
                      onClick={() => handleSimulateProcess('import')} 
                      disabled={isProcessing}
                      className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
                    >
                      {isProcessing ? <><Loader2 size={16} className="animate-spin" /> Processing Data...</> : 'Analyze & Import'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Import Successful!</h4>
                   <p className="text-sm text-slate-500">1,240 rows imported and clustered into 4 primary segments.</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};