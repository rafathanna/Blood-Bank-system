import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  Clock,
  Download,
  RefreshCcw,
  CheckCircle2,
  Search,
  UserCheck,
  UserMinus,
  Briefcase,
  Plus,
  Trash2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Layers,
  Edit2,
  Save,
  Settings,
  X,
  FileText,
  Share2,
} from "lucide-react";
import { format, addDays, parseISO } from "date-fns";
import { DEFAULT_EMPLOYEES, STORAGE_KEY } from "./constants";
import {
  calculateWorkedHours,
  formatTime,
  getTodayStr,
  exportToExcel,
  exportAllHistory,
  exportIndividualTimeSheets,
} from "./utils";

function App() {
  // Data State
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY + "_employees_v2");
    return saved ? JSON.parse(saved) : DEFAULT_EMPLOYEES;
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY + "_history_v2");
    return saved ? JSON.parse(saved) : {};
  });

  // UI State
  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [filter, setFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSettings, setShowSettings] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDept, setNewDept] = useState("General");
  const [newJob, setNewJob] = useState("");
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDept, setEditDept] = useState("");
  const [editJob, setEditJob] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const departments = useMemo(() => {
    const depts = new Set(employees.map((e) => e.department));
    return ["All", ...Array.from(depts).sort()];
  }, [employees]);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Persist Data
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY + "_employees_v2",
      JSON.stringify(employees),
    );
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + "_history_v2", JSON.stringify(history));
  }, [history]);

  // Current Day's Attendance logic
  const attendanceForDate = useMemo(() => {
    const data = history[selectedDate] || [];
    const updatedData = [...data];

    employees.forEach((emp) => {
      const exists = updatedData.some((e) => e.name === emp.name);
      if (!exists) {
        updatedData.push({ ...emp, checkIn: null, checkOut: null });
      } else {
        const idx = updatedData.findIndex((e) => e.name === emp.name);
        updatedData[idx] = {
          ...updatedData[idx],
          department: emp.department,
          job: emp.job,
        };
      }
    });

    return updatedData.filter((e) =>
      employees.some((emp) => emp.name === e.name),
    );
  }, [history, selectedDate, employees]);

  // Actions
  const updateAttendance = (name, field, value) => {
    setHistory((prev) => {
      const currentDayData = [...(prev[selectedDate] || attendanceForDate)];
      const index = currentDayData.findIndex((e) => e.name === name);

      if (index > -1) {
        currentDayData[index] = { ...currentDayData[index], [field]: value };
      }

      return { ...prev, [selectedDate]: currentDayData };
    });
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    if (employees.some((e) => e.name === newName.trim())) {
      alert("Name already exists");
      return;
    }
    setEmployees((prev) => [
      ...prev,
      { name: newName.trim(), job: newJob.trim(), department: newDept },
    ]);
    setNewName("");
    setNewJob("");
  };

  const handleRemoveEmployee = (name) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      setEmployees((prev) => prev.filter((e) => e.name !== name));
    }
  };

  const handleStartEdit = (emp) => {
    setEditingEmployee(emp.name);
    setEditName(emp.name);
    setEditDept(emp.department);
    setEditJob(emp.job || "");
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) return;

    setEmployees((prev) =>
      prev.map((e) =>
        e.name === editingEmployee
          ? { name: editName.trim(), job: editJob.trim(), department: editDept }
          : e,
      ),
    );

    // Update history with new name
    setHistory((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((date) => {
        updated[date] = updated[date].map((e) =>
          e.name === editingEmployee
            ? {
                ...e,
                name: editName.trim(),
                job: editJob.trim(),
                department: editDept,
              }
            : e,
        );
      });
      return updated;
    });

    setEditingEmployee(null);
  };

  const handleCancelEdit = () => {
    setEditingEmployee(null);
    setEditName("");
    setEditDept("");
    setEditJob("");
  };

  const handleResetDay = () => {
    if (window.confirm("Reset all check-ins for the selected date?")) {
      setHistory((prev) => ({
        ...prev,
        [selectedDate]: employees.map((emp) => ({
          ...emp,
          checkIn: null,
          checkOut: null,
        })),
      }));
    }
  };

  const changeDate = (days) => {
    const current = parseISO(selectedDate);
    const next = addDays(current, days);
    setSelectedDate(format(next, "yyyy-MM-dd"));
  };

  const filteredAttendance = useMemo(() => {
    return attendanceForDate.filter((emp) => {
      const matchesSearch = emp.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        filter === "All" ||
        (filter === "Not Checked-In" && !emp.checkIn) ||
        (filter === "Not Checked-Out" && emp.checkIn && !emp.checkOut) ||
        (filter === "Completed" && emp.checkIn && emp.checkOut);
      const matchesDept = deptFilter === "All" || emp.department === deptFilter;

      return matchesSearch && matchesFilter && matchesDept;
    });
  }, [attendanceForDate, filter, searchTerm, deptFilter]);

  const stats = useMemo(
    () => ({
      total: employees.length,
      present: attendanceForDate.filter((e) => e.checkIn).length,
      completed: attendanceForDate.filter((e) => e.checkOut).length,
      remaining: attendanceForDate.filter((e) => !e.checkIn).length,
    }),
    [employees, attendanceForDate],
  );
  return (
    <div className="fixed inset-0 w-full h-[100dvh] flex flex-col bg-slate-50 overflow-hidden font-sans">
      {/* --- PREMIUM APP HEADER --- */}
      <header className="bg-white border-b border-slate-200 z-30 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-primary-600 rounded-xl shadow-lg shadow-primary-500/30">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-black text-slate-900 leading-tight">
                  Time Keeper
                </h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  Attendance Pro
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              <button
                onClick={() => setShowSettings(true)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl transition-all border shadow-sm flex-shrink-0 ${showSettings ? "bg-primary-600 border-primary-600 text-white" : "bg-white border-slate-200 text-slate-500 hover:border-primary-500/50 active:scale-90"}`}
              >
                <Settings className="w-5 h-5" />
                <span className="text-xs font-black">إدارة الموظفين</span>
              </button>
              <button
                onClick={() => setShowHelp(true)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-primary-50 hover:text-primary-600 transition-all active:scale-95"
              >
                <X className="w-5 h-5 rotate-45" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- SUB-HEADER: DATE & CLOCK --- */}
      <div className="bg-white/50 backdrop-blur-md border-b border-slate-100 px-4 py-2 sm:py-3 z-20 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => changeDate(-1)}
              className="p-2 sm:p-2.5 bg-slate-50 rounded-lg sm:rounded-xl active:scale-90"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 px-1">
              <Calendar className="w-3.5 h-3.5 sm:w-4 h-4 text-primary-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent font-black text-slate-900 outline-none text-xs sm:text-sm border-none p-0 focus:ring-0"
              />
            </div>
            <button
              onClick={() => changeDate(1)}
              className="p-2 sm:p-2.5 bg-slate-50 rounded-lg sm:rounded-xl active:scale-90"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 h-5" />
            </button>
          </div>

          <div className="bg-slate-900 text-white px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10 w-full sm:w-auto">
            <Clock className="w-3.5 h-3.5 sm:w-4 h-4 text-primary-400" />
            <span className="font-black text-xs sm:text-sm tabular-nums tracking-tight">
              {format(currentTime, "hh:mm:ss a")}
            </span>
          </div>
        </div>
      </div>

      {/* Settings Modal (Manage Employees) */}
      {showSettings && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[100] flex items-end md:items-center justify-center p-0 md:p-4 touch-auto">
          <div className="bg-white w-full h-[100dvh] md:h-auto md:max-h-[90vh] md:max-w-2xl md:rounded-[2.5rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom-full duration-300">
            <div className="px-8 py-6 flex justify-between items-center border-b border-slate-100 flex-shrink-0">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <div className="p-2 bg-primary-100 rounded-xl">
                  <Users className="w-5 h-5 text-primary-600" />
                </div>
                إدارة الموظفين
              </h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-4 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all active:scale-90"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>
            {/* ... remaining settings content ... */}

            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-widest text-center">
                  إضافة موظف جديد
                </h3>
                <form
                  onSubmit={handleAddEmployee}
                  className="flex flex-col gap-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="اسم الموظف..."
                      className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-primary-500 transition-all font-bold"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="الوظيفة..."
                      className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-primary-500 transition-all font-bold"
                      value={newJob}
                      onChange={(e) => setNewJob(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-3">
                    <select
                      className="flex-1 px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-primary-500 transition-all font-bold appearance-none"
                      value={newDept}
                      onChange={(e) => setNewDept(e.target.value)}
                    >
                      {departments
                        .filter((d) => d !== "All")
                        .map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                    </select>
                    <button
                      type="submit"
                      className="bg-primary-600 text-white px-8 rounded-2xl font-black shadow-lg shadow-primary-500/30 active:scale-95 transition-all"
                    >
                      إضافة
                    </button>
                  </div>
                </form>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-black text-slate-400 mb-2 uppercase tracking-widest px-2">
                  قائمة الموظفين ({employees.length})
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {employees.map((emp) => (
                    <div
                      key={emp.name}
                      className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-slate-50 shadow-sm group hover:border-primary-100 transition-all"
                    >
                      {editingEmployee === emp.name ? (
                        <div className="flex-1 flex flex-col gap-3">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-primary-500 rounded-xl font-bold outline-none"
                          />
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={editJob}
                              onChange={(e) => setEditJob(e.target.value)}
                              className="flex-1 px-4 py-2 border-2 border-slate-100 rounded-xl font-bold outline-none"
                            />
                            <select
                              value={editDept}
                              onChange={(e) => setEditDept(e.target.value)}
                              className="px-4 py-2 border-2 border-slate-100 rounded-xl font-bold outline-none"
                            >
                              {departments
                                .filter((d) => d !== "All")
                                .map((d) => (
                                  <option key={d} value={d}>
                                    {d}
                                  </option>
                                ))}
                            </select>
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={handleSaveEdit}
                              className="p-3 bg-green-500 text-white rounded-xl shadow-lg shadow-green-500/20 active:scale-90 transition-all"
                            >
                              <Save className="w-5 h-5" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-3 bg-slate-100 text-slate-400 rounded-xl active:scale-90 transition-all"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-500 uppercase tracking-tighter">
                              {emp.name.substring(0, 2)}
                            </div>
                            <div>
                              <span className="font-black text-slate-900 block">
                                {emp.name}
                              </span>
                              <div className="flex gap-2 mt-0.5">
                                <span className="text-[10px] bg-slate-100 text-slate-500 font-black px-2 py-0.5 rounded-md uppercase">
                                  {emp.department}
                                </span>
                                <span className="text-[10px] bg-primary-50 text-primary-600 font-black px-2 py-0.5 rounded-md uppercase">
                                  {emp.job}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStartEdit(emp)}
                              className="p-3 text-blue-500 bg-blue-50 rounded-xl active:scale-90 transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveEmployee(emp.name)}
                              className="p-3 text-rose-500 bg-rose-50 rounded-xl active:scale-90 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50/50 scroll-smooth">
        <div className="max-w-4xl mx-auto p-3 sm:p-6 space-y-4">
          {/* --- INFO LEGEND (ULTRA COMPACT) --- */}
          <div className="bg-white/40 backdrop-blur-sm px-4 py-2 rounded-2xl border border-slate-200/50 flex items-center justify-between">
            <div className="flex items-center gap-1.5 grayscale opacity-70">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
              <span className="text-[8px] font-black text-slate-500 uppercase">
                انتظار
              </span>
            </div>
            <div className="flex items-center gap-1.5 grayscale opacity-70">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <span className="text-[8px] font-black text-blue-600 uppercase">
                موجود
              </span>
            </div>
            <div className="flex items-center gap-1.5 grayscale opacity-70">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-[8px] font-black text-emerald-600 uppercase">
                انصراف
              </span>
            </div>
          </div>

          {/* --- DASHBOARD STATS (VIBRANT GRID) --- */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            {[
              {
                label: "الكل",
                val: stats.total,
                icon: Users,
                theme: "blue",
                bg: "bg-blue-500",
              },
              {
                label: "حاضر",
                val: stats.present,
                icon: UserCheck,
                theme: "emerald",
                bg: "bg-emerald-500",
              },
              {
                label: "تم",
                val: stats.completed,
                icon: CheckCircle2,
                theme: "indigo",
                bg: "bg-indigo-500",
              },
              {
                label: "باقي",
                val: stats.total - stats.present,
                icon: UserMinus,
                theme: "rose",
                bg: "bg-rose-500",
              },
            ].map((s, i) => (
              <div
                key={i}
                className={`${s.bg} p-4 sm:p-5 rounded-3xl sm:rounded-[2.5rem] shadow-lg shadow-${s.theme}-500/20 flex flex-col justify-between h-28 sm:h-36 relative overflow-hidden group border-none`}
              >
                <div className="bg-white/20 w-8 h-8 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0">
                  <s.icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="relative z-10">
                  <p className="text-white/70 text-[8px] sm:text-[10px] font-black uppercase tracking-widest leading-none mb-1">
                    {s.label}
                  </p>
                  <p className="text-xl sm:text-3xl font-black text-white tabular-nums leading-none">
                    {s.val}
                  </p>
                </div>
                <s.icon className="absolute -right-4 -bottom-4 w-20 h-20 sm:w-24 sm:h-24 text-white/10 group-hover:rotate-12 transition-transform duration-500" />
              </div>
            ))}
          </div>

          {/* --- SEARCHBAR --- */}
          <div className="relative group">
            <div className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 p-2 bg-primary-50 rounded-lg sm:rounded-xl group-focus-within:bg-primary-600 transition-colors">
              <Search className="w-4 h-4 sm:w-5 h-5 text-primary-500 group-focus-within:text-white transition-colors" />
            </div>
            <input
              type="text"
              placeholder="ابحث عن اسم الموظف هنا..."
              className="w-full pl-12 sm:pl-16 pr-6 sm:pr-8 py-4 sm:py-6 bg-white border-2 border-slate-100 rounded-[1.5rem] sm:rounded-[2.5rem] outline-none focus:border-primary-500/50 transition-all shadow-xl shadow-slate-200/10 text-base sm:text-xl font-black placeholder:text-slate-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* --- FILTERS & CATEGORIES --- */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 px-1">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setDeptFilter(dept)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black transition-all border-2 active:scale-95 ${
                    deptFilter === dept
                      ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/10"
                      : "bg-white border-slate-100 text-slate-500"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 px-1">
              {[
                { id: "All", label: "الكل", icon: Users },
                { id: "Not Checked-In", label: "غائب", icon: Clock },
                { id: "Not Checked-Out", label: "موجود", icon: UserCheck },
                { id: "Completed", label: "انصراف", icon: CheckCircle2 },
              ].map((tab) => {
                const isActive = filter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id)}
                    className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-[11px] font-black transition-all border-2 flex items-center gap-2 active:scale-95 ${
                      isActive
                        ? "bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-500/20"
                        : "bg-white border-slate-100 text-slate-500"
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* --- MAIN ACTION BUTTONS --- */}
          <div className="flex gap-3 px-1">
            <button
              onClick={() => exportToExcel(attendanceForDate, selectedDate)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-[2rem] shadow-xl shadow-emerald-500/30 active:scale-95 transition-all font-black text-base flex items-center justify-center gap-3 border-none"
            >
              <Download className="w-6 h-6" /> تحميل شيت الإكسيل (Excel)
            </button>
            <button
              onClick={handleResetDay}
              className="p-5 bg-white text-slate-400 hover:text-rose-500 border-2 border-slate-100 rounded-[2rem] active:scale-95 transition-all"
              title="إعادة ضبط اليوم"
            >
              <RefreshCcw className="w-6 h-6" />
            </button>
          </div>

          {/* --- EMPLOYEE LIST --- */}
          <div className="space-y-4">
            <div className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur-md py-4 transition-all">
              <div
                className="flex items-center justify-between px-6 py-5 bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-sm"
                dir="rtl"
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      if (
                        selectedEmployees.length ===
                          filteredAttendance.length &&
                        filteredAttendance.length > 0
                      ) {
                        setSelectedEmployees([]);
                      } else {
                        setSelectedEmployees(
                          filteredAttendance.map((e) => e.name),
                        );
                      }
                    }}
                    className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
                      selectedEmployees.length === filteredAttendance.length &&
                      filteredAttendance.length > 0
                        ? "bg-primary-600 border-primary-600 text-white"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    {selectedEmployees.length === filteredAttendance.length &&
                      filteredAttendance.length > 0 && (
                        <CheckCircle2 className="w-5 h-5" />
                      )}
                  </button>
                  <span className="font-black text-slate-900 text-sm">
                    تحديد الموظفين ({selectedEmployees.length})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-full">
                    {filteredAttendance.length} موظف
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredAttendance.length > 0 ? (
                filteredAttendance.map((emp) => (
                  <div
                    key={emp.name}
                    dir="rtl"
                    onClick={() => {
                      if (selectedEmployees.includes(emp.name)) {
                        setSelectedEmployees((prev) =>
                          prev.filter((n) => n !== emp.name),
                        );
                      } else {
                        setSelectedEmployees((prev) => [...prev, emp.name]);
                      }
                    }}
                    className={`p-3 sm:p-4 rounded-2xl sm:rounded-3xl transition-all border-2 active:scale-[0.99] relative overflow-hidden group cursor-pointer ${
                      selectedEmployees.includes(emp.name)
                        ? "bg-primary-50/30 border-primary-500 shadow-sm"
                        : "bg-white border-white shadow-sm hover:border-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Status Dot */}
                      <div
                        className={`w-1.5 h-12 rounded-full shrink-0 ${
                          emp.checkOut
                            ? "bg-emerald-500"
                            : emp.checkIn
                              ? "bg-blue-500"
                              : "bg-slate-200"
                        }`}
                      />

                      {/* Name & Basic Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-base sm:text-lg font-black text-slate-900 truncate tracking-tight">
                            {emp.name}
                          </h3>
                          {emp.checkIn && !emp.checkOut && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
                          <span className="text-[10px] font-black text-slate-400 uppercase">
                            {emp.job}
                          </span>
                          <span className="text-[10px] text-slate-200">•</span>
                          <span className="text-[10px] font-black text-primary-500/70 uppercase">
                            {emp.department}
                          </span>
                        </div>
                      </div>

                      {/* Times (Compact) */}
                      <div className="hidden sm:flex items-center gap-4 px-4 border-r border-slate-100">
                        <div className="text-center">
                          <p className="text-[8px] font-black text-slate-300 uppercase leading-none mb-1">
                            دخول
                          </p>
                          <p className="text-xs font-black text-slate-600 tabular-nums">
                            {formatTime(emp.checkIn) || "--:--"}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[8px] font-black text-slate-300 uppercase leading-none mb-1">
                            خروج
                          </p>
                          <p className="text-xs font-black text-slate-600 tabular-nums">
                            {formatTime(emp.checkOut) || "--:--"}
                          </p>
                        </div>
                      </div>

                      {/* Worked Hours / Action Button */}
                      <div className="flex items-center gap-2">
                        <div className="text-center bg-slate-50 px-2 py-1.5 rounded-xl min-w-[50px]">
                          <p className="text-[8px] font-black text-slate-400 uppercase leading-none mb-0.5">
                            ساعة
                          </p>
                          <p
                            className={`text-sm font-black ${emp.checkOut ? "text-primary-600" : "text-slate-300"}`}
                          >
                            {calculateWorkedHours(emp.checkIn, emp.checkOut)}
                          </p>
                        </div>

                        {!emp.checkIn ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateAttendance(
                                emp.name,
                                "checkIn",
                                new Date().toISOString(),
                              );
                            }}
                            className="w-10 h-10 bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-500/20 active:scale-90 transition-all flex items-center justify-center shrink-0"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        ) : !emp.checkOut ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateAttendance(
                                emp.name,
                                "checkOut",
                                new Date().toISOString(),
                              );
                            }}
                            className="w-10 h-10 bg-rose-600 text-white rounded-xl shadow-lg shadow-rose-500/20 active:scale-90 transition-all flex items-center justify-center shrink-0"
                          >
                            <UserMinus className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm("هل تريد إلغاء الخروج؟"))
                                updateAttendance(emp.name, "checkOut", null);
                            }}
                            className="w-10 h-10 bg-emerald-100 text-emerald-600 border border-emerald-200 rounded-xl active:scale-90 transition-all flex items-center justify-center shrink-0"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Mobile Times (Visible only on very small screens if needed) */}
                    {(emp.checkIn || emp.checkOut) && (
                      <div className="flex sm:hidden items-center gap-3 mt-2 pr-4 text-[10px] font-bold text-slate-400 border-t border-slate-50 pt-2">
                        <span className="flex items-center gap-1">
                          <UserCheck className="w-3 h-3" />{" "}
                          {formatTime(emp.checkIn) || "لم يسجل"}
                        </span>
                        <span className="text-slate-200">|</span>
                        <span className="flex items-center gap-1">
                          <UserMinus className="w-3 h-3" />{" "}
                          {formatTime(emp.checkOut) || "مستمر"}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-20 flex flex-col items-center text-center px-10">
                  <div className="w-32 h-32 bg-slate-100 rounded-[3rem] flex items-center justify-center mb-6">
                    <Search className="w-12 h-12 text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">
                    القائمة فارغة
                  </h3>
                  <p className="text-slate-400 font-bold">
                    لم نجد أي موظف في هذا القسم أو يطابق بحثك
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* --- QUICK ACTION FOOTER --- */}
      <div className="bg-white border-t border-slate-100 px-6 py-4 flex-shrink-0 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => exportAllHistory(history)}
            className="flex-1 p-4 bg-slate-100 text-slate-600 rounded-3xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Download className="w-5 h-5" /> التقارير اليومية والشهرية
          </button>

          <button
            onClick={() => {
              if (selectedEmployees.length === 0) {
                alert("برجاء اختيار موظفين أولاً");
                return;
              }
              const chosenItems = employees.filter((e) =>
                selectedEmployees.includes(e.name),
              );
              exportIndividualTimeSheets(chosenItems, history, selectedDate);
            }}
            className="flex-[1.5] p-5 bg-primary-600 text-white rounded-3xl font-black text-base flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-primary-500/30"
          >
            <Clock className="w-6 h-6" /> Time Sheet
            {selectedEmployees.length > 0 && (
              <span className="bg-white text-primary-600 w-6 h-6 rounded-full flex items-center justify-center text-[10px]">
                {selectedEmployees.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <footer className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-slate-400 text-sm font-medium">
          Developed By{" "}
          <span className="text-slate-600 font-bold">Rafat Hanna</span>
        </p>
      </footer>

      {/* Individual Employee QR Modal (Existing) */}

      {/* Daily Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-end md:items-center justify-center p-0 md:p-4 touch-auto">
          <div className="bg-white w-full h-[100dvh] md:h-auto md:max-w-md md:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full duration-300 flex flex-col">
            <div className="p-8 pb-4 flex justify-between items-start border-b border-slate-50 flex-shrink-0">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  تقرير اليوم
                </h3>
                <p className="text-slate-500 font-bold text-sm">
                  {format(parseISO(selectedDate), "EEEE, MMMM do")}
                </p>
              </div>
              <button
                onClick={() => setShowSummary(false)}
                className="p-4 bg-slate-100/50 hover:bg-slate-100 rounded-2xl transition-colors active:scale-90"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-8">
              {/* stats content */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-600 p-6 rounded-[2rem] text-white shadow-xl shadow-blue-500/20">
                  <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">
                    حضر
                  </p>
                  <p className="text-4xl font-black">{stats.present}</p>
                </div>
                <div className="bg-amber-500 p-6 rounded-[2rem] text-white shadow-xl shadow-amber-500/20">
                  <p className="text-amber-100 text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">
                    غادر
                  </p>
                  <p className="text-4xl font-black">{stats.completed}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                      <Users className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="text-slate-600 font-black text-sm">
                      العدد الكلي
                    </span>
                  </div>
                  <span className="font-black text-slate-900 text-lg">
                    {stats.total}
                  </span>
                </div>
                <div className="flex items-center justify-between p-5 bg-primary-50 rounded-[1.5rem] border border-primary-100/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary-500" />
                    </div>
                    <span className="text-primary-700 font-black text-sm">
                      نسبة الحضور
                    </span>
                  </div>
                  <span className="font-black text-primary-600 text-lg">
                    {Math.round((stats.present / stats.total) * 100)}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-5 bg-rose-50 rounded-[1.5rem] border border-rose-100/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                      <Clock className="w-4 h-4 text-rose-500" />
                    </div>
                    <span className="text-rose-700 font-black text-sm">
                      قيد العمل
                    </span>
                  </div>
                  <span className="font-black text-rose-600 text-lg">
                    {stats.present - stats.completed}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-4 pb-8">
                <button
                  onClick={() => {
                    const msg = `📊 *تقرير الحضور اليومي* - ${selectedDate}
-------------------------
👤 العدد الكلي: ${stats.total}
✅ الحضور: ${stats.present}
🚪 غادروا: ${stats.completed}
❌ غائب: ${stats.total - stats.present}
⏳ قيد العمل: ${stats.present - stats.completed}
-------------------------
تم التوليد بواسطة *Time Keeper*`;
                    window.open(
                      `https://wa.me/?text=${encodeURIComponent(msg)}`,
                      "_blank",
                    );
                  }}
                  className="btn bg-green-600 hover:bg-green-700 text-white w-full py-5 rounded-[1.5rem] shadow-xl shadow-green-500/30 font-black flex items-center justify-center gap-2 text-lg active:scale-95 transition-transform"
                >
                  <Share2 className="w-6 h-6" />
                  مشاركة عبر واتساب
                </button>
                <button
                  onClick={() => {
                    const text = `📊 تقرير الحضور اليومي - ${selectedDate}\n العدد الكلي: ${stats.total}\n الحضور: ${stats.present}\n غادروا: ${stats.completed}\n قيد العمل: ${stats.present - stats.completed}`;
                    navigator.clipboard.writeText(text);
                    alert("تم نسخ التقرير بنجاح");
                  }}
                  className="text-slate-400 font-black text-sm hover:text-slate-600 transition-colors py-2 active:scale-95"
                >
                  نسخ النص فقط
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showHelp && (
        <div
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[200] flex items-center justify-center p-6"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-[2rem] flex items-center justify-center mb-6 mx-auto">
              <Briefcase className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-center text-slate-900 mb-6">
              كيفية استخدام النظام
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4 text-right" dir="rtl">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-xs text-slate-500 shrink-0">
                  1
                </div>
                <p className="text-slate-600 font-bold text-sm leading-relaxed">
                  اضغط على زر{" "}
                  <span className="text-primary-600 font-black">
                    تسجيل دخول
                  </span>{" "}
                  عند وصول الموظف.
                </p>
              </div>
              <div className="flex gap-4 text-right" dir="rtl">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-xs text-slate-500 shrink-0">
                  2
                </div>
                <p className="text-slate-600 font-bold text-sm leading-relaxed">
                  عند الانتهاء، اضغط على{" "}
                  <span className="text-rose-600 font-black">تسجيل خروج</span>{" "}
                  لحساب عدد الساعات.
                </p>
              </div>
              <div className="flex gap-4 text-right" dir="rtl">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-xs text-slate-500 shrink-0">
                  3
                </div>
                <p className="text-slate-600 font-bold text-sm leading-relaxed">
                  استخدم الفلاتر في الأعلى لعرض أقسام معينة أو البحث بالاسم.
                </p>
              </div>
              <div className="flex gap-4 text-right" dir="rtl">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-xs text-slate-500 shrink-0">
                  4
                </div>
                <p className="text-slate-600 font-bold text-sm leading-relaxed">
                  اضغط على{" "}
                  <span className="text-amber-500 font-black">اليومية</span>{" "}
                  للحصول على تقرير سريع ومشاركته واتساب.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="w-full mt-10 bg-slate-900 text-white font-black py-4 rounded-2xl active:scale-95 transition-all text-sm uppercase tracking-widest"
            >
              فهمت ذلك
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
