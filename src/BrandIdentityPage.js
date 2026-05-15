import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, Box, Droplet, Type, Image as ImageIcon, 
  Upload, Download, Check, Database, LayoutTemplate, 
  Smile, HeartHandshake, Globe, Users, UserCircle, Plus, X,
  Sparkles, Wand2, Loader2, ArrowRight
} from 'lucide-react';

export const BrandIdentityPage = () => {
  const [activeTab, setActiveTab] = useState('prism');
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  // === STATE DATA SUNGGUHAN ===
  const [brandData, setBrandData] = useState({
    prism: {
      physique: 'Desain cover modern dengan variasi warna elegan (merah, hijau, biru, hitam), kertas HVS putih bersih yang kontras, dan ukuran A5 yang sangat praktis untuk mobilitas tinggi.',
      personality: 'Memotivasi, edukatif, praktis, dan suportif. Bertindak layaknya "mentor spiritual" yang mudah dipahami (relatable) dan tidak menggurui.',
      relationship: 'Membangun kemitraan dalam perjalanan spiritual (self-improvement) individu. Memberikan rasa aman dari kecemasan melakukan kesalahan fatal (lahn jali) saat membaca Al-Qur\'an.',
      culture: 'Nilai keseimbangan antara kehidupan material dan spiritual. Menjunjung tinggi konsep pembelajaran berkelanjutan (lifelong learning) dan adaptasi progresif.',
      reflection: 'Individu dewasa yang melek teknologi, sibuk berkarir, namun mencari efisiensi (just-in-time learning) untuk memperbaiki tajwid secara mandiri di sela waktu kerja.',
      selfImage: '"Saya adalah \'Muslim Progresif\' yang mampu memperbaiki kualitas ibadah secara mandiri di tengah kesibukan profesional saya."'
    },
    logo: { 
      primary: 'Logomark diposisikan di atas (center-aligned) dengan Logotype "AQSHOR" di bawahnya. Menggunakan font Serif yang bersih dan elegan (huruf kapital semua) dengan kerning longgar untuk kesan premium. Di bawahnya terdapat tagline kecil "Tajwid Triple Kode".', 
      secondary: 'Logomark berada di sebelah kiri, disusul dengan Logotype "AQSHOR" di sebelah kanan. Digunakan untuk header website, spanduk marketplace, atau banner toko TikTok/Shopee yang ruang vertikalnya terbatas.', 
      favicon: 'Penggabungan abstrak bentuk "Buku Terbuka" dan huruf "A". Ujung garis melengkung halus (rounded) melambangkan inklusivitas dan edukasi ramah. Identitas kuat untuk profile picture.' 
    },
    colors: [
      { id: 1, name: 'Aqshor Navy', hex: '#1B305A', desc: 'Biru gelap yang elegan. Melambangkan kedalaman ilmu, ketenangan ibadah, dan profesionalisme. Sangat cocok untuk teks utama dan logo.' },
      { id: 2, name: 'Purity White', hex: '#FFFFFF', desc: 'Mewakili kertas HVS putih bersih. Memberikan negative space yang luas agar mata tidak cepat lelah saat melihat konten tajwid.' },
      { id: 3, name: 'Emerald Green', hex: '#2E7D32', desc: 'Hijau elegan untuk aksen islami yang segar.' },
      { id: 4, name: 'Ruby Red', hex: '#C62828', desc: 'Merah redup untuk penekanan pada fitur diskon atau urgency di promo marketplace.' },
      { id: 5, name: 'Gold Sand', hex: '#D4AF37', desc: 'Emas matte untuk sentuhan premium pada elemen garis, ikon, atau pita pembatas buku.' }
    ],
    typography: {
      heading: { font: 'Playfair Display / Lora', desc: 'Font Serif. Memiliki lekukan elegan dan sentuhan editorial klasik, cocok untuk kutipan ayat, judul konten edukasi, dan nama produk.' },
      subheading: { font: 'Montserrat', desc: 'Font Sans-Serif (Medium/Semi-Bold). Geometris, modern, memberikan struktur rapi untuk memisahkan hierarki.' },
      body: { font: 'Inter / Open Sans', desc: 'Font Sans-Serif (Regular). Keterbacaan layar sangat tinggi. Ideal untuk deskripsi panjang tanpa membuat mata lelah.' }
    },
    graphics: { 
      photography: 'Aesthetic Prayer Corner: Latar interior rumah minimalis, cahaya alami matahari, properti sajadah estetik, sukulen, tasbih, teh.\n\nTeknik Makro: Foto close-up tajam menyoroti detail tekstur kertas dan tinta "Triple Kode".', 
      iconography: 'Line-art minimalis dengan stroke konsisten (2px).\nIkon UVP: "Mata" (visual warna), "Bibir/Mic" (fonetik huruf), dan "Jam Pasir" (durasi simbol).', 
      pattern: 'Garis lengkung geometris tipis disamarkan (opacity 5-10%) sebagai watermark. Hindari pola geometri Islam (Arabesque) yang terlalu padat agar tidak mengganggu informasi.' 
    }
  });

  // === STATE KHUSUS AI VISUALIZER ===
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);

  // Fungsi meracik prompt dari data Brand
  const handleAutoGeneratePrompt = () => {
    const colorList = brandData.colors.map(c => c.name).join(', ');
    const autoPrompt = `A highly aesthetic, photorealistic product photography moodboard. \n\nCore Vibe: ${brandData.prism.culture} The personality is ${brandData.prism.personality} \n\nColor Palette focus: ${colorList}. \n\nVisual Style: ${brandData.graphics.photography} \n\nAdditional elements: Minimalist, 8k resolution, cinematic natural lighting, extremely detailed texture, modern islamic design aesthetic.`;
    setAiPrompt(autoPrompt);
  };

  // Fungsi Simulasi Webhook ke n8n
  const handleGenerateVisual = () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    setGeneratedImages([]); // Kosongkan galeri sebelumnya

    // Simulasi n8n memproses API Midjourney/DALL-E selama 3 detik
    setTimeout(() => {
      // Mockup hasil kembalian dari Webhook n8n
      setGeneratedImages([
        'https://images.unsplash.com/photo-1600431521340-491eca880813?w=600&q=80',
        'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=600&q=80',
        'https://images.unsplash.com/photo-1519892300165-cb5548fc3781?w=600&q=80',
        'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&q=80'
      ]);
      setIsGenerating(false);
    }, 3500);
  };

  // === FUNGSI TAMBAH / HAPUS WARNA ===
  const handleAddColor = () => {
    const newId = brandData.colors.length > 0 ? Math.max(...brandData.colors.map(c => c.id)) + 1 : 1;
    setBrandData({ ...brandData, colors: [...brandData.colors, { id: newId, name: 'New Color', hex: '#CCCCCC', desc: '' }] });
  };
  const handleRemoveColor = (id) => {
    setBrandData({ ...brandData, colors: brandData.colors.filter(c => c.id !== id) });
  };

  // === FUNGSI EXPORT / IMPORT CSV ===
  const handleDownloadCSV = () => {
    const escapeCSV = (str) => `"${String(str || '').replace(/"/g, '""')}"`;
    const rawRows = [
      ["KATEGORI", "NAMA ELEMEN", "VALUE (HEX/FONT/DSB)", "DESKRIPSI / KETENTUAN"],
      ["PRISMA", "Physique (Fisik)", "-", brandData.prism.physique],
      ["PRISMA", "Personality (Kepribadian)", "-", brandData.prism.personality],
      ["PRISMA", "Relationship (Hubungan)", "-", brandData.prism.relationship],
      ["PRISMA", "Culture (Budaya)", "-", brandData.prism.culture],
      ["PRISMA", "Reflection (Refleksi)", "-", brandData.prism.reflection],
      ["PRISMA", "Self-Image (Citra Diri)", "-", brandData.prism.selfImage],
      ["LOGO", "Logo Utama (Primary)", "-", brandData.logo.primary],
      ["LOGO", "Logo Sekunder (Horizontal)", "-", brandData.logo.secondary],
      ["LOGO", "Ikon / Favicon", "-", brandData.logo.favicon],
      ...brandData.colors.map(c => ["WARNA", c.name, c.hex, c.desc]),
      ["TIPOGRAFI", "Heading", brandData.typography.heading.font, brandData.typography.heading.desc],
      ["TIPOGRAFI", "Sub-Heading", brandData.typography.subheading.font, brandData.typography.subheading.desc],
      ["TIPOGRAFI", "Body Text", brandData.typography.body.font, brandData.typography.body.desc],
      ["GRAFIS TAMBAHAN", "Gaya Fotografi", "-", brandData.graphics.photography],
      ["GRAFIS TAMBAHAN", "Ikonografi", "-", brandData.graphics.iconography],
      ["GRAFIS TAMBAHAN", "Pola (Pattern)", "-", brandData.graphics.pattern]
    ];
    const csvString = "\uFEFF" + rawRows.map(row => row.map(escapeCSV).join(",")).join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "Template_BrandIdentity.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsImporting(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target.result;
      const parseCSVRow = (text) => {
        const rows = []; let curRow = []; let curCell = ''; let inQuotes = false;
        for (let i = 0; i < text.length; i++) {
          const c = text[i];
          if (c === '"' && text[i+1] === '"') { curCell += '"'; i++; } 
          else if (c === '"') { inQuotes = !inQuotes; } 
          else if (c === ',' && !inQuotes) { curRow.push(curCell); curCell = ''; } 
          else if ((c === '\n' || c === '\r') && !inQuotes) { 
            if (c === '\r' && text[i+1] === '\n') i++; 
            curRow.push(curCell); rows.push(curRow); curRow = []; curCell = ''; 
          } else { curCell += c; } 
        }
        if (curCell !== '' || curRow.length > 0) { curRow.push(curCell); rows.push(curRow); }
        return rows;
      };

      const parsedRows = parseCSVRow(csvText);
      const newData = JSON.parse(JSON.stringify(brandData));
      
      const hasNewColors = parsedRows.some(row => row[0]?.trim() === 'WARNA');
      if (hasNewColors) newData.colors = []; 
      let colorIdCounter = 1;

      parsedRows.forEach((row, index) => {
        if (index === 0 || row.length < 4) return; 
        const category = row[0].trim(); const element = row[1].trim();
        const valueColumn = row[2].trim(); const description = row[3].trim();

        if (category === 'PRISMA') {
          if (element.includes('Physique')) newData.prism.physique = description;
          if (element.includes('Personality')) newData.prism.personality = description;
          if (element.includes('Relationship')) newData.prism.relationship = description;
          if (element.includes('Culture')) newData.prism.culture = description;
          if (element.includes('Reflection')) newData.prism.reflection = description;
          if (element.includes('Self-Image')) newData.prism.selfImage = description;
        } 
        else if (category === 'LOGO') {
          if (element.includes('Primary')) newData.logo.primary = description;
          if (element.includes('Horizontal')) newData.logo.secondary = description;
          if (element.includes('Favicon')) newData.logo.favicon = description;
        }
        else if (category === 'WARNA') {
          newData.colors.push({ id: colorIdCounter++, name: element || `Color ${colorIdCounter}`, hex: valueColumn !== '-' ? valueColumn : '#CCCCCC', desc: description });
        }
        else if (category === 'TIPOGRAFI') {
          if (element.toLowerCase().includes('heading')) { newData.typography.heading.font = valueColumn; newData.typography.heading.desc = description; }
          if (element.toLowerCase().includes('sub-heading')) { newData.typography.subheading.font = valueColumn; newData.typography.subheading.desc = description; }
          if (element.toLowerCase().includes('body text')) { newData.typography.body.font = valueColumn; newData.typography.body.desc = description; }
        }
        else if (category === 'GRAFIS TAMBAHAN') {
          if (element.toLowerCase().includes('fotografi')) newData.graphics.photography = description;
          if (element.toLowerCase().includes('ikonografi')) newData.graphics.iconography = description;
          if (element.toLowerCase().includes('pola')) newData.graphics.pattern = description;
        }
      });

      setTimeout(() => {
        setBrandData(newData); setIsImporting(false); setImportSuccess(true);
        setTimeout(() => setImportSuccess(false), 3000);
      }, 800); 
    };
    reader.readAsText(file); 
  };

  const EditField = ({ label, value, onChange, placeholder = "Ketik panduan di sini..." }) => (
    <div className="mb-4">
      <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">{label}</label>
      <textarea value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-slate-700 dark:text-zinc-300 outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none h-24 custom-scrollbar" />
    </div>
  );

  const EditPrismCard = ({ title, icon: Icon, colorClass, value, field }) => (
    <motion.div whileHover={{ scale: 1.02, zIndex: 20 }} className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col items-center text-center relative w-full md:w-[320px] z-10">
      <div className={`w-10 h-10 rounded-2xl mb-3 flex items-center justify-center bg-slate-50 dark:bg-zinc-800 ${colorClass}`}><Icon size={20} /></div>
      <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">{title}</h4>
      <textarea value={value} onChange={(e) => setBrandData({...brandData, prism: {...brandData.prism, [field]: e.target.value}})} placeholder={`Ketik ${title} di sini...`} className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-3 text-xs text-slate-600 dark:text-zinc-400 outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none h-32 custom-scrollbar text-center" />
    </motion.div>
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Palette className="text-emerald-500" /> Brand Identity (Editable)
          </h2>
          <p className="text-slate-500 mt-1">Platform CMS: Atur, edit, dan export panduan visual Aqshor Anda.</p>
        </div>
      </div>

      <div className="flex overflow-x-auto custom-scrollbar border-b border-slate-200 dark:border-zinc-800">
        <button onClick={() => setActiveTab('master')} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'master' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}><Database size={18} /> Master Sync</button>
        <button onClick={() => setActiveTab('prism')} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'prism' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}><Box size={18} /> Brand Prism</button>
        <button onClick={() => setActiveTab('logos')} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'logos' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}><ImageIcon size={18} /> Logo & Colors</button>
        <button onClick={() => setActiveTab('typo')} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'typo' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}><Type size={18} /> Typo & Graphics</button>
        {/* NEW TAB: AI VISUALIZER */}
        <button onClick={() => setActiveTab('visualizer')} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'visualizer' ? 'border-purple-500 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}><Sparkles size={18} className={activeTab === 'visualizer' ? 'text-purple-500' : ''} /> AI Visualizer</button>
      </div>

      <AnimatePresence mode="wait">
        
        {/* TAB 1: MASTER SYNC */}
        {activeTab === 'master' && (
          <motion.div key="master" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="pt-4 space-y-6">
            <div className="bg-emerald-600 dark:bg-emerald-900/40 border border-emerald-500/50 p-8 rounded-3xl text-white relative overflow-hidden">
               <div className="relative z-10 max-w-2xl">
                 <h3 className="text-2xl font-black mb-2 flex items-center gap-3"><Database /> Sinkronisasi Master File CSV</h3>
                 <p className="text-emerald-100 mb-8 leading-relaxed">Ingin mengubah seluruh data brand sekaligus? Download template CSV di bawah, isi kolom Value dan Deskripsinya menggunakan Excel, lalu upload kembali ke sini. Seluruh halaman akan otomatis membaca dan menyimpan file CSV Anda.</p>
                 <div className="flex flex-col sm:flex-row gap-4">
                   <button onClick={handleDownloadCSV} className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition-all"><Download size={18}/> 1. Download Current Data (.csv)</button>
                   <div className="relative flex-1 max-w-xs">
                     {isImporting ? (
                       <div className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-emerald-600 font-bold rounded-xl w-full">Membaca File CSV...</div>
                     ) : importSuccess ? (
                       <div className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-800 text-white font-bold rounded-xl w-full"><Check size={18}/> Data Berhasil Dibaca!</div>
                     ) : (
                       <>
                         <input type="file" accept=".csv" onChange={handleImportCSV} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                         <button className="flex items-center justify-center gap-2 px-6 py-3 font-bold rounded-xl transition-all w-full bg-white text-emerald-700 hover:bg-emerald-50 shadow-lg shadow-black/10"><Upload size={18}/> 2. Upload Excel / CSV</button>
                       </>
                     )}
                   </div>
                 </div>
               </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: BRAND PRISM */}
        {activeTab === 'prism' && (
          <motion.div key="prism" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="pt-4">
            <div className="mb-8 text-center"><h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2 mb-2"><Box className="text-blue-500" /> Editable Brand Prism</h3></div>
            <div className="relative py-12 px-4 sm:px-10 bg-slate-100 dark:bg-zinc-900/30 rounded-[3rem] border border-slate-200 dark:border-zinc-800 flex flex-col items-center overflow-hidden">
              <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block opacity-40 dark:opacity-20" style={{ zIndex: 0 }}>
                 <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="currentColor" className="text-slate-400" strokeWidth="2" />
                 <line x1="50%" y1="15%" x2="15%" y2="50%" stroke="currentColor" className="text-slate-400" strokeWidth="2" strokeDasharray="8 8" />
                 <line x1="15%" y1="50%" x2="50%" y2="85%" stroke="currentColor" className="text-slate-400" strokeWidth="2" strokeDasharray="8 8" />
                 <line x1="50%" y1="85%" x2="85%" y2="50%" stroke="currentColor" className="text-slate-400" strokeWidth="2" strokeDasharray="8 8" />
                 <line x1="85%" y1="50%" x2="50%" y2="15%" stroke="currentColor" className="text-slate-400" strokeWidth="2" strokeDasharray="8 8" />
              </svg>
              <div className="text-xs font-black tracking-widest text-slate-500 uppercase mb-8 bg-slate-100 dark:bg-zinc-900/30 px-4 z-10 rounded-full">⬇ Picture of Sender ⬇</div>
              <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-12 w-full max-w-4xl z-10 relative">
                 <EditPrismCard title="Physique" icon={ImageIcon} colorClass="text-blue-500" field="physique" value={brandData.prism.physique} />
                 <EditPrismCard title="Personality" icon={Smile} colorClass="text-amber-500" field="personality" value={brandData.prism.personality} />
              </div>
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0 w-full max-w-6xl my-8 z-10 relative">
                 <EditPrismCard title="Relationship" icon={HeartHandshake} colorClass="text-rose-500" field="relationship" value={brandData.prism.relationship} />
                 <EditPrismCard title="Culture" icon={Globe} colorClass="text-emerald-500" field="culture" value={brandData.prism.culture} />
              </div>
              <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-12 w-full max-w-4xl z-10 relative">
                 <EditPrismCard title="Reflection" icon={Users} colorClass="text-purple-500" field="reflection" value={brandData.prism.reflection} />
                 <EditPrismCard title="Self-Image" icon={UserCircle} colorClass="text-indigo-500" field="selfImage" value={brandData.prism.selfImage} />
              </div>
              <div className="text-xs font-black tracking-widest text-slate-500 uppercase mt-8 bg-slate-100 dark:bg-zinc-900/30 px-4 z-10 rounded-full">⬆ Picture of Receiver ⬆</div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: LOGO & COLORS */}
        {activeTab === 'logos' && (
          <motion.div key="logos" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="pt-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><ImageIcon className="text-blue-500" /> Desain Logo</h3>
              <EditField label="Logo Utama (Stacked)" value={brandData.logo.primary} onChange={(e) => setBrandData({...brandData, logo: {...brandData.logo, primary: e.target.value}})} />
              <EditField label="Logo Sekunder (Horizontal)" value={brandData.logo.secondary} onChange={(e) => setBrandData({...brandData, logo: {...brandData.logo, secondary: e.target.value}})} />
              <EditField label="Ikon (Logomark/Favicon)" value={brandData.logo.favicon} onChange={(e) => setBrandData({...brandData, logo: {...brandData.logo, favicon: e.target.value}})} />
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold flex items-center gap-2"><Droplet className="text-rose-500" /> Palet Warna</h3>
                 <button onClick={handleAddColor} className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"><Plus size={14}/> Tambah Warna</button>
              </div>
              <div className="space-y-4">
                {brandData.colors.map((color, index) => (
                  <div key={color.id} className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl flex gap-4 relative group">
                    <button onClick={() => handleRemoveColor(color.id)} className="absolute -top-2 -right-2 bg-rose-100 text-rose-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"><X size={14}/></button>
                    <div className="w-12 h-12 shrink-0 rounded-xl shadow-inner border border-black/10 transition-colors duration-300" style={{ backgroundColor: color.hex }}></div>
                    <div className="flex-1">
                      <div className="flex gap-2 mb-2">
                        <input value={color.name} onChange={(e) => { const newC = [...brandData.colors]; newC[index].name = e.target.value; setBrandData({...brandData, colors: newC}); }} className="font-bold text-sm bg-transparent outline-none border-b border-dashed border-slate-300 w-1/2" placeholder="Nama Warna" />
                        <input value={color.hex} onChange={(e) => { const newC = [...brandData.colors]; newC[index].hex = e.target.value; setBrandData({...brandData, colors: newC}); }} className="text-sm font-mono bg-transparent outline-none border-b border-dashed border-slate-300 w-1/2" placeholder="#HEXCODE" />
                      </div>
                      <textarea value={color.desc} onChange={(e) => { const newC = [...brandData.colors]; newC[index].desc = e.target.value; setBrandData({...brandData, colors: newC}); }} placeholder="Deskripsi filosofi warna..." className="w-full bg-transparent text-sm text-slate-600 outline-none resize-none h-16 custom-scrollbar" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: TYPO & GRAPHICS */}
        {activeTab === 'typo' && (
          <motion.div key="typo" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="pt-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Type className="text-emerald-500" /> Sistem Tipografi</h3>
              
              <div className="mb-6 border-b border-slate-100 pb-6">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Heading Font</label>
                <input value={brandData.typography.heading.font} onChange={e => setBrandData({...brandData, typography: {...brandData.typography, heading: {...brandData.typography.heading, font: e.target.value}}})} placeholder="Nama Font (e.g. Playfair Display)" className="w-full text-lg font-black bg-transparent outline-none mb-2 border-b border-dashed border-slate-300" />
                <textarea value={brandData.typography.heading.desc} onChange={e => setBrandData({...brandData, typography: {...brandData.typography, heading: {...brandData.typography.heading, desc: e.target.value}}})} placeholder="Alasan penggunaan..." className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-3 text-sm resize-none h-20" />
              </div>

              <div className="mb-6 border-b border-slate-100 pb-6">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sub-Heading Font</label>
                <input value={brandData.typography.subheading.font} onChange={e => setBrandData({...brandData, typography: {...brandData.typography, subheading: {...brandData.typography.subheading, font: e.target.value}}})} placeholder="Nama Font (e.g. Montserrat)" className="w-full text-base font-bold bg-transparent outline-none mb-2 border-b border-dashed border-slate-300" />
                <textarea value={brandData.typography.subheading.desc} onChange={e => setBrandData({...brandData, typography: {...brandData.typography, subheading: {...brandData.typography.subheading, desc: e.target.value}}})} placeholder="Alasan penggunaan..." className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-3 text-sm resize-none h-20" />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Body Text Font</label>
                <input value={brandData.typography.body.font} onChange={e => setBrandData({...brandData, typography: {...brandData.typography, body: {...brandData.typography.body, font: e.target.value}}})} placeholder="Nama Font (e.g. Inter)" className="w-full text-sm font-medium bg-transparent outline-none mb-2 border-b border-dashed border-slate-300" />
                <textarea value={brandData.typography.body.desc} onChange={e => setBrandData({...brandData, typography: {...brandData.typography, body: {...brandData.typography.body, desc: e.target.value}}})} placeholder="Alasan penggunaan..." className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-3 text-sm resize-none h-20" />
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><LayoutTemplate className="text-amber-500" /> Elemen Grafis Tambahan</h3>
              <EditField label="📷 Gaya Fotografi (Moodboard & Makro)" value={brandData.graphics.photography} onChange={(e) => setBrandData({...brandData, graphics: {...brandData.graphics, photography: e.target.value}})} />
              <EditField label="🖋️ Ikonografi (Line-Art & UVP)" value={brandData.graphics.iconography} onChange={(e) => setBrandData({...brandData, graphics: {...brandData.graphics, iconography: e.target.value}})} />
              <EditField label="🌀 Pola (Pattern Latar Belakang)" value={brandData.graphics.pattern} onChange={(e) => setBrandData({...brandData, graphics: {...brandData.graphics, pattern: e.target.value}})} />
            </div>
          </motion.div>
        )}

        {/* ============================== */}
        {/* NEW TAB 5: AI VISUALIZER       */}
        {/* ============================== */}
        {activeTab === 'visualizer' && (
          <motion.div key="visualizer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="pt-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* SISI KIRI: Konverter Prompt (The Brain) */}
            <div className="lg:col-span-4 space-y-6">
               <div className="bg-purple-600 dark:bg-purple-900/40 border border-purple-500/50 p-6 rounded-3xl text-white shadow-xl shadow-purple-500/20 relative overflow-hidden">
                 <div className="relative z-10">
                   <h3 className="text-xl font-black mb-2 flex items-center gap-2"><Wand2 size={20}/> AI Prompt Engine</h3>
                   <p className="text-purple-100 text-sm mb-6 opacity-80">
                     Sistem akan menerjemahkan data Brand Identity Anda menjadi parameter teknis yang dipahami oleh AI Generator (Midjourney / DALL-E).
                   </p>
                   
                   <button onClick={handleAutoGeneratePrompt} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition-all mb-4">
                     1. Compile Brand Data
                   </button>

                   <textarea 
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Prompt akan muncul di sini..."
                      className="w-full h-40 bg-purple-950/50 border border-purple-400/30 rounded-xl p-4 text-sm text-purple-50 placeholder:text-purple-300/50 outline-none focus:ring-2 focus:ring-purple-400 resize-none custom-scrollbar mb-4"
                   />

                   <button 
                     onClick={handleGenerateVisual}
                     disabled={!aiPrompt || isGenerating}
                     className={`w-full flex items-center justify-center gap-2 px-4 py-4 font-black rounded-xl transition-all shadow-lg ${!aiPrompt || isGenerating ? 'bg-purple-800 text-purple-400 cursor-not-allowed' : 'bg-white text-purple-700 hover:bg-purple-50 hover:scale-[1.02]'}`}
                   >
                     {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                     {isGenerating ? 'AI IS GENERATING...' : '2. GENERATE MOODBOARD'}
                   </button>
                 </div>
               </div>

               <div className="bg-slate-100 dark:bg-zinc-900/50 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">Webhook Status <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span></h4>
                  <p className="text-xs text-slate-400">Siap dihubungkan ke <b>n8n</b> untuk mengeksekusi prompt ke endpoint AI pihak ketiga.</p>
               </div>
            </div>

            {/* SISI KANAN: Galeri Output (The Canvas) */}
            <div className="lg:col-span-8">
               <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 min-h-[500px] h-full shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2"><ImageIcon className="text-slate-400" /> Visual Output Gallery</h3>
                    {generatedImages.length > 0 && <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded-full font-bold">4 Results</span>}
                  </div>

                  {/* Empty State */}
                  {!isGenerating && generatedImages.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl bg-slate-50 dark:bg-zinc-900/50">
                       <Sparkles size={48} className="mb-4 opacity-30" />
                       <p className="font-medium text-slate-500 dark:text-zinc-400">Canvas masih kosong.</p>
                       <p className="text-sm mt-1">Compile data dan klik Generate di sebelah kiri.</p>
                    </div>
                  )}

                  {/* Loading State */}
                  {isGenerating && (
                    <div className="flex-1 grid grid-cols-2 gap-4">
                       {[1,2,3,4].map(i => (
                         <div key={i} className="bg-slate-100 dark:bg-zinc-800 rounded-2xl animate-pulse flex items-center justify-center border border-slate-200 dark:border-zinc-700">
                           <ImageIcon size={32} className="opacity-20 text-slate-400"/>
                         </div>
                       ))}
                    </div>
                  )}

                  {/* Result State */}
                  {!isGenerating && generatedImages.length > 0 && (
                    <div className="flex-1 grid grid-cols-2 gap-4">
                       {generatedImages.map((img, i) => (
                         <div key={i} className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 cursor-pointer shadow-sm hover:shadow-md transition-all">
                           <img src={img} alt={`Generated Visual ${i}`} className="w-full h-full object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-500" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                             <button className="text-xs font-bold text-white bg-white/20 hover:bg-white/40 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 w-max">
                               Use as Concept <ArrowRight size={12}/>
                             </button>
                           </div>
                         </div>
                       ))}
                    </div>
                  )}
               </div>
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};