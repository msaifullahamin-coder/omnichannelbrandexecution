import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, MoreVertical, Wallet, Activity, MessageSquare, 
  Clock, ChevronRight, Layers, X, Users, RefreshCcw, KanbanSquare, AlertCircle, AlignLeft, Filter 
} from 'lucide-react';

import { Badge, ProgressBar } from './components';
import { formatRupiah } from './dummyData';

export const KanbanBoard = ({ users, tasks, setTasks, highlightTaskId, setHighlightTaskId, pdcaIterations, navigateToPdca, phases, personas }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  
  const todayStr = new Date().toISOString().split('T')[0];

  // === STATE UNTUK FILTER KANBAN ===
  const [filterPhase, setFilterPhase] = useState('All');
  const [filterPic, setFilterPic] = useState('All');
  const [filterPersona, setFilterPersona] = useState('All');

  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '', 
    status: 'todo',
    phase: phases[0]?.title.split(' - ')[0] || 'Phase 1',
    assignees: [users[0]?.name || ''], 
    targetPersonas: ['All Personas'],
    budget: 0,
    realisasi: 0,
    dueDate: '' 
  });

  useEffect(() => {
    if (highlightTaskId) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`kanban-task-${highlightTaskId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }
      }, 100);
      
      const clearTimer = setTimeout(() => {
        setHighlightTaskId(null);
      }, 2500);

      return () => {
        clearTimeout(timer);
        clearTimeout(clearTimer);
      };
    }
  }, [highlightTaskId, setHighlightTaskId]);

  // === LOGIKA FILTER SUPER PINTAR ===
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // 1. Cek Phase
      const matchPhase = filterPhase === 'All' || task.phase === filterPhase;
      
      // 2. Cek PIC (Assignees)
      const assigneesList = task.assignees || (task.pic ? [task.pic] : []);
      const matchPic = filterPic === 'All' || assigneesList.includes(filterPic);
      
      // 3. Cek Persona (Termasuk 'All Personas' biar tetap muncul)
      const matchPersona = filterPersona === 'All' || 
        (task.targetPersonas && (task.targetPersonas.includes(filterPersona) || task.targetPersonas.includes('All Personas')));

      return matchPhase && matchPic && matchPersona;
    });
  }, [tasks, filterPhase, filterPic, filterPersona]);

  const handleDragStart = (e, id) => { e.dataTransfer.setData("taskId", id); };
  const handleDragOver = (e) => { e.preventDefault(); };
  
  const handleDrop = (e, status) => {
    const id = e.dataTransfer.getData("taskId");
    setTasks(tasks.map(t => t.id === id ? { ...t, status } : t));
  };

  const openAddTaskModal = () => {
    setTaskFormData({
      title: '',
      description: '', 
      status: 'todo',
      phase: phases[0]?.title.split(' - ')[0] || 'Phase 1',
      assignees: [users[0]?.name || ''],
      targetPersonas: ['All Personas'],
      budget: 0,
      realisasi: 0,
      dueDate: ''
    });
    setIsTaskModalOpen(true);
  };

  const handleToggleTaskPersona = (pName) => {
    let newSelected = [...taskFormData.targetPersonas];
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
    setTaskFormData({ ...taskFormData, targetPersonas: newSelected });
  };

  const handleToggleAssignee = (uName) => {
    let newAssignees = [...taskFormData.assignees];
    if (newAssignees.includes(uName)) {
        newAssignees = newAssignees.filter(n => n !== uName);
    } else {
        newAssignees.push(uName);
    }
    if (newAssignees.length === 0) newAssignees = [users[0]?.name]; 
    setTaskFormData({ ...taskFormData, assignees: newAssignees });
  };

  const handleSaveNewTask = (e) => {
    e.preventDefault();
    if (!taskFormData.title) return;
    
    const firstAssignee = users.find(u => u.name === taskFormData.assignees[0]);
    const avatar = firstAssignee?.avatar || 'https://i.pravatar.cc/150?img=1';

    const newTask = {
      id: `t${Date.now()}`,
      title: taskFormData.title,
      description: taskFormData.description, 
      phase: taskFormData.phase,
      status: taskFormData.status,
      priority: 'medium', 
      pic: taskFormData.assignees[0], 
      assignees: taskFormData.assignees,
      dueDate: taskFormData.dueDate,
      avatar,
      targetPersonas: taskFormData.targetPersonas,
      budget: Number(taskFormData.budget) || 0,
      realisasi: 0 
    };
    setTasks([...tasks, newTask]);
    setIsTaskModalOpen(false);
  };

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-slate-200 dark:bg-zinc-800/50' },
    { id: 'doing', title: 'In Progress', color: 'bg-amber-100/50 dark:bg-amber-900/10 border-t-2 border-amber-500' },
    { id: 'review', title: 'Review', color: 'bg-blue-100/50 dark:bg-blue-900/10 border-t-2 border-blue-500' }, 
    { id: 'done', title: 'Completed', color: 'bg-emerald-100/50 dark:bg-emerald-900/10 border-t-2 border-emerald-500' },
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col relative">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">Task Management</h2>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">Drag and drop to update status</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex -space-x-2 mr-0 sm:mr-4 items-center">
             <span className="text-sm text-slate-500 mr-3 hidden sm:inline">Team:</span>
             {users.map(user => (
               <img key={user.id} src={user.avatar} className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-950 object-cover" alt="pic" title={user.name} />
             ))}
          </div>
          <button onClick={openAddTaskModal} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium shrink-0 shadow-sm">
            <Plus size={16} /> New Task
          </button>
        </div>
      </div>

      {/* === FILTER BAR AREA === */}
      <div className="flex flex-wrap items-center gap-3 mb-6 p-3 bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm">
        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-500 dark:text-zinc-400 mr-2">
          <Filter size={16} /> Filter:
        </div>
        
        {/* Filter Phase */}
        <select 
          value={filterPhase} onChange={(e) => setFilterPhase(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700 dark:text-zinc-300 cursor-pointer"
        >
          <option value="All">Semua Phase</option>
          {phases.map(p => <option key={p.id} value={p.title.split(' - ')[0]}>{p.title.split(' - ')[0]}</option>)}
        </select>

        {/* Filter PIC */}
        <select 
          value={filterPic} onChange={(e) => setFilterPic(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700 dark:text-zinc-300 cursor-pointer"
        >
          <option value="All">Semua Pekerja (PIC)</option>
          {users.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
        </select>

        {/* Filter Persona */}
        <select 
          value={filterPersona} onChange={(e) => setFilterPersona(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700 dark:text-zinc-300 cursor-pointer"
        >
          <option value="All">Semua Persona</option>
          {personas.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
        </select>

        {/* Tombol Reset (Muncul kalau ada filter yang aktif) */}
        {(filterPhase !== 'All' || filterPic !== 'All' || filterPersona !== 'All') && (
          <button 
            onClick={() => { setFilterPhase('All'); setFilterPic('All'); setFilterPersona('All'); }}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <X size={14} /> Reset Filter
          </button>
        )}
      </div>

      {/* KANBAN COLUMNS */}
      <div className="flex-1 flex gap-4 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory custom-scrollbar">
        {columns.map(col => {
          // Ambil task yang sudah di-filter
          const colTasks = filteredTasks.filter(t => t.status === col.id);

          return (
            <div 
              key={col.id} 
              className={`flex flex-col min-w-[85vw] sm:min-w-[300px] w-[85vw] sm:w-[300px] rounded-xl p-3 sm:p-4 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 snap-center ${col.color}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-700 dark:text-zinc-300">{col.title}</h3>
                <Badge>{colTasks.length}</Badge>
              </div>
              
              <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
                <AnimatePresence>
                  {colTasks.length === 0 ? (
                    <div className="text-center p-6 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-xl opacity-50">
                       <p className="text-sm font-medium text-slate-500">Kosong</p>
                    </div>
                  ) : (
                    colTasks.map(task => {
                      const assigneesList = task.assignees || (task.pic ? [task.pic] : []);
                      const isHighlighted = highlightTaskId === task.id;
                      
                      const taskPdcas = pdcaIterations.filter(p => p.tasks.includes(task.id));
                      const completedPdcas = taskPdcas.filter(p => p.status === 'Done');
                      const pdcaProgress = taskPdcas.length > 0 ? (completedPdcas.length / taskPdcas.length) * 100 : 0;
                      
                      const isOverdue = task.dueDate && task.dueDate < todayStr && task.status !== 'done';

                      return (
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          id={`kanban-task-${task.id}`}
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          onClick={() => setSelectedTask(task)}
                          className={`bg-white dark:bg-zinc-950 p-3 sm:p-4 rounded-xl border shadow-sm cursor-pointer hover:border-emerald-500/50 transition-all duration-300 ${
                            isHighlighted 
                              ? 'border-emerald-500 ring-2 ring-emerald-500/50 shadow-emerald-500/20 scale-[1.02] z-10 relative' 
                              : isOverdue ? 'border-rose-300 dark:border-rose-900/50 hover:border-rose-500' : 'border-slate-200 dark:border-zinc-800'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'default'}>
                              {task.priority}
                            </Badge>
                            <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={16} /></button>
                          </div>
                          <h4 className="font-medium text-slate-900 dark:text-zinc-100 text-sm mb-3">{task.title}</h4>
                          
                          {taskPdcas.length > 0 && (
                            <div className="mb-3">
                              <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                <span>PDCA Iterations</span>
                                <span className={pdcaProgress === 100 ? 'text-emerald-500' : ''}>{Math.round(pdcaProgress)}%</span>
                              </div>
                              <ProgressBar progress={pdcaProgress} className="h-1.5" />
                            </div>
                          )}

                          <p className="text-xs text-slate-500 mb-4 truncate">{task.phase}</p>
                          
                          <div className="flex flex-col gap-3 mt-2 border-t border-slate-100 dark:border-zinc-800 pt-3">
                            <div className="flex flex-col gap-1.5 text-[11px] sm:text-xs bg-slate-50 dark:bg-zinc-900/50 p-2 rounded-lg">
                              <div className="flex items-center justify-between text-slate-500">
                                <div className="flex items-center gap-1.5">
                                    <Wallet size={12} className="text-slate-400" />
                                    <span>Budget:</span>
                                </div>
                                <span className="font-semibold text-slate-700 dark:text-zinc-300">{formatRupiah(task.budget)}</span>
                              </div>
                              <div className="flex items-center justify-between text-slate-500">
                                <div className="flex items-center gap-1.5">
                                    <Activity size={12} className="text-slate-400" />
                                    <span>Realisasi:</span>
                                </div>
                                <span className={`font-semibold ${task.realisasi > task.budget ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                  {formatRupiah(task.realisasi)}
                                </span>
                              </div>
                            </div>

                            <div className="flex justify-between items-center mt-1">
                              <div className={`flex items-center gap-1.5 text-xs font-medium ${isOverdue ? 'text-rose-600 dark:text-rose-500' : 'text-slate-400'}`}>
                                <Clock size={14} /> 
                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'}) : 'No Date'}
                              </div>
                              
                              <div className="flex -space-x-2">
                                {assigneesList.slice(0, 3).map((name, idx) => {
                                    const u = users.find(user => user.name === name);
                                    return (
                                      <img key={idx} src={u?.avatar || 'https://i.pravatar.cc/150?img=1'} alt={name} title={name} className="w-6 h-6 rounded-full border border-white dark:border-zinc-950 object-cover bg-slate-100" />
                                    )
                                })}
                                {assigneesList.length > 3 && (
                                  <div className="w-6 h-6 rounded-full border border-white dark:border-zinc-950 bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-[8px] font-bold text-slate-600 dark:text-slate-300">
                                    +{assigneesList.length - 3}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })
                  )}
                </AnimatePresence>
              </div>
            </div>
          )
        })}
      </div>

      {/* TASK DETAIL MODAL */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="w-full h-full sm:h-auto sm:max-w-5xl bg-white dark:bg-zinc-950 sm:rounded-2xl shadow-2xl border-0 sm:border border-slate-200 dark:border-zinc-800 flex flex-col sm:max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex justify-between items-start p-4 sm:p-6 border-b border-slate-100 dark:border-zinc-800 shrink-0">
                <div className="flex-1 mr-4">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <div className="relative">
                      <select 
                        value={selectedTask.status}
                        onChange={(e) => {
                           const newStatus = e.target.value;
                           setSelectedTask({...selectedTask, status: newStatus});
                           setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, status: newStatus } : t));
                        }}
                        className={`appearance-none cursor-pointer outline-none px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider pr-5 ${selectedTask.status === 'done' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : selectedTask.status === 'doing' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' : selectedTask.status === 'review' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' : 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300'}`}
                      >
                        <option value="todo">TO DO</option>
                        <option value="doing">IN PROGRESS</option>
                        <option value="review">REVIEW</option>
                        <option value="done">DONE</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-1 flex items-center px-1 text-current opacity-50">
                           <ChevronRight size={10} className="rotate-90"/>
                      </div>
                    </div>

                    <Badge variant={selectedTask.priority === 'high' ? 'danger' : selectedTask.priority === 'medium' ? 'warning' : 'default'}>
                      {selectedTask.priority.toUpperCase()} PRIORITY
                    </Badge>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">{selectedTask.title}</h3>
                    <p className="text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                     <Layers size={14}/> {selectedTask.phase}
                  </p>
                </div>
                <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 p-2 bg-slate-50 dark:bg-zinc-900 rounded-full transition-colors shrink-0">
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-6 sm:gap-8 custom-scrollbar">
                  
                {/* Deskripsi */}
                <div>
                  <h4 className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlignLeft size={14}/> Deskripsi Task
                  </h4>
                  <textarea
                    value={selectedTask.description || ''}
                    onChange={(e) => {
                      const newDesc = e.target.value;
                      setSelectedTask({ ...selectedTask, description: newDesc });
                      setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, description: newDesc } : t));
                    }}
                    placeholder="Ketik detail tugas, brief konten, atau catatan tambahan di sini..."
                    className="w-full min-h-[100px] p-4 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-2xl text-sm text-slate-700 dark:text-zinc-300 outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-y custom-scrollbar"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                  {/* Left Column: Task Meta & Assignee */}
                  <div className="space-y-6 lg:col-span-1">
                    
                    {/* ASSIGNEES EDITABLE */}
                    <div>
                      <h4 className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 sm:mb-3">Assignees</h4>
                      <div className="flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800 rounded-xl">
                        {users.map(u => {
                            const taskAssignees = selectedTask.assignees || (selectedTask.pic ? [selectedTask.pic] : []);
                            const isAssigned = taskAssignees.includes(u.name);
                            return (
                               <button
                                  key={u.id}
                                  onClick={() => {
                                      let newAssignees = [...taskAssignees];
                                      if (isAssigned) newAssignees = newAssignees.filter(name => name !== u.name);
                                      else newAssignees.push(u.name);
                                      setSelectedTask({...selectedTask, assignees: newAssignees});
                                      setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, assignees: newAssignees } : t));
                                  }}
                                  className={`flex items-center gap-2 px-2 py-1.5 rounded-full text-xs font-medium border transition-all ${isAssigned ? 'bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-300 shadow-sm' : 'bg-white border-slate-200 text-slate-500 dark:bg-zinc-800 dark:border-zinc-700 hover:border-emerald-200'}`}
                               >
                                  <img src={u.avatar} className="w-5 h-5 rounded-full object-cover" alt="avatar"/>
                                  {u.name}
                               </button>
                            )
                        })}
                      </div>
                    </div>
                    
                    {/* TIMELINE EDITABLE */}
                    <div>
                      <h4 className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 sm:mb-3">Timeline</h4>
                      <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-zinc-300">
                         <div className="flex justify-between items-center p-2.5 sm:p-2 bg-slate-50 dark:bg-zinc-900/50 rounded-lg border border-amber-200 dark:border-amber-900/30 hover:border-amber-400 transition-colors">
                            <span className="text-amber-600 dark:text-amber-500 flex items-center gap-2"><AlertCircle size={14}/> Due Date</span>
                            <input 
                               type="date"
                               value={selectedTask.dueDate || ''}
                               onChange={(e) => {
                                   const newDate = e.target.value;
                                   setSelectedTask({...selectedTask, dueDate: newDate});
                                   setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, dueDate: newDate } : t));
                               }}
                               className="bg-transparent border-none outline-none text-right font-medium text-amber-600 dark:text-amber-500 cursor-pointer"
                            />
                         </div>
                      </div>
                    </div>

                    {/* Task Financials */}
                    <div>
                      <h4 className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 sm:mb-3">Task Financials</h4>
                      <div className="p-3 bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800 rounded-xl space-y-3">
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 flex items-center gap-1.5"><Wallet size={14}/> Budget</span>
                            <span className="font-bold text-slate-700 dark:text-zinc-300">{formatRupiah(selectedTask.budget)}</span>
                         </div>
                         <div className="flex justify-between items-center text-sm border-t border-slate-200 dark:border-zinc-800 pt-3">
                            <span className="text-slate-500 flex items-center gap-1.5"><Activity size={14}/> Realisasi (Auto)</span>
                            <span className={`font-bold ${selectedTask.realisasi > selectedTask.budget ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                              {formatRupiah(selectedTask.realisasi)}
                            </span>
                         </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 sm:mb-3">Target Personas</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTask.targetPersonas && selectedTask.targetPersonas.length > 0 ? (
                          selectedTask.targetPersonas.map((persona, i) => (
                            <span key={i} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 flex items-center gap-1.5 shadow-sm">
                              <Users size={12} /> {persona}
                            </span>
                          ))
                        ) : (
                           <span className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 flex items-center gap-1.5">
                            <Users size={12} /> General / All Personas
                          </span>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Right Column: PDCA Iterations */}
                  <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                        <RefreshCcw size={16} className="text-emerald-500" /> Iterasi PDCA Terkait
                      </h4>
                      <button 
                        onClick={() => {
                          setSelectedTask(null);
                          navigateToPdca('new', { taskId: selectedTask.id, phase: selectedTask.phase });
                        }}
                        className="text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                      >
                        Link PDCA Baru
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {pdcaIterations.filter(pdca => pdca.tasks.includes(selectedTask.id)).length > 0 ? (
                        pdcaIterations.filter(pdca => pdca.tasks.includes(selectedTask.id)).map(pdca => (
                          <div 
                            key={pdca.id} 
                            onClick={() => {
                              setSelectedTask(null);
                              navigateToPdca(pdca.id);
                            }}
                            className="p-3 sm:p-4 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl hover:border-emerald-500/50 transition-colors group cursor-pointer"
                          >
                            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 mb-2">
                              <h5 className="font-bold text-sm text-slate-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 sm:line-clamp-none">
                                {pdca.title}
                              </h5>
                              <div className="shrink-0 self-start">
                                <Badge variant={pdca.status === 'Done' ? 'success' : pdca.status === 'Action' ? 'success' : pdca.status === 'Plan' ? 'info' : 'warning'}>
                                  {pdca.status}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1.5 mb-3 mt-2">
                               <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mr-1 hidden sm:inline-block">Attached Personas:</span>
                              {pdca.personas.map((p, i) => (
                                <span key={i} className="text-[10px] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 px-2 py-0.5 rounded text-slate-600 dark:text-zinc-400">
                                  {p}
                                </span>
                              ))}
                             </div>

                            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-200 dark:border-zinc-800">
                              <span className="flex items-center gap-1"><KanbanSquare size={12}/> Linked to {pdca.tasks.length} tasks</span>
                              <span className="font-bold text-emerald-600 dark:text-emerald-500">{formatRupiah(pdca.cost)}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-xl text-center">
                           <RefreshCcw size={24} className="text-slate-300 mx-auto mb-2" />
                           <p className="text-sm font-medium text-slate-600 dark:text-zinc-300">Belum ada iterasi PDCA</p>
                           <p className="text-xs text-slate-400 mt-1">Task ini belum dilampirkan ke eksperimen PDCA manapun.</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD NEW TASK FROM KANBAN */}
      <AnimatePresence>
        {isTaskModalOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                   <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add New Task</h3>
                   <p className="text-xs text-slate-500 mt-1">Tambahkan task baru ke dalam board.</p>
                </div>
                <button type="button" onClick={() => setIsTaskModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 p-1">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <form onSubmit={handleSaveNewTask} className="space-y-4 sm:space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase">Task Title</label>
                  <input 
                    required type="text" 
                    value={taskFormData.title} 
                    onChange={e => setTaskFormData({...taskFormData, title: e.target.value})} 
                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                    placeholder="e.g. Create new ad creative"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase">Deskripsi / Brief</label>
                  <textarea 
                    value={taskFormData.description} 
                    onChange={e => setTaskFormData({...taskFormData, description: e.target.value})} 
                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-y min-h-[80px]" 
                    placeholder="Detail task..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase">Roadmap Phase</label>
                    <select 
                      value={taskFormData.phase} 
                      onChange={e => setTaskFormData({...taskFormData, phase: e.target.value})} 
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    >
                      {phases.map(p => (
                         <option key={p.id} value={p.title.split(' - ')[0]}>{p.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase">Status</label>
                    <select 
                      value={taskFormData.status} 
                      onChange={e => setTaskFormData({...taskFormData, status: e.target.value})} 
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    >
                      <option value="todo">To Do</option>
                      <option value="doing">In Progress</option>
                      <option value="review">Review</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>

                {/* AREA BARU: Penugasan dan Tanggal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase">Assignees (Pekerja)</label>
                    <div className="flex flex-wrap gap-2 p-2 sm:p-2.5 border border-slate-200 dark:border-zinc-700 rounded-xl bg-slate-50 dark:bg-zinc-950/50 min-h-[44px]">
                       {users.map(u => {
                           const isSelected = taskFormData.assignees.includes(u.name);
                           return (
                              <button 
                                key={u.id} type="button" onClick={() => handleToggleAssignee(u.name)}
                                className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border transition-all ${isSelected ? 'bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-300' : 'bg-white border-slate-200 text-slate-500 dark:bg-zinc-800 dark:border-zinc-700'}`}
                              >
                                 <img src={u.avatar} className="w-4 h-4 rounded-full object-cover" alt="avatar"/>
                                 {u.name}
                              </button>
                           )
                       })}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase">Due Date (Tenggat)</label>
                    <input 
                      type="date" 
                      value={taskFormData.dueDate} 
                      onChange={e => setTaskFormData({...taskFormData, dueDate: e.target.value})} 
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-700 dark:text-zinc-300"
                    />
                  </div>
                </div>
               
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase">Budget Task</label>
                    <input 
                      type="number" 
                      value={taskFormData.budget ?? 0} 
                      onChange={e => setTaskFormData({...taskFormData, budget: e.target.value})} 
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase">Realisasi</label>
                    <input 
                      type="number" 
                      value={taskFormData.realisasi ?? 0} 
                      disabled
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-100 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm outline-none transition-all cursor-not-allowed opacity-70 text-slate-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-2 uppercase">Target Personas</label>
                  <div className="flex flex-wrap gap-2 p-3 border border-slate-200 dark:border-zinc-700 rounded-xl bg-slate-50 dark:bg-zinc-950/50">
                     {['All Personas', ...personas.map(p => p.name)].map((personaName, i) => {
                       const isSelected = taskFormData.targetPersonas.includes(personaName);
                       return (
                         <button 
                           key={i} 
                           type="button" 
                           onClick={() => handleToggleTaskPersona(personaName)}
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
                  <button type="button" onClick={() => setIsTaskModalOpen(false)} className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/20 transition-colors">
                    Create Task
                  </button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};