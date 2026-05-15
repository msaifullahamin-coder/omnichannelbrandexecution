import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, RefreshCcw, Layers, Users, X, KanbanSquare, Wallet, 
  Edit, CheckCircle2, Target, Activity, Search, Zap, ArrowUpRight, 
  Paperclip, Link2, Image as ImageIcon, FileText, ExternalLink, Plus, Filter, Clock 
} from 'lucide-react';
import { Card, Badge } from './components';
import { formatRupiah } from './dummyData';

export const PDCAPage = ({ pdcaIterations, setPdcaIterations, tasks, setTasks, personas, phases, activePdcaId, setActivePdcaId, users, navigateToTaskBoard, navigateToPersona, navigateToRoadmap, pdcaPrefill, setPdcaPrefill }) => {
  const [filterTask, setFilterTask] = useState('all');
  const [filterPersona, setFilterPersona] = useState('all');
  const [filterPhase, setFilterPhase] = useState('all');

  const [editData, setEditData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [toastMessage, setToastMessage] = useState(''); 
  const [autoEditId, setAutoEditId] = useState(null);
  
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskFromPdca, setNewTaskFromPdca] = useState({ title: '', pic: users[0]?.name || '', phase: '' });

  useEffect(() => {
    if (activePdcaId && activePdcaId !== 'new') {
      const pdca = pdcaIterations.find(p => p.id === activePdcaId);
      if (pdca) {
        setEditData(JSON.parse(JSON.stringify({ ...pdca, attachments: pdca.attachments || [] })));
      }
      if (activePdcaId === autoEditId) {
          setIsEditing(true);
          setAutoEditId(null);
      } else if (!isEditing) {
          setIsEditing(false); 
      }
    } else if (activePdcaId !== 'new') {
      setEditData(null);
      setIsEditing(false);
    }
  }, [activePdcaId, pdcaIterations, autoEditId]);

  const handleCreateBlankIteration = (prefillTaskId, prefillPhase) => {
    const taskId = typeof prefillTaskId === 'string' ? prefillTaskId : null;
    const phaseStr = typeof prefillPhase === 'string' ? prefillPhase : null;

    const newPdcaId = `pdca${Date.now()}`;
    const newBlankPdca = {
      id: newPdcaId,
      title: 'Iterasi Baru',
      tasks: taskId ? [taskId] : [],
      personas: [],
      phase: phaseStr || phases[0]?.title.split(' - ')[0] || 'Phase 1',
      status: 'Plan',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      linkedNextIter: null,
      cost: 0,
      plan: { goal: '', kpi: [], approved: false },
      do: { checklist: [] },
      check: { experiments: [] },
      action: { steps: [] },
      attachments: []
    };
    setActivePdcaId('new'); 
    setEditData(newBlankPdca);
    setIsEditing(true);
  };

  useEffect(() => {
    if (activePdcaId === 'new' && pdcaPrefill) {
      handleCreateBlankIteration(pdcaPrefill.taskId, pdcaPrefill.phase);
      if (setPdcaPrefill) setPdcaPrefill(null); 
    }
  }, [activePdcaId, pdcaPrefill, setPdcaPrefill]);

  const evaluatePdcaStatus = (currentData) => {
    let newStatus = currentData.status;
    let dataToSave = { ...currentData };
    const isPlanApproved = currentData.plan?.approved;
    const allChecklistDone = currentData.do?.checklist?.length > 0 && currentData.do.checklist.every(c => c.done);
    const hasPendingExp = currentData.check?.experiments?.some(e => e.status === 'Pending');
    const hasResolvedExp = currentData.check?.experiments?.some(e => e.status === 'Winner' || e.status === 'Loser');

    if (isPlanApproved && newStatus === 'Plan') {
       newStatus = 'Do';
       setTasks(prevTasks => prevTasks.map(t => {
         if(currentData.tasks.includes(t.id) && t.status === 'todo') return { ...t, status: 'doing' };
         return t;
       }));
    }

    if (allChecklistDone && newStatus === 'Do') {
       newStatus = 'Check';
       setTasks(prevTasks => prevTasks.map(t => {
         if(currentData.tasks.includes(t.id) && t.status === 'doing') return { ...t, status: 'review' };
         return t;
       }));
    }

    if (!hasPendingExp && hasResolvedExp && newStatus === 'Check') {
       newStatus = 'Action';
    }

    if (!isPlanApproved && newStatus === 'Do') {
       newStatus = 'Plan';
       setTasks(prevTasks => prevTasks.map(t => {
         if(currentData.tasks.includes(t.id) && t.status === 'doing') return { ...t, status: 'todo' };
         return t;
       }));
    }
    
    if (!allChecklistDone && newStatus === 'Check') {
       newStatus = 'Do';
       setTasks(prevTasks => prevTasks.map(t => {
         if(currentData.tasks.includes(t.id) && t.status === 'review') return { ...t, status: 'doing' };
         return t;
       }));
    }

    dataToSave.status = newStatus;
    return dataToSave;
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const quickSave = (newData) => {
     const evaluatedData = evaluatePdcaStatus(newData);
     setPdcaIterations(prev => prev.map(p => p.id === evaluatedData.id ? evaluatedData : p));
     setEditData(evaluatedData);
  }

  const handleSavePdca = () => {
    const evaluatedData = evaluatePdcaStatus(editData);
    if (activePdcaId === 'new') {
        setPdcaIterations([evaluatedData, ...pdcaIterations]);
        setActivePdcaId(evaluatedData.id);
    } else {
        setPdcaIterations(prev => prev.map(p => p.id === evaluatedData.id ? evaluatedData : p));
    }
    
    setEditData(evaluatedData);
    setIsEditing(false);
    showToast("Perubahan PDCA berhasil disimpan!");
  };

  const handleCancelEdit = () => {
    if (activePdcaId === 'new') {
        setActivePdcaId(null);
        setEditData(null);
        setIsEditing(false);
    } else {
        const pdca = pdcaIterations.find(p => p.id === activePdcaId);
        setEditData(JSON.parse(JSON.stringify({ ...pdca, attachments: pdca.attachments || [] })));
        setIsEditing(false);
    }
  };

  const handleQuickPlanApproved = (val) => {
    const newData = {...editData, plan: {...editData.plan, approved: val}};
    quickSave(newData);
  };

  const handleQuickChecklist = (idx, val) => {
    const newList = [...editData.do.checklist];
    newList[idx] = { ...newList[idx], done: val };
    const newData = {...editData, do: {...editData.do, checklist: newList}};
    quickSave(newData);
  };

  const handleQuickExpStatus = (idx, val) => {
    const newExp = [...editData.check.experiments];
    newExp[idx] = { ...newExp[idx], status: val };
    const newData = {...editData, check: {...editData.check, experiments: newExp}};
    quickSave(newData);
  };

  const addPdcaPersona = (e) => {
    const val = e.target.value;
    if(!val) return;
    if(!editData.personas.includes(val)) {
      setEditData({...editData, personas: [...editData.personas, val]});
    }
  };

  const removePdcaPersona = (name, e) => {
    e.stopPropagation(); 
    setEditData({...editData, personas: editData.personas.filter(p => p !== name)});
  };

  const addPdcaTask = (e) => {
    const val = e.target.value;
    if(!val) return;
    if(!editData.tasks.includes(val)) {
      setEditData({...editData, tasks: [...editData.tasks, val]});
    }
  };

  const removePdcaTask = (id, e) => {
    e.stopPropagation(); 
    setEditData({...editData, tasks: editData.tasks.filter(t => t !== id)});
  };

  const updatePlanGoal = (val) => setEditData({...editData, plan: {...editData.plan, goal: val}});
  const updatePlanApproved = (val) => setEditData({...editData, plan: {...editData.plan, approved: val}});
  
  const updateKpi = (idx, val) => {
    const newKpi = [...editData.plan.kpi];
    newKpi[idx] = val;
    setEditData({...editData, plan: {...editData.plan, kpi: newKpi}});
  };
  const addKpi = () => setEditData({...editData, plan: {...editData.plan, kpi: [...(editData.plan.kpi||[]), 'KPI Baru']}});
  const removeKpi = (idx) => setEditData({...editData, plan: {...editData.plan, kpi: editData.plan.kpi.filter((_, i) => i !== idx)}});

  const updateChecklist = (idx, field, val) => {
    const newList = [...editData.do.checklist];
    newList[idx] = { ...newList[idx], [field]: val };
    setEditData({...editData, do: {...editData.do, checklist: newList}});
  };
  const addChecklist = () => setEditData({...editData, do: {...editData.do, checklist: [...(editData.do.checklist||[]), {text: 'Tugas eksekusi baru', done: false}]}});
  const removeChecklist = (idx) => setEditData({...editData, do: {...editData.do, checklist: editData.do.checklist.filter((_, i) => i !== idx)}});

  // === MODULAR KPI FUNCTIONS (CHECK PHASE) ===
  const updateExp = (idx, field, val) => {
    const newExp = [...editData.check.experiments];
    newExp[idx] = { ...newExp[idx], [field]: val };
    setEditData({...editData, check: {...editData.check, experiments: newExp}});
  };
  
  // Menggunakan default modular metrics saat menambah Variant Baru
  const addExp = () => setEditData({
     ...editData, 
     check: {
        ...editData.check, 
        experiments: [
           ...(editData.check.experiments||[]), 
           {
              name: 'Eksperimen Baru', 
              status: 'Pending', 
              metrics: [{label: 'CPA', value: '', unit: 'Rp'}, {label: 'CTR', value: '', unit: '%'}]
           }
        ]
     }
  });

  const removeExp = (idx) => setEditData({...editData, check: {...editData.check, experiments: editData.check.experiments.filter((_, i) => i !== idx)}});

  // Menambah Baris Metrik Baru
  const addMetricRow = (expIdx) => {
    const newExp = [...editData.check.experiments];
    // Backward compatibility: Jika data lama belum ada metrics array, buat dulu
    if (!newExp[expIdx].metrics) {
      newExp[expIdx].metrics = [
        {label: 'CPA', value: newExp[expIdx].cpa||'', unit: 'Rp'}, 
        {label: 'CTR', value: newExp[expIdx].ctr||'', unit: '%'}
      ];
    }
    newExp[expIdx].metrics.push({ label: 'New Metric', value: '', unit: '%' });
    setEditData({...editData, check: {...editData.check, experiments: newExp}});
  };

  // Update Data Baris Metrik
  const updateMetricRow = (expIdx, metricIdx, field, val) => {
    const newExp = [...editData.check.experiments];
    if (!newExp[expIdx].metrics) {
      newExp[expIdx].metrics = [
        {label: 'CPA', value: newExp[expIdx].cpa||'', unit: 'Rp'}, 
        {label: 'CTR', value: newExp[expIdx].ctr||'', unit: '%'}
      ];
    }
    newExp[expIdx].metrics[metricIdx][field] = val;
    setEditData({...editData, check: {...editData.check, experiments: newExp}});
  };

  // Hapus Baris Metrik
  const removeMetricRow = (expIdx, metricIdx) => {
    const newExp = [...editData.check.experiments];
    newExp[expIdx].metrics.splice(metricIdx, 1);
    setEditData({...editData, check: {...editData.check, experiments: newExp}});
  };

  const updateActionStep = (idx, field, val) => {
    const newSteps = [...editData.action.steps];
    newSteps[idx] = { ...newSteps[idx], [field]: val };
    setEditData({...editData, action: {...editData.action, steps: newSteps}});
  };
  const addActionStep = () => setEditData({...editData, action: {...editData.action, steps: [...(editData.action.steps||[]), {text: 'Langkah selanjutnya', type: 'info'}]}});
  const removeActionStep = (idx) => setEditData({...editData, action: {...editData.action, steps: editData.action.steps.filter((_, i) => i !== idx)}});

  const handleAddLink = () => {
    if(!linkTitle || !linkUrl) return;
    const newAtt = { id: `att-${Date.now()}`, type: 'link', name: linkTitle, url: linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}` };
    setEditData({...editData, attachments: [...editData.attachments, newAtt]});
    setShowLinkModal(false);
    setLinkTitle(''); setLinkUrl('');
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAtt = { id: `att-${Date.now()}`, type, name: file.name, url: reader.result };
        setEditData({...editData, attachments: [...editData.attachments, newAtt]});
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeAttachment = (id) => {
    setEditData({...editData, attachments: editData.attachments.filter(a => a.id !== id)});
  }

  const handleSetStatus = (status) => {
    let updatedData = {...editData, status};
    if (status === 'Rework') {
       updatedData.status = 'Plan';
       updatedData.plan.approved = false;
       if (updatedData.do.checklist) updatedData.do.checklist = updatedData.do.checklist.map(c => ({...c, done: false}));
       if (updatedData.check.experiments) updatedData.check.experiments = updatedData.check.experiments.map(e => ({...e, status: 'Pending'}));
       setTasks(prevTasks => prevTasks.map(t => {
         if(updatedData.tasks.includes(t.id) && (t.status === 'done' || t.status === 'review')) {
           return { ...t, status: 'doing' };
         }
         return t;
       }));
    }

    setEditData(updatedData);
    setPdcaIterations(prev => prev.map(p => p.id === updatedData.id ? updatedData : p));
  };

  const handleCompletePdca = () => {
    let updatedData = {...editData, status: 'Done'};
    const newPdcaDb = pdcaIterations.map(p => p.id === updatedData.id ? updatedData : p);
    setPdcaIterations(newPdcaDb);
    setEditData(updatedData);
    setConfirmDialog({
      message: "Iterasi ini ditandai Selesai. Apakah Anda juga ingin mengupdate semua status Task yang tertaut di Kanban? (Task hanya akan 'Done' jika semua iterasinya selesai)",
      onConfirm: () => {
        setTasks(prevTasks => prevTasks.map(t => {
          if(updatedData.tasks.includes(t.id)) {
             const taskPdcas = newPdcaDb.filter(p => p.tasks.includes(t.id));
             const completedPdcas = taskPdcas.filter(p => p.status === 'Done');
             if(taskPdcas.length > 0 && completedPdcas.length === taskPdcas.length) {
                return { ...t, status: 'done' };
             }
          }
          return t;
        }));
        setConfirmDialog(null);
        showToast("Task berhasil diperbarui ke Done!");
      },
      onCancel: () => {
        setConfirmDialog(null);
        showToast("Iterasi diselesaikan tanpa mengubah Task.");
      }
    });
  };

  const handleCreateNewIteration = () => {
    const newPdcaId = `pdca${Date.now()}`;
    const nextIteration = {
      id: newPdcaId,
      title: `Iterasi Lanjutan: ${newTaskFromPdca.title}`,
      tasks: editData.tasks, 
      personas: editData.personas, 
      phase: editData.phase, 
      status: 'Plan',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      linkedNextIter: null,
      cost: 0,
      plan: { goal: `Melanjutkan eksperimen berdasarkan rekomendasi: ${newTaskFromPdca.title}`, kpi: [], approved: false },
      do: { checklist: [] },
      check: { experiments: [] },
      action: { steps: [] },
      attachments: []
    };
    const updatedCurrentData = {...editData, linkedNextIter: newPdcaId, status: 'Done'};
    const newPdcaDb = [...pdcaIterations.map(p => p.id === editData.id ? updatedCurrentData : p), nextIteration];
    setPdcaIterations(newPdcaDb);
    setEditData(updatedCurrentData);

    setTasks(prevTasks => prevTasks.map(t => {
       if (editData.tasks.includes(t.id) && t.status === 'done') {
          return { ...t, status: 'doing' };
       }
       return t;
    }));
    setShowNewTaskModal(false);
    setNewTaskFromPdca({ title: '', pic: users[0]?.name || '', phase: '' });
    showToast('Iterasi PDCA baru berhasil dibuat dan ditautkan!');
  };

  const filteredIterations = useMemo(() => {
    return pdcaIterations.filter(pdca => {
      const matchTask = filterTask === 'all' || pdca.tasks.includes(filterTask);
      const matchPersona = filterPersona === 'all' || pdca.personas.includes(filterPersona) || pdca.personas.includes('All Personas');
      const matchPhase = filterPhase === 'all' || pdca.phase.includes(filterPhase);
      return matchTask && matchPersona && matchPhase;
    });
  }, [pdcaIterations, filterTask, filterPersona, filterPhase]);

  if (editData) {
    return (
      <div className="space-y-6 pb-20 relative">
        <AnimatePresence>
          {toastMessage && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 font-medium text-sm w-max max-w-[90vw]">
              <CheckCircle2 size={18} /> {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 border-b border-slate-200 dark:border-zinc-800 pb-4 gap-4">
          <div className="flex items-start sm:items-center gap-4 flex-1 w-full">
            <button 
              onClick={() => setActivePdcaId(null)}
              className="p-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-500 hover:text-emerald-500 hover:border-emerald-500 transition-colors shrink-0 mt-1 sm:mt-0"
              title="Kembali ke Daftar PDCA"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1 w-full overflow-hidden">
              {isEditing ? (
                <input 
                   value={editData.title}
                   onChange={e => setEditData({...editData, title: e.target.value})}
                   className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 outline-none w-full transition-colors px-1"
                />
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 px-1 truncate">{editData.title}</h2>
                  {editData.linkedNextIter && (
                    <span 
                       onClick={() => setActivePdcaId(editData.linkedNextIter)}
                       className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 py-1 rounded cursor-pointer hover:bg-indigo-200 transition-colors flex items-center gap-1 w-max"
                     >
                       <RefreshCcw size={12}/> View Next Iteration
                     </span>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3 mt-2 px-1">
                <Badge variant={editData.status === 'Done' ? 'success' : editData.status === 'Rework' ? 'danger' : editData.status === 'Action' ? 'success' : editData.status === 'Check' ? 'info' : editData.status === 'Do' ? 'warning' : 'default'}>
                  {editData.status} Stage
                </Badge>
                
                <span 
                   onClick={() => !isEditing && navigateToRoadmap(editData.phase)}
                   className={`text-sm text-slate-500 flex items-center gap-1 transition-colors ${!isEditing ? 'cursor-pointer hover:text-emerald-500' : ''}`}
                   title={!isEditing ? "View in Roadmap" : ""}
                >
                   <Layers size={14}/> 
                   {isEditing ? (
                     <select 
                       value={editData.phase} 
                       onChange={(e) => setEditData({...editData, phase: e.target.value})}
                       className="bg-transparent outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800 rounded px-1"
                     >
                       {phases.map(p => (
                         <option key={p.id} value={p.title.split(' - ')[0]}>{p.title.split(' - ')[0]}</option>
                       ))}
                     </select>
                   ) : (
                     <span>{editData.phase}</span>
                   )}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 mt-3 px-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mr-1">Personas:</span>
                {editData.personas.map((p, i) => (
                  <span 
                     key={i} 
                     onClick={() => !isEditing && navigateToPersona(p)}
                     className={`group relative text-[10px] bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 px-2 py-0.5 rounded flex items-center gap-1 transition-colors ${!isEditing ? 'cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-500/30' : ''}`}
                     title={!isEditing ? "View Persona details" : ""}
                   >
                     <Users size={10}/> {p}
                     {isEditing && <button onClick={(e) => removePdcaPersona(p, e)} className="ml-1 text-indigo-400 hover:text-rose-500"><X size={10}/></button>}
                   </span>
                ))}
                
                {isEditing && (
                  <select onChange={addPdcaPersona} value="" className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 px-2 py-0.5 rounded outline-none cursor-pointer w-auto max-w-[100px]">
                     <option value="" disabled>+ Add</option>
                     <option value="All Personas">All Personas</option>
                     {personas.filter(p => !editData.personas.includes(p.name)).map(p => (
                       <option key={p.id} value={p.name}>{p.name}</option>
                     ))}
                  </select>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-2 px-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mr-1">Tasks:</span>
                {editData.tasks.map((taskId) => {
                   const t = tasks.find(x => x.id === taskId);
                   if(!t) return null;
                   return (
                     <span 
                       key={taskId} 
                       onClick={() => !isEditing && navigateToTaskBoard(taskId)}
                       className={`group relative text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-700 flex items-center gap-1 transition-colors ${!isEditing ? 'cursor-pointer hover:bg-slate-200 dark:hover:bg-zinc-700' : ''}`}
                       title={!isEditing ? "View Task in Board" : ""}
                     >
                       <KanbanSquare size={10}/> <span className="truncate max-w-[150px]">{t.title}</span>
                       {isEditing && <button onClick={(e) => removePdcaTask(taskId, e)} className="ml-1 text-slate-400 hover:text-rose-500"><X size={10}/></button>}
                     </span>
                   )
                })}
                
                {isEditing && (
                  <select onChange={addPdcaTask} value="" className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 px-2 py-0.5 rounded outline-none cursor-pointer w-24 truncate">
                     <option value="" disabled>+ Add</option>
                     {tasks.filter(t => !editData.tasks.includes(t.id)).map(t => (
                       <option key={t.id} value={t.id}>{t.title}</option>
                     ))}
                  </select>
                )}
              </div>

              <div className="flex items-center gap-2 mt-4 px-1 border-t border-slate-100 dark:border-zinc-800 pt-4">
                <Wallet size={14} className="text-slate-400"/>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mr-1">Biaya Iterasi:</span>
                {isEditing ? (
                   <div className="flex items-center gap-2">
                     <span className="text-xs font-bold text-slate-400">Rp</span>
                     <input 
                       type="number"
                       value={editData.cost ?? 0}
                       onChange={e => setEditData({...editData, cost: e.target.value})}
                       className="w-32 px-2 py-1 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-md text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                     />
                   </div>
                ) : (
                   <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatRupiah(editData.cost)}</span>
                )}
              </div>

             </div>
          </div>
          
          <div className="flex items-center justify-end sm:justify-start gap-2 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/30 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto"
              >
                <Edit size={16} /> Edit Iteration
              </button>
            ) : (
              <>
                <button 
                  onClick={handleCancelEdit}
                  className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSavePdca}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle2 size={16} /> Save Changes
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PLAN */}
          <Card className="border-l-4 border-l-blue-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-blue-500 font-black text-8xl pointer-events-none">P</div>
             <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><Target size={24}/></div>
                <h3 className="text-xl font-bold">PLAN</h3>
              </div>
              <div className="flex items-center gap-2 relative z-10">
                 <span className="text-xs font-bold text-slate-500">APPROVED:</span>
                 <button
                    onClick={(e) => { 
                      e.stopPropagation();
                      if (isEditing) updatePlanApproved(!editData.plan?.approved); 
                      else handleQuickPlanApproved(!editData.plan?.approved);
                    }}
                    className={`w-5 h-5 rounded flex items-center justify-center border shrink-0 transition-colors cursor-pointer ${editData.plan?.approved ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300 dark:border-zinc-600 hover:border-blue-400'}`}
                 >
                    {editData.plan?.approved && <CheckCircle2 size={14} />}
                 </button>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase flex justify-between items-center mb-1">
                  Experiment Goal {isEditing && <Edit size={12} className="opacity-50"/>}
                </label>
                {isEditing ? (
                  <textarea 
                    value={editData.plan?.goal || ''}
                    onChange={e => updatePlanGoal(e.target.value)}
                    className="p-3 bg-slate-50 dark:bg-zinc-900 focus:bg-white dark:focus:bg-zinc-950 rounded-lg text-sm border border-slate-200 dark:border-zinc-700 focus:border-blue-500 outline-none w-full resize-none transition-colors"
                    rows="3"
                  />
                ) : (
                  <div className="p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-lg text-sm border border-slate-200 dark:border-zinc-700">
                    {editData.plan?.goal || 'No goal defined yet.'}
                  </div>
                )}
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase flex justify-between items-center mb-1">
                  Target KPI {isEditing && <button onClick={addKpi} className="text-blue-500 hover:underline relative z-10">+ Add KPI</button>}
                </label>
                <ul className="space-y-2 text-sm">
                  {editData.plan?.kpi?.map((kpi, i) => (
                    <li key={i} className={`flex justify-between items-center group ${!isEditing && 'border-b border-slate-100 dark:border-zinc-800 pb-1'}`}>
                      <div className="flex items-center gap-2 flex-1 mr-2">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0"/>
                        {isEditing ? (
                          <input 
                            value={kpi} onChange={(e) => updateKpi(i, e.target.value)}
                            className="font-medium text-emerald-700 dark:text-emerald-400 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none w-full px-1 py-0.5"
                          />
                        ) : (
                          <span className="font-medium text-emerald-600 dark:text-emerald-500">{kpi}</span>
                        )}
                      </div>
                      {isEditing && <button onClick={() => removeKpi(i)} className="opacity-0 group-hover:opacity-100 text-rose-500 p-1 relative z-10"><X size={14}/></button>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* DO */}
          <Card className="border-l-4 border-l-amber-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-amber-500 font-black text-8xl pointer-events-none">D</div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg"><Activity size={24}/></div>
                <h3 className="text-xl font-bold">DO</h3>
              </div>
              {isEditing && <button onClick={addChecklist} className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1 relative z-10"><Plus size={14}/> Add Task</button>}
            </div>
            <div className="space-y-2 relative z-10">
              <label className="text-xs font-bold text-slate-500 uppercase">Execution Checklist</label>
              {editData.do?.checklist?.map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => { if(!isEditing) handleQuickChecklist(i, !item.done) }}
                  className={`flex items-start sm:items-center gap-3 p-2 rounded-lg transition-colors group ${!isEditing ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800' : 'bg-slate-50 dark:bg-zinc-900/50'}`}
                >
                  <button
                     onClick={(e) => { 
                       e.stopPropagation();
                       if (isEditing) updateChecklist(i, 'done', !item.done); 
                       else handleQuickChecklist(i, !item.done);
                     }}
                     className={`w-5 h-5 mt-0.5 sm:mt-0 rounded flex items-center justify-center border shrink-0 transition-colors cursor-pointer ${item.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-zinc-600 group-hover:border-emerald-400'}`}
                  >
                     {item.done && <CheckCircle2 size={14} />}
                  </button>

                  {isEditing ? (
                    <input 
                      value={item.text} 
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateChecklist(i, 'text', e.target.value)}
                      className={`flex-1 text-sm bg-transparent border-b border-transparent hover:border-slate-300 focus:border-amber-500 outline-none px-1 py-0.5 w-full ${item.done ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-zinc-100'}`}
                    />
                  ) : (
                    <span className={`text-sm flex-1 select-none leading-snug ${item.done ? 'text-slate-500 line-through' : 'text-slate-900 dark:text-zinc-100'}`}>{item.text}</span>
                  )}
                  {isEditing && <button onClick={() => removeChecklist(i)} className="opacity-100 sm:opacity-0 group-hover:opacity-100 text-rose-500 p-1"><X size={14}/></button>}
                </div>
              ))}
            </div>
          </Card>

          {/* CHECK (MODULAR METRICS UPDATE) */}
          <Card className="border-l-4 border-l-purple-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-purple-500 font-black text-8xl pointer-events-none">C</div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg"><Search size={24}/></div>
                <h3 className="text-xl font-bold">CHECK</h3>
              </div>
              {isEditing && <button onClick={addExp} className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1 relative z-10"><Plus size={14}/> Add Variant</button>}
            </div>
            <div className="space-y-4 relative z-10">
                 {editData.check?.experiments?.map((exp, i) => {
                    // Backward Compatibility Handler
                    let metricsToRender = exp.metrics;
                    if (!metricsToRender) {
                       metricsToRender = [
                         { label: 'CPA', value: exp.cpa || '-', unit: 'Rp' },
                         { label: 'CTR', value: exp.ctr || '-', unit: '%' }
                       ];
                    }

                    return (
                      <div key={i} className={`p-3 rounded-xl border group relative transition-colors ${
                        isEditing 
                          ? 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-700' 
                          : exp.status === 'Winner' 
                             ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-400' 
                             : exp.status === 'Loser' 
                                ? 'bg-slate-50 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 opacity-70 hover:opacity-100' 
                                : 'bg-slate-50 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 hover:border-amber-400'
                      }`}>
                         {isEditing && <button onClick={() => removeExp(i)} className="absolute -top-2 -right-2 bg-rose-100 text-rose-600 rounded-full p-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>}
                         
                         <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3 gap-2 border-b border-slate-200 dark:border-zinc-800 pb-2">
                           {isEditing ? (
                             <input 
                               value={exp.name} onChange={(e) => updateExp(i, 'name', e.target.value)}
                               className="font-medium text-sm w-full bg-transparent border-b border-transparent focus:border-purple-500 outline-none px-1"
                             />
                           ) : (
                             <span className="text-sm font-bold text-slate-800 dark:text-zinc-200">{exp.name}</span>
                           )}

                           <select 
                             value={exp.status} 
                             onChange={(e) => isEditing ? updateExp(i, 'status', e.target.value) : handleQuickExpStatus(i, e.target.value)}
                             className={`text-[10px] uppercase tracking-wider font-bold rounded-full px-2 py-1 outline-none cursor-pointer appearance-none text-center self-start sm:self-auto ${exp.status === 'Winner' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : exp.status === 'Loser' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}
                             style={{ paddingRight: '0.5rem' }}
                             title={!isEditing ? "Change Status" : ""}
                           >
                             <option value="Winner">Winner</option>
                             <option value="Loser">Loser</option>
                             <option value="Pending">Pending</option>
                           </select>
                         </div>

                         {/* METRIC HEADER & ADD BUTTON */}
                         <div className="flex justify-between items-center mb-2">
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Metrics</span>
                           {isEditing && (
                             <button onClick={() => addMetricRow(i)} className="text-[10px] font-bold text-purple-600 hover:underline flex items-center gap-1">
                               <Plus size={12}/> Add Metric
                             </button>
                           )}
                         </div>

                         {/* METRIC LIST RENDERER */}
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                           {metricsToRender.map((m, mIdx) => (
                             <div key={mIdx} className="flex items-center gap-2 group/metric relative bg-white dark:bg-zinc-950 p-2 rounded-lg border border-slate-200 dark:border-zinc-800">
                               {isEditing ? (
                                 <>
                                   <input value={m.label} onChange={e => updateMetricRow(i, mIdx, 'label', e.target.value)} placeholder="Name" className="w-[40%] bg-transparent text-[11px] font-medium outline-none border-b border-dashed border-slate-300 dark:border-zinc-700 focus:border-purple-500" />
                                   <input value={m.value} onChange={e => updateMetricRow(i, mIdx, 'value', e.target.value)} placeholder="Val" className="w-[30%] bg-transparent text-[11px] font-bold outline-none border-b border-dashed border-slate-300 dark:border-zinc-700 focus:border-purple-500 text-center" />
                                   <select value={m.unit} onChange={e => updateMetricRow(i, mIdx, 'unit', e.target.value)} className="w-[30%] bg-slate-100 dark:bg-zinc-900 text-[10px] rounded px-1 py-1 outline-none text-slate-600 dark:text-zinc-400">
                                     <option value="%">%</option>
                                     <option value="Rp">Rp</option>
                                     <option value="x">x</option>
                                     <option value="qty">qty</option>
                                     <option value="s">sec</option>
                                   </select>
                                   <button onClick={() => removeMetricRow(i, mIdx)} className="absolute -top-1.5 -right-1.5 bg-rose-100 text-rose-600 rounded-full p-0.5 opacity-0 group-hover/metric:opacity-100 transition-opacity z-10"><X size={10}/></button>
                                 </>
                               ) : (
                                 <>
                                   <span className="text-[11px] text-slate-500 w-1/2 truncate font-medium">{m.label}:</span>
                                   <span className={`text-[11px] font-bold w-1/2 text-right truncate ${exp.status === 'Winner' ? 'text-emerald-600 dark:text-emerald-400' : exp.status === 'Loser' ? 'text-rose-500' : 'text-slate-700 dark:text-zinc-300'}`}>
                                     {m.unit === 'Rp' ? 'Rp ' : ''}{m.value}{m.unit !== 'Rp' ? ` ${m.unit}` : ''}
                                   </span>
                                 </>
                               )}
                             </div>
                           ))}
                         </div>

                      </div>
                    );
                 })}
            </div>
          </Card>

          {/* ACTION */}
          <Card className="border-l-4 border-l-emerald-500 relative overflow-hidden bg-emerald-50/30 dark:bg-emerald-900/5 flex flex-col">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-emerald-500 font-black text-8xl pointer-events-none">A</div>
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg"><Zap size={24}/></div>
                <h3 className="text-xl font-bold">ACTION</h3>
              </div>
              {isEditing && <button onClick={addActionStep} className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1 relative z-10"><Plus size={14}/> Add Step</button>}
            </div>
            
            <div className="space-y-3 flex-1 overflow-y-auto relative z-10">
               <div>
                <label className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase">Recommended Next Steps</label>
                <div className="mt-2 space-y-2">
                   {editData.action?.steps?.map((step, i) => (
                    <div key={i} className={`flex gap-2 text-sm items-start group ${isEditing ? 'bg-white dark:bg-zinc-900 p-2 rounded-lg border border-slate-200 dark:border-zinc-700 flex-wrap' : ''}`}>
                      
                      {isEditing ? (
                        <>
                          <select 
                            value={step.type} onChange={(e) => updateActionStep(i, 'type', e.target.value)}
                            className="bg-transparent text-xs font-bold outline-none cursor-pointer mt-1 border-r border-slate-200 dark:border-zinc-700 pr-1"
                          >
                            <option value="scale">Scale</option>
                            <option value="iterate">Iterate</option>
                            <option value="info">Info</option>
                          </select>
                          <input 
                            value={step.text} onChange={(e) => updateActionStep(i, 'text', e.target.value)}
                            className="flex-1 bg-transparent border-b border-transparent focus:border-emerald-500 outline-none px-1 py-0.5 w-full min-w-0"
                          />
                          <button onClick={() => removeActionStep(i)} className="opacity-100 sm:opacity-0 group-hover:opacity-100 text-rose-500 p-1"><X size={14}/></button>
                        </>
                      ) : (
                        <>
                          {step.type === 'scale' ? <ArrowUpRight size={18} className="text-emerald-500 shrink-0 mt-0.5" /> :
                            step.type === 'iterate' ? <RefreshCcw size={18} className="text-amber-500 shrink-0 mt-0.5" /> :
                            <CheckCircle2 size={18} className="text-blue-500 shrink-0 mt-0.5" />}
                           <span className="leading-snug">{step.text}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
               </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-6 pt-4 border-t border-emerald-500/20 grid grid-cols-3 gap-2 relative z-10">
               <button 
                 onClick={handleCompletePdca}
                 className="flex flex-col items-center justify-center p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-sm"
               >
                 <CheckCircle2 size={18} className="mb-1" />
                 <span className="text-[10px] font-bold uppercase tracking-wider">Selesai</span>
               </button>
               <button 
                 onClick={() => handleSetStatus('Rework')}
                 className="flex flex-col items-center justify-center p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors shadow-sm"
               >
                 <RefreshCcw size={18} className="mb-1" />
                 <span className="text-[10px] font-bold uppercase tracking-wider">Rework</span>
               </button>
               <button 
                 onClick={() => setShowNewTaskModal(true)}
                 className="flex flex-col items-center justify-center p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-sm"
               >
                 <Plus size={18} className="mb-1" />
                 <span className="text-[10px] font-bold uppercase tracking-wider text-center">Buat Iterasi</span>
               </button>
            </div>
          </Card>
        </div>

        {/* ATTACHMENTS & RESOURCES SECTION */}
        <div className="mt-8">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
             <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
               <Paperclip size={18} className="text-slate-400" /> Attachments & Resources
             </h3>
             
             {isEditing && (
               <div className="flex flex-wrap items-center gap-2">
                  <button onClick={() => setShowLinkModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-bold rounded-lg transition-colors flex-1 justify-center sm:flex-none">
                    <Link2 size={14} /> Link
                  </button>
                  <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex-1 justify-center sm:flex-none">
                    <ImageIcon size={14} /> Image
                    <input type="file" hidden accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} />
                  </label>
                  <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex-1 justify-center sm:flex-none">
                    <FileText size={14} /> Doc
                    <input type="file" hidden accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={(e) => handleFileUpload(e, 'doc')} />
                  </label>
               </div>
             )}
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
             {editData.attachments?.length > 0 ? (
               editData.attachments.map((att) => (
                 <div key={att.id} className="group relative bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-3 flex items-center gap-3 shadow-sm hover:border-emerald-500/50 transition-colors">
                    {isEditing && <button onClick={() => removeAttachment(att.id)} className="absolute -top-2 -right-2 bg-rose-100 text-rose-600 rounded-full p-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>}
                    <div className={`p-2 rounded-lg shrink-0 ${att.type === 'link' ? 'bg-blue-50 text-blue-500' : att.type === 'image' ? 'bg-purple-50 text-purple-500' : 'bg-amber-50 text-amber-500'}`}>
                      {att.type === 'link' && <Link2 size={20} />}
                      {att.type === 'image' && <ImageIcon size={20} />}
                      {att.type === 'doc' && <FileText size={20} />}
                    </div>
                    <div className="overflow-hidden">
                      <a href={att.url} target="_blank" rel="noreferrer" className="text-sm font-bold text-slate-900 dark:text-zinc-100 truncate block hover:underline hover:text-emerald-500 flex items-center gap-1">
                        {att.name} {att.type === 'link' && <ExternalLink size={10} className="shrink-0"/>}
                      </a>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">{att.type}</p>
                     </div>
                  </div>
               ))
             ) : (
               <div className="col-span-full p-8 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center text-slate-400 text-center">
                 <Paperclip size={32} className="mb-2 opacity-50" />
                 <p className="text-sm">Belum ada lampiran. Tambahkan link Ads Manager atau gambar referensi eksperimen.</p>
               </div>
             )}
           </div>
        </div>

        {/* MODAL: ADD LINK */}
        <AnimatePresence>
          {showLinkModal && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-zinc-800">
                <h3 className="text-lg font-bold mb-4">Attach a Link</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Title</label>
                    <input value={linkTitle} onChange={e => setLinkTitle(e.target.value)} placeholder="e.g., Meta Ads Dashboard" className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">URL</label>
                    <input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://..." className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:border-emerald-500" />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowLinkModal(false)} className="flex-1 py-2 text-sm bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg font-medium">Batal</button>
                  <button onClick={handleAddLink} className="flex-1 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium">Tambahkan</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: BUAT TASK / ITERASI BARU */}
        <AnimatePresence>
          {showNewTaskModal && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-2xl border border-blue-500/30">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-zinc-800 pb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg"><Plus size={20} /></div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Buat Iterasi Baru</h3>
                    <p className="text-xs text-slate-500">Meneruskan rekomendasi menjadi siklus PDCA baru.</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Berdasarkan Rekomendasi</label>
                    <select 
                      value={newTaskFromPdca.title} 
                      onChange={e => setNewTaskFromPdca({...newTaskFromPdca, title: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:border-blue-500"
                    >
                       <option value="" disabled>-- Pilih rekomendasi --</option>
                      {editData.action?.steps?.map((step, i) => (
                         <option key={i} value={step.text}>{step.type.toUpperCase()}: {step.text}</option>
                      ))}
                     </select>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 p-3 rounded-lg flex gap-2">
                    <Activity size={16} className="text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700 dark:text-blue-400">Iterasi baru akan otomatis mewarisi Task, Persona, dan Fase dari iterasi saat ini. Kuadran Plan/Do/Check akan di-reset.</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowNewTaskModal(false)} className="flex-1 py-2.5 text-sm bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg font-medium">Batal</button>
                  <button onClick={handleCreateNewIteration} className="flex-1 py-2.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20">Buat Iterasi</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL KONFIRMASI (CUSTOM) */}
        <AnimatePresence>
          {confirmDialog && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-zinc-800">
                <div className="flex items-center gap-3 mb-4 text-emerald-500">
                  <CheckCircle2 size={24} />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Konfirmasi Penyelesaian</h3>
                </div>
                <p className="text-sm text-slate-500 mb-6">{confirmDialog.message}</p>
                <div className="flex gap-3">
                  <button onClick={confirmDialog.onCancel} className="flex-1 py-2 text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 rounded-xl transition-colors">Tidak, Abaikan</button>
                  <button onClick={confirmDialog.onConfirm} className="flex-1 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/20 transition-colors">Ya, Update Task</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      
      {/* 1. BRANDING HEADER: PRECISION PERFORMANCE HUB */}
      <div className="bg-slate-900 dark:bg-zinc-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden border border-emerald-500/20 shadow-2xl">
         <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -ml-20 -mb-20"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-5">
               <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/40 rotate-3">
                  <RefreshCcw size={32} className="text-white" />
               </div>
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <span className="text-[10px] font-black tracking-[0.2em] text-emerald-400 uppercase bg-emerald-400/10 px-2 py-0.5 rounded">Scientific Framework</span>
                  </div>
                  <h1 className="text-3xl font-black tracking-tight">PRECISION PERFORMANCE HUB</h1>
                  <p className="text-slate-400 text-sm font-medium italic mt-1">"Turning creative uncertainty into engineering certainty."</p>
               </div>
            </div>
            <button onClick={handleCreateBlankIteration} className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
               <Zap size={18} fill="currentColor" /> SETUP NEW EXPERIMENT
            </button>
         </div>
      </div>

      <Card className="bg-slate-50 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2 mb-4 text-slate-700 dark:text-zinc-300">
          <Filter size={18} /> <h3 className="font-bold text-sm">Filter Iterations</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">By Roadmap Phase</label>
            <select 
              value={filterPhase} onChange={e => setFilterPhase(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="all">All Phases</option>
              {phases.map(p => (
                <option key={p.id} value={p.title.split(' - ')[0]}>{p.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">By Linked Task</label>
            <select 
              value={filterTask} onChange={e => setFilterTask(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="all">All Tasks</option>
               {tasks.map(t => (
                 <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">By Persona Target</label>
            <select 
               value={filterPersona} onChange={e => setFilterPersona(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="all">All Personas</option>
              {personas.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIterations.length > 0 ? (
          filteredIterations.map((pdca) => (
            <Card 
              key={pdca.id} 
              className="group cursor-pointer hover:border-emerald-500 transition-all hover:-translate-y-1 relative flex flex-col"
            >
              <div 
                className="absolute inset-0 z-10" 
                onClick={() => setActivePdcaId(pdca.id)}
              ></div>

              <div className="flex justify-between items-start mb-4">
                <Badge variant={pdca.status === 'Done' ? 'success' : pdca.status === 'Rework' ? 'danger' : pdca.status === 'Action' ? 'success' : pdca.status === 'Check' ? 'info' : pdca.status === 'Do' ? 'warning' : 'default'}>
                  {pdca.status} Stage
                </Badge>
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1"><Clock size={12}/> {pdca.date}</span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 mb-2 leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {pdca.title}
              </h3>
              
              <div className="mb-4">
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Targeting:</p>
                 <div className="flex flex-wrap gap-1.5">
                   {pdca.personas.map((p, i) => (
                     <span key={i} className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-700 flex items-center gap-1 truncate max-w-full">
                       <Users size={10} className="shrink-0"/> <span className="truncate">{p}</span>
                     </span>
                   ))}
                 </div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100 dark:border-zinc-800 flex justify-between items-center text-sm text-slate-500">
                <span className="flex items-center gap-1.5"><Layers size={14}/> {pdca.phase}</span>
                <span className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 px-2 py-1 rounded-md text-xs font-bold">
                   <KanbanSquare size={14}/> {pdca.tasks?.length || 0} Tasks
                </span>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl bg-slate-50 dark:bg-zinc-900/50 text-center px-4">
            <RefreshCcw size={32} className="mb-3 opacity-50" />
            <p className="font-medium text-sm sm:text-base">Tidak ada iterasi PDCA yang cocok dengan filter tersebut.</p>
          </div>
        )}
      </div>
    </div>
  );
};