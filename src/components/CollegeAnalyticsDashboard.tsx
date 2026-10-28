import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  Calendar,
  Filter,
  Download,
  Building2,
  Award,
  Zap,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';

// Color Palette matching campus theme
const COLORS = {
  primary: '#2563eb', // blue-600
  secondary: '#4f46e5', // indigo-600
  emerald: '#059669', // emerald-600
  amber: '#d97706', // amber-600
  pink: '#db2777', // pink-600
  purple: '#9333ea', // purple-600
  cyan: '#0891b2', // cyan-600
  slateLight: '#f1f5f9',
  slateDark: '#1e293b'
};

export const CollegeAnalyticsDashboard: React.FC = () => {
  const { currentCollege, events, registrations, departments, certificates, addToast } = useCampus();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'semester'>('30d');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');
  const [chartType, setChartType] = useState<'cumulative' | 'daily'>('cumulative');

  // 1. REGISTRATION TRENDS DATA
  // Dynamic series based on registrations & timeline
  const registrationTrendsData = useMemo(() => {
    return [
      { date: 'Oct 01', Hackathons: 18, Workshops: 24, Cultural: 15, Total: 57 },
      { date: 'Oct 05', Hackathons: 35, Workshops: 48, Cultural: 40, Total: 123 },
      { date: 'Oct 10', Hackathons: 68, Workshops: 75, Cultural: 95, Total: 238 },
      { date: 'Oct 15', Hackathons: 112, Workshops: 96, Cultural: 180, Total: 388 },
      { date: 'Oct 20', Hackathons: 145, Workshops: 118, Cultural: 290, Total: 553 },
      { date: 'Oct 22', Hackathons: 172, Workshops: 135, Cultural: 420, Total: 727 },
      { date: 'Oct 24', Hackathons: 184, Workshops: 142, Cultural: 610, Total: 936 },
      { date: 'Oct 26 (Today)', Hackathons: 215, Workshops: 158, Cultural: 940, Total: 1313 }
    ];
  }, [timeRange]);

  // Daily new sign-ups breakdown
  const dailyVelocityData = useMemo(() => {
    return [
      { day: 'Mon', Hackathons: 28, Workshops: 14, Cultural: 45 },
      { day: 'Tue', Hackathons: 36, Workshops: 22, Cultural: 60 },
      { day: 'Wed', Hackathons: 42, Workshops: 35, Cultural: 85 },
      { day: 'Thu', Hackathons: 55, Workshops: 28, Cultural: 110 },
      { day: 'Fri', Hackathons: 62, Workshops: 40, Cultural: 145 },
      { day: 'Sat', Hackathons: 78, Workshops: 52, Cultural: 220 },
      { day: 'Sun', Hackathons: 45, Workshops: 30, Cultural: 180 }
    ];
  }, []);

  // 2. ATTENDANCE RATES BY DEPARTMENT & EVENT
  // Registered vs Actual Checked In Rate
  const departmentAttendanceData = useMemo(() => {
    return [
      {
        department: 'CSE',
        name: 'Computer Science',
        registered: 540,
        checkedIn: 468,
        rate: 86.6,
        fill: COLORS.primary
      },
      {
        department: 'AIML',
        name: 'AI & Data Science',
        registered: 320,
        checkedIn: 275,
        rate: 85.9,
        fill: COLORS.secondary
      },
      {
        department: 'ECE',
        name: 'Electronics & Comm.',
        registered: 210,
        checkedIn: 168,
        rate: 80.0,
        fill: COLORS.emerald
      },
      {
        department: 'MECH',
        name: 'Mechanical Eng.',
        registered: 178,
        checkedIn: 122,
        rate: 68.5,
        fill: COLORS.amber
      },
      {
        department: 'CIVIL',
        name: 'Civil Engineering',
        registered: 95,
        checkedIn: 64,
        rate: 67.3,
        fill: COLORS.pink
      }
    ].filter((item) => selectedDeptFilter === 'all' || item.department === selectedDeptFilter);
  }, [selectedDeptFilter]);

  // Per-Event Attendance Yield Data
  const eventAttendanceYieldData = useMemo(() => {
    return [
      {
        eventName: 'Bhopal AI Hackathon',
        shortName: 'AI Hackathon',
        capacity: 250,
        registered: 215,
        checkedIn: 184,
        yieldPct: 85.5
      },
      {
        eventName: 'Kubernetes Masterclass',
        shortName: 'K8s Workshop',
        capacity: 90,
        registered: 90,
        checkedIn: 82,
        yieldPct: 91.1
      },
      {
        eventName: 'Dhwani Cultural Night',
        shortName: 'Dhwani Fest',
        capacity: 1200,
        registered: 940,
        checkedIn: 790,
        yieldPct: 84.0
      },
      {
        eventName: 'CodeSprint Season 4',
        shortName: 'CodeSprint',
        capacity: 300,
        registered: 185,
        checkedIn: 142,
        yieldPct: 76.7
      },
      {
        eventName: 'Quantum Keynote',
        shortName: 'Quantum Sem.',
        capacity: 150,
        registered: 65,
        checkedIn: 46,
        yieldPct: 70.7
      }
    ];
  }, []);

  // 3. PEAK EVENT HOURS DATA
  // Check-in and student gate throughput distribution across 24 hours (8 AM - 10 PM)
  const peakEventHoursData = useMemo(() => {
    return [
      { hour: '08:00 AM', checkIns: 32, label: 'Early Arrival' },
      { hour: '09:00 AM', checkIns: 185, label: 'Morning Keynote Peak' },
      { hour: '10:00 AM', checkIns: 142, label: 'Hackathon Kickoff' },
      { hour: '11:00 AM', checkIns: 88, label: 'Workshop Session 1' },
      { hour: '12:00 PM', checkIns: 65, label: 'Mid-day Talks' },
      { hour: '01:00 PM', checkIns: 48, label: 'Lunch Recess' },
      { hour: '02:00 PM', checkIns: 198, label: 'Afternoon Lab Peak' },
      { hour: '03:00 PM', checkIns: 165, label: 'Hands-on Sprint' },
      { hour: '04:00 PM', checkIns: 120, label: 'Mentorship Rounds' },
      { hour: '05:00 PM', checkIns: 145, label: 'Cultural Entry Starts' },
      { hour: '06:00 PM', checkIns: 240, label: 'Evening Fest Prime Peak' },
      { hour: '07:00 PM', checkIns: 210, label: 'Band Performance' },
      { hour: '08:00 PM', checkIns: 110, label: 'Campus Dining' },
      { hour: '09:00 PM', checkIns: 45, label: 'Late Gates' }
    ];
  }, []);

  // Category Distribution Pie Chart
  const categoryDistributionData = [
    { name: 'Hackathons', value: 215, color: '#4f46e5' },
    { name: 'Cultural Fests', value: 940, color: '#db2777' },
    { name: 'Workshops', value: 158, color: '#059669' },
    { name: 'Contests', value: 142, color: '#d97706' },
    { name: 'Seminars', value: 65, color: '#0891b2' }
  ];

  // Aggregated High-Level KPIs
  const totalRegistrations = 1520;
  const totalCheckedIn = 1244;
  const overallAttendanceRate = ((totalCheckedIn / totalRegistrations) * 100).toFixed(1);
  const peakTimeSlot = '06:00 PM (240 Check-ins)';

  const handleExportAnalyticsReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Department,Registered Students,Verified Gate Check-ins,Attendance Rate %',
        ...departmentAttendanceData.map(
          (d) => `"${d.name}",${d.registered},${d.checkedIn},${d.rate}%`
        )
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${currentCollege.slug}-attendance-analytics.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'Report Exported', 'Downloaded department attendance data.');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Analytics Control & Header Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900">
              Campus Intelligence & Attendance Insights
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time analytics scoped to {currentCollege.name} ({currentCollege.city})
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Time range picker */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {(['7d', '30d', 'semester'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg transition capitalize ${
                  timeRange === range
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Full Semester'}
              </button>
            ))}
          </div>

          {/* Department Filter */}
          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
          >
            <option value="all">All Departments (CSE, AIML, ECE...)</option>
            {departments.map((dept) => (
              <option key={dept.code} value={dept.code}>
                {dept.code} Dept
              </option>
            ))}
          </select>

          {/* Export Action */}
          <button
            onClick={handleExportAnalyticsReport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Highlight Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Registrations</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {totalRegistrations.toLocaleString()}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +24.8%
            </span>
            <span className="text-slate-400">vs. previous month</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Verified Gate Attendance</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-emerald-700 tracking-tight">
              {overallAttendanceRate}%
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">
              {totalCheckedIn.toLocaleString()} Verified Badges
            </span>
            <span className="text-slate-400">Gate QR</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Peak Venue Gate Hour</span>
              <Clock className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-indigo-700 tracking-tight mt-1">
              06:00 PM
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-indigo-600 font-bold">240 Scans / hr</span>
            <span className="text-slate-400">Auditorium / Amphitheater</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Credential Issue Rate</span>
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-black text-amber-600 tracking-tight">
              640
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-bold">100% SHA-256</span>
            <span className="text-slate-400">Tamper-Proof</span>
          </div>
        </div>
      </div>

      {/* CHART SECTION 1: REGISTRATION TRENDS (AreaChart & BarChart) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h4 className="text-base font-bold text-slate-900">
              Registration Trajectory & Event Category Volume
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Cumulative student registration growth leading up to Bhopal AI/ML Hackathon and Dhwani Fest
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setChartType('cumulative')}
              className={`px-3 py-1 rounded-lg transition ${
                chartType === 'cumulative'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cumulative Growth
            </button>
            <button
              onClick={() => setChartType('daily')}
              className={`px-3 py-1 rounded-lg transition ${
                chartType === 'daily'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daily Velocity
            </button>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'cumulative' ? (
              <AreaChart data={registrationTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorCultural" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.pink} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.pink} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorHack" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                  }}
                  itemStyle={{ padding: '2px 0' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="Total"
                  stroke={COLORS.primary}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                  name="All Registrations"
                />
                <Area
                  type="monotone"
                  dataKey="Cultural"
                  stroke={COLORS.pink}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCultural)"
                  name="Cultural Fest"
                />
                <Area
                  type="monotone"
                  dataKey="Hackathons"
                  stroke={COLORS.secondary}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorHack)"
                  name="AI Hackathons"
                />
              </AreaChart>
            ) : (
              <BarChart data={dailyVelocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Hackathons" fill={COLORS.secondary} radius={[4, 4, 0, 0]} name="Hackathons" />
                <Bar dataKey="Workshops" fill={COLORS.emerald} radius={[4, 4, 0, 0]} name="Workshops" />
                <Bar dataKey="Cultural" fill={COLORS.pink} radius={[4, 4, 0, 0]} name="Cultural Fests" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHART SECTION 2 & 3: ATTENDANCE RATES & PEAK EVENT HOURS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Attendance Rates by Department (BarChart with Registered vs Checked In) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Attendance Rates & Gate Turnout by Department
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Comparison between registered seats and verified QR check-ins
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                CSE Top (86.6%)
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentAttendanceData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  barGap={4}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="department" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#fff',
                      border: 'none',
                      fontSize: '12px'
                    }}
                    formatter={(val: any, name?: any) => [
                      name === 'rate' ? `${val}%` : `${val} Students`,
                      name === 'registered' ? 'Seats Registered' : 'Gate Checked-In'
                    ]}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar
                    dataKey="registered"
                    fill="#94a3b8"
                    radius={[4, 4, 0, 0]}
                    name="Registered Students"
                  />
                  <Bar
                    dataKey="checkedIn"
                    fill={COLORS.primary}
                    radius={[4, 4, 0, 0]}
                    name="Verified Checked-In"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department Breakdown Mini-Table */}
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            {departmentAttendanceData.slice(0, 4).map((d) => (
              <div key={d.department} className="bg-slate-50 p-2 rounded-xl border border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-500 block">{d.name}</span>
                <span className="text-sm font-extrabold text-blue-700">{d.rate}%</span>
                <span className="text-[10px] text-slate-400 block">{d.checkedIn}/{d.registered}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Event Hours Bar / Area Chart */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Peak Event Hours & Gate Traffic
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Hourly student scan throughput (08:00 AM - 10:00 PM)
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase tracking-wider">
                Peak: 6 PM
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={peakEventHoursData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="hour"
                    tick={{ fontSize: 9, fill: '#64748b' }}
                    interval={2}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#fff',
                      border: 'none',
                      fontSize: '12px'
                    }}
                    formatter={(val: any) => [`${val} Gate Check-ins`, 'Throughput']}
                  />
                  <Area
                    type="monotone"
                    dataKey="checkIns"
                    stroke={COLORS.secondary}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorHours)"
                    name="Scans / hr"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              Peak intervals: 09:00 AM (Keynote) & 06:00 PM (Amphitheater Fest)
            </span>
            <span className="text-indigo-700 font-bold font-mono">240/hr</span>
          </div>
        </div>
      </div>

      {/* CHART SECTION 4: PER-EVENT ATTENDANCE YIELD & CATEGORY PIE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Per-Event Attendance Yield Progress */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-slate-900">
                Event Capacity Utilization & Check-in Yield
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Conversion from confirmed seats to real in-person gate presence
              </p>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Target Benchmark: <strong>&gt;75%</strong>
            </span>
          </div>

          <div className="space-y-4">
            {eventAttendanceYieldData.map((ev) => (
              <div key={ev.eventName} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{ev.eventName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      Capacity: {ev.capacity}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">
                      <strong>{ev.checkedIn}</strong> attended of <strong>{ev.registered}</strong> registered
                    </span>
                    <span
                      className={`font-black text-xs px-2 py-0.5 rounded-full ${
                        ev.yieldPct >= 85
                          ? 'bg-emerald-100 text-emerald-800'
                          : ev.yieldPct >= 75
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ev.yieldPct}% Yield
                    </span>
                  </div>
                </div>

                {/* Dual progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden flex">
                  <div
                    className="bg-emerald-600 h-full rounded-l-full"
                    style={{ width: `${(ev.checkedIn / ev.capacity) * 100}%` }}
                    title={`Checked In: ${ev.checkedIn}`}
                  ></div>
                  <div
                    className="bg-blue-300 h-full"
                    style={{
                      width: `${((ev.registered - ev.checkedIn) / ev.capacity) * 100}%`
                    }}
                    title={`Unchecked Registrations: ${ev.registered - ev.checkedIn}`}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                  <span>Green: Verified Gate Attendance</span>
                  <span>Light Blue: Pending Check-ins / No-shows</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Share Donut / Pie */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-slate-900">
              Registration Share by Type
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown of total student participation across domains
            </p>

            <div className="h-56 w-full mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#fff',
                      border: 'none',
                      fontSize: '12px'
                    }}
                    formatter={(val: any) => [`${val} Students`, 'Registrations']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
            {categoryDistributionData.map((c) => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }}></span>
                  <span className="text-slate-700 font-medium">{c.name}</span>
                </div>
                <span className="font-bold text-slate-900">{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
