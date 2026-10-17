const { useState, useEffect, useMemo } = React;

// --- SVG Icons Component Helper ---
function Icon({ name, className = "w-5 h-5" }) {
  const icons = {
    calendar: <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
    clock: <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
    user: <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>,
    users: <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>,
    building: <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>,
    book: <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>,
    sparkles: <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>,
    chart: <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
    alert: <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>,
    check: <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
    refresh: <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>,
    download: <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>,
    plus: <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>,
    trash: <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>,
    settings: <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
    info: <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
    filter: <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>,
    printer: <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
  };
  return icons[name] || null;
}

// --- Main App Component ---
function App() {
  const [activeTab, setActiveTab] = useState("timetable"); // timetable, analytics, faculty, classrooms, batches, courses
  const [collegeData, setCollegeData] = useState({ faculty: [], classrooms: [], batches: [], courses: [] });
  const [timetableResult, setTimetableResult] = useState(null);
  const [constants, setConstants] = useState({ days: [], time_slots: [] });
  
  // Visualizer filter states
  const [filterType, setFilterType] = useState("batch"); // batch, faculty, room, all
  const [selectedEntityId, setSelectedEntityId] = useState("");
  
  // Optimization & Diagnostic states
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [diagnostics, setDiagnostics] = useState([]);
  const [showDiagnosticsModal, setShowDiagnosticsModal] = useState(false);
  const [notification, setNotification] = useState(null);

  // Modals for CRUD
  const [modalState, setModalState] = useState({ open: false, type: null, item: null });

  // Load Initial Data
  useEffect(() => {
    fetchConstants();
    fetchCollegeData();
    fetchLatestTimetable();
  }, []);

  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchConstants = async () => {
    try {
      const res = await fetch("/api/timetable/constants");
      const data = await res.json();
      setConstants(data);
    } catch (e) {
      console.error("Failed to load constants", e);
    }
  };

  const fetchCollegeData = async () => {
    try {
      const res = await fetch("/api/data");
      const data = await res.json();
      setCollegeData(data);
      if (data.batches.length > 0 && !selectedEntityId) {
        setSelectedEntityId(data.batches[0].id);
      }
    } catch (e) {
      console.error("Failed to load college data", e);
    }
  };

  const fetchLatestTimetable = async () => {
    try {
      const res = await fetch("/api/timetable/latest");
      const data = await res.json();
      if (data) {
        setTimetableResult(data);
        if (data.diagnostics) setDiagnostics(data.diagnostics);
      }
    } catch (e) {
      console.error("Failed to load latest timetable", e);
    }
  };

  const runOptimizer = async () => {
    setIsOptimizing(true);
    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timeout_seconds: 15,
          minimize_gaps: true,
          balance_daily_load: true,
          prefer_morning_core: true
        })
      });
      const data = await res.json();
      setTimetableResult(data);
      setDiagnostics(data.diagnostics || []);

      if (data.status === "OPTIMAL" || data.status === "FEASIBLE") {
        showToast(`Success! Schedule generated in ${data.execution_time_ms} ms (${data.total_classes_scheduled} classes, Status: ${data.status})`);
        setActiveTab("timetable");
      } else {
        showToast(`Solver returned ${data.status}. Check diagnostics for conflicts!`, "error");
        setShowDiagnosticsModal(true);
      }
    } catch (e) {
      showToast("Error running timetable optimizer", "error");
      console.error(e);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleResetSampleData = async () => {
    if (!confirm("Reset database to the standard Computer Science department sample data?")) return;
    try {
      const res = await fetch("/api/reset-sample", { method: "POST" });
      const data = await res.json();
      setCollegeData(data.data);
      showToast("Database restored to default college dataset!");
      // Automatically run optimizer on the fresh sample data
      runOptimizer();
    } catch (e) {
      showToast("Failed to reset sample data", "error");
    }
  };

  const runDiagnosticsCheck = async () => {
    try {
      const res = await fetch("/api/diagnostics");
      const issues = await res.json();
      setDiagnostics(issues);
      setShowDiagnosticsModal(true);
      if (issues.length === 0) {
        showToast("Great! All inputs and constraints are 100% valid with 0 conflicts.");
      }
    } catch (e) {
      showToast("Failed to fetch diagnostics", "error");
    }
  };

  // Filtered timetable entries
  const filteredClasses = useMemo(() => {
    if (!timetableResult || !timetableResult.classes) return [];
    if (filterType === "all") return timetableResult.classes;
    if (filterType === "batch") {
      return timetableResult.classes.filter(c => c.batch_id === selectedEntityId);
    }
    if (filterType === "faculty") {
      return timetableResult.classes.filter(c => c.faculty_id === selectedEntityId);
    }
    if (filterType === "room") {
      return timetableResult.classes.filter(c => c.room_id === selectedEntityId);
    }
    return timetableResult.classes;
  }, [timetableResult, filterType, selectedEntityId]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-sm font-semibold transition-all border ${
          notification.type === "error" 
            ? "bg-rose-950 text-rose-200 border-rose-800" 
            : "bg-emerald-950 text-emerald-200 border-emerald-800"
        }`}>
          <Icon name={notification.type === "error" ? "alert" : "check"} className="w-5 h-5 flex-shrink-0" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo & Hackathon Tag */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Icon name="calendar" className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                  TimeCraft AI
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  DevSprint Hackathon
                </span>
              </div>
              <p className="text-xs text-slate-400">Intelligent College Timetable Optimization Engine</p>
            </div>
          </div>

          {/* Engine Status Badge & Actions */}
          <div className="flex items-center flex-wrap gap-2.5">
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300 font-medium">Google OR-Tools CP-SAT</span>
            </div>

            <button
              onClick={runDiagnosticsCheck}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center space-x-1.5"
              title="Inspect conflicts and feasibility diagnostics"
            >
              <Icon name="alert" className="w-4 h-4 text-amber-400" />
              <span>Diagnostics</span>
              {diagnostics.filter(d => d.severity === "error").length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px]">
                  {diagnostics.filter(d => d.severity === "error").length}
                </span>
              )}
            </button>

            <button
              onClick={handleResetSampleData}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center space-x-1.5"
              title="Reset to CSE Department sample preset"
            >
              <Icon name="refresh" className="w-4 h-4 text-cyan-400" />
              <span>Demo Preset</span>
            </button>

            <button
              onClick={runOptimizer}
              disabled={isOptimizing}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {isOptimizing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Optimizing...</span>
                </>
              ) : (
                <>
                  <Icon name="sparkles" className="w-4 h-4" />
                  <span>Generate Timetable</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto mt-4 flex items-center space-x-1 overflow-x-auto no-scrollbar border-t border-slate-800/80 pt-2">
          {[
            { id: "timetable", label: "Timetable Grid", icon: "calendar" },
            { id: "analytics", label: "Optimization Analytics", icon: "chart" },
            { id: "faculty", label: "Faculty Directory", icon: "user", count: collegeData.faculty.length },
            { id: "classrooms", label: "Classrooms & Labs", icon: "building", count: collegeData.classrooms.length },
            { id: "batches", label: "Student Batches", icon: "users", count: collegeData.batches.length },
            { id: "courses", label: "Courses & Curricula", icon: "book", count: collegeData.courses.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Icon name={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  activeTab === tab.id ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-400"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {activeTab === "timetable" && (
          <TimetableView
            timetableResult={timetableResult}
            filteredClasses={filteredClasses}
            constants={constants}
            collegeData={collegeData}
            filterType={filterType}
            setFilterType={setFilterType}
            selectedEntityId={selectedEntityId}
            setSelectedEntityId={setSelectedEntityId}
            onGenerate={runOptimizer}
            isOptimizing={isOptimizing}
          />
        )}

        {activeTab === "analytics" && (
          <AnalyticsView
            result={timetableResult}
            collegeData={collegeData}
            constants={constants}
          />
        )}

        {activeTab === "faculty" && (
          <FacultyManager
            faculty={collegeData.faculty}
            constants={constants}
            refreshData={fetchCollegeData}
            showToast={showToast}
          />
        )}

        {activeTab === "classrooms" && (
          <ClassroomManager
            classrooms={collegeData.classrooms}
            refreshData={fetchCollegeData}
            showToast={showToast}
          />
        )}

        {activeTab === "batches" && (
          <BatchManager
            batches={collegeData.batches}
            courses={collegeData.courses}
            refreshData={fetchCollegeData}
            showToast={showToast}
          />
        )}

        {activeTab === "courses" && (
          <CourseManager
            courses={collegeData.courses}
            faculty={collegeData.faculty}
            batches={collegeData.batches}
            refreshData={fetchCollegeData}
            showToast={showToast}
          />
        )}
      </main>

      {/* Diagnostics / Error Modal */}
      {showDiagnosticsModal && (
        <DiagnosticsModal
          diagnostics={diagnostics}
          onClose={() => setShowDiagnosticsModal(false)}
          onGenerate={runOptimizer}
        />
      )}
    </div>
  );
}

// =========================================================================
// 1. TIMETABLE VISUALIZER VIEW
// =========================================================================
function TimetableView({
  timetableResult,
  filteredClasses,
  constants,
  collegeData,
  filterType,
  setFilterType,
  selectedEntityId,
  setSelectedEntityId,
  onGenerate,
  isOptimizing
}) {
  const [selectedClassDetail, setSelectedClassDetail] = useState(null);

  // Group scheduled classes by (day, slot) for quick O(1) lookup
  const gridMap = useMemo(() => {
    const map = {};
    for (const item of filteredClasses) {
      const key = `${item.day}_${item.slot}`;
      if (!map[key]) map[key] = [];
      map[key].push(item);
    }
    return map;
  }, [filteredClasses]);

  // Current filter entity name
  const currentEntityName = useMemo(() => {
    if (filterType === "all") return "All Batches (Master Schedule)";
    if (filterType === "batch") {
      const b = collegeData.batches.find(x => x.id === selectedEntityId);
      return b ? b.name : "Select Batch";
    }
    if (filterType === "faculty") {
      const f = collegeData.faculty.find(x => x.id === selectedEntityId);
      return f ? `${f.name} (${f.department})` : "Select Faculty";
    }
    if (filterType === "room") {
      const r = collegeData.classrooms.find(x => x.id === selectedEntityId);
      return r ? `${r.room_number} (${r.type.replace('_', ' ').toUpperCase()})` : "Select Room";
    }
    return "";
  }, [filterType, selectedEntityId, collegeData]);

  // Handle Export CSV
  const handleExportCSV = () => {
    window.open("/api/timetable/export/csv", "_blank");
  };

  // Handle Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      
      {/* Control / Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Filter Type Pills */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center space-x-1 mr-1">
            <Icon name="filter" className="w-3.5 h-3.5" />
            <span>View:</span>
          </span>
          {[
            { id: "batch", label: "Student Batch" },
            { id: "faculty", label: "Faculty" },
            { id: "room", label: "Classroom" },
            { id: "all", label: "Master Grid" }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => {
                setFilterType(f.id);
                if (f.id === "batch" && collegeData.batches.length) setSelectedEntityId(collegeData.batches[0].id);
                if (f.id === "faculty" && collegeData.faculty.length) setSelectedEntityId(collegeData.faculty[0].id);
                if (f.id === "room" && collegeData.classrooms.length) setSelectedEntityId(collegeData.classrooms[0].id);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterType === f.id
                  ? "bg-slate-800 text-indigo-400 border border-indigo-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Entity Selector Dropdown */}
        {filterType !== "all" && (
          <div className="flex-1 max-w-xs">
            <select
              value={selectedEntityId}
              onChange={(e) => setSelectedEntityId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              {filterType === "batch" && collegeData.batches.map(b => (
                <option key={b.id} value={b.id}>{b.name} (Sem {b.semester})</option>
              ))}
              {filterType === "faculty" && collegeData.faculty.map(f => (
                <option key={f.id} value={f.id}>{f.name} — {f.department}</option>
              ))}
              {filterType === "room" && collegeData.classrooms.map(r => (
                <option key={r.id} value={r.id}>{r.room_number} (Cap: {r.capacity})</option>
              ))}
            </select>
          </div>
        )}

        {/* Right Action: CSV & Print */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            <Icon name="download" className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            <Icon name="printer" className="w-4 h-4 text-indigo-400" />
            <span>Print View</span>
          </button>
        </div>

      </div>

      {/* Schedule Summary Banner */}
      {timetableResult ? (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/50 border border-slate-800/80 px-4 py-3 rounded-xl text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            <span className="font-bold text-slate-200">{currentEntityName}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">
              {filteredClasses.length} class {filteredClasses.length === 1 ? 'period' : 'periods'} scheduled
            </span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <div>
              Status: <span className="font-bold text-emerald-400">{timetableResult.status}</span>
            </div>
            <div>
              Solve Time: <span className="font-bold text-slate-200">{timetableResult.execution_time_ms} ms</span>
            </div>
            {timetableResult.stats && (
              <>
                <div>
                  Gap Hours: <span className="font-bold text-slate-200">{timetableResult.stats.student_gap_hours} hrs</span>
                </div>
                <div>
                  Room Util: <span className="font-bold text-slate-200">{timetableResult.stats.room_utilization_percent}%</span>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl">
          <Icon name="sparkles" className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200 mb-1">No Timetable Generated Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
            Click the "Generate Timetable" button above to run the Google OR-Tools constraint satisfaction engine.
          </p>
          <button
            onClick={onGenerate}
            disabled={isOptimizing}
            className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg hover:bg-indigo-500 transition-all"
          >
            Generate Now
          </button>
        </div>
      )}

      {/* Interactive Weekly Timetable Grid */}
      {timetableResult && constants.days && constants.days.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
          <table className="w-full border-collapse text-left text-xs min-w-[850px]">
            {/* Header: Time Slots */}
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80">
                <th className="p-3.5 font-bold text-slate-400 w-28 uppercase tracking-wider text-[11px]">
                  Day / Period
                </th>
                {constants.time_slots.map((slot, idx) => (
                  <React.Fragment key={slot.index}>
                    {/* Insert Lunch Break Banner Column between period 4 (idx 3) and period 5 (idx 4) */}
                    {idx === 4 && (
                      <th className="p-3.5 font-bold text-center text-amber-500/80 bg-amber-950/10 border-x border-amber-900/30 w-16 uppercase tracking-wider text-[10px]">
                        Lunch
                      </th>
                    )}
                    <th className="p-3.5 font-bold text-slate-300 border-l border-slate-800/60 min-w-[130px]">
                      <div className="text-slate-200 font-semibold">{slot.period}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{slot.label}</div>
                    </th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>

            {/* Body: Days */}
            <tbody className="divide-y divide-slate-800/80">
              {constants.days.map(day => (
                <tr key={day.index} className="hover:bg-slate-800/20 transition-colors">
                  
                  {/* Day Label Cell */}
                  <td className="p-3.5 font-bold text-slate-200 bg-slate-950/40 border-r border-slate-800/80">
                    <div className="text-sm">{day.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Day {day.index + 1}</div>
                  </td>

                  {/* Time Slot Cells */}
                  {constants.time_slots.map((slot, idx) => {
                    const key = `${day.index}_${slot.index}`;
                    const classesInSlot = gridMap[key] || [];

                    return (
                      <React.Fragment key={slot.index}>
                        {/* Lunch Break Cell */}
                        {idx === 4 && (
                          <td className="p-2 text-center bg-amber-950/10 border-x border-amber-900/30 text-amber-400/50 text-[10px] font-bold select-none">
                            <div className="rotate-180 [writing-mode:vertical-rl] mx-auto tracking-widest uppercase">
                              Break
                            </div>
                          </td>
                        )}

                        {/* Class Slot Cell */}
                        <td className="p-2 border-l border-slate-800/60 align-top min-h-[90px]">
                          {classesInSlot.length > 0 ? (
                            <div className="space-y-1.5">
                              {classesInSlot.map(cls => (
                                <div
                                  key={cls.id}
                                  onClick={() => setSelectedClassDetail(cls)}
                                  className="p-2.5 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg relative overflow-hidden group"
                                  style={{
                                    backgroundColor: `${cls.color}15`,
                                    borderColor: `${cls.color}50`
                                  }}
                                >
                                  {/* Left color bar indicator */}
                                  <div
                                    className="absolute left-0 top-0 bottom-0 w-1"
                                    style={{ backgroundColor: cls.color }}
                                  />

                                  <div className="flex items-center justify-between gap-1 mb-1 pl-1">
                                    <span className="font-extrabold text-slate-100 text-xs">
                                      {cls.course_code}
                                    </span>
                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                      cls.is_lab 
                                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" 
                                        : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                    }`}>
                                      {cls.session_type}
                                    </span>
                                  </div>

                                  <div className="text-[11px] font-medium text-slate-200 line-clamp-1 pl-1" title={cls.course_name}>
                                    {cls.course_name}
                                  </div>

                                  <div className="mt-2 pt-1.5 border-t border-slate-700/40 flex flex-col gap-0.5 text-[10px] text-slate-400 pl-1">
                                    {filterType !== "faculty" && (
                                      <div className="flex items-center space-x-1 truncate" title={cls.faculty_name}>
                                        <Icon name="user" className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                        <span className="truncate">{cls.faculty_name}</span>
                                      </div>
                                    )}
                                    {filterType !== "room" && (
                                      <div className="flex items-center space-x-1 text-slate-300 font-semibold truncate">
                                        <Icon name="building" className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                        <span>{cls.room_number.split(' ')[0]}</span>
                                      </div>
                                    )}
                                    {filterType !== "batch" && (
                                      <div className="flex items-center space-x-1 text-slate-400 truncate">
                                        <Icon name="users" className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                        <span className="truncate">{cls.batch_name}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="h-full min-h-[70px] rounded-lg border border-dashed border-slate-800/40 flex items-center justify-center text-[10px] text-slate-700 hover:border-slate-700/60 transition-colors">
                              Free
                            </div>
                          )}
                        </td>
                      </React.Fragment>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Class Detail Modal */}
      {selectedClassDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Class Details</span>
                <h3 className="text-lg font-bold text-slate-100">{selectedClassDetail.course_code}: {selectedClassDetail.course_name}</h3>
              </div>
              <button
                onClick={() => setSelectedClassDetail(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Day & Time:</span>
                <span className="font-semibold text-slate-200">{selectedClassDetail.day_name}, {selectedClassDetail.time_label}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Session Type:</span>
                <span className="font-semibold uppercase text-indigo-300">{selectedClassDetail.session_type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Faculty Instructor:</span>
                <span className="font-semibold text-slate-200">{selectedClassDetail.faculty_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Classroom / Lab:</span>
                <span className="font-semibold text-slate-200">{selectedClassDetail.room_number}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Student Batch:</span>
                <span className="font-semibold text-slate-200">{selectedClassDetail.batch_name}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedClassDetail(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// =========================================================================
// 2. OPTIMIZATION ANALYTICS VIEW
// =========================================================================
function AnalyticsView({ result, collegeData, constants }) {
  if (!result || !result.stats) {
    return (
      <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
        <Icon name="chart" className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-200">No Analytics Available</h3>
        <p className="text-xs text-slate-400 mt-1">Generate a timetable first to review solver metrics and capacity analytics.</p>
      </div>
    );
  }

  const { stats } = result;

  return (
    <div className="space-y-6">
      
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Solver Status</span>
            <Icon name="sparkles" className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">{result.status}</div>
          <div className="text-[11px] text-slate-500 mt-1">CP-SAT in {result.execution_time_ms} ms</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Room Utilization</span>
            <Icon name="building" className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100">{stats.room_utilization_percent}%</div>
          <div className="text-[11px] text-slate-500 mt-1">{stats.total_slots_scheduled} total room slots booked</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Student Idle Gaps</span>
            <Icon name="clock" className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-300">{stats.student_gap_hours} hrs</div>
          <div className="text-[11px] text-slate-500 mt-1">Minimizing windows across 5 days</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Faculty Capacity Load</span>
            <Icon name="user" className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-purple-300">{stats.faculty_utilization_percent}%</div>
          <div className="text-[11px] text-slate-500 mt-1">Across {collegeData.faculty.length} active professors</div>
        </div>

      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Daily Load Distribution */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
            <Icon name="calendar" className="w-4 h-4 text-indigo-400" />
            <span>Daily Lecture Workload Balance</span>
          </h3>
          <p className="text-xs text-slate-400">Total sessions scheduled per day (Goal: smooth even distribution)</p>

          <div className="space-y-3 pt-2">
            {Object.entries(stats.daily_distribution || {}).map(([day, count]) => {
              const maxCount = Math.max(...Object.values(stats.daily_distribution || {}), 1);
              const pct = (count / maxCount) * 100;
              return (
                <div key={day} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{day}</span>
                    <span className="text-indigo-400">{count} classes</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Room Usage */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
            <Icon name="building" className="w-4 h-4 text-cyan-400" />
            <span>Classroom & Lab Occupancy</span>
          </h3>
          <p className="text-xs text-slate-400">Total hours booked per room throughout the week</p>

          <div className="space-y-3 pt-2">
            {Object.entries(stats.room_usage || {}).map(([room, count]) => {
              const maxCount = 30; // 5 days * 6 slots = 30
              const pct = Math.min(100, (count / maxCount) * 100);
              return (
                <div key={room} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{room}</span>
                    <span className="text-cyan-400">{count} hrs ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Faculty Teaching Load Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Faculty Teaching Load Breakdown</h3>
            <p className="text-xs text-slate-400">Actual scheduled hours compared against weekly maximums</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3.5 font-semibold">Faculty Name</th>
                <th className="p-3.5 font-semibold">Department</th>
                <th className="p-3.5 font-semibold">Max Weekly Limit</th>
                <th className="p-3.5 font-semibold">Scheduled Hours</th>
                <th className="p-3.5 font-semibold">Load Bar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {collegeData.faculty.map(f => {
                const scheduled = stats.faculty_hours ? stats.faculty_hours[f.name] || 0 : 0;
                const pct = Math.min(100, (scheduled / f.max_hours_per_week) * 100);
                return (
                  <tr key={f.id} className="hover:bg-slate-800/20">
                    <td className="p-3.5 font-bold text-slate-200">{f.name}</td>
                    <td className="p-3.5 text-slate-400">{f.department}</td>
                    <td className="p-3.5 text-slate-300 font-mono">{f.max_hours_per_week} hrs</td>
                    <td className="p-3.5 text-indigo-400 font-bold font-mono">{scheduled} hrs</td>
                    <td className="p-3.5 w-48">
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full rounded-full ${pct > 90 ? 'bg-amber-400' : 'bg-indigo-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// =========================================================================
// 3. FACULTY MANAGEMENT VIEW
// =========================================================================
function FacultyManager({ faculty, constants, refreshData, showToast }) {
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenAdd = () => {
    setEditingFaculty({
      id: `FAC_${Date.now()}`,
      name: "",
      department: "Computer Science & Engineering",
      email: "",
      max_hours_per_week: 16,
      max_hours_per_day: 4,
      unavailable_slots: [],
      color: "#3b82f6"
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/faculty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingFaculty)
      });
      if (res.ok) {
        showToast("Faculty saved successfully!");
        setIsModalOpen(false);
        refreshData();
      }
    } catch (e) {
      showToast("Error saving faculty", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this faculty member?")) return;
    try {
      const res = await fetch(`/api/faculty/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Faculty deleted!");
        refreshData();
      }
    } catch (e) {
      showToast("Error deleting faculty", "error");
    }
  };

  const toggleUnavailableSlot = (day, slot) => {
    const current = editingFaculty.unavailable_slots || [];
    const exists = current.some(s => s.day === day && s.slot === slot);
    let updated;
    if (exists) {
      updated = current.filter(s => !(s.day === day && s.slot === slot));
    } else {
      updated = [...current, { day, slot }];
    }
    setEditingFaculty({ ...editingFaculty, unavailable_slots: updated });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-100">Faculty Members</h2>
          <p className="text-xs text-slate-400">Manage teaching staff, weekly workload caps, and unavailable time periods</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center space-x-1.5 shadow-md shadow-indigo-600/20"
        >
          <Icon name="plus" className="w-4 h-4" />
          <span>Add Faculty</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {faculty.map(f => (
          <div key={f.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm"
                  style={{ backgroundColor: f.color || "#4f46e5" }}
                >
                  {f.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-100">{f.name}</h3>
                  <p className="text-xs text-slate-400">{f.department}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => { setEditingFaculty(f); setIsModalOpen(true); }}
                  className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg"
                >
                  <Icon name="settings" className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(f.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg"
                >
                  <Icon name="trash" className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">Max Hours / Wk</span>
                <span className="font-bold text-slate-200">{f.max_hours_per_week} hrs</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">Max Hours / Day</span>
                <span className="font-bold text-slate-200">{f.max_hours_per_day} hrs</span>
              </div>
            </div>

            <div className="text-xs pt-1">
              <span className="text-slate-500 text-[10px] uppercase block mb-1">Unavailable Slots:</span>
              {f.unavailable_slots && f.unavailable_slots.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {f.unavailable_slots.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[10px] font-medium">
                      Day {s.day + 1} Slot {s.slot + 1}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-slate-500 text-[11px] italic">Available full week</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Faculty Modal */}
      {isModalOpen && editingFaculty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-100">
                {faculty.some(x => x.id === editingFaculty.id) ? "Edit Faculty" : "Add Faculty"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Faculty Name</label>
                  <input
                    type="text"
                    required
                    value={editingFaculty.name}
                    onChange={e => setEditingFaculty({ ...editingFaculty, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Dr. Alan Turing"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Department</label>
                  <input
                    type="text"
                    required
                    value={editingFaculty.department}
                    onChange={e => setEditingFaculty({ ...editingFaculty, department: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Max Hours / Week</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={editingFaculty.max_hours_per_week}
                    onChange={e => setEditingFaculty({ ...editingFaculty, max_hours_per_week: parseInt(e.target.value) || 16 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Max Hours / Day</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={editingFaculty.max_hours_per_day}
                    onChange={e => setEditingFaculty({ ...editingFaculty, max_hours_per_day: parseInt(e.target.value) || 4 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Visual Unavailable Slots Picker */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Unavailable Time Periods (Click cells to toggle unavailable hours)
                </label>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 overflow-x-auto">
                  <div className="grid grid-cols-6 gap-1 min-w-[360px] text-center text-[10px]">
                    <div className="font-bold text-slate-500">Day / Period</div>
                    {[1, 2, 3, 4, 5, 6].map(p => (
                      <div key={p} className="font-bold text-slate-400">P{p}</div>
                    ))}
                    {constants.days && constants.days.map(d => (
                      <React.Fragment key={d.index}>
                        <div className="font-semibold text-slate-300 py-1.5 text-left pl-1">{d.short}</div>
                        {[0, 1, 2, 3, 4, 5].map(slotIdx => {
                          const isUnavail = (editingFaculty.unavailable_slots || []).some(
                            s => s.day === d.index && s.slot === slotIdx
                          );
                          return (
                            <button
                              type="button"
                              key={slotIdx}
                              onClick={() => toggleUnavailableSlot(d.index, slotIdx)}
                              className={`py-1.5 rounded text-[10px] font-bold transition-all ${
                                isUnavail
                                  ? "bg-rose-600 text-white shadow-sm"
                                  : "bg-slate-900 hover:bg-slate-800 text-slate-400"
                              }`}
                            >
                              {isUnavail ? "✕" : "✓"}
                            </button>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-md"
                >
                  Save Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 4. CLASSROOM & LAB MANAGEMENT VIEW
// =========================================================================
function ClassroomManager({ classrooms, refreshData, showToast }) {
  const [editingRoom, setEditingRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenAdd = () => {
    setEditingRoom({
      id: `ROOM_${Date.now()}`,
      room_number: "",
      capacity: 50,
      type: "lecture_hall",
      building: "Main Academic Block"
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/classrooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingRoom)
      });
      if (res.ok) {
        showToast("Classroom saved successfully!");
        setIsModalOpen(false);
        refreshData();
      }
    } catch (e) {
      showToast("Error saving classroom", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this classroom?")) return;
    try {
      const res = await fetch(`/api/classrooms/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Classroom removed!");
        refreshData();
      }
    } catch (e) {
      showToast("Error removing classroom", "error");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-100">Classrooms & Laboratories</h2>
          <p className="text-xs text-slate-400">Manage lecture halls, specialized computer labs, and seminar auditoriums</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center space-x-1.5 shadow-md shadow-indigo-600/20"
        >
          <Icon name="plus" className="w-4 h-4" />
          <span>Add Room</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classrooms.map(r => (
          <div key={r.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm text-slate-100">{r.room_number}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    r.type === 'computer_lab' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : r.type === 'seminar_hall'
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  }`}>
                    {r.type.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{r.building}</p>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => { setEditingRoom(r); setIsModalOpen(true); }}
                  className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg"
                >
                  <Icon name="settings" className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg"
                >
                  <Icon name="trash" className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Seating Capacity:</span>
              <span className="font-extrabold text-slate-100 text-sm font-mono">{r.capacity} students</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-100">
                {classrooms.some(x => x.id === editingRoom.id) ? "Edit Classroom" : "Add Classroom"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Room Number / Name</label>
                <input
                  type="text"
                  required
                  value={editingRoom.room_number}
                  onChange={e => setEditingRoom({ ...editingRoom, room_number: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. LH-101 (Turing Hall)"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Capacity (Seats)</label>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    value={editingRoom.capacity}
                    onChange={e => setEditingRoom({ ...editingRoom, capacity: parseInt(e.target.value) || 50 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Room Type</label>
                  <select
                    value={editingRoom.type}
                    onChange={e => setEditingRoom({ ...editingRoom, type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="lecture_hall">Lecture Hall</option>
                    <option value="computer_lab">Computer Lab</option>
                    <option value="electronics_lab">Electronics Lab</option>
                    <option value="seminar_hall">Seminar Hall</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Building / Location</label>
                <input
                  type="text"
                  value={editingRoom.building}
                  onChange={e => setEditingRoom({ ...editingRoom, building: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-md"
                >
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 5. STUDENT BATCHES VIEW
// =========================================================================
function BatchManager({ batches, courses, refreshData, showToast }) {
  const [editingBatch, setEditingBatch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenAdd = () => {
    setEditingBatch({
      id: `BATCH_${Date.now()}`,
      name: "",
      department: "Computer Science & Engineering",
      semester: 4,
      size: 45
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingBatch)
      });
      if (res.ok) {
        showToast("Student batch saved successfully!");
        setIsModalOpen(false);
        refreshData();
      }
    } catch (e) {
      showToast("Error saving batch", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this student batch?")) return;
    try {
      const res = await fetch(`/api/batches/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Batch removed!");
        refreshData();
      }
    } catch (e) {
      showToast("Error removing batch", "error");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-100">Student Batches & Sections</h2>
          <p className="text-xs text-slate-400">Manage student cohort sizes, semesters, and course loads</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center space-x-1.5 shadow-md shadow-indigo-600/20"
        >
          <Icon name="plus" className="w-4 h-4" />
          <span>Add Batch</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {batches.map(b => {
          const batchCourses = courses.filter(c => c.batch_id === b.id);
          const totalHours = batchCourses.reduce(
            (acc, c) => acc + c.lectures_per_week + (c.labs_per_week * (c.lab_duration_hours || 2)),
            0
          );
          return (
            <div key={b.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-100">{b.name}</h3>
                  <p className="text-xs text-slate-400">{b.department}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => { setEditingBatch(b); setIsModalOpen(true); }}
                    className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg"
                  >
                    <Icon name="settings" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg"
                  >
                    <Icon name="trash" className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                  <span className="text-slate-500 block text-[10px] uppercase">Semester</span>
                  <span className="font-bold text-slate-200">Sem {b.semester}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                  <span className="text-slate-500 block text-[10px] uppercase">Students</span>
                  <span className="font-bold text-slate-200">{b.size}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                  <span className="text-slate-500 block text-[10px] uppercase">Load</span>
                  <span className="font-bold text-indigo-400">{totalHours} hrs</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && editingBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-100">
                {batches.some(x => x.id === editingBatch.id) ? "Edit Batch" : "Add Student Batch"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Batch Name / Section</label>
                <input
                  type="text"
                  required
                  value={editingBatch.name}
                  onChange={e => setEditingBatch({ ...editingBatch, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. B.Tech CSE - Year 2 (Sec A)"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Semester (1 to 8)</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={editingBatch.semester}
                    onChange={e => setEditingBatch({ ...editingBatch, semester: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Class Size (Enrolled)</label>
                  <input
                    type="number"
                    min="5"
                    max="200"
                    value={editingBatch.size}
                    onChange={e => setEditingBatch({ ...editingBatch, size: parseInt(e.target.value) || 40 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Department</label>
                <input
                  type="text"
                  value={editingBatch.department}
                  onChange={e => setEditingBatch({ ...editingBatch, department: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-md"
                >
                  Save Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 6. COURSES & CURRICULA MANAGEMENT VIEW
// =========================================================================
function CourseManager({ courses, faculty, batches, refreshData, showToast }) {
  const [editingCourse, setEditingCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenAdd = () => {
    setEditingCourse({
      id: `CRS_${Date.now()}`,
      code: "",
      name: "",
      faculty_id: faculty.length ? faculty[0].id : "",
      batch_id: batches.length ? batches[0].id : "",
      lectures_per_week: 3,
      labs_per_week: 1,
      lab_duration_hours: 2,
      room_type_required: "lecture_hall",
      color: "#6366f1"
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCourse)
      });
      if (res.ok) {
        showToast("Course saved successfully!");
        setIsModalOpen(false);
        refreshData();
      }
    } catch (e) {
      showToast("Error saving course", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this course?")) return;
    try {
      const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Course removed!");
        refreshData();
      }
    } catch (e) {
      showToast("Error removing course", "error");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-100">Courses & Subject Curricula</h2>
          <p className="text-xs text-slate-400">Configure weekly lecture frequencies, laboratory sessions, assigned faculty, and target batches</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center space-x-1.5 shadow-md shadow-indigo-600/20"
        >
          <Icon name="plus" className="w-4 h-4" />
          <span>Add Course</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map(c => {
          const fac = faculty.find(f => f.id === c.faculty_id);
          const bat = batches.find(b => b.id === c.batch_id);
          return (
            <div
              key={c.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: c.color || "#6366f1" }}
              />

              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs px-2 py-0.5 rounded bg-slate-800 text-indigo-400 font-mono">
                      {c.code}
                    </span>
                    <h3 className="font-bold text-sm text-slate-100">{c.name}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Batch: {bat ? bat.name : "Unassigned"}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => { setEditingCourse(c); setIsModalOpen(true); }}
                    className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg"
                  >
                    <Icon name="settings" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg"
                  >
                    <Icon name="trash" className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Instructor:</span>
                  <span className="font-semibold text-slate-200">{fac ? fac.name : "Unassigned"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Lectures / Wk:</span>
                  <span className="font-semibold text-indigo-400">{c.lectures_per_week} lectures (1h)</span>
                </div>
                {c.labs_per_week > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Labs / Wk:</span>
                    <span className="font-semibold text-emerald-400">{c.labs_per_week} lab ({c.lab_duration_hours || 2}h block)</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">Room Type:</span>
                  <span className="font-semibold text-slate-300 uppercase text-[10px]">{c.room_type_required.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-100">
                {courses.some(x => x.id === editingCourse.id) ? "Edit Course" : "Add Course"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Course Code</label>
                  <input
                    type="text"
                    required
                    value={editingCourse.code}
                    onChange={e => setEditingCourse({ ...editingCourse, code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 uppercase font-mono"
                    placeholder="CS301"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-400 mb-1 font-semibold">Course Name</label>
                  <input
                    type="text"
                    required
                    value={editingCourse.name}
                    onChange={e => setEditingCourse({ ...editingCourse, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Artificial Intelligence"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Assigned Faculty</label>
                  <select
                    value={editingCourse.faculty_id}
                    onChange={e => setEditingCourse({ ...editingCourse, faculty_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    {faculty.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Target Batch</label>
                  <select
                    value={editingCourse.batch_id}
                    onChange={e => setEditingCourse({ ...editingCourse, batch_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    {batches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Lectures / Wk</label>
                  <input
                    type="number"
                    min="0"
                    max="6"
                    value={editingCourse.lectures_per_week}
                    onChange={e => setEditingCourse({ ...editingCourse, lectures_per_week: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Labs / Wk</label>
                  <input
                    type="number"
                    min="0"
                    max="3"
                    value={editingCourse.labs_per_week}
                    onChange={e => setEditingCourse({ ...editingCourse, labs_per_week: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Lab Duration (Hrs)</label>
                  <input
                    type="number"
                    min="1"
                    max="3"
                    value={editingCourse.lab_duration_hours}
                    onChange={e => setEditingCourse({ ...editingCourse, lab_duration_hours: parseInt(e.target.value) || 2 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Required Room Type</label>
                  <select
                    value={editingCourse.room_type_required}
                    onChange={e => setEditingCourse({ ...editingCourse, room_type_required: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="lecture_hall">Lecture Hall</option>
                    <option value="computer_lab">Computer Lab</option>
                    <option value="electronics_lab">Electronics Lab</option>
                    <option value="seminar_hall">Seminar Hall</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Badge Color</label>
                  <input
                    type="color"
                    value={editingCourse.color || "#6366f1"}
                    onChange={e => setEditingCourse({ ...editingCourse, color: e.target.value })}
                    className="w-full h-9 bg-slate-950 border border-slate-700 rounded-xl px-2 py-1 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-md"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 7. DIAGNOSTICS & CONFLICT INSPECTOR MODAL
// =========================================================================
function DiagnosticsModal({ diagnostics, onClose, onGenerate }) {
  const errors = diagnostics.filter(d => d.severity === "error");
  const warnings = diagnostics.filter(d => d.severity === "warning");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              errors.length > 0 ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"
            }`}>
              <Icon name={errors.length > 0 ? "alert" : "check"} className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Constraint & Conflict Diagnostics</h3>
              <p className="text-xs text-slate-400">
                {errors.length > 0 
                  ? `${errors.length} hard constraint conflicts detected that cause INFEASIBLE schedules` 
                  : "Pre-validation checks passed! Constraints are mathematically solvable."}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">✕</button>
        </div>

        {diagnostics.length === 0 ? (
          <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <Icon name="check" className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-sm text-slate-200">Zero Conflicts Detected!</h4>
            <p className="text-xs text-slate-400">
              All faculty workloads, room sizes, batch hours, and lab blocks are within feasible operational limits.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {diagnostics.map((d, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border text-xs space-y-2 ${
                  d.severity === "error"
                    ? "bg-rose-950/20 border-rose-800/60 text-rose-200"
                    : "bg-amber-950/20 border-amber-800/60 text-amber-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      d.severity === "error" ? "bg-rose-500/30 text-rose-300" : "bg-amber-500/30 text-amber-300"
                    }`}>
                      {d.severity.toUpperCase()}
                    </span>
                    <span className="font-bold text-slate-200 uppercase text-[10px] tracking-wide">
                      {d.category.replace('_', ' ')}
                    </span>
                  </div>
                  {d.entity_name && (
                    <span className="text-[11px] text-slate-400 font-mono">{d.entity_name}</span>
                  )}
                </div>

                <p className="font-medium text-slate-200">{d.message}</p>

                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-slate-300 text-[11px] flex items-start space-x-2">
                  <span className="font-bold text-indigo-400 flex-shrink-0">Actionable Suggestion:</span>
                  <span>{d.suggestion}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs"
          >
            Close
          </button>
          {errors.length === 0 && (
            <button
              onClick={() => { onClose(); onGenerate(); }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-md"
            >
              Generate Schedule
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Render into DOM
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
