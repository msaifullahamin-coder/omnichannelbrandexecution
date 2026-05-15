import { 
  Target, Zap, Users, Activity, Smartphone, ShoppingBag, MonitorPlay, MessageSquare, LineChart as ChartIcon
} from 'lucide-react';

export const COLORS = {
  primary: '#059669', secondary: '#f59e0b', tertiary: '#3b82f6', quaternary: '#ec4899',
  darkBg: '#09090b', darkCard: '#18181b', lightBg: '#f8fafc', lightCard: '#ffffff',
  textLight: '#f4f4f5', textDark: '#0f172a',
};

export const initialUsers = [
  { id: 'u1', name: 'Saifull', username: 'saifull', role: 'admin', password: '123', avatar: 'https://i.pravatar.cc/150?img=11' },
  { id: 'u2', name: 'Bagas', username: 'bagas', role: 'admin', password: '123', avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: 'u3', name: 'Azka', username: 'azka', role: 'user', password: '123', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 'u4', name: 'Ghina', username: 'ghina', role: 'user', password: '123', avatar: 'https://i.pravatar.cc/150?img=9' },
];

export const overviewStats = [
  { title: 'Total Progress', value: '68%', change: '+5%', icon: Target, trend: 'up' }, 
  { title: 'Budget Used', value: 'Rp 12.5M', subtext: 'of Rp 50M', change: '25%', icon: Zap, trend: 'neutral' },
  { title: 'Leads Generated', value: '3,420', change: '+12%', icon: Users, trend: 'up' },
  { title: 'ROAS Estimation', value: '4.2x', change: '+0.8', icon: Activity, trend: 'up' },
];

export const revenueData = [
  { name: 'Mon', leads: 400, budget: 240, conversions: 24 }, { name: 'Tue', leads: 300, budget: 139, conversions: 22 },
  { name: 'Wed', leads: 550, budget: 980, conversions: 22 }, { name: 'Thu', leads: 278, budget: 390, conversions: 20 },
  { name: 'Fri', leads: 189, budget: 480, conversions: 21 }, { name: 'Sat', leads: 239, budget: 380, conversions: 25 },
  { name: 'Sun', leads: 349, budget: 430, conversions: 21 },
];

export const funnelData = [
  { name: 'Awareness (Reach)', value: 120000 }, { name: 'Interest (Clicks)', value: 15000 },
  { name: 'Consideration (LP Views)', value: 8000 }, { name: 'Intent (Add to Cart)', value: 2000 },
  { name: 'Conversion (Purchases)', value: 850 },
];

export const platformSpendData = [
  { name: 'Meta Ads', value: 45 }, { name: 'TikTok Ads', value: 30 },
  { name: 'Shopee Ads', value: 15 }, { name: 'Google Ads', value: 10 },
];

export const financeChartData = [
  { name: 'Week 1', spent: 2.5, revenue: 10.5 }, { name: 'Week 2', spent: 3.0, revenue: 14.2 },
  { name: 'Week 3', spent: 4.5, revenue: 19.8 }, { name: 'Week 4', spent: 2.5, revenue: 12.0 },
];

