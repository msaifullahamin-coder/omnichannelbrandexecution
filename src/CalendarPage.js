import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, 
  Clock, MapPin, Tag, Plus, Target, Megaphone, PenTool 
} from 'lucide-react';

export const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // === DATA SIMULASI (GABUNGAN SEMUA TIMELINE) ===
  const [events, setEvents] = useState([
    { id: 1, title: 'Kick-off Campaign Ramadhan', date: '2026-05-20', category: 'Campaign', color: 'bg-emerald-500', icon: Megaphone },
    { id: 2, title: 'Review PDCA Fase 1', date: '2026-05-18', category: 'PDCA', color: 'bg-blue-500', icon: Target },
    { id: 3, title: 'Shooting Konten Tajwid', date: '2026-05-22', category: 'Content', color: 'bg-purple-500', icon: PenTool },
    { id: 4, title: 'Evaluasi Ads Meta', date: '2026-05-25', category: 'Campaign', color: 'bg-emerald-500', icon: Megaphone },
    { id: 5, title: 'Meeting Tim Produksi', date: '2026-05-20', category: 'PDCA', color: 'bg-blue-500', icon: Target },
  ]);

  // === LOGIKA KALENDER VANILLA JS ===
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  // Fungsi untuk format YYYY-MM-DD
  const formatDateString = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // Ambil event untuk tanggal tertentu
  const getEventsForDate = (day) => {
    const dateStr = formatDateString(currentDate.getFullYear(), currentDate.getMonth(), day);
    return events.filter(e => e.date === dateStr);
  };

  // Ambil event untuk tanggal yang sedang di-klik (Sidebar)
  const selectedDateStr = formatDateString(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
  const selectedEvents = events.filter(e => e.date === selectedDateStr);

  return (
    <div className="space-y-6 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="text-indigo-500" /> Master Calendar
          </h2>
          <p className="text-slate-500 mt-1 text-sm">Omnichannel View: Pantau semua jadwal PDCA, Campaign, dan Konten.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none">
          <Plus size={16} /> Tambah Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* KIRI: GRID KALENDER */}
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
          
          {/* Calendar Controls */}
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-zinc-800 pb-4">
            <h3 className="text-xl font-black text-slate-800 dark:text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 transition-colors"><ChevronLeft size={20} /></button>
              <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-slate-300 text-sm font-bold transition-colors">Hari Ini</button>
              <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 transition-colors"><ChevronRight size={20} /></button>
            </div>
          </div>

          {/* Nama Hari */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Kotak Tanggal */}
          <div className="grid grid-cols-7 gap-2">
            {/* Ruang kosong sebelum tanggal 1 */}
            {[...Array(firstDayOfMonth)].map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[80px] md:min-h-[100px] bg-slate-50/50 dark:bg-zinc-950/50 rounded-xl border border-transparent"></div>
            ))}

            {/* Tanggal aktual */}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const dateStr = formatDateString(currentDate.getFullYear(), currentDate.getMonth(), day);
              const dayEvents = getEventsForDate(day);
              const isToday = dateStr === formatDateString(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
              const isSelected = dateStr === selectedDateStr;

              return (
                <motion.div 
                  key={day}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                  className={`min-h-[80px] md:min-h-[100px] p-2 rounded-xl border cursor-pointer transition-colors relative flex flex-col gap-1
                    ${isSelected ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' : 'border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-slate-300 dark:hover:border-zinc-700'}
                  `}
                >
                  <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400'}`}>
                    {day}
                  </span>
                  
                  {/* Tampilkan indikator event */}
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

        {/* KANAN: DETAIL AGENDA HARIAN */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-100 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6">
            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-1">Agenda Harian</h3>
            <p className="text-slate-500 text-sm mb-6 flex items-center gap-2">
              <CalendarIcon size={14}/> {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </p>

            {selectedEvents.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900">
                <p className="text-slate-400 text-sm font-medium">Tidak ada jadwal hari ini.</p>
                <p className="text-xs text-slate-400 mt-1">Gunakan waktu untuk deep work.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedEvents.map(event => {
                  const Icon = event.icon;
                  return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key={event.id} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex gap-4">
                      <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-white shadow-md ${event.color}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-white leading-tight">{event.title}</h4>
                        <div className="flex gap-3 mt-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1"><Tag size={10}/> {event.category}</span>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1"><Clock size={10}/> 09:00</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Legenda Kalender */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Warna Timeline</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-sm text-slate-600 dark:text-slate-300">PDCA / Management</span></div>
              <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-sm text-slate-600 dark:text-slate-300">Campaign & Marketing</span></div>
              <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-purple-500"></div><span className="text-sm text-slate-600 dark:text-slate-300">Content Production</span></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};