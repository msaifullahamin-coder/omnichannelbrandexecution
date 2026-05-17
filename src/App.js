import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarPage } from './CalendarPage';
import { 
  LayoutDashboard, Map, KanbanSquare, RefreshCcw, Bot, Wallet, 
  Link2, Menu, Sun, Moon, Palette, ArrowLeft, Megaphone, Calendar 
} from 'lucide-react';

// --- IMPORT DATA ---
import { 
  initialUsers, initialTasks, initialPhases, initialPdcaIterations, personas 
} from './dummyData';

// --- IMPORT KAMAR-KAMAR (PAGES) ---
import { LoginPage } from './LoginPage';
import { ProjectSelectionPage } from './ProjectSelectionPage';
import { DashboardPage } from './DashboardPage';
import { RoadmapPage } from './RoadmapPage';
import { BrandIdentityPage } from './BrandIdentityPage';
import { PersonaPage } from './PersonaPage';
import { CampaignPage } from './CampaignPage'; 
import { KanbanBoard } from './KanbanBoard';
import { PDCAPage } from './PDCAPage';
import { APIPage } from './APIPage';
import { FinancePage } from './FinancePage';
import { UserManagementPage } from './UserManagementPage';
import { Badge } from './components';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [users, setUsers] = useState(initialUsers);

  // === DATABASE INDUK ===
  const [projects, setProjects] = useState([
    {
      id: 'prj-1',
      name: 'Aqshor Mushaf Tajwid (Demo)',
      owner: 'admin', 
      members: ['admin'], 
      tasks: initialTasks,
      phases: initialPhases,
      pdcaIterations: initialPdcaIterations,
      personas: personas,
      campaigns: [], 
      revenues: [] 
    }
  ]);

  // === STATE NAVIGASI ===
  const [appMode, setAppMode] = useState('lobby'); 
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // === STATE JEMBATAN ANTAR HALAMAN (INI YANG BIKIN BLANK KALAU DIHAPUS) ===
  const [highlightPhaseName, setHighlightPhaseName] = useState(null);
  const [highlightTaskId, setHighlightTaskId] = useState(null);
  const [highlightPersonaName, setHighlightPersonaName] = useState(null);
  const [activePdcaId, setActivePdcaId] = useState(null);
  const [pdcaPrefill, setPdcaPrefill] = useState(null);

  // Efek Dark Mode
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  // === FUNGSI MANAJEMEN PROJECT ===
  const handleCreateProject = (name) => {
    const newProject = {
      id: `prj-${Date.now()}`,
      name: name,
      owner: loggedInUser.username,
      members: [loggedInUser.username],
      tasks: [], phases: [], pdcaIterations: [], personas: [], campaigns: [], revenues: []
    };
    setProjects([...projects, newProject]);
  };

  const handleDeleteProject = (id) => setProjects(projects.filter(p => p.id !== id));

  const activeProject = projects.find(p => p.id === activeProjectId);

  const updateActiveProjectData = (key, newData) => {
    setProjects(prevProjects => prevProjects.map(p => {
      if (p.id === activeProjectId) {
        const updatedValue = typeof newData === 'function' ? newData(p[key]) : newData;
        return { ...p, [key]: updatedValue };
      }
      return p;
    }));
  };

  const handleUpdateProfile = (updatedUserData) => {
    setLoggedInUser(updatedUserData);
    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUserData.id ? updatedUserData : u));
  };

  // === KALKULASI OTOMATIS (BUDGET & PROGRESS) ===
  const enrichedTasks = useMemo(() => {
    if (!activeProject) return [];
    return activeProject.tasks.map(t => {
      const relatedPdcas = (activeProject.pdcaIterations || []).filter(p => p.tasks && p.tasks.includes(t.id));
      const autoRealisasi = relatedPdcas.reduce((sum, p) => {
        const sharedCost = Number(p.cost || 0) / (p.tasks.length || 1);
        return sum + sharedCost;
      }, 0);
      return { ...t, realisasi: autoRealisasi };
    });
  }, [activeProject]);

  const enrichedPhases = useMemo(() => {
    if (!activeProject) return [];
    return activeProject.phases.map(p => {
      const phaseTasks = enrichedTasks.filter(t => t.phase === p.title.split(' - ')[0] || p.title.includes(t.phase));
      const autoBudget = phaseTasks.reduce((sum, t) => sum + Number(t.budget || 0), 0);
      const autoRealisasi = phaseTasks.reduce((sum, t) => sum + Number(t.realisasi || 0), 0);
      return { ...p, budget: autoBudget, realisasi: autoRealisasi };
    });
  }, [activeProject, enrichedTasks]);

  // === FUNGSI LOMPAT ANTAR HALAMAN ===
  const navigateToRoadmap = (phaseName = null) => { if(phaseName) setHighlightPhaseName(phaseName); setActiveTab('roadmap'); };
  const navigateToTaskBoard = (taskId) => { setHighlightTaskId(taskId); setActiveTab('tasks'); };
  const navigateToPersona = (personaName) => { setHighlightPersonaName(personaName); setActiveTab('persona'); };
  const navigateToPdca = (pdcaId, prefill = null) => { if (prefill) setPdcaPrefill(prefill); setActivePdcaId(pdcaId); setActiveTab('pdca'); };

  // === DAFTAR MENU SIDEBAR ===
  const NAVIGATION = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Master Calendar', icon: Calendar },
    { id: 'persona', label: 'Market & Persona', icon: Bot },
    { id: 'brand', label: 'Brand Identity', icon: Palette },
    { id: 'roadmap', label: 'Project Roadmap', icon: Map },
    { id: 'campaigns', label: 'Campaign Manager', icon: Megaphone },
    { id: 'tasks', label: 'Task Kanban', icon: KanbanSquare },
    { id: 'pdca', label: 'PDCA Iterations', icon: RefreshCcw },
    { id: 'finance', label: 'Financials', icon: Wallet },
    { id: 'api', label: 'API Integrations', icon: Link2 },
  ];

  if (!loggedInUser) {
    return <LoginPage users={users} onLogin={setLoggedInUser} />;
  }

  // --- HALAMAN TEAM MANAGEMENT (LOBBY) ---
  if (appMode === 'team') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans text-slate-900 dark:text-zinc-100">
        <header className="h-16 flex items-center px-6 lg:px-12 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 sticky top-0 z-30">
          <button onClick={() => setAppMode('lobby')} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors bg-slate-100 hover:bg-emerald-50 dark:bg-zinc-800 dark:hover:bg-emerald-900/20 px-4 py-2 rounded-lg">
            <ArrowLeft size={16} /> Kembali ke Lobby
          </button>
        </header>
        <main className="max-w-6xl mx-auto p-6 lg:p-12">
          <UserManagementPage users={users} setUsers={setUsers} currentUser={loggedInUser} projects={projects} setProjects={setProjects} />
        </main>
      </div>
    );
  }

  // --- HALAMAN LOBBY UTAMA ---
  if (appMode === 'lobby') {
    const visibleProjects = projects.filter(p => {
      if (loggedInUser.role === 'admin') return true;
      return p.owner === loggedInUser.username || (p.members && p.members.includes(loggedInUser.username));
    });

    return (
      <ProjectSelectionPage 
        projects={visibleProjects} 
        onSelectProject={(id) => { setActiveProjectId(id); setAppMode('project'); setActiveTab('dashboard'); }} 
        onCreateProject={handleCreateProject}
        onDeleteProject={handleDeleteProject}
        currentUser={loggedInUser}
        onLogout={() => setLoggedInUser(null)}
        onManageTeam={() => setAppMode('team')}
        onUpdateProfile={handleUpdateProfile} 
      />
    );
  }

  // --- HALAMAN PROJECT (DALAM) KABEL FULL TANPA POTONGAN ---
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': 
        return <DashboardPage phases={enrichedPhases} navigateToRoadmap={navigateToRoadmap} />;
      case 'calendar': 
        return <CalendarPage tasks={enrichedTasks} pdcaIterations={activeProject.pdcaIterations || []} navigateToTaskBoard={navigateToTaskBoard} navigateToPdca={navigateToPdca} currentUser={loggedInUser} />;
      case 'persona': 
        return <PersonaPage highlightPersonaName={highlightPersonaName} setHighlightPersonaName={setHighlightPersonaName} />;
      case 'brand': 
        return <BrandIdentityPage />;
      case 'roadmap': 
        return <RoadmapPage users={users} tasks={enrichedTasks} setTasks={(val) => updateActiveProjectData('tasks', val)} phases={enrichedPhases} setPhases={(val) => updateActiveProjectData('phases', val)} highlightPhaseName={highlightPhaseName} setHighlightPhaseName={setHighlightPhaseName} setHighlightTaskId={setHighlightTaskId} setActiveTab={setActiveTab} />;
      case 'campaigns': 
        return <CampaignPage campaigns={activeProject.campaigns || []} updateActiveProjectData={updateActiveProjectData} personas={activeProject.personas?.length > 0 ? activeProject.personas : personas} />;
      case 'tasks': 
        return <KanbanBoard users={users} tasks={enrichedTasks} setTasks={(val) => updateActiveProjectData('tasks', val)} highlightTaskId={highlightTaskId} setHighlightTaskId={setHighlightTaskId} pdcaIterations={activeProject.pdcaIterations} navigateToPdca={navigateToPdca} phases={enrichedPhases} personas={activeProject.personas?.length > 0 ? activeProject.personas : personas} />;
      case 'pdca': 
        return <PDCAPage pdcaIterations={activeProject.pdcaIterations} setPdcaIterations={(val) => updateActiveProjectData('pdcaIterations', val)} tasks={enrichedTasks} setTasks={(val) => updateActiveProjectData('tasks', val)} personas={activeProject.personas?.length > 0 ? activeProject.personas : personas} phases={enrichedPhases} activePdcaId={activePdcaId} setActivePdcaId={setActivePdcaId} users={users} navigateToTaskBoard={navigateToTaskBoard} navigateToPersona={navigateToPersona} navigateToRoadmap={navigateToRoadmap} pdcaPrefill={pdcaPrefill} setPdcaPrefill={setPdcaPrefill} />;
      case 'finance': 
        return <FinancePage activeProject={activeProject} enrichedPhases={enrichedPhases} updateActiveProjectData={updateActiveProjectData} />;
      case 'api': 
        return <APIPage />;
      default: 
        return <DashboardPage phases={enrichedPhases} navigateToRoadmap={navigateToRoadmap} />;
    }
  };

  // --- LOGIKA UNTUK NAMA HEADER OTOMATIS ---
  let headerTitle = NAVIGATION.find(item => item.id === activeTab)?.label || activeTab;
  if (activeTab === 'pdca') headerTitle = 'Precision Performance Hub'; // Custom nama biar keren

  return (
    <div className={`flex h-screen bg-slate-50 dark:bg-zinc-950 font-sans text-slate-900 dark:text-zinc-100 transition-colors duration-300 overflow-hidden`}>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
        )}
      </AnimatePresence>
      
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 border-b border-slate-200 dark:border-zinc-800">
           <button 
             onClick={() => { setActiveProjectId(null); setAppMode('lobby'); }} 
             className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors bg-slate-100 hover:bg-emerald-50 dark:bg-zinc-800 dark:hover:bg-emerald-900/20 px-3 py-2 rounded-lg w-full mb-3"
           >
             <ArrowLeft size={14} /> Kembali ke Lobby
           </button>
           <h2 className="font-black text-lg text-slate-900 dark:text-white truncate" title={activeProject.name}>{activeProject.name}</h2>
           <Badge variant={loggedInUser.role === 'admin' ? 'admin' : 'success'}>
              {activeProject.owner === loggedInUser.username ? 'Owner' : loggedInUser.role === 'admin' ? 'Admin Access' : 'Member'}
           </Badge>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAVIGATION.map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-zinc-100'}`}>
              <item.icon size={18} className={activeTab === item.id ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* === HEADER YANG SUDAH DIPERBAIKI (FOTO & NAMA MUNCUL) === */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 z-30">
           <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-500 hover:text-slate-700 dark:hover:text-zinc-300 lg:hidden"><Menu size={24} /></button>
              
              <h1 className="text-sm sm:text-lg font-bold text-slate-800 dark:text-zinc-200 hidden sm:block">
                {headerTitle}
              </h1>
           </div>
           
           <div className="flex items-center gap-3 sm:gap-5">
              {/* Tombol Dark Mode */}
              <button onClick={() => setDarkMode(!darkMode)} className="p-2 text-slate-500 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-all">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              {/* Garis Pembatas (Hanya muncul di laptop) */}
              <div className="w-px h-6 bg-slate-200 dark:bg-zinc-700 hidden sm:block"></div>
              
              {/* Info User & Foto Profil */}
              <div className="flex items-center gap-3">
                <img src={loggedInUser.avatar} className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm object-cover bg-slate-100" alt="Profile" />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 hidden sm:block capitalize">
                  {loggedInUser.username}
                </span>
              </div>
           </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
           {renderContent()}
        </main>
      </div>
    </div>
  );
}