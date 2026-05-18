import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, GripVertical, CheckCircle2, Wallet, Activity, 
  Edit, Trash2, ChevronRight, KanbanSquare, Target, 
  Users, AlertCircle, ArrowRight, Sparkles, Briefcase, Loader2
} from 'lucide-react';

import { Card, Badge, ProgressBar } from './components';
import { formatRupiah, personas } from './dummyData';

export const RoadmapPage = ({ users, tasks, setTasks, highlightPhaseName, setHighlightPhaseName, phases, setPhases, setHighlightTaskId, setActiveTab }) => {
  const [expandedPhaseId, setExpandedPhaseId] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null); 
  const [draggedPhaseIndex, setDraggedPhaseIndex] = useState(null);

  // =====================================================================
  // STATE BARU KHUSUS AI ROADMAP GENERATOR
  // =====================================================================
  const [availableBrands, setAvailableBrands] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Sedot data brand dari localStorage (hasil dari Brand Identity Page)
    const localBrandData = localStorage.getItem('saas_brand_projects');
    if (localBrandData) {
      setAvailableBrands(JSON.parse(localBrandData));
    }
  }, []);

  const handleGenerateRoadmap = async () => {
    if (!selectedBrandId) return alert("Pilih Brand Identity terlebih dahulu!");
    
    setIsGenerating(true);
    try {
      const selectedBrand = availableBrands.find(b => b.id === selectedBrandId);
      
      const formData = new FormData();
      formData.append('brandName', selectedBrand.name);
      formData.append('industry', selectedBrand.context.industry);
      formData.append('brandData', JSON.stringify(selectedBrand.data));

      const response = await fetch('https://n8n-ovmloglvzrcc.jkt4.sumopod.my.id/webhook/api-project-roadmap', {
        method: 'POST',
        body: formData
      });

      const rawText = await response.text();
      let finalData = {};
      
      try {
        let result = JSON.parse(rawText);
        let extractedString = "";
        if (Array.isArray(result) && result[0]?.text) extractedString = result[0].text;
        else if (result.text) extractedString = result.text;
        else finalData = result; 

        if (extractedString) {
            let cleanStr = extractedString.replace(/```json/gi, '').replace(/```/g, '').trim();
            finalData = JSON.parse(cleanStr);
        }
      } catch (e) {
        console.error("Gagal bongkar paket:", e);
        alert("Waduh, format AI berantakan. Coba generate ulang.");
        setIsGenerating(false);
        return;
      }

      // TRANSLATE DATA AI KE FORMAT STATE EXISTING (MODE APPEND/TAMBAH AMAN)
      if (finalData.roadmap && Array.isArray(finalData.roadmap)) {
        // Cari ID fase terakhir biar nggak numpuk
        let currentMaxPhaseId = phases.length > 0 ? Math.max(...phases.map(p => p.id)) : 0;
        
        const generatedPhases = [...phases]; // Copy data lama biar aman
        const generatedTasks = [...tasks];   // Copy data lama biar aman

        finalData.roadmap.forEach((r, idx) => {
          const newPhaseId = currentMaxPhaseId + idx + 1;
          const phaseTitle = `Phase ${newPhaseId} - ${r.phase}`;
          
          generatedPhases.push({
            id: newPhaseId,
            title: phaseTitle,
            progress: 0,
            status: 'pending',
            budget: 0,
            realisasi: 0,
            focus: r.focus, 
            milestone: r.milestone 
          });

          r.tasks.forEach((tStr, tIdx) => {
            generatedTasks.push({
              id: `t_ai_${Date.now()}_${idx}_${tIdx}`,
              title: tStr,
              phase: phaseTitle,
              status: 'todo',
              priority: 'medium',
              pic: users[0]?.name || 'Unassigned',
              avatar: users[0]?.avatar || 'https://i.pravatar.cc/150?img=1',
              targetPersonas: ['All Personas'],
              budget: 0,
              realisasi: 0
            });
          });
        });

        setPhases(generatedPhases);
        setTasks(generatedTasks);
        alert("Sukses! Roadmap AI berhasil ditambahkan ke dalam jadwal Anda.");
      }

    } catch (error) {
      alert("Error menghubungi n8n. Pastikan webhook aktif.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };
  // =====================================================================

  useEffect(() => {
    if (highlightPhaseName) {
      const phaseToExpand = phases.find(p => p.title.includes(highlightPhaseName) || highlightPhaseName.includes(p.title.split(' - ')[0]));
      
      if (phaseToExpand) {
        setExpandedPhaseId(phaseToExpand.id);
        setTimeout(() => {
          const el = document.getElementById(`phase-card-${phaseToExpand.id}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('ring-2', 'ring-emerald-500', 'shadow-emerald-500/20');
            setTimeout(() => {
              el.classList.remove('ring-2', 'ring-emerald-500', 'shadow-emerald-500/20');
              setHighlightPhaseName(null);
            }, 2500);
          }
        }, 300);
      } else {
         setHighlightPhaseName(null);
      }
    }
  }, [highlightPhaseName, phases, setHighlightPhaseName]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activePhaseTitle, setActivePhaseTitle] = useState('');

  const [isPhaseModalOpen, setIsPhaseModalOpen] = useState(false);
  const [phaseFormName, setPhaseFormName] = useState('');
  const [phaseFormBudget, setPhaseFormBudget] = useState(0);
  const [phaseFormRealisasi, setPhaseFormRealisasi] = useState(0);
  const [editingPhaseId, setEditingPhaseId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    status: 'todo',
    pic: users[0]?.name || '',
    targetPersonas: ['All Personas'],
    budget: 0,
    realisasi: 0
  });

  const togglePhase = (id) => {
    if (expandedPhaseId === id) setExpandedPhaseId(null);
    else setExpandedPhaseId(id);
  };

  const handlePhaseDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("phaseIndex", index);
    setDraggedPhaseIndex(index);
  };

  const handlePhaseDragOver = (e, index) => {
    e.preventDefault(); 
  };

  const handlePhaseDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndexStr = e.dataTransfer.getData("phaseIndex");
    if (!dragIndexStr) return;
    const dragIndex = parseInt(dragIndexStr, 10);
    
    if (dragIndex === dropIndex) {
      setDraggedPhaseIndex(null);
      return;
    }

    const newPhases = [...phases];
    const draggedPhase = newPhases[dragIndex];
    newPhases.splice(dragIndex, 1);
    newPhases.splice(dropIndex, 0, draggedPhase);

    const oldToNewPhaseMap = {};

    const updatedPhases = newPhases.map((p, idx) => {
      const oldPrefix = p.title.split(' - ')[0]; 
      const nameOnly = p.title.includes(' - ') ? p.title.substring(p.title.indexOf(' - ') + 3) : p.title;
      const newId = idx + 1;
      const newPrefix = `Phase ${newId}`;
      
      if (oldPrefix !== newPrefix) {
        oldToNewPhaseMap[oldPrefix] = newPrefix;
      }

      return {
        ...p,
        id: newId,
        title: `${newPrefix} - ${nameOnly}`
      };
    });

    setPhases(updatedPhases);

    if (Object.keys(oldToNewPhaseMap).length > 0) {
      setTasks(prevTasks => prevTasks.map(t => {
        let updatedPhase = t.phase;
        if (oldToNewPhaseMap[t.phase]) {
           updatedPhase = oldToNewPhaseMap[t.phase];
        } else {
           for (const oldPref in oldToNewPhaseMap) {
             if (t.phase === oldPref || t.phase.startsWith(`${oldPref} -`)) {
               updatedPhase = t.phase.replace(oldPref, oldToNewPhaseMap[oldPref]);
             }
           }
        }
        return { ...t, phase: updatedPhase };
      }));
    }

    setDraggedPhaseIndex(null);
  };

  const openAddPhaseModal = () => {
    setEditingPhaseId(null);
    setPhaseFormName('');
    setPhaseFormBudget(0);
    setPhaseFormRealisasi(0);
    setIsPhaseModalOpen(true);
  };

  const openEditPhaseModal = (phase, e) => {
    e.stopPropagation();
    setEditingPhaseId(phase.id);
    const prefix = `Phase ${phase.id} - `;
    const nameOnly = phase.title.startsWith(prefix) ? phase.title.replace(prefix, '') : phase.title;
    setPhaseFormName(nameOnly);
    setPhaseFormBudget(phase.budget || 0);
    setPhaseFormRealisasi(phase.realisasi || 0);
    setIsPhaseModalOpen(true);
  };

  const handleDeletePhase = (phaseId, e) => {
    e.stopPropagation();
    setConfirmDialog({
      message: 'Yakin ingin menghapus Milestone / Fase ini? Task yang ada di dalamnya akan kehilangan referensi fase ini.',
      onConfirm: () => {
        setPhases(phases.filter(p => p.id !== phaseId));
        setConfirmDialog(null);
      }
    });
  };

  const handleSavePhase = (e) => {
    e.preventDefault();
    if (!phaseFormName.trim()) return;
    if (editingPhaseId) {
       setPhases(phases.map(p => p.id === editingPhaseId ? { ...p, title: `Phase ${p.id} - ${phaseFormName}` } : p));
    } else {
       const nextId = phases.length > 0 ? Math.max(...phases.map(p => p.id)) + 1 : 1;
       const newPhase = {
         id: nextId,
         title: `Phase ${nextId} - ${phaseFormName}`,
         progress: 0,
         status: 'pending',
         budget: 0,
         realisasi: 0
       };
       setPhases([...phases, newPhase]);
    }
    setIsPhaseModalOpen(false);
    setPhaseFormName('');
    setPhaseFormBudget(0);
    setPhaseFormRealisasi(0);
    setEditingPhaseId(null);
  };

  const openAddModal = (phaseTitle) => {
    setEditingTask(null);
    setActivePhaseTitle(phaseTitle);
    setFormData({
      title: '',
      status: 'todo',
      pic: users[0]?.name || '',
      targetPersonas: ['All Personas'],
      budget: 0,
      realisasi: 0
    });
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setActivePhaseTitle(task.phase);
    setFormData({
      title: task.title,
      status: task.status,
      pic: task.pic,
      targetPersonas: task.targetPersonas && task.targetPersonas.length > 0 ? task.targetPersonas : ['All Personas'],
      budget: task.budget ?? 0,
      realisasi: task.realisasi ?? 0
    });
    setIsModalOpen(true);
  };

  const handleDeleteTask = (id) => {
    setConfirmDialog({
      message: 'Yakin ingin menghapus task ini?',
      onConfirm: () => {
        setTasks(tasks.filter(t => t.id !== id));
        setConfirmDialog(null);
      }
    });
  };

  const handleTogglePersona = (pName) => {
    let newSelected = [...formData.targetPersonas];
    if (pName === 'All Personas') {
      newSelected = ['All Personas'];
    } else {
      newSelected = newSelected.filter(p => p !== 'All Personas');
      if (newSelected.includes(pName)) {
        newSelected = newSelected.filter(p => p !== pName);
      } else {
        newSelected.push(pName);
      }
      if (newSelected.length === 0) newSelected = ['All Personas'];
    }
    setFormData({ ...formData, targetPersonas: newSelected });
  };

  const handleSaveTask = (e) => {
    e.preventDefault();
    if (!formData.title) return;

    const avatar = users.find(u => u.name === formData.pic)?.avatar || 'https://i.pravatar.cc/150?img=1';
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { 
        ...t, 
        ...formData, 
        budget: Number(formData.budget) || 0,
        realisasi: editingTask.realisasi 
      } : t));
    } else {
      const newTask = {
        id: `t${Date.now()}`,
        title: formData.title,
        phase: activePhaseTitle,
        status: formData.status,
        priority: 'medium', 
        pic: formData.pic,
        avatar,
        targetPersonas: formData.targetPersonas,
        budget: Number(formData.budget) || 0,
        realisasi: 0 
      };
      setTasks([...tasks, newTask]);
    }
    setIsModalOpen(false);
  };

  const navigateToTaskBoard = (taskId) => {
    setHighlightTaskId(taskId);
    setActiveTab('tasks');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10 relative">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">Project Master Roadmap</h2>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            {selectedBrandId 
              ? `${availableBrands.find(b => b.id === selectedBrandId)?.name || 'Project'} Launch Plan` 
              : 'Strategic Execution Plan'}
          </p>
        </div>
        <button onClick={openAddPhaseModal} className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto">
          <Plus size={16} /> Add Milestone
        </button>
      </div>

      {/* KOTAK GENERATE AI */}
      <div className="bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-center mb-6">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Sparkles className="text-blue-600 dark:text-blue-400" size={20}/>
          </div>
          <div className="hidden sm:block">
            <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-200">AI Roadmap Generator</h3>
            <p className="text-[10px] text-slate-500">Ubah Brand Identity jadi Timeline</p>
          </div>
        </div>
        
        <select 
          value={selectedBrandId} 
          onChange={(e) => setSelectedBrandId(e.target.value)} 
          className="flex-1 w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl p-2.5 text-sm outline-none"
        >
          <option value="">-- Pilih Brand Identity Tersimpan --</option>
          {availableBrands.map(b => (
            <option key={b.id} value={b.id}>{b.name} ({b.context.industry})</option>
          ))}
        </select>
        
        <button 
          onClick={handleGenerateRoadmap} 
          disabled={isGenerating || !selectedBrandId} 
          className={`w-full md:w-auto px-6 py-2.5 font-bold rounded-xl flex items-center justify-center gap-2 transition-all text-sm ${isGenerating || !selectedBrandId ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-md'}`}
        >
          {isGenerating ? <Loader2 size={16} className="animate-spin"/> : <Briefcase size={16}/>} 
          {isGenerating ? 'Menyusun...' : 'Generate Roadmap'}
        </button>
      </div>

      <div className="space-y-4">
        {phases.map((phase, idx) => {
          const isExpanded = expandedPhaseId === phase.id;
          const isDragged = draggedPhaseIndex === idx;
          const phaseTasks = tasks.filter(t => phase.title.includes(t.phase) || t.phase.includes(phase.title.split(' - ')[0]));

          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={phase.id}
              draggable
              onDragStart={(e) => handlePhaseDragStart(e, idx)}
              onDragOver={(e) => handlePhaseDragOver(e, idx)}
              onDrop={(e) => handlePhaseDrop(e, idx)}
              className={`transition-all duration-300 ${isDragged ? 'opacity-50 scale-[0.98]' : 'opacity-100 scale-100'}`}
            >
              <Card 
                id={`phase-card-${phase.id}`}
                className={`group transition-all duration-300 ${isExpanded ? 'border-emerald-500/50 shadow-md' : 'hover:border-slate-300 dark:hover:border-zinc-700'}`}
              >
                <div 
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                  onClick={() => togglePhase(phase.id)}
                >
                  <div className="flex-1 flex items-start sm:items-center">
                    <div 
                      className="text-slate-300 hover:text-emerald-500 cursor-grab active:cursor-grabbing p-2 -ml-2 mr-1 transition-colors hidden sm:block"
                      title="Drag up or down to reorder phase"
                      onClick={(e) => e.stopPropagation()} 
                    >
                      <GripVertical size={16} />
                    </div>

                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors shrink-0
                          ${phase.progress === 100 ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                          {phase.progress === 100 ? <CheckCircle2 size={16} /> : phase.id}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100 leading-tight">{phase.title}</h3>
                        {phase.status === 'in-progress' && <Badge variant="warning">Active</Badge>}
                        {phase.status === 'completed' && <Badge variant="success">Done</Badge>}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <ProgressBar progress={phase.progress} colorClass={phase.progress === 100 ? 'bg-emerald-500' : 'bg-amber-500'} />
                        </div>
                        <span className="text-sm font-medium text-slate-500 w-12 text-right">{phase.progress}%</span>
                      </div>
                      
                      {/* FOCUS & MILESTONE DARI AI */}
                      {phase.focus && (
                        <div className="mt-3 bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100/50 dark:border-blue-800/30">
                          <p className="text-xs text-blue-800 dark:text-blue-300"><strong>🎯 Fokus:</strong> {phase.focus}</p>
                          <p className="text-xs text-blue-800 dark:text-blue-300 mt-1"><strong>🏆 Target:</strong> {phase.milestone}</p>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mt-3 text-sm border-t border-slate-100 dark:border-zinc-800 pt-3">
                         <div className="flex items-center gap-2">
                             <span className="text-slate-500 flex items-center gap-1"><Wallet size={14}/> Budget Phase:</span>
                             <span className="font-semibold text-slate-700 dark:text-zinc-300">{formatRupiah(phase.budget)}</span>
                         </div>
                         <div className="flex items-center gap-2">
                             <span className="text-slate-500 flex items-center gap-1"><Activity size={14}/> Realisasi Phase:</span>
                             <span className={`font-semibold ${phase.realisasi > phase.budget ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                 {formatRupiah(phase.realisasi)}
                             </span>
                         </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-1 w-full md:w-auto mt-2 sm:mt-0 border-t sm:border-0 border-slate-100 dark:border-zinc-800 pt-3 sm:pt-0">
                    <div className="flex items-center gap-2">
                       <div className="text-slate-300 hover:text-emerald-500 cursor-grab active:cursor-grabbing p-1 transition-colors sm:hidden" onClick={(e) => e.stopPropagation()}><GripVertical size={16} /></div>
                       <div className="flex -space-x-2 mr-2">
                          {users.slice(0, 3).map((user, i) => (
                           <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-slate-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-medium overflow-hidden">
                              <img src={user.avatar} alt="avatar" />
                           </div>
                         ))}
                       </div>
                    </div>
                    <div className="flex items-center">
                       <button onClick={(e) => openEditPhaseModal(phase, e)} className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded transition-colors" title="Edit Milestone">
                         <Edit size={16} />
                       </button>
                       <button onClick={(e) => handleDeletePhase(phase.id, e)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded transition-colors" title="Hapus Milestone">
                         <Trash2 size={16} />
                       </button>
                       <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-400 transition-colors">
                         <ChevronRight size={20} className={`transition-transform duration-300 ${isExpanded ? 'rotate-90 text-emerald-500' : ''}`} />
                       </button>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                   {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-3">
                         <h4 className="text-sm font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-2 mb-3">
                          <KanbanSquare size={16} className="text-emerald-500" /> Tasks Breakdown & Persona Targets
                        </h4>
                        
                        {phaseTasks.length === 0 ? (
                           <p className="text-sm text-slate-500 italic bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl text-center border border-slate-100 dark:border-zinc-800">
                             Belum ada task yang dibuat untuk phase ini.
                           </p>
                        ) : (
                          phaseTasks.map(task => {
                            const assignee = users.find(u => u.name === task.pic) || { avatar: task.avatar || 'https://i.pravatar.cc/150?img=1' };
                            return (
                              <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-3.5 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-100 dark:border-zinc-800 gap-4 hover:border-emerald-500/30 transition-colors">
                                 <div className="flex-1 w-full">
                                  <div className="flex items-start sm:items-center justify-between sm:justify-start gap-3 mb-2">
                                    <span 
                                      className="text-sm font-bold text-slate-900 dark:text-zinc-100 cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors underline decoration-emerald-500/30 underline-offset-4 line-clamp-2 sm:line-clamp-none"
                                      onClick={(e) => { e.stopPropagation(); navigateToTaskBoard(task.id); }}
                                      title="Go to Task Board"
                                    >
                                      {task.title}
                                    </span>
                                    <Badge variant={task.status === 'done' ? 'success' : task.status === 'doing' ? 'warning' : task.status === 'review' ? 'info' : 'default'}>
                                      {task.status.toUpperCase()}
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 flex-wrap mt-2 sm:mt-1">
                                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 bg-slate-200/50 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                                      <Target size={12}/> Attack:
                                    </span>
                                    {task.targetPersonas && task.targetPersonas.length > 0 ? (
                                      task.targetPersonas.map((persona, i) => (
                                        <button 
                                          key={i} 
                                          onClick={(e) => { e.stopPropagation(); setActiveTab('persona'); }}
                                          className="text-[11px] sm:text-[11px] font-medium px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 flex items-center gap-1 shadow-sm hover:bg-indigo-100 dark:hover:bg-indigo-500/30 cursor-pointer transition-colors truncate max-w-[120px] sm:max-w-none"
                                          title="View Persona Intelligence"
                                        >
                                          <Users size={10} className="shrink-0" /> <span className="truncate">{persona}</span>
                                        </button>
                                      ))
                                    ) : (
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); setActiveTab('persona'); }}
                                        className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 flex items-center gap-1 cursor-pointer hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
                                        title="View Persona Intelligence"
                                      >
                                         General
                                      </button>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-4 mt-3 pt-2.5 border-t border-slate-100 dark:border-zinc-800/60 text-[11px] sm:text-xs">
                                    <div className="flex items-center gap-1.5 text-slate-500">
                                      <Wallet size={12} className="text-slate-400" />
                                      <span>Budget:</span>
                                      <span className="font-semibold text-slate-700 dark:text-zinc-300">{formatRupiah(task.budget)}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-500">
                                      <Activity size={12} className="text-slate-400" />
                                      <span>Realisasi:</span>
                                      <span className={`font-semibold ${task.realisasi > task.budget ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                        {formatRupiah(task.realisasi)}
                                      </span>
                                    </div>
                                  </div>

                                </div>
                                
                                <div className="flex flex-row items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-zinc-800">
                                  <div className="flex items-center gap-2 sm:gap-3 bg-white dark:bg-zinc-900 py-1 px-2 sm:py-1.5 sm:px-3 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-sm shrink-0">
                                    <div className="text-right hidden sm:block">
                                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Assignee</p>
                                       <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">{task.pic}</p>
                                    </div>
                                    <img src={assignee.avatar} alt={task.pic} title={task.pic} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-emerald-500/30 object-cover" />
                                  </div>

                                  <div className="flex items-center gap-1">
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); openEditModal(task); }} 
                                      className="p-1.5 sm:p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"
                                    >
                                      <Edit size={16} />
                                    </button>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }} 
                                      className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                 </div>
                              </div>
                            )
                          })
                        )}

                        <button 
                          onClick={(e) => { e.stopPropagation(); openAddModal(phase.title.split(' - ')[0]); }} 
                          className="w-full mt-3 py-3 border-2 border-dashed border-slate-200 dark:border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        >
                          <Plus size={16} /> Add Task to {phase.title.split(' - ')[0]}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* MODAL EDIT / ADD TASK */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                   <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editingTask ? 'Edit Task Details' : 'Add New Task'}</h3>
                   <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">{activePhaseTitle}</p>
                </div>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 p-1">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <form onSubmit={handleSaveTask} className="space-y-4 sm:space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase">Task Title</label>
                  <input 
                    required type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                    placeholder="e.g. Design Creative Banner A"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase">Status</label>
                    <select 
                      value={formData.status} 
                      onChange={e => setFormData({...formData, status: e.target.value})} 
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    >
                      <option value="todo">To Do</option>
                      <option value="doing">In Progress</option>
                      <option value="review">Review</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase">Assignee (PIC)</label>
                    <select 
                      value={formData.pic} 
                      onChange={e => setFormData({...formData, pic: e.target.value})} 
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    >
                      {users.map(u => (
                        <option key={u.id} value={u.name}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase">Budget Task (Rp)</label>
                    <input 
                      type="number" 
                      value={formData.budget ?? 0} 
                      onChange={e => setFormData({...formData, budget: e.target.value})} 
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase">Realisasi (Rp)</label>
                    <input 
                      type="number" 
                      value={formData.realisasi ?? 0} 
                      disabled
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-100 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm outline-none transition-all cursor-not-allowed opacity-70 text-slate-500" 
                      placeholder="0"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">*Terakumulasi otomatis dari total Cost Iterasi PDCA yang terhubung.</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-2 uppercase">Target Personas</label>
                  <div className="flex flex-wrap gap-2 p-3 border border-slate-200 dark:border-zinc-700 rounded-xl bg-slate-50 dark:bg-zinc-950/50">
                     {['All Personas', ...personas.map(p => p.name)].map((personaName, i) => {
                       const isSelected = formData.targetPersonas.includes(personaName);
                       return (
                         <button 
                           key={i} 
                           type="button" 
                           onClick={() => handleTogglePersona(personaName)}
                           className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                             isSelected 
                               ? 'bg-emerald-500 border-emerald-500 text-white shadow-md' 
                               : 'bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:border-emerald-300 dark:hover:border-emerald-700'
                           }`}
                         >
                           {personaName}
                         </button>
                       )
                     })}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/20 transition-colors">
                    {editingTask ? 'Save Changes' : 'Create Task'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD / EDIT MILESTONE / PHASE */}
      <AnimatePresence>
        {isPhaseModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-zinc-800"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                   <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editingPhaseId ? 'Edit Milestone' : 'Add New Milestone'}</h3>
                   <p className="text-xs text-slate-500 mt-1">{editingPhaseId ? 'Ubah nama fase roadmap project.' : 'Tambahkan fase baru ke dalam roadmap project.'}</p>
                </div>
                <button type="button" onClick={() => setIsPhaseModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 p-1">
                  <Plus size={24} className="rotate-45" />
                </button>
               </div>

              <form onSubmit={handleSavePhase} className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase">Milestone / Phase Name</label>
                  <div className="flex items-center bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
                    <span className="px-3 text-sm font-medium text-slate-500 border-r border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-900 whitespace-nowrap">
                      Phase {editingPhaseId ? editingPhaseId : (phases.length > 0 ? Math.max(...phases.map(p => p.id)) + 1 : 1)} - 
                    </span>
                    <input 
                      required type="text" 
                      value={phaseFormName} 
                      onChange={e => setPhaseFormName(e.target.value)} 
                      className="w-full px-3 py-2.5 bg-transparent text-sm outline-none text-slate-900 dark:text-zinc-100 min-w-0" 
                      placeholder="e.g. Post Launch Review"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase">Budget Plan (Rp)</label>
                    <input 
                      type="number" 
                      value={phaseFormBudget ?? 0} 
                      disabled
                      className="w-full px-3 py-2.5 bg-slate-100 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm outline-none transition-all cursor-not-allowed opacity-70 text-slate-500" 
                      placeholder="0"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">*Terakumulasi otomatis dari total budget Task di fase ini.</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase">Realisasi (Rp)</label>
                    <input 
                      type="number" 
                      value={phaseFormRealisasi ?? 0} 
                      disabled
                      className="w-full px-3 py-2.5 bg-slate-100 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm outline-none transition-all cursor-not-allowed opacity-70 text-slate-500" 
                      placeholder="0"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">*Terakumulasi otomatis dari total realisasi Task di fase ini.</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row justify-end gap-3">
                  <button type="button" onClick={() => setIsPhaseModalOpen(false)} className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                    Batal
                  </button>
                  <button type="submit" className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/20 transition-colors">
                    {editingPhaseId ? 'Simpan' : 'Tambahkan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL KONFIRMASI HAPUS (CUSTOM) */}
      <AnimatePresence>
        {confirmDialog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} 
              className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-zinc-800"
            >
              <div className="flex items-center gap-3 mb-4 text-rose-500">
                <AlertCircle size={24} />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Konfirmasi Hapus</h3>
              </div>
              <p className="text-sm text-slate-500 mb-6">{confirmDialog.message}</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDialog(null)} className="flex-1 py-2 text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 rounded-xl transition-colors">Batal</button>
                <button onClick={confirmDialog.onConfirm} className="flex-1 py-2 text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-lg shadow-rose-500/20 transition-colors">Hapus</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};