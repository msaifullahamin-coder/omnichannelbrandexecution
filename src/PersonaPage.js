import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Target, Lightbulb, MapPin, Briefcase, 
  Smile, Frown, CheckCircle, ArrowRight, Save, 
  Download, FolderOpen, Trash2, Database, FileText, Loader2, Compass, UserCheck, Globe 
} from 'lucide-react';

export const PersonaPage = () => {
  // =========================================================================
  // 1. STATE UNTUK WIZARD & DATABASE LOKAL
  // =========================================================================
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [savedPersonas, setSavedPersonas] = useState([]);

  useEffect(() => {
    const localData = localStorage.getItem('saas_persona_projects');
    if (localData) {
      setSavedPersonas(JSON.parse(localData));
    }
  }, []);

  // =========================================================================
  // 2. STATE INPUT USER & HASIL AI
  // =========================================================================
  const [projectContext, setProjectContext] = useState({ industry: '', productName: '', description: '' });
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  // STATE BARU: Array untuk menyimpan banyak pilihan (Multi-Select)
  const [selectedPersonasIndices, setSelectedPersonasIndices] = useState([]);

  const [personaData, setPersonaData] = useState({
    market: { demographic: 'Belum ada data.', geographic: 'Belum ada data.', psychographic: 'Belum ada data.', behavioral: 'Belum ada data.' },
    personas: [] // Akan diisi 10 persona dari AI
  });

  // =========================================================================
  // 3. FUNGSI DATABASE LOKAL (SAVE, LOAD, DELETE)
  // =========================================================================
  const handleSaveProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: projectContext.productName || projectContext.industry || 'Project Tanpa Nama',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      context: projectContext,
      data: personaData,
      selectedIndices: selectedPersonasIndices // Simpan array pilihan user
    };

    const updatedProjects = [newProject, ...savedPersonas];
    setSavedPersonas(updatedProjects);
    localStorage.setItem('saas_persona_projects', JSON.stringify(updatedProjects));
    alert("Target Persona berhasil disimpan di Lobi!");
  };

  const loadProject = (project) => {
    setProjectContext(project.context);
    setPersonaData(project.data);
    setSelectedPersonasIndices(project.selectedIndices || []);
    setCurrentStep(4); 
  };

  const deleteProject = (id) => {
    if (window.confirm("Yakin ingin menghapus data persona ini?")) {
      const updatedProjects = savedPersonas.filter(p => p.id !== id);
      setSavedPersonas(updatedProjects);
      localStorage.setItem('saas_persona_projects', JSON.stringify(updatedProjects));
    }
  };

  const startNewProject = () => {
    setProjectContext({ industry: '', productName: '', description: '' });
    setSelectedFiles([]);
    setSelectedPersonasIndices([]);
    setCurrentStep(1);
  };

  // =========================================================================
  // 4. FUNGSI NAVIGASI WIZARD & EXPORT CSV
  // =========================================================================
  const handleSubmitStep1 = async () => {
    if (!projectContext.industry || !projectContext.description) {
      return alert("Harap isi Kategori Bisnis dan Deskripsi Project!");
    }
    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append('industry', projectContext.industry);
      formData.append('productName', projectContext.productName);
      formData.append('description', projectContext.description);
      selectedFiles.forEach((file, index) => { formData.append(`file_${index}`, file); });

      // MAS IPUL: PASTIKAN URL WEBHOOK N8N SUDAH BENAR DI SINI!
      const response = await fetch('https://n8n-ovmloglvzrcc.jkt4.sumopod.my.id/webhook-test/api-persona', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      setPersonaData(result);
      setSelectedPersonasIndices([]); // Kosongkan pilihan awal
      setCurrentStep(2);

    } catch (error) {
      console.error("Gagal konek ke n8n:", error);
      alert("Terjadi kesalahan saat menghubungi AI. Pastikan URL n8n sudah benar dan aktif (Listening).");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Fungsi Toggle untuk memilih/membatalkan pilihan Persona
  const togglePersonaSelection = (index) => {
    if (selectedPersonasIndices.includes(index)) {
      // Jika sudah terpilih, hapus dari array
      setSelectedPersonasIndices(selectedPersonasIndices.filter(i => i !== index));
    } else {
      // Jika belum terpilih, tambahkan ke array
      setSelectedPersonasIndices([...selectedPersonasIndices, index]);
    }
  };

  const downloadCSV = () => {
    let rows = [
      ["Tahap", "Kategori", "Detail", "Nilai / Hasil AI"],
      ["1. Brief", "Input", "Nama Produk/Brand", projectContext.productName || "-"],
      ["1. Brief", "Input", "Kategori Industri", projectContext.industry || "-"],
      ["2. Market", "Segmentasi", "Demografis", personaData.market?.demographic || "-"],
      ["2. Market", "Segmentasi", "Geografis", personaData.market?.geographic || "-"],
      ["2. Market", "Segmentasi", "Psikografis", personaData.market?.psychographic || "-"],
      ["2. Market", "Segmentasi", "Perilaku (Behavioral)", personaData.market?.behavioral || "-"]
    ];

    // Looping semua persona yang DIPILIH saja untuk dimasukkan ke Excel
    selectedPersonasIndices.forEach((index, i) => {
      const p = personaData.personas[index];
      rows.push(["3. Persona Terpilih", `Persona ${i+1}`, "Tipe / Peran", p.tipe || "-"]);
      rows.push(["3. Persona Terpilih", `Persona ${i+1}`, "Nama Fiktif", p.name || "-"]);
      rows.push(["3. Persona Terpilih", `Persona ${i+1}`, "Quote", p.quote || "-"]);
      rows.push(["3. Persona Terpilih", `Persona ${i+1}`, "Tujuan (Goals)", p.goals?.join("; ") || "-"]);
      rows.push(["3. Persona Terpilih", `Persona ${i+1}`, "Rasa Frustrasi", p.frustrations?.join("; ") || "-"]);
      rows.push(["4. Value", `Positioning ${i+1}`, "Inti Masalah", p.positioning?.problem || "-"]);
      rows.push(["4. Value", `Positioning ${i+1}`, "Solusi Kita", p.positioning?.solution || "-"]);
      rows.push(["4. Value", `Positioning ${i+1}`, "Value Proposition", p.positioning?.valueProp || "-"]);
      rows.push(["4. Value", `Positioning ${i+1}`, "Brand Statement", p.positioning?.statement || "-"]);
    });

    let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.map(item => `"${String(item).replace(/"/g, '""')}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TargetPersona_Multi_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // =========================================================================
  // 5. KOMPONEN UI BANTUAN
  // =========================================================================
  const InfoCard = ({ title, icon: Icon, value, colorClass }) => (
    <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 h-full">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}><Icon size={18} className={colorClass.replace('bg-', 'text-')} /></div>
        <h4 className="font-bold text-sm text-slate-800 dark:text-zinc-200 uppercase tracking-wide">{title}</h4>
      </div>
      <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">{value}</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      {/* HEADER & STEPPER */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-3 mb-3">
          <Target className="text-rose-500" size={32} /> Market & Persona Explorer
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto">Temukan siapa target pasar Anda, pilih beberapa persona yang paling tepat, dan tentukan positioning brand Anda.</p>
        
        <div className="flex justify-center items-center mt-8 gap-2 sm:gap-4 overflow-x-auto">
          {[{ step: 1, label: 'The Brief' }, { step: 2, label: 'Market Overview' }, { step: 3, label: 'Select Personas' }, { step: 4, label: 'Positioning' }].map((item) => (
            <div key={item.step} className="flex items-center gap-2 sm:gap-4">
              <div className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${currentStep === item.step ? 'bg-rose-500 text-white shadow-lg' : currentStep > item.step ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-slate-100 text-slate-400 dark:bg-zinc-800 dark:text-zinc-500'}`}>
                {currentStep > item.step ? <CheckCircle size={16} /> : <span>{item.step}</span>}
                <span className="hidden sm:inline">{item.label}</span>
              </div>
              {item.step < 4 && <div className={`w-4 sm:w-8 h-1 rounded-full ${currentStep > item.step ? 'bg-rose-500' : 'bg-slate-200 dark:bg-zinc-800'}`}></div>}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* ==========================================
            LANGKAH 1: THE BRIEF & LOBI PERSONA
        ========================================== */}
        {currentStep === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-8 rounded-3xl shadow-sm">
               <h3 className="text-2xl font-black mb-6 flex items-center gap-3 text-slate-800 dark:text-white"><Database className="text-blue-500"/> Riset Pasar Baru</h3>
               <div className="space-y-6">
                 <div>
                   <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Kategori Bisnis / Industri <span className="text-rose-500">*</span></label>
                   <input 
                     type="text" placeholder="Contoh: Skincare Organik, Aplikasi Keuangan, F&B..."
                     value={projectContext.industry} onChange={(e) => setProjectContext({...projectContext, industry: e.target.value})}
                     className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Nama Produk / Ide Bisnis (Opsional)</label>
                   <input 
                     type="text" placeholder="Misal: 'GlowUp Serum' atau 'Klinik Sehat Bersama'"
                     value={projectContext.productName} onChange={(e) => setProjectContext({...projectContext, productName: e.target.value})}
                     className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Deskripsi Singkat Solusi Anda <span className="text-rose-500">*</span></label>
                   <textarea 
                     rows="4" placeholder="Apa yang Anda jual? Apa kelebihan produk/layanan Anda dibandingkan yang lain?"
                     value={projectContext.description} onChange={(e) => setProjectContext({...projectContext, description: e.target.value})}
                     className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 focus:ring-2 focus:ring-rose-500 outline-none transition-all resize-none"
                   ></textarea>
                 </div>
                 <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                    <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Upload Data Mentah (Hasil Kuesioner/Survei)</label>
                    <div className="bg-slate-50 dark:bg-zinc-950 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl p-6 text-center hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors">
                      <input 
                          type="file" multiple accept=".pdf,.doc,.docx,.txt"
                          onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      />
                    </div>
                 </div>
               </div>
               <div className="mt-10 flex justify-end">
                 <button 
                   onClick={handleSubmitStep1} disabled={isAnalyzing}
                   className={`flex items-center gap-2 px-8 py-4 font-black rounded-xl transition-all shadow-lg ${isAnalyzing ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-rose-500 text-white hover:bg-rose-400 hover:scale-[1.02]'}`}
                 >
                   {isAnalyzing ? <Loader2 size={20} className="animate-spin" /> : 'Mulai Analisis Pasar'} {!isAnalyzing && <ArrowRight size={20} />}
                 </button>
               </div>
            </div>

            <div className="bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl h-fit">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white"><FolderOpen className="text-amber-500" size={20}/> Histori Riset</h3>
              {savedPersonas.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl">
                  <p className="text-sm text-slate-400">Belum ada riset pasar yang disimpan.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                  {savedPersonas.map((proj) => (
                    <div key={proj.id} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm hover:border-blue-400 transition-colors group">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-800 dark:text-white text-sm line-clamp-1">{proj.name}</h4>
                        <button onClick={() => deleteProject(proj.id)} className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={14}/></button>
                      </div>
                      <p className="text-xs text-slate-500 mb-3">{proj.date} • {proj.context.industry}</p>
                      <button onClick={() => loadProject(proj)} className="w-full py-2 bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 text-xs font-bold rounded-lg group-hover:bg-rose-100 transition-colors">Buka Riset</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ==========================================
            LANGKAH 2: MARKET OVERVIEW
        ========================================== */}
        {currentStep === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
             <div className="bg-white dark:bg-zinc-900 p-8 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-sm">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100 dark:border-zinc-800">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2"><Globe className="text-blue-500"/> Market Segmentation</h3>
                    <p className="text-slate-500 mt-1">Pembagian ceruk pasar berdasarkan hasil analisis AI.</p>
                  </div>
                  <button onClick={() => setCurrentStep(3)} className="flex items-center gap-2 px-6 py-3 font-bold text-white bg-rose-500 rounded-xl hover:bg-rose-400 transition-all">
                    Lanjut Pilih Persona <ArrowRight size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoCard title="Demografis (Siapa mereka?)" icon={Users} colorClass="bg-blue-500" value={personaData.market?.demographic} />
                  <InfoCard title="Geografis (Di mana mereka?)" icon={MapPin} colorClass="bg-emerald-500" value={personaData.market?.geographic} />
                  <InfoCard title="Psikografis (Gaya Hidup & Nilai)" icon={Lightbulb} colorClass="bg-purple-500" value={personaData.market?.psychographic} />
                  <InfoCard title="Perilaku (Habit & Interaksi)" icon={Briefcase} colorClass="bg-amber-500" value={personaData.market?.behavioral} />
                </div>
             </div>
          </motion.div>
        )}

        {/* ==========================================
            LANGKAH 3: PILIH BEBERAPA PERSONA (MULTI-SELECT)
        ========================================== */}
        {currentStep === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
             <div className="bg-white dark:bg-zinc-900 p-8 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-sm">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-zinc-800">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2"><Target className="text-rose-500"/> Pilih Target Persona Utama</h3>
                    <p className="text-slate-500 mt-1">
                      AI merekomendasikan {personaData.personas?.length || 0} tipe pelanggan. 
                      Anda telah memilih <strong className="text-rose-600">{selectedPersonasIndices.length}</strong> persona.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setCurrentStep(2)} className="px-6 py-3 font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-300">Kembali</button>
                    {/* Tombol Lanjut dinonaktifkan kalau belum ada yang dipilih */}
                    <button 
                      onClick={() => setCurrentStep(4)} 
                      disabled={selectedPersonasIndices.length === 0}
                      className={`flex items-center gap-2 px-6 py-3 font-bold rounded-xl transition-all ${selectedPersonasIndices.length === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-zinc-800' : 'text-white bg-rose-500 hover:bg-rose-400'}`}
                    >
                      Lanjut Positioning <ArrowRight size={18} />
                    </button>
                  </div>
                </div>

                {/* Grid Pilihan Persona (Scrollable horizontal kalau terlalu banyak) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[800px] overflow-y-auto p-2 custom-scrollbar">
                  {personaData.personas?.map((persona, index) => {
                    const isSelected = selectedPersonasIndices.includes(index);
                    return (
                      <div 
                        key={index} 
                        onClick={() => togglePersonaSelection(index)}
                        className={`relative cursor-pointer transition-all duration-300 rounded-3xl p-6 border-2 flex flex-col h-full ${isSelected ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/10 shadow-md scale-[1.02]' : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-rose-300'}`}
                      >
                        {/* Badge Terpilih */}
                        {isSelected && (
                          <div className="absolute -top-3 -right-3 bg-rose-500 text-white p-1.5 rounded-full shadow-lg z-10">
                            <UserCheck size={20} />
                          </div>
                        )}

                        <div className="text-center mb-6">
                          <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${isSelected ? 'text-rose-500' : 'text-slate-400'}`}>
                            {persona.tipe || `Tipe ${index + 1}`}
                          </div>
                          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${isSelected ? 'bg-rose-200 dark:bg-rose-800' : 'bg-slate-100 dark:bg-zinc-800'}`}>
                            <Users size={28} className={isSelected ? 'text-rose-600 dark:text-rose-300' : 'text-slate-400'} />
                          </div>
                          <h4 className="text-xl font-black text-slate-900 dark:text-white mb-1">{persona.name}</h4>
                          <p className="italic text-slate-500 text-xs line-clamp-2">"{persona.quote}"</p>
                        </div>

                        <div className="space-y-4 flex-1">
                          <div>
                            <h5 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-2"><Smile size={14}/> Goals</h5>
                            <ul className="space-y-1">
                              {persona.goals?.map((goal, idx) => (
                                <li key={idx} className="text-slate-600 dark:text-zinc-400 text-xs flex items-start gap-1.5"><div className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5 shrink-0"></div> <span className="line-clamp-2">{goal}</span></li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 mb-2"><Frown size={14}/> Pain Points</h5>
                            <ul className="space-y-1">
                              {persona.frustrations?.map((frust, idx) => (
                                <li key={idx} className="text-slate-600 dark:text-zinc-400 text-xs flex items-start gap-1.5"><div className="w-1 h-1 bg-rose-500 rounded-full mt-1.5 shrink-0"></div> <span className="line-clamp-2">{frust}</span></li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className={`mt-6 pt-4 border-t ${isSelected ? 'border-rose-200 dark:border-rose-900/30' : 'border-slate-100 dark:border-zinc-800'} text-center`}>
                          <span className={`text-sm font-bold ${isSelected ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}`}>
                            {isSelected ? '✓ Terpilih' : '+ Klik untuk Pilih'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
             </div>
          </motion.div>
        )}

        {/* ==========================================
            LANGKAH 4: POSITIONING (SEMUA PERSONA YANG DIPILIH)
        ========================================== */}
        {currentStep === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
             
             {/* Header Selesai */}
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-rose-50 dark:bg-rose-900/20 p-6 rounded-3xl border border-rose-100 dark:border-rose-900/50 sticky top-4 z-20 backdrop-blur-sm">
              <div>
                <h3 className="text-xl font-black text-rose-800 dark:text-rose-400">Riset Persona Selesai! 🎉</h3>
                <p className="text-sm text-rose-600 dark:text-rose-500 mt-1">Menampilkan positioning untuk <strong className="font-bold">{selectedPersonasIndices.length}</strong> persona terpilih.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={handleSaveProject} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-amber-500 text-white rounded-lg shadow-sm hover:bg-amber-400 transition-all">
                  <Save size={18} /> Simpan Laporan
                </button>
                <button onClick={downloadCSV} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-rose-600 text-white rounded-lg shadow-sm hover:bg-rose-500 transition-all">
                  <Download size={18} /> Export CSV
                </button>
                <button onClick={startNewProject} className="px-5 py-2.5 text-sm font-bold bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-lg shadow-sm border border-slate-200 dark:border-zinc-700 hover:bg-slate-50">
                  Riset Baru
                </button>
              </div>
            </div>

            {/* Render Positioning Block Untuk Setiap Persona Yang Dipilih */}
            {selectedPersonasIndices.map((index, i) => {
              const persona = personaData.personas[index];
              return (
                <div key={index} className="bg-white dark:bg-zinc-900 p-8 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-sm relative overflow-hidden">
                  {/* Label Urutan/Tipe di pojok */}
                  <div className="absolute top-0 right-0 bg-slate-100 dark:bg-zinc-800 px-4 py-2 rounded-bl-2xl font-bold text-xs text-slate-500 tracking-wider">
                    Pilihan {i + 1} : {persona.tipe}
                  </div>

                  <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2 mb-2">
                    <Compass className="text-indigo-500"/> Value & Positioning
                  </h3>
                  <p className="text-slate-500 mb-8 border-b border-slate-100 dark:border-zinc-800 pb-4">Target: <strong className="text-rose-500">{persona.name}</strong></p>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-rose-50 dark:bg-rose-950/30 p-6 rounded-2xl border border-rose-100 dark:border-rose-900/50">
                        <h4 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-3">The Problem (Inti Masalah)</h4>
                        <p className="text-slate-700 dark:text-zinc-300 text-sm leading-relaxed">{persona.positioning?.problem}</p>
                      </div>
                      <div className="bg-emerald-50 dark:bg-emerald-950/30 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
                        <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">Our Solution (Solusi Kita)</h4>
                        <p className="text-slate-700 dark:text-zinc-300 text-sm leading-relaxed">{persona.positioning?.solution}</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/50">
                      <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">Value Proposition</h4>
                      <p className="text-slate-800 dark:text-zinc-200 font-medium leading-relaxed">{persona.positioning?.valueProp}</p>
                    </div>

                    <div className="bg-slate-900 dark:bg-black p-8 rounded-2xl border border-slate-800 text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10"><Compass size={100} className="text-white"/></div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 relative z-10">Brand Positioning Statement</h4>
                      <p className="text-xl md:text-2xl font-black text-white leading-snug relative z-10">
                        "{persona.positioning?.statement}"
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};