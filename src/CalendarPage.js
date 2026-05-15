import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, 
  Tag, Target, RefreshCcw, CheckCircle2, AlertCircle, Clock3, Flame, Lock, Unlock
} from 'lucide-react';

export const CalendarPage = ({ tasks = [], pdcaIterations = [], navigateToTaskBoard, navigateToPdca, currentUser }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDateString = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const today = new Date();
  const todayStr = formatDateString(today.getFullYear(), today.getMonth(), today.getDate());

  // === FUNGSI SAKTI: Memperbaiki format tanggal yang rusak dari Database ===
  const normalizeDate = (rawDate) => {
    if (!rawDate) return todayStr; // Kalau kosong, lempar ke Hari Ini
    try {
      const d = new Date(rawDate);
      if (isNaN(d.getTime())) return todayStr;
      return formatDateString(d.getFullYear(), d.getMonth(), d.getDate());
    } catch(e) {
      return todayStr;
    }
  };

  // === MENGOLAH DATA (FILTER SUPER KETAT & ANTI-TYPO) ===
  const events = useMemo(() => {
    const calendarEvents = [];
    const isAdmin = currentUser?.role === 'admin';
    const currentUsername = currentUser?.username?.toLowerCase() || '';

    // 1. Memasukkan Data Tasks
    tasks.forEach(task => {
      // 🔒 FITUR PRIVASI: Cari nama user di semua laci kemungkinan
      if (!isAdmin) {
        let assignedNames = [];
        if (task.assignee) assignedNames.push(task.assignee.toLowerCase());
        if (Array.isArray(task.assignees)) assignedNames.push(...task.assignees.map(a => a?.toLowerCase()));
        if (Array.isArray(task.members)) assignedNames.push(...task.members.map(m => m?.toLowerCase()));

        // Jika nama dia tidak ada di daftar, Sembunyikan!
        if (!assignedNames.includes(currentUsername)) return; 
      }

      let color = 'bg-slate-500';
      let icon = Target;
      let category = `TASK: ${(task.status || 'TODO').toUpperCase()}`;
      const statusLokal = (task.status || '').toLowerCase();
      const isDone = statusLokal.includes('done');
      
      if (isDone) { color = 'bg-emerald-500'; icon = CheckCircle2; }
      else if (statusLokal.includes('progress') || statusLokal.includes('doing')) { color = 'bg-blue-500'; icon = Clock3; }
      else if (statusLokal.includes('review')) { color = 'bg-purple-500'; icon = AlertCircle; }
      else if (statusLokal.includes('todo') || statusLokal.includes('to do')) { color = 'bg-amber-500'; icon = Target; }

      // Normalisasi Tanggal (Biar nggak gaib)
      let eventDate = normalizeDate(task.dueDate);

      // 🔥 Sistem Task Nunggak (Overdue) 🔥
      if (!isDone && eventDate < todayStr) {
        eventDate = todayStr; 
        color = 'bg-rose-600'; 
        category = `🚨 NUNGGAK (${(task.status || 'TODO').toUpperCase()})`; 
        icon = Flame; 
      }

      calendarEvents.push({
        id: `task-${task.id}`,
        title: task.title,
        date: eventDate,
        category: category,
        color: color,
        icon: icon
      });
    });

    // 2. Memasukkan Data PDCA
    pdcaIterations.forEach(pdca => {
      // 🔒 FITUR PRIVASI PDCA
      if (!isAdmin) {
        const hasTaskInPdca = tasks.some(t => {
           let assignedNames = [];
           if (t.assignee) assignedNames.push(t.assignee.toLowerCase());
           if (Array.isArray(t.assignees)) assignedNames.push(...t.assignees.map(a => a?.toLowerCase()));
           return (pdca.tasks || []).includes(t.id) && assignedNames.includes(currentUsername);
        });
        const isLead = pdca.lead?.toLowerCase() === currentUsername || pdca.owner?.toLowerCase() === currentUsername;
        
        if (!hasTaskInPdca && !isLead) return; 
      }

      let pdcaDate = normalizeDate(pdca.date || pdca.dueDate);
      
      calendarEvents.push({
        id: `pdca-${pdca.id}`,
        title: `PDCA: ${pdca.objective}`,
        date: pdcaDate,
        category: 'PDCA ITERATION',
        color: 'bg-indigo-600',
        icon: RefreshCcw
      });
    });

    return calendarEvents;
  }, [tasks, pdcaIterations, currentUser, todayStr]);

  const handleEventClick = (eventId) => {
    if (!eventId) return;
    if (eventId.startsWith('task-') && navigateToTaskBoard) {
      navigateToTaskBoard(eventId.replace('task-', ''));
    } else if (eventId.startsWith('pdca-') && navigateToPdca) {
      navigateToPdca(eventId.replace('pdca-', ''));
    }
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const getEventsForDate = (day) => {
    const dateStr = formatDateString(currentDate.getFullYear(), currentDate.getMonth(), day);
    return events.filter(e => e.date === dateStr);
  };

  const selectedDateStr = formatDateString(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
  const selectedEvents = events.filter(e => e.date === selectedDateStr);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="text-indigo-500" /> Master Calendar
          </h2>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 text-xs font-bold text-slate-600 dark:text-slate-300">
            {currentUser?.role === 'admin' ? (
              <><Unlock size={12} className="text-emerald-500"/> Mode Admin: Melihat semua jadwal tim.</>
            ) : (
              <><Lock size={12} className="text-amber-500"/> Mode Personal: Hanya melihat jadwal tugas Anda.</>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-zinc-800 pb-4">
            <h3 className="text-xl font-black text-slate-800 dark:text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 transition-colors"><ChevronLeft size={20} /></button>
              <button onClick={() => {setCurrentDate(new Date()); setSelectedDate(new Date());}} className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-slate-300 text-sm font-bold transition-colors">Hari Ini</button>
              <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 transition-colors"><ChevronRight size={20} /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {[...Array(firstDayOfMonth)].map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[80px] md:min-h-[100px] bg-slate-50/50 dark:bg-zinc-950/50 rounded-xl border border-transparent"></div>
            ))}

            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const dateStr = formatDateString(currentDate.getFullYear(), currentDate.getMonth(), day);
              const dayEvents = getEventsForDate(day);
              const isToday = dateStr === formatDateString(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
              const isSelected = dateStr === selectedDateStr;

              return (
                <motion.div 
                  key={day} whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                  className={`min-h-[80px] md:min-h-[100px] p-2 rounded-xl border cursor-pointer transition-colors relative flex flex-col gap-1
                    ${isSelected ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' : 'border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-slate-300 dark:hover:border-zinc-700'}
                    ${isToday && dayEvents.some(e => e.color === 'bg-rose-600') ? 'border-rose-300 dark:border-rose-900/50' : ''}
                  `}
                >
                  <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400'}`}>
                    {day}
                  </span>
                  
                  <div className="flex flex-col gap-1 mt-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map(e => (
                      <div key={e.id} className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white truncate ${e.color}`}>
                        {e.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[10px] text-slate-400 font-bold px-1">+ {dayEvents.length - 2} lagi</div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-100 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6">
            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-1">Agenda Harian</h3>
            <p className="text-slate-500 text-sm mb-6 flex items-center gap-2">
              <CalendarIcon size={14}/> {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </p>

            {selectedEvents.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900">
                <p className="text-slate-400 text-sm font-medium">Kosong.</p>
                <p className="text-xs text-slate-400 mt-1">Tidak ada jadwal di tanggal ini.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                {selectedEvents.map(event => {
                  const Icon = event.icon;
                  return (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      key={event.id} 
                      onClick={() => handleEventClick(event.id)}
                      className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex gap-4 cursor-pointer hover:border-indigo-400 hover:ring-2 hover:ring-indigo-100 dark:hover:ring-indigo-900 transition-all group"
                      title="Klik untuk melihat detail"
                    >
                      <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110 ${event.color}`}>
                        <Icon size={18} />
                      </div>
                      <div className="overflow-hidden flex-1">
                        <h4 className="font-bold text-sm text-slate-800 dark:text-white leading-tight truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{event.title}</h4>
                        <div className="flex gap-3 mt-2">
                          <span className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${event.color.replace('bg-', 'text-')}`}>
                            <Tag size={10}/> {event.category}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Indikator Status</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div><span className="text-xs font-bold text-slate-600 dark:text-slate-300">To Do</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-xs font-bold text-slate-600 dark:text-slate-300">Doing</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-600"></div><span className="text-xs font-bold text-slate-600 dark:text-slate-300">Overdue (Nunggak)</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-xs font-bold text-slate-600 dark:text-slate-300">Done</span></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};