export const initialTasks = [
  { id: 't8', title: 'Setup Akun IG & TikTok + Optimasi Bio', phase: 'Phase 1', status: 'done', priority: 'high', pic: 'Ghina', avatar: 'https://i.pravatar.cc/150?img=9', targetPersonas: ['All Personas'], budget: 1000000, realisasi: 0 },
  { id: 't9', title: 'Desain Logo & Omnichannel Brand Guideline', phase: 'Phase 1', status: 'done', priority: 'high', pic: 'Azka', avatar: 'https://i.pravatar.cc/150?img=5', targetPersonas: ['All Personas'], budget: 2000000, realisasi: 0 },
  { id: 't6', title: 'Create 2000 Persona Accounts Data', phase: 'Phase 2', status: 'done', priority: 'low', pic: 'Saifull', avatar: 'https://i.pravatar.cc/150?img=11', targetPersonas: ['All Personas'], budget: 1500000, realisasi: 0 },
  { id: 't10', title: 'Mapping Competitor Ads (TikTok & Meta Library)', phase: 'Phase 2', status: 'done', priority: 'medium', pic: 'Bagas', avatar: 'https://i.pravatar.cc/150?img=12', targetPersonas: ['All Personas'], budget: 500000, realisasi: 0 },
  { id: 't1', title: 'Setup Meta Business Manager & Ad Account', phase: 'Phase 3', status: 'done', priority: 'high', pic: 'Saifull', avatar: 'https://i.pravatar.cc/150?img=11', targetPersonas: ['All Personas'], budget: 1000000, realisasi: 0 },
  { id: 't11', title: 'Setup TikTok Business Center & Pixel', phase: 'Phase 3', status: 'done', priority: 'high', pic: 'Saifull', avatar: 'https://i.pravatar.cc/150?img=11', targetPersonas: ['All Personas'], budget: 1000000, realisasi: 0 },
  { id: 't5', title: 'Setup Google Analytics 4 & Tag Manager', phase: 'Phase 3', status: 'doing', priority: 'high', pic: 'Saifull', avatar: 'https://i.pravatar.cc/150?img=11', targetPersonas: ['All Personas'], budget: 500000, realisasi: 0 },
  { id: 't4', title: 'Launch Meta Ads (Edukasi vs Hard Selling)', phase: 'Phase 6', status: 'todo', priority: 'high', pic: 'Bagas', avatar: 'https://i.pravatar.cc/150?img=12', targetPersonas: ['Fatimah Az-Zahra', 'Aisyah Putri'], budget: 5000000, realisasi: 0 },
  { id: 't12', title: 'Bikin Script Video Hook Emosional (Storytelling)', phase: 'Phase 4', status: 'todo', priority: 'high', pic: 'Ghina', avatar: 'https://i.pravatar.cc/150?img=9', targetPersonas: ['Fatimah Az-Zahra', 'Aisyah Putri'], budget: 2000000, realisasi: 0 },
  { id: 't17', title: 'Launch Omnichannel Retargeting (Diskon 10%)', phase: 'Phase 6', status: 'todo', priority: 'high', pic: 'Saifull', avatar: 'https://i.pravatar.cc/150?img=11', targetPersonas: ['All Personas'], budget: 3000000, realisasi: 0 },
  { id: 't2', title: 'Design Landing Page UI (Aesthetic Islamic)', phase: 'Phase 5', status: 'review', priority: 'high', pic: 'Azka', avatar: 'https://i.pravatar.cc/150?img=5', targetPersonas: ['Aisyah Putri', 'Budi Santoso'], budget: 2500000, realisasi: 0 },
  { id: 't15', title: 'Copywriting Headline Landing Page', phase: 'Phase 5', status: 'review', priority: 'high', pic: 'Bagas', avatar: 'https://i.pravatar.cc/150?img=12', targetPersonas: ['All Personas'], budget: 1000000, realisasi: 0 },
  { id: 't14', title: 'Integrasi Pixel (Meta, TikTok, Google) di LP', phase: 'Phase 5', status: 'review', priority: 'high', pic: 'Saifull', avatar: 'https://i.pravatar.cc/150?img=11', targetPersonas: ['All Personas'], budget: 500000, realisasi: 0 },
  { id: 't3', title: 'Shoot Video Vertikal (Reels/TikTok) - Tajwid Dasar', phase: 'Phase 4', status: 'review', priority: 'medium', pic: 'Ghina', avatar: 'https://i.pravatar.cc/150?img=9', targetPersonas: ['Nisa Sabyan (Lookalike)'], budget: 4000000, realisasi: 0 },
  { id: 't7', title: 'Launch TikTok Ads (Video Conversion Campaign)', phase: 'Phase 6', status: 'review', priority: 'medium', pic: 'Bagas', avatar: 'https://i.pravatar.cc/150?img=12', targetPersonas: ['Nisa Sabyan (Lookalike)'], budget: 4500000, realisasi: 0 },
  { id: 't13', title: 'Desain Carousel IG & Banner Marketplace', phase: 'Phase 4', status: 'todo', priority: 'medium', pic: 'Azka', avatar: 'https://i.pravatar.cc/150?img=5', targetPersonas: ['Nisa Sabyan (Lookalike)', 'Budi Santoso'], budget: 1500000, realisasi: 0 },
  { id: 't16', title: 'Setup Google Search Ads (Keyword: Belajar Tajwid)', phase: 'Phase 6', status: 'todo', priority: 'medium', pic: 'Bagas', avatar: 'https://i.pravatar.cc/150?img=12', targetPersonas: ['Budi Santoso'], budget: 2000000, realisasi: 0 },
  { id: 't18', title: 'Setup Shopee Ads (Iklan Pencarian & Toko)', phase: 'Phase 7', status: 'todo', priority: 'low', pic: 'Azka', avatar: 'https://i.pravatar.cc/150?img=5', targetPersonas: ['All Personas'], budget: 1000000, realisasi: 0 },
  { id: 't19', title: 'Broadcast Promo Follow-up via WhatsApp API', phase: 'Phase 7', status: 'todo', priority: 'medium', pic: 'Ghina', avatar: 'https://i.pravatar.cc/150?img=9', targetPersonas: ['Fatimah Az-Zahra'], budget: 500000, realisasi: 0 },
  { id: 't20', title: 'Weekly Cross-Platform Review: Matikan Ads Boncos', phase: 'Phase 8', status: 'doing', priority: 'high', pic: 'Saifull', avatar: 'https://i.pravatar.cc/150?img=11', targetPersonas: ['All Personas'], budget: 0, realisasi: 0 },
  { id: 't21', title: 'Analisa Attribution Model (Platform mana yang menang?)', phase: 'Phase 8', status: 'todo', priority: 'medium', pic: 'Bagas', avatar: 'https://i.pravatar.cc/150?img=12', targetPersonas: ['All Personas'], budget: 0, realisasi: 0 },
];

