import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, Droplet, Type, Image as ImageIcon, 
  Database, LayoutTemplate, Smile, HeartHandshake, Globe, Users, UserCircle,
  Sparkles, Loader2, FileText, ArrowRight, CheckCircle, Download,
  Save, FolderOpen, Trash2, Link2, Edit3, Compass
} from 'lucide-react';

export const BrandIdentityPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [savedProjects, setSavedProjects] = useState([]);
  const [availablePersonas, setAvailablePersonas] = useState([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState('');

  useEffect(() => {
    const localBrandData = localStorage.getItem('saas_brand_projects');
    if (localBrandData) setSavedProjects(JSON.parse(localBrandData));
    const localPersonaData = localStorage.getItem('saas_persona_projects');
    if (localPersonaData) setAvailablePersonas(JSON.parse(localPersonaData));
  }, []);

  const [projectContext, setProjectContext] = useState({ industry: '', description: '' });
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  const [brandNamingOptions, setBrandNamingOptions] = useState([]);
  const [selectedName, setSelectedName] = useState('');
  const [customName, setCustomName] = useState('');

  const [brandData, setBrandData] = useState({
    prism: { physique: '', personality: '', relationship: '', culture: '', reflection: '', selfImage: '' },
    logo: { primary: '', secondary: '', favicon: '' },
    colors: [],
    typography: { heading: { font: '', desc: '' }, subheading: { font: '', desc: '' }, body: { font: '', desc: '' } },
    graphics: { photography: '', iconography: '', pattern: '' }
  });

  const handleSubmitStep1 = async () => {
    if (!projectContext.industry || !projectContext.description) {
      return alert("Harap isi Kategori Bisnis dan Deskripsi Project!");
    }
    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append('industry', projectContext.industry);
      formData.append('description', projectContext.description);
      
      if (selectedPersonaId) {
        const linkedPersona = availablePersonas.find(p => p.id === selectedPersonaId);
        if (linkedPersona) formData.append('linkedPersonaData', JSON.stringify(linkedPersona.data));
      }

      if (selectedFiles.length === 0) {
        formData.append('file_0', new File(["-"], "dummy.txt", { type: "text/plain" }));
      } else {
        selectedFiles.forEach((f, i) => formData.append(`file_${i}`, f));
      }

      const response = await fetch('https://n8n-ovmloglvzrcc.jkt4.sumopod.my.id/webhook/api-brand-identity', {
        method: 'POST',
        body: formData
      });

      const rawText = await response.text();
      let finalData = {};
      
      try {
        let result = JSON.parse(rawText);
        let extractedString = "";
        
        if (Array.isArray(result) && result[0]?.text) {
            extractedString = result[0].text;
        } else if (result.text) {
            extractedString = result.text;
        } else {
            finalData = result; 
        }

        if (extractedString) {
            let cleanStr = extractedString.replace(/```json/gi, '').replace(/```/g, '').trim();
            finalData = JSON.parse(cleanStr);
        }
      } catch (e) {
        console.error("Gagal bongkar paket:", e);
        alert("Paket dari AI berantakan. Buka tab Console (Inspect) buat lihat isinya.");
        setIsAnalyzing(false);
        return;
      }
      
      setBrandNamingOptions(finalData.naming_options || []);
      setBrandData(finalData.brand_identity || finalData);
      
      setCurrentStep(2); 

    } catch (error) {
      console.error("Gagal konek:", error);
      alert("Error menghubungi n8n.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveProject = () => {
    const nameToSave = customName || selectedName || "Brand Tanpa Nama";
    const newProject = {
      id: Date.now().toString(),
      name: nameToSave,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      context: projectContext,
      brandName: nameToSave,
      data: brandData,
      linkedPersonaId: selectedPersonaId
    };
    const updated = [newProject, ...savedProjects];
    setSavedProjects(updated);
    localStorage.setItem('saas_brand_projects', JSON.stringify(updated));
    alert("Mantap! Brand Identity Berhasil Disimpan!");
  };

  // =========================================================================
  // FUNGSI BARU: DOWNLOAD CSV SUPER PROMPT
  // =========================================================================
  const handleDownloadCSV = () => {
    const brand = customName || selectedName || "Brand_Tanpa_Nama";
    const safeText = (text) => `"${(text || '').replace(/"/g, '""')}"`;

    let csvContent = "Kategori,Elemen,Value\n";
    
    csvContent += `Identitas Utama,Nama Brand,${safeText(brand)}\n`;
    
    csvContent += `Brand Prism,Physique,${safeText(brandData.prism?.physique)}\n`;
    csvContent += `Brand Prism,Personality,${safeText(brandData.prism?.personality)}\n`;
    csvContent += `Brand Prism,Relationship,${safeText(brandData.prism?.relationship)}\n`;
    csvContent += `Brand Prism,Culture,${safeText(brandData.prism?.culture)}\n`;
    csvContent += `Brand Prism,Reflection,${safeText(brandData.prism?.reflection)}\n`;
    csvContent += `Brand Prism,Self-Image,${safeText(brandData.prism?.selfImage)}\n`;

    csvContent += `Logo,Primary,${safeText(brandData.logo?.primary)}\n`;
    csvContent += `Logo,Secondary/Icon,${safeText(brandData.logo?.secondary || brandData.logo?.favicon)}\n`;

    brandData.colors?.forEach((c, i) => {
      csvContent += `Warna,Warna ${i+1} (${c.name}),${safeText(c.hex + " - " + c.desc)}\n`;
    });

    csvContent += `Tipografi,Heading,${safeText(brandData.typography?.heading?.font + " - " + brandData.typography?.heading?.desc)}\n`;
    csvContent += `Tipografi,Sub-Heading,${safeText(brandData.typography?.subheading?.font + " - " + brandData.typography?.subheading?.desc)}\n`;
    csvContent += `Tipografi,Body,${safeText(brandData.typography?.body?.font + " - " + brandData.typography?.body?.desc)}\n`;

    csvContent += `Grafis,Gaya Fotografi,${safeText(brandData.graphics?.photography)}\n`;
    csvContent += `Grafis,Ikonografi,${safeText(brandData.graphics?.iconography)}\n`;
    csvContent += `Grafis,Pola (Pattern),${safeText(brandData.graphics?.pattern)}\n`;

    // BONUS: Auto-Generated Prompt untuk Image Generator
    const colorList = brandData.colors?.map(c => c.hex).join(', ') || '';
    const photoStyle = brandData.graphics?.photography || 'aesthetic lighting';
    
    csvContent += `PROMPT GENERATOR,Banner Sosmed,${safeText(`Aesthetic social media promotional layout for ${brand}, featuring ${photoStyle}. Brand colors: ${colorList}. Minimalist, high-end, highly detailed, 8k`)}\n`;
    csvContent += `PROMPT GENERATOR,Packaging/Produk,${safeText(`Premium product packaging design for ${brand}. Accented with brand colors: ${colorList}. Studio lighting, realistic 3d render, 8k`)}\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `VisualKit_${brand.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadProject = (project) => {
    setProjectContext(project.context);
    setSelectedName(project.brandName);
    setBrandData(project.data);
    setSelectedPersonaId(project.linkedPersonaId || '');
    setCurrentStep(4);
  };

  const deleteProject = (id) => {
    if (window.confirm("Yakin mau hapus project ini?")) {
      const updated = savedProjects.filter(p => p.id !== id);
      setSavedProjects(updated);
      localStorage.setItem('saas_brand_projects', JSON.stringify(updated));
    }
  };

  const startNewProject = () => {
    setProjectContext({ industry: '', description: '' });
    setSelectedName('');
    setCustomName('');
    setCurrentStep(1);
  };

  const ReadOnlyField = ({ label, value }) => (
    <div className="mb-4 text-left">
      <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">{label}</label>
      <div className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 text-sm text-slate-700 dark:text-zinc-300 min-h-[4rem]">
        {value || <span className="text-slate-400 italic">Sedang diracik AI...</span>}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-3 mb-3">
          <Sparkles className="text-emerald-500" size={32} /> AI Brand Architect
        </h2>
        <div className="flex justify-center items-center mt-8 gap-2 overflow-x-auto">
          {['The Brief', 'The Naming', 'The Direction', 'The Execution'].map((label, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${currentStep === idx + 1 ? 'bg-emerald-500 text-white shadow-lg' : currentStep > idx + 1 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                {idx + 1}. {label}
              </div>
              {idx < 3 && <div className="w-4 h-0.5 bg-slate-200"></div>}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* STEP 1: BRIEF */}
        {currentStep === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-8 rounded-3xl shadow-sm text-left">
               <h3 className="text-xl font-black mb-6 flex items-center gap-2"><Database className="text-blue-500"/> Mulai Strategi Brand</h3>
               <div className="space-y-5">
                 <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-2xl">
                    <label className="block text-xs font-bold text-indigo-700 uppercase mb-2">Pilih Data Riset Persona</label>
                    <select value={selectedPersonaId} onChange={(e) => setSelectedPersonaId(e.target.value)} className="w-full bg-white dark:bg-zinc-950 border border-indigo-200 rounded-xl p-3 text-sm outline-none">
                      <option value="">-- Tanpa Hubungkan Persona --</option>
                      {availablePersonas.map(p => <option key={p.id} value={p.id}>{p.name} ({p.date})</option>)}
                    </select>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Kategori Bisnis</label>
                   <input type="text" value={projectContext.industry} onChange={(e) => setProjectContext({...projectContext, industry: e.target.value})} className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Contoh: Skincare, EduTech..."/>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Deskripsi & Pesan Brand</label>
                   <textarea rows="4" value={projectContext.description} onChange={(e) => setProjectContext({...projectContext, description: e.target.value})} className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 resize-none" placeholder="Visi brand Anda..."></textarea>
                 </div>
                 <button onClick={handleSubmitStep1} disabled={isAnalyzing} className="w-full py-4 bg-emerald-500 text-white font-black rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2">
                   {isAnalyzing ? <Loader2 className="animate-spin"/> : 'Generate Ide Brand'} <ArrowRight size={20}/>
                 </button>
               </div>
            </div>
            <div className="bg-slate-50 dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200 text-left">
              <h4 className="font-bold text-sm mb-4 flex items-center gap-2"><FolderOpen size={18} className="text-amber-500"/> Brand Tersimpan</h4>
              <div className="space-y-3">
                {savedProjects.length === 0 && <p className="text-xs text-slate-400 text-center py-4">Belum ada brand tersimpan.</p>}
                {savedProjects.map(p => (
                  <div key={p.id} className="bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-slate-100 flex justify-between items-center group shadow-sm">
                    <div>
                      <p className="font-bold text-xs line-clamp-1">{p.name}</p>
                      <p className="text-[10px] text-slate-400">{p.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => loadProject(p)} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><ArrowRight size={14}/></button>
                      <button onClick={() => deleteProject(p.id)} className="p-2 text-slate-300 hover:text-rose-500"><Trash2 size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: THE NAMING */}
        {currentStep === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="bg-white dark:bg-zinc-900 p-8 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-sm">
               <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                 <div className="text-left">
                    <h3 className="text-2xl font-black flex items-center gap-2"><CheckCircle className="text-emerald-500"/> Pilih Nama Brand</h3>
                    <p className="text-slate-500 text-sm mt-1">Pilih 1 dari 15 ide AI, atau masukkan kreasi Anda sendiri.</p>
                 </div>
                 <button onClick={() => setCurrentStep(3)} disabled={!selectedName && !customName} className={`px-8 py-3 rounded-xl font-bold transition-all ${(!selectedName && !customName) ? 'bg-slate-100 text-slate-400' : 'bg-emerald-500 text-white hover:scale-105 shadow-lg'}`}>
                   Lanjut ke Direction <ArrowRight className="inline ml-2" size={18}/>
                 </button>
               </div>

               <div className="mb-8 p-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 rounded-2xl text-left">
                  <label className="block text-xs font-bold text-emerald-700 uppercase mb-3 flex items-center gap-2"><Edit3 size={14}/> Nama Custom</label>
                  <input 
                    type="text" value={customName} 
                    onChange={(e) => { setCustomName(e.target.value); if(e.target.value) setSelectedName(''); }}
                    placeholder="Ketik nama brand..."
                    className="w-full bg-white dark:bg-zinc-950 border border-emerald-200 rounded-xl p-4 text-lg font-black outline-none focus:ring-2 focus:ring-emerald-500"
                  />
               </div>

               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                 {brandNamingOptions.map((name, idx) => (
                   <button 
                    key={idx} onClick={() => { setSelectedName(name); setCustomName(''); }}
                    className={`p-4 rounded-2xl border-2 transition-all text-sm font-bold h-24 flex items-center justify-center leading-tight ${selectedName === name ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md scale-105' : 'border-slate-100 hover:border-emerald-200 text-slate-600'}`}
                   >
                     {name}
                   </button>
                 ))}
               </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: THE DIRECTION (BRAND PRISM) */}
        {currentStep === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
             <div className="bg-emerald-50 dark:bg-emerald-950/50 p-6 rounded-3xl border border-emerald-100 flex flex-col md:flex-row justify-between items-center gap-4 text-left shadow-sm">
              <div>
                <h3 className="text-xl font-black text-emerald-800">Brand Direction: {customName || selectedName}</h3>
                <p className="text-xs text-emerald-600 mt-1">Panduan karakter dan esensi brand Anda.</p>
              </div>
              <button onClick={() => setCurrentStep(4)} className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg">
                Lanjut ke Execution <ArrowRight className="inline ml-2" size={18}/>
              </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-slate-200 p-8 rounded-[3rem] text-center shadow-xl">
               <h3 className="text-xl font-black mb-10 flex items-center justify-center gap-2"><Compass className="text-blue-500"/> Brand Identity Prism</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                 <div className="space-y-6">
                    <ReadOnlyField label="Physique (Visual Core)" value={brandData.prism?.physique}/>
                    <ReadOnlyField label="Relationship (Vibe)" value={brandData.prism?.relationship}/>
                    <ReadOnlyField label="Reflection (Target Perception)" value={brandData.prism?.reflection}/>
                 </div>
                 <div className="space-y-6">
                    <ReadOnlyField label="Personality (Voice)" value={brandData.prism?.personality}/>
                    <ReadOnlyField label="Culture (Values)" value={brandData.prism?.culture}/>
                    <ReadOnlyField label="Self-Image (User Feeling)" value={brandData.prism?.selfImage}/>
                 </div>
               </div>
            </div>
          </motion.div>
        )}

        {/* STEP 4: THE EXECUTION (VISUAL KIT) */}
        {currentStep === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            
            <div className="bg-emerald-50 dark:bg-emerald-950/50 p-6 rounded-3xl border border-emerald-100 flex flex-col md:flex-row justify-between items-center gap-4 text-left shadow-sm">
              <div>
                <h3 className="text-xl font-black text-emerald-800">Visual Kit: {customName || selectedName}</h3>
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><CheckCircle size={12}/> Ekspor data untuk pembuatan Image Asset.</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setCurrentStep(3)} className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">Kembali</button>
                <button onClick={handleSaveProject} className="px-4 py-2.5 bg-amber-500 text-white rounded-xl font-bold flex items-center gap-2 text-sm hover:bg-amber-400 transition-colors"><Save size={16}/> Simpan</button>
                {/* TOMBOL DOWNLOAD CSV BARU! */}
                <button onClick={handleDownloadCSV} className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 text-sm hover:bg-blue-500 transition-colors shadow-lg"><Download size={16}/> Download Prompts (CSV)</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white dark:bg-zinc-900 border border-slate-200 p-8 rounded-3xl text-left shadow-sm">
                  <h3 className="font-black mb-6 flex items-center gap-2"><ImageIcon className="text-blue-500"/> Logo Concept</h3>
                  <ReadOnlyField label="Primary Logo" value={brandData.logo?.primary}/>
                  <ReadOnlyField label="Secondary / Icon" value={brandData.logo?.secondary || brandData.logo?.favicon}/>
               </div>
               
               <div className="bg-white dark:bg-zinc-900 border border-slate-200 p-8 rounded-3xl text-left shadow-sm">
                  <h3 className="font-black mb-6 flex items-center gap-2"><Droplet className="text-rose-500"/> Color Palette</h3>
                  <div className="space-y-4">
                    {brandData.colors && brandData.colors.map((c, i) => (
                      <div key={i} className="flex gap-4 items-center bg-slate-50 dark:bg-zinc-950 p-3 rounded-2xl border border-slate-100 dark:border-zinc-800">
                        <div className="w-12 h-12 rounded-xl border border-black/10 shadow-inner shrink-0" style={{backgroundColor: c.hex || '#ccc'}}></div>
                        <div>
                          <p className="font-bold text-xs">{c.name || 'Warna'} <span className="text-slate-400 font-mono ml-2">{c.hex}</span></p>
                          <p className="text-[10px] text-slate-500 line-clamp-2 mt-1">{c.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white dark:bg-zinc-900 border border-slate-200 p-8 rounded-3xl text-left shadow-sm">
                  <h3 className="font-black mb-6 flex items-center gap-2"><Type className="text-emerald-500"/> Sistem Tipografi</h3>
                  <div className="mb-4 text-left">
                    <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Heading Font</label>
                    <div className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 rounded-xl p-4">
                      <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1">{brandData.typography?.heading?.font || '-'}</h4>
                      <p className="text-sm text-slate-600 dark:text-zinc-400">{brandData.typography?.heading?.desc || 'Menunggu AI...'}</p>
                    </div>
                  </div>
                  <div className="mb-4 text-left">
                    <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Sub-Heading Font</label>
                    <div className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 rounded-xl p-4">
                      <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">{brandData.typography?.subheading?.font || '-'}</h4>
                      <p className="text-sm text-slate-600 dark:text-zinc-400">{brandData.typography?.subheading?.desc || 'Menunggu AI...'}</p>
                    </div>
                  </div>
                  <div className="mb-4 text-left">
                    <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Body Text Font</label>
                    <div className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 rounded-xl p-4">
                      <h4 className="text-base font-medium text-slate-900 dark:text-white mb-1">{brandData.typography?.body?.font || '-'}</h4>
                      <p className="text-sm text-slate-600 dark:text-zinc-400">{brandData.typography?.body?.desc || 'Menunggu AI...'}</p>
                    </div>
                  </div>
               </div>

               <div className="bg-white dark:bg-zinc-900 border border-slate-200 p-8 rounded-3xl text-left shadow-sm">
                  <h3 className="font-black mb-6 flex items-center gap-2"><LayoutTemplate className="text-amber-500"/> Elemen Grafis Tambahan</h3>
                  <ReadOnlyField label="📷 Gaya Fotografi" value={brandData.graphics?.photography}/>
                  <ReadOnlyField label="🖋️ Ikonografi" value={brandData.graphics?.iconography}/>
                  <ReadOnlyField label="🌀 Pola (Pattern)" value={brandData.graphics?.pattern}/>
               </div>
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};