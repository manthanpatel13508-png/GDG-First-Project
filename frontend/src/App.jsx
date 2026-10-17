import React, { useState, useEffect, useMemo } from 'react';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('timetable');
  const [collegeData, setCollegeData] = useState({ faculty: [], classrooms: [], batches: [], courses: [] });
  const [timetableResult, setTimetableResult] = useState(null);
  const [constants, setConstants] = useState({ days: [], time_slots: [] });
  const [filterType, setFilterType] = useState('batch');
  const [selectedEntityId, setSelectedEntityId] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [diagnostics, setDiagnostics] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadInitialData = async () => {
    try {
      const [consts, data, latest] = await Promise.all([
        api.getConstants(),
        api.getCollegeData(),
        api.getLatestTimetable(),
      ]);
      setConstants(consts);
      setCollegeData(data);
      if (data.batches.length > 0) setSelectedEntityId(data.batches[0].id);
      if (latest) {
        setTimetableResult(latest);
        if (latest.diagnostics) setDiagnostics(latest.diagnostics);
      }
    } catch (e) {
      console.error('Initial data load error:', e);
    }
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const res = await api.optimize({
        timeout_seconds: 15,
        minimize_gaps: true,
        balance_daily_load: true,
        prefer_morning_core: true,
      });
      setTimetableResult(res);
      setDiagnostics(res.diagnostics || []);
      if (res.status === 'OPTIMAL' || res.status === 'FEASIBLE') {
        showToast(`Schedule generated in ${res.execution_time_ms} ms! (${res.total_classes_scheduled} classes)`);
        setActiveTab('timetable');
      } else {
        showToast(`Status: ${res.status}. Check diagnostics!`, 'error');
      }
    } catch (e) {
      showToast('Optimization failed', 'error');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset database to sample college dataset?')) return;
    try {
      const res = await api.resetSampleData();
      setCollegeData(res.data);
      showToast('Reset to demo dataset completed');
      handleOptimize();
    } catch (e) {
      showToast('Failed to reset dataset', 'error');
    }
  };

  const filteredClasses = useMemo(() => {
    if (!timetableResult || !timetableResult.classes) return [];
    if (filterType === 'all') return timetableResult.classes;
    if (filterType === 'batch') return timetableResult.classes.filter((c) => c.batch_id === selectedEntityId);
    if (filterType === 'faculty') return timetableResult.classes.filter((c) => c.faculty_id === selectedEntityId);
    if (filterType === 'room') return timetableResult.classes.filter((c) => c.room_id === selectedEntityId);
    return timetableResult.classes;
  }, [timetableResult, filterType, selectedEntityId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-xs font-semibold border ${
            notification.type === 'error'
              ? 'bg-rose-950 text-rose-200 border-rose-800'
              : 'bg-emerald-950 text-emerald-200 border-emerald-800'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-indigo-600/30">
              TC
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold text-lg text-slate-100">TimeCraft AI</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  DevSprint
                </span>
              </div>
              <p className="text-xs text-slate-400">Intelligent College Timetable Optimization Engine</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleReset}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Demo Preset
            </button>
            <button
              onClick={handleOptimize}
              disabled={isOptimizing}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
            >
              {isOptimizing ? 'Optimizing...' : '⚡ Generate Timetable'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto mt-4 flex items-center space-x-2 border-t border-slate-800 pt-3">
          {['timetable', 'analytics', 'faculty', 'classrooms', 'batches', 'courses'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Main Grid View */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        {activeTab === 'timetable' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-400">View By:</span>
                {['batch', 'faculty', 'room', 'all'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setFilterType(mode);
                      if (mode === 'batch' && collegeData.batches.length) setSelectedEntityId(collegeData.batches[0].id);
                      if (mode === 'faculty' && collegeData.faculty.length) setSelectedEntityId(collegeData.faculty[0].id);
                      if (mode === 'room' && collegeData.classrooms.length) setSelectedEntityId(collegeData.classrooms[0].id);
                    }}
                    className={`px-3 py-1 text-xs rounded-lg font-semibold uppercase ${
                      filterType === mode ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {filterType !== 'all' && (
                <select
                  value={selectedEntityId}
                  onChange={(e) => setSelectedEntityId(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5"
                >
                  {filterType === 'batch' &&
                    collegeData.batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  {filterType === 'faculty' &&
                    collegeData.faculty.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  {filterType === 'room' &&
                    collegeData.classrooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.room_number}
                      </option>
                    ))}
                </select>
              )}

              <a
                href="/api/timetable/export/csv"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-emerald-400 border border-slate-700"
              >
                Export CSV
              </a>
            </div>

            {/* Timetable Weekly Grid */}
            {timetableResult && constants.days ? (
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950 border-b border-slate-800 text-slate-400">
                    <tr>
                      <th className="p-3 w-28 uppercase">Day</th>
                      {constants.time_slots.map((s, idx) => (
                        <React.Fragment key={s.index}>
                          {idx === 4 && <th className="p-3 text-center text-amber-500 uppercase text-[10px]">Lunch</th>}
                          <th className="p-3 border-l border-slate-800">
                            <div>{s.period}</div>
                            <div className="text-[10px] text-slate-500">{s.label}</div>
                          </th>
                        </React.Fragment>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {constants.days.map((d) => (
                      <tr key={d.index} className="hover:bg-slate-800/30">
                        <td className="p-3 font-bold text-slate-200 bg-slate-950/40 border-r border-slate-800">
                          {d.name}
                        </td>
                        {constants.time_slots.map((s, idx) => {
                          const matches = filteredClasses.filter((c) => c.day === d.index && c.slot === s.index);
                          return (
                            <React.Fragment key={s.index}>
                              {idx === 4 && (
                                <td className="p-2 text-center text-amber-500/40 bg-amber-950/10 text-[10px] font-bold">
                                  BREAK
                                </td>
                              )}
                              <td className="p-2 border-l border-slate-800/80 align-top min-h-[80px]">
                                {matches.map((c) => (
                                  <div
                                    key={c.id}
                                    className="p-2 rounded-lg border text-[11px] space-y-1 mb-1"
                                    style={{
                                      backgroundColor: `${c.color}20`,
                                      borderColor: `${c.color}60`,
                                    }}
                                  >
                                    <div className="font-extrabold text-slate-100 flex justify-between">
                                      <span>{c.course_code}</span>
                                      <span className="text-[9px] uppercase font-bold text-indigo-400">{c.session_type}</span>
                                    </div>
                                    <div className="text-slate-300 truncate">{c.course_name}</div>
                                    <div className="text-[10px] text-slate-400">{c.room_number} • {c.faculty_name}</div>
                                  </div>
                                ))}
                              </td>
                            </React.Fragment>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center bg-slate-900 rounded-xl border border-slate-800">
                <p className="text-sm text-slate-400">Click Generate Timetable to create a conflict-free schedule.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