export const initialPdcaIterations = [
  { 
    id: 'pdca1', title: 'Iterasi 1: Uji Coba Hook Emosional (Storytelling)', tasks: ['t4', 't12', 't17'], personas: ['Fatimah Az-Zahra', 'Aisyah Putri'], phase: 'Phase 4', status: 'Plan', date: '08 May 2026', linkedNextIter: null, cost: 150000,
    plan: { goal: 'Mengetes angle hook "Keresahan Ibu saat ajari anak ngaji" vs "Tips ngaji tajwid cepat" di Meta Ads.', kpi: ['CTR Link > 2.0%', 'Cost per Click < Rp 1.500'], approved: false },
    do: { checklist: [{ text: 'Selesaikan script video Storytelling Ibu', done: true }, { text: 'Buat 2 variasi thumbnail', done: true }, { text: 'Launch A/B Test di Meta Ads', done: false }] },
    check: { experiments: [{ name: 'Video Hook Storytelling Ibu', status: 'Pending', cpa: '-', ctr: '-' }, { name: 'Video Hook Tips Cepat', status: 'Pending', cpa: '-', ctr: '-' }] },
    action: { steps: [{ text: 'Tunggu data stabil selama 3 hari sebelum scaling', type: 'info' }] },
    attachments: [{ id: 'a1', type: 'link', name: 'Meta Ads Manager Preview', url: 'https://facebook.com/adsmanager' }, { id: 'a2', type: 'doc', name: 'Brief Script Storytelling.pdf', url: '#' }]
  },
  { 
    id: 'pdca2', title: 'Iterasi 2: Optimasi Konversi Landing Page & Pixel', tasks: ['t2', 't15', 't14'], personas: ['All Personas'], phase: 'Phase 5', status: 'Check', date: '10 May 2026', linkedNextIter: null, cost: 50000,
    plan: { goal: 'Meningkatkan Conversion Rate (CVR) Landing page dari Page Views ke Add to Cart (ATC) menjadi minimal 5%.', kpi: ['CVR > 5%', 'Bounce Rate < 60%'], approved: true },
    do: { checklist: [{ text: 'Ubah warna tombol CTA menjadi Gold Contrast', done: true }, { text: 'Tambahkan section testimoni di atas lipatan (above fold)', done: true }, { text: 'Cek ulang integrasi Meta Pixel Event ATC', done: true }] },
    check: { experiments: [{ name: 'LP V1 (Desain Original Green)', status: 'Loser', cpa: 'Rp 85.000', ctr: '1.2%' }, { name: 'LP V2 (Tombol Gold + Testimoni Atas)', status: 'Winner', cpa: 'Rp 65.000', ctr: '2.8%' }] },
    action: { steps: [{ text: 'Jadikan LP V2 sebagai default destination link', type: 'scale' }, { text: 'Buat eksperimen LP V3 dengan tambahan video tutorial', type: 'iterate' }] }, attachments: []
  },
  { 
    id: 'pdca3', title: 'Iterasi 3: Scale Up TikTok Edukasi', tasks: ['t3', 't7'], personas: ['Nisa Sabyan (Lookalike)'], phase: 'Phase 6', status: 'Action', date: '15 May 2026', linkedNextIter: null, cost: 350000,
    plan: { goal: 'Eskalasi budget (Scaling up) campaign video edukasi tajwid di TikTok yang sedang winning.', kpi: ['ROAS stabil di angka > 4.0x', 'CPA stabil < Rp 50.000'], approved: true },
    do: { checklist: [{ text: 'Duplikat Adset TikTok dan naikkan budget 30%', done: true }, { text: 'Setup rules: Pause ad jika CPA tiba-tiba > Rp 75k', done: true }] },
    check: { experiments: [{ name: 'TikTok Adset Original (Rp 100k/hari)', status: 'Winner', cpa: 'Rp 42.000', ctr: '4.5%' }, { name: 'TikTok Adset Scaled (Rp 150k/hari)', status: 'Winner', cpa: 'Rp 48.000', ctr: '4.1%' }] },
    action: { steps: [{ text: 'Scale Up: Terus naikkan budget TikTok 20% tiap 2 hari', type: 'scale' }, { text: 'Iterate: Produksi part 2 video tajwid dengan talent yang sama', type: 'iterate' }] }, attachments: []
  },
];

export const initialPhases = [
  { id: 1, title: 'Phase 1 - Brand Foundation', progress: 100, status: 'completed', budget: 5000000, realisasi: 0 },
  { id: 2, title: 'Phase 2 - Persona Engineering', progress: 100, status: 'completed', budget: 2000000, realisasi: 0 },
  { id: 3, title: 'Phase 3 - Multi-Platform Setup', progress: 85, status: 'in-progress', budget: 3500000, realisasi: 0 },
  { id: 4, title: 'Phase 4 - Content Ecosystem', progress: 45, status: 'in-progress', budget: 15000000, realisasi: 0 },
  { id: 5, title: 'Phase 5 - Landing Page', progress: 60, status: 'in-progress', budget: 4000000, realisasi: 0 },
  { id: 6, title: 'Phase 6 - Omnichannel Ads Execution', progress: 10, status: 'pending', budget: 20000000, realisasi: 0 },
  { id: 7, title: 'Phase 7 - Marketplace & Social Proof', progress: 0, status: 'pending', budget: 3000000, realisasi: 0 },
  { id: 8, title: 'Phase 8 - PDCA Continuous', progress: 5, status: 'ongoing', budget: 5000000, realisasi: 0 },
];

export const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number || 0);
};

export const personas = [
  { id: 1, name: 'Aisyah Putri', age: 24, type: 'Urban Muslimah', pain: 'Takut salah baca tajwid panjang pendek', interest: 'Self-improvement, Kajian Hanan Attaki', score: 92 },
  { id: 2, name: 'Fatimah Az-Zahra', age: 32, type: 'Young Mom', pain: 'Ingin ajari anak ngaji tapi belum PD', interest: 'Parenting islami, Aesthetic home', score: 88 },
  { id: 3, name: 'Budi Santoso', age: 28, type: 'Professional', pain: 'Sibuk, butuh panduan cepat dan jelas', interest: 'Productivity, Investasi syariah', score: 75 },
  { id: 4, name: 'Nisa Sabyan (Lookalike)', age: 21, type: 'Gen Z', pain: 'Malu kalau ngaji terbata-bata di kampus', interest: 'OOTD Syari, Halal cafe', score: 85 },
];

export const apiConnections = [
  { id: 1, name: 'Meta Ads Graph API', type: 'Marketing Data', status: 'connected', lastSync: '5 mins ago', icon: Target },
  { id: 2, name: 'TikTok Marketing API', type: 'Marketing Data', status: 'connected', lastSync: '12 mins ago', icon: Smartphone },
  { id: 3, name: 'Shopee Open API', type: 'Marketplace', status: 'pending', lastSync: '-', icon: ShoppingBag },
  { id: 4, name: 'Google Ads API', type: 'Search Ads', status: 'disconnected', lastSync: '2 days ago', icon: MonitorPlay },
  { id: 5, name: 'WhatsApp Cloud API', type: 'Automation', status: 'pending', lastSync: '-', icon: MessageSquare },
  { id: 6, name: 'Google Analytics 4', type: 'Analytics', status: 'connected', lastSync: '1 hour ago', icon: ChartIcon },
];