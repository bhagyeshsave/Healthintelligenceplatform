import { useState } from 'react';
import { FileText, Activity, Pill, Calendar, Download, Search, Filter, MessageSquare, Mic, Send, Plus, X, Clock, TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle, BarChart3, FileDown, Sparkles, Mail, Copy, List, LayoutGrid, Upload, RefreshCw, Share2, Zap, Bell, UserPlus, FileStack, Heart, ChevronLeft, ChevronRight, Watch, Droplet, Wind, Moon, Flame, File } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Slider from 'react-slick';
import { DailyLog } from './DailyLog';
import { AppAlert } from './ui/app-alert';
import { uploadToS3, downloadFromS3 } from '../utils/s3Upload';
import type { UploadedFile } from '../utils/s3Upload';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Today's Vitals from Wearables/Devices (Real-time data)
const todaysVitalsData = [
  {
    id: 'heart-rate',
    name: 'Heart Rate',
    value: 68,
    unit: 'bpm',
    status: 'normal',
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    source: 'Google Fit',
    lastSync: '2 mins ago',
    trend: [65, 67, 66, 68, 70, 69, 68],
    range: '60-75',
  },
  {
    id: 'blood-pressure',
    name: 'Blood Pressure',
    value: '128/82',
    unit: 'mmHg',
    status: 'elevated',
    icon: Activity,
    color: 'from-orange-500 to-red-500',
    source: 'Omron BP Monitor',
    lastSync: '4 hours ago',
    trend: [124, 126, 128, 127, 128, 126, 128],
    range: '<120/80',
  },
  {
    id: 'blood-glucose',
    name: 'Blood Glucose',
    value: 108,
    unit: 'mg/dL',
    status: 'monitor',
    icon: Droplet,
    color: 'from-blue-500 to-cyan-500',
    source: 'Manual Entry',
    lastSync: '1 hour ago',
    trend: [102, 105, 110, 108, 109, 107, 108],
    range: '<100',
  },
  {
    id: 'sleep-score',
    name: 'Sleep Score',
    value: 82,
    unit: '/100',
    status: 'normal',
    icon: Moon,
    color: 'from-indigo-500 to-purple-500',
    source: 'Google Fit',
    lastSync: '8 hours ago',
    trend: [78, 80, 79, 83, 85, 81, 82],
    range: '70-100',
  },
  {
    id: 'steps',
    name: 'Steps',
    value: '8,340',
    unit: 'steps',
    status: 'normal',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-500',
    source: 'Google Fit',
    lastSync: '2 mins ago',
    trend: [7200, 8500, 9100, 8800, 7600, 8200, 8340],
    range: '8,000+',
  },
  {
    id: 'spo2',
    name: 'SpO₂',
    value: 97,
    unit: '%',
    status: 'normal',
    icon: Wind,
    color: 'from-cyan-500 to-blue-500',
    source: 'WHOOP',
    lastSync: 'Not connected',
    trend: [98, 97, 98, 97, 96, 97, 97],
    range: '95-100',
  },
];

interface TimelineEvent {
  id: string;
  date: string;
  type: 'lab' | 'prescription' | 'vitals' | 'appointment' | 'imaging';
  title: string;
  details: string;
  source: string;
  status?: string;
  fileUrl?: string;
}

interface LogEntry {
  id: string;
  date: string;
  time: string;
  type: 'symptom' | 'medication' | 'meal' | 'exercise' | 'mood' | 'vital' | 'general';
  content: string;
  tags: string[];
}

const timelineData: TimelineEvent[] = [
  {
    id: '1',
    date: '2024-11-20',
    type: 'lab',
    title: 'Complete Blood Count (CBC)',
    details: 'All values within normal range. Hemoglobin: 14.2 g/dL, WBC: 7,200/μL',
    source: 'Apollo Diagnostics',
    status: 'normal',
  },
  {
    id: '2',
    date: '2024-11-18',
    type: 'vitals',
    title: 'Blood Pressure Reading',
    details: '128/82 mmHg - Slightly elevated systolic reading',
    source: 'Home Device - iHealth BP Monitor',
    status: 'monitor',
  },
  {
    id: '3',
    date: '2024-11-15',
    type: 'prescription',
    title: 'Prescription - Dr. Sharma',
    details: 'Metformin 500mg (2x daily), Vitamin D3 supplement',
    source: 'Max Healthcare - Cardiology',
    status: 'active',
  },
  {
    id: '4',
    date: '2024-11-10',
    type: 'appointment',
    title: 'Cardiology Consultation',
    details: 'Follow-up for hypertension management. BP stable, continue current medications.',
    source: 'Dr. Anil Sharma - Max Healthcare',
  },
  {
    id: '5',
    date: '2024-11-05',
    type: 'lab',
    title: 'Lipid Profile',
    details: 'Total Cholesterol: 210 mg/dL, LDL: 140 mg/dL, HDL: 45 mg/dL',
    source: 'SRL Diagnostics',
    status: 'elevated',
  },
];

const initialLogs: LogEntry[] = [
  {
    id: '1',
    date: '2024-11-23',
    time: '14:30',
    type: 'symptom',
    content: 'Feeling slight headache after lunch. Possibly related to screen time.',
    tags: ['headache', 'screen-time'],
  },
  {
    id: '2',
    date: '2024-11-23',
    time: '08:00',
    type: 'medication',
    content: 'Took Metformin 500mg with breakfast as prescribed.',
    tags: ['metformin', 'morning'],
  },
  {
    id: '3',
    date: '2024-11-22',
    time: '19:00',
    type: 'exercise',
    content: '45 minute evening walk in the park. Felt energized afterward.',
    tags: ['walking', 'cardio'],
  },
  {
    id: '4',
    date: '2024-11-22',
    time: '13:00',
    type: 'meal',
    content: 'Lunch: Grilled chicken salad with olive oil dressing, whole grain bread.',
    tags: ['healthy', 'low-carb'],
  },
];

// L3M Trend Data
const cbcTrendData = [
  { date: 'Aug 26', hemoglobin: 13.8, wbc: 6800, platelets: 245000 },
  { date: 'Sep 15', hemoglobin: 14.0, wbc: 7000, platelets: 250000 },
  { date: 'Oct 10', hemoglobin: 14.1, wbc: 7100, platelets: 248000 },
  { date: 'Nov 20', hemoglobin: 14.2, wbc: 7200, platelets: 252000 },
];

const bpTrendData = [
  { date: 'Aug 22', systolic: 122, diastolic: 78 },
  { date: 'Sep 5', systolic: 125, diastolic: 80 },
  { date: 'Sep 18', systolic: 126, diastolic: 81 },
  { date: 'Oct 2', systolic: 124, diastolic: 79 },
  { date: 'Oct 15', systolic: 127, diastolic: 82 },
  { date: 'Oct 28', systolic: 128, diastolic: 82 },
  { date: 'Nov 10', systolic: 126, diastolic: 80 },
  { date: 'Nov 18', systolic: 128, diastolic: 82 },
];

const sugarTrendData = [
  { date: 'Aug 20', fasting: 98, postMeal: 135, hba1c: null },
  { date: 'Sep 3', fasting: 102, postMeal: 140, hba1c: null },
  { date: 'Sep 17', fasting: 105, postMeal: 145, hba1c: 6.1 },
  { date: 'Oct 1', fasting: 108, postMeal: 148, hba1c: null },
  { date: 'Oct 15', fasting: 110, postMeal: 152, hba1c: null },
  { date: 'Oct 29', fasting: 109, postMeal: 150, hba1c: 6.2 },
  { date: 'Nov 12', fasting: 110, postMeal: 153, hba1c: null },
];

const lipidTrendData = [
  { date: 'Feb 10', totalCholesterol: 195, ldl: 125, hdl: 48, triglycerides: 145 },
  { date: 'May 15', totalCholesterol: 202, ldl: 132, hdl: 46, triglycerides: 155 },
  { date: 'Aug 20', totalCholesterol: 208, ldl: 138, hdl: 45, triglycerides: 160 },
  { date: 'Nov 5', totalCholesterol: 210, ldl: 140, hdl: 45, triglycerides: 165 },
];

// Vitals Logged - Manual/Device entries (L3M)
const loggedBPData = [
  { date: 'Aug 22', systolic: 122, diastolic: 78 },
  { date: 'Sep 5', systolic: 125, diastolic: 80 },
  { date: 'Sep 18', systolic: 126, diastolic: 81 },
  { date: 'Oct 2', systolic: 124, diastolic: 79 },
  { date: 'Oct 15', systolic: 127, diastolic: 82 },
  { date: 'Oct 28', systolic: 128, diastolic: 82 },
  { date: 'Nov 10', systolic: 126, diastolic: 80 },
  { date: 'Nov 18', systolic: 128, diastolic: 82 },
];

const loggedGlucoseData = [
  { date: 'Aug 20', fasting: 98 },
  { date: 'Sep 3', fasting: 102 },
  { date: 'Sep 17', fasting: 105 },
  { date: 'Oct 1', fasting: 108 },
  { date: 'Oct 15', fasting: 110 },
  { date: 'Oct 29', fasting: 109 },
  { date: 'Nov 12', fasting: 110 },
  { date: 'Nov 18', fasting: 108 },
];

const loggedStepsData = [
  { date: 'Aug 20', steps: 7200 },
  { date: 'Sep 3', steps: 8500 },
  { date: 'Sep 17', steps: 9100 },
  { date: 'Oct 1', steps: 8800 },
  { date: 'Oct 15', steps: 7600 },
  { date: 'Oct 29', steps: 8200 },
  { date: 'Nov 12', steps: 8340 },
  { date: 'Nov 18', steps: 8650 },
];

export function HealthRecords() {
  const [activeView, setActiveView] = useState<'timeline' | 'daily-log'>('timeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [newEntry, setNewEntry] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [timelineRange, setTimelineRange] = useState<'1M' | '3M' | '6M' | '1Y'>('3M');
  const [timelineViewMode, setTimelineViewMode] = useState<'list' | 'analytics'>('list');
  const [showAISummary, setShowAISummary] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [aiSummary, setAiSummary] = useState('');
  const [summaryGenerated, setSummaryGenerated] = useState(false);
  const [selectedVitals, setSelectedVitals] = useState<string[]>(['cbc', 'bp', 'sugar']);
  const [showLogVitals, setShowLogVitals] = useState(false);
  const [showUploadReport, setShowUploadReport] = useState(false);
  const [showMyReports, setShowMyReports] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: 'doc1',
      name: 'Lab Report - Nov 2024.pdf',
      size: 1024000,
      type: 'application/pdf',
      uploadedAt: new Date().toISOString(),
      url: '/downloads/lab-report.pdf'
    }
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [newVitals, setNewVitals] = useState({
    heartRate: '',
    systolic: '',
    diastolic: '',
    glucose: '',
    temperature: '',
  });
  
  const [alertDialog, setAlertDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    type: 'success' | 'warning' | 'info' | 'emergency';
  }>({ open: false, title: '', message: '', type: 'info' });

  const showAppAlert = (title: string, message: string, type: 'success' | 'warning' | 'info' | 'emergency' = 'info') => {
    setAlertDialog({ open: true, title, message, type });
  };

  const handleLogVitals = () => {
    if (!newVitals.heartRate && !newVitals.systolic && !newVitals.glucose && !newVitals.temperature) {
      showAppAlert('Empty Form', 'Please enter at least one vital sign', 'warning');
      return;
    }

    const vitalsEntry: LogEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].slice(0, 5),
      type: 'vital',
      content: `HR: ${newVitals.heartRate || '-'} bpm, BP: ${newVitals.systolic}/${newVitals.diastolic} mmHg, Glucose: ${newVitals.glucose || '-'} mg/dL, Temp: ${newVitals.temperature || '-'}°C`,
      tags: ['logged', 'vital-signs'],
    };

    setLogs([vitalsEntry, ...logs]);
    setNewVitals({ heartRate: '', systolic: '', diastolic: '', glucose: '', temperature: '' });
    setShowLogVitals(false);
    showAppAlert('Vitals Logged', 'Your vital signs have been recorded successfully', 'success');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploaded = await uploadToS3(file);
      setUploadedFiles([uploaded, ...uploadedFiles]);
      showAppAlert('Upload Successful', `${file.name} uploaded to S3 bucket`, 'success');
      setShowUploadReport(false);
    } catch (error) {
      showAppAlert('Upload Failed', 'Could not upload file to S3', 'warning');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadFile = async (fileId: string, fileName: string) => {
    try {
      await downloadFromS3(fileId, fileName);
    } catch (error) {
      showAppAlert('Download Failed', 'Could not download file', 'warning');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lab':
      case 'vital':
        return Activity;
      case 'prescription':
      case 'medication':
        return Pill;
      case 'appointment':
        return Calendar;
      case 'imaging':
        return FileText;
      case 'symptom':
        return AlertCircle;
      case 'meal':
        return MessageSquare;
      case 'exercise':
        return TrendingUp;
      case 'mood':
        return MessageSquare;
      default:
        return MessageSquare;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lab':
      case 'vital':
        return 'from-cyan-500 to-blue-500';
      case 'prescription':
      case 'medication':
        return 'from-purple-500 to-pink-500';
      case 'appointment':
        return 'from-emerald-500 to-teal-500';
      case 'imaging':
        return 'from-orange-500 to-red-500';
      case 'symptom':
        return 'from-red-500 to-rose-500';
      case 'meal':
        return 'from-green-500 to-emerald-500';
      case 'exercise':
        return 'from-blue-500 to-indigo-500';
      case 'mood':
        return 'from-purple-500 to-violet-500';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const statusConfig = {
      normal: { color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: CheckCircle },
      monitor: { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', icon: AlertCircle },
      elevated: { color: 'bg-orange-500/20 text-orange-300 border-orange-500/30', icon: TrendingUp },
      active: { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: Clock },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${config.color}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleAddLog = () => {
    if (!newEntry.trim()) return;

    const now = new Date();
    const newLog: LogEntry = {
      id: Date.now().toString(),
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0].slice(0, 5),
      type: 'general',
      content: newEntry,
      tags: [],
    };

    setLogs([newLog, ...logs]);
    setNewEntry('');
  };

  const handleExportData = () => {
    // Export raw data as CSV
    const csvData = 'Date,Type,Value,Unit\n' +
      cbcTrendData.map(d => `${d.date},Hemoglobin,${d.hemoglobin},g/dL`).join('\n') + '\n' +
      bpTrendData.map(d => `${d.date},Blood Pressure,${d.systolic}/${d.diastolic},mmHg`).join('\n') + '\n' +
      sugarTrendData.map(d => `${d.date},Fasting Sugar,${d.fasting},mg/dL`).join('\n');
    
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-data-${timelineRange}.csv`;
    a.click();
  };

  const handleExportSummary = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 20;

    // Helper function to add new page if needed
    const checkPageBreak = (height: number) => {
      if (yPos + height > 280) {
        doc.addPage();
        yPos = 20;
      }
    };

    // Title
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Health Intelligence Report', pageWidth / 2, 25, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`, pageWidth / 2, 35, { align: 'center' });

    yPos = 55;
    doc.setTextColor(0, 0, 0);

    // Patient Info
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 25, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Patient: Rahul Sharma', margin + 5, yPos + 5);
    doc.setFont('helvetica', 'normal');
    doc.text('ABHA ID: rahul.sharma@abdm', margin + 5, yPos + 15);
    doc.text(`Report Period: ${timelineRange}`, pageWidth - margin - 60, yPos + 5);
    yPos += 35;

    // Section 1: CBC Trends
    checkPageBreak(60);
    doc.setFillColor(6, 182, 212); // cyan-500
    doc.rect(margin, yPos, 5, 20, 'F');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(6, 182, 212);
    doc.text('1. Complete Blood Count (CBC) Trends', margin + 10, yPos + 12);
    yPos += 25;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // CBC Table
    autoTable(doc, {
      startY: yPos,
      head: [['Parameter', 'Aug 26', 'Sep 15', 'Oct 10', 'Nov 20', 'Trend', 'Reference']],
      body: [
        ['Hemoglobin (g/dL)', '13.8', '14.0', '14.1', '14.2', '+2.9%', '13.5-17.5'],
        ['WBC (/μL)', '6,800', '7,000', '7,100', '7,200', '+5.9%', '4,000-11,000'],
        ['Platelets (/μL)', '245,000', '248,000', '250,000', '252,000', 'Stable', '150,000-400,000'],
      ],
      margin: { left: margin },
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [241, 245, 249] },
    });
    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Section 2: Blood Pressure Trends
    checkPageBreak(60);
    doc.setFillColor(249, 115, 22); // orange-500
    doc.rect(margin, yPos, 5, 20, 'F');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(249, 115, 22);
    doc.text('2. Blood Pressure Trends', margin + 10, yPos + 12);
    yPos += 25;
    doc.setTextColor(0, 0, 0);

    autoTable(doc, {
      startY: yPos,
      head: [['Date', 'Systolic (mmHg)', 'Diastolic (mmHg)', 'Status']],
      body: bpTrendData.map(d => [d.date, d.systolic.toString(), d.diastolic.toString(), d.systolic >= 130 ? 'Elevated' : 'Normal']),
      margin: { left: margin },
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [241, 245, 249] },
    });
    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Section 3: Blood Glucose
    checkPageBreak(60);
    doc.setFillColor(59, 130, 246); // blue-500
    doc.rect(margin, yPos, 5, 20, 'F');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text('3. Blood Glucose & Metabolic Markers', margin + 10, yPos + 12);
    yPos += 25;
    doc.setTextColor(0, 0, 0);

    autoTable(doc, {
      startY: yPos,
      head: [['Date', 'Fasting (mg/dL)', 'Status']],
      body: sugarTrendData.map(d => [d.date, d.fasting.toString(), d.fasting >= 100 ? 'Pre-diabetic' : 'Normal']),
      margin: { left: margin },
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [241, 245, 249] },
    });
    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Section 4: Key Trends Summary
    checkPageBreak(80);
    doc.setFillColor(139, 92, 246); // violet-500
    doc.rect(margin, yPos, 5, 20, 'F');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(139, 92, 246);
    doc.text('4. Summary of Key Trends', margin + 10, yPos + 12);
    yPos += 30;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);

    doc.setFont('helvetica', 'bold');
    doc.text('Stable Metrics:', margin, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.text('• Complete Blood Count parameters (all within normal range)', margin + 5, yPos);
    yPos += 6;
    doc.text('• HbA1c levels (stable at 6.1-6.2%)', margin + 5, yPos);
    yPos += 12;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(249, 115, 22);
    doc.text('Upward Trends (Require Attention):', margin, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text('• Blood Pressure: Systolic +6 mmHg, Diastolic +4 mmHg', margin + 5, yPos);
    yPos += 6;
    doc.text('• Fasting Glucose: +12 mg/dL (12.2% increase)', margin + 5, yPos);
    yPos += 6;
    doc.text('• Post-Meal Glucose: +18 mg/dL (13.3% increase)', margin + 5, yPos);
    yPos += 12;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(239, 68, 68); // red-500
    doc.text('Range Transitions:', margin, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text('• Blood Pressure: Normal → Elevated/Pre-hypertension', margin + 5, yPos);
    yPos += 6;
    doc.text('• Fasting Glucose: Normal → Pre-diabetic', margin + 5, yPos);
    yPos += 6;
    doc.text('• Post-Meal Glucose: Normal → Pre-diabetic', margin + 5, yPos);

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 290, { align: 'center' });
      doc.text('Thryve Health Intelligence Platform • Data from ABHA/ABDM verified sources', pageWidth / 2, 295, { align: 'center' });
    }

    // Save the PDF
    doc.save(`health-summary-${timelineRange}-${new Date().toISOString().split('T')[0]}.pdf`);
    showAppAlert('PDF Exported', 'Your health summary has been downloaded successfully!', 'success');
  };

  const handleGenerateAISummary = () => {
    setSummaryGenerated(false);
    setShowAISummary(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const summary = `**OBJECTIVE MEDICAL DATA SUMMARY**
**Patient:** Rahul Sharma (ABHA ID: rahul.sharma@abdm)
**Report Period:** ${timelineRange} (August 26, 2024 - November 26, 2024)
**Generated:** ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
**Reporting Period:** Last 3 Months

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**1. COMPLETE BLOOD COUNT (CBC) TRENDS**

Measurement Period: Aug 26 - Nov 20, 2024 (4 readings)

• Hemoglobin:
  - Aug 26: 13.8 g/dL
  - Sep 15: 14.0 g/dL
  - Oct 10: 14.1 g/dL
  - Nov 20: 14.2 g/dL
  - Trend: Progressive increase of 0.4 g/dL (2.9% rise)
  - Reference Range: 13.5-17.5 g/dL (Male)

• White Blood Cell Count:
  - Aug 26: 6,800/μL
  - Sep 15: 7,000/μL
  - Oct 10: 7,100/μL
  - Nov 20: 7,200/μL
  - Trend: Progressive increase of 400/μL (5.9% rise)
  - Reference Range: 4,000-11,000/μL

• Platelet Count:
  - Baseline: 245,000/μL → Current: 252,000/μL
  - Trend: Stable with minor fluctuation
  - Reference Range: 150,000-400,000/μL

Observation: All CBC parameters remain within normal reference ranges throughout the 3-month period.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**2. BLOOD PRESSURE TRENDS**

Measurement Period: Aug 22 - Nov 18, 2024 (8 readings)

• Systolic Blood Pressure:
  - Aug 22: 122 mmHg
  - Sep 5: 125 mmHg
  - Sep 18: 126 mmHg
  - Oct 2: 124 mmHg
  - Oct 15: 127 mmHg
  - Oct 28: 128 mmHg
  - Nov 10: 126 mmHg
  - Nov 18: 128 mmHg
  - 3-Month Average: 125.8 mmHg
  - Trend: Upward progression of 6 mmHg (4.9% increase)

• Diastolic Blood Pressure:
  - Aug 22: 78 mmHg
  - Nov 18: 82 mmHg
  - 3-Month Average: 80.5 mmHg
  - Trend: Upward progression of 4 mmHg (5.1% increase)

• Classification Observations:
  - Initial reading: Normal range (Aug 22)
  - Recent readings: Elevated/Pre-hypertension range (Oct-Nov)
  - Consistent upward trajectory observed over 3-month period

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**3. BLOOD GLUCOSE & METABOLIC MARKERS**

Measurement Period: Aug 20 - Nov 12, 2024 (7 readings)

• Fasting Blood Glucose:
  - Aug 20: 98 mg/dL
  - Sep 3: 102 mg/dL
  - Sep 17: 105 mg/dL
  - Oct 1: 108 mg/dL
  - Oct 15: 110 mg/dL
  - Oct 29: 109 mg/dL
  - Nov 12: 110 mg/dL
  - Trend: Progressive increase of 12 mg/dL (12.2% rise)
  - Reference: Normal <100 mg/dL, Pre-diabetic 100-125 mg/dL

• Post-Meal Blood Glucose:
  - Aug 20: 135 mg/dL
  - Nov 12: 153 mg/dL
  - Trend: Increase of 18 mg/dL (13.3% rise)
  - Reference: Normal <140 mg/dL, Pre-diabetic 140-199 mg/dL

• HbA1c (Glycated Hemoglobin):
  - Sep 17: 6.1%
  - Oct 29: 6.2%
  - Trend: Stable in pre-diabetic range (5.7-6.4%)
  - Reference: Normal <5.7%, Pre-diabetic 5.7-6.4%

Observation: Glucose levels crossed from normal to pre-diabetic range during the measurement period.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**4. LIPID PROFILE**

Date: November 5, 2024

• Total Cholesterol: 210 mg/dL (Desirable: <200 mg/dL)
• LDL Cholesterol: 140 mg/dL (Optimal: <100 mg/dL)
• HDL Cholesterol: 45 mg/dL (Optimal: >60 mg/dL)
• LDL/HDL Ratio: 3.1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**5. CURRENT MEDICATION REGIMEN**

As of November 15, 2024 (Prescribed by Dr. Anil Sharma, Max Healthcare):

• Metformin 500mg - Twice daily dosing
• Vitamin D3 - Daily supplement
• Patient-reported medication compliance: Good

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**6. CLINICAL ENCOUNTERS**

• Nov 10, 2024: Cardiology consultation - Hypertension management follow-up
• Nov 15, 2024: Prescription renewal

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**7. SUMMARY OF KEY TRENDS (L3M)**

Stable Metrics:
• Complete Blood Count parameters (all within normal range)
• HbA1c levels (stable at 6.1-6.2%)

Upward Trends:
• Blood Pressure: Systolic +6 mmHg, Diastolic +4 mmHg
• Fasting Glucose: +12 mg/dL (12.2% increase)
• Post-Meal Glucose: +18 mg/dL (13.3% increase)

Range Transitions:
• Blood Pressure: Normal → Elevated/Pre-hypertension
• Fasting Glucose: Normal → Pre-diabetic
• Post-Meal Glucose: Normal → Pre-diabetic

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**DATA SOURCES & VERIFICATION**

Laboratory Results:
• Apollo Diagnostics (ABHA/ABDM verified)
• SRL Diagnostics (ABHA/ABDM verified)

Vital Signs Monitoring:
• iHealth BP Monitor (Patient home device)
• Continuous glucose monitoring via patient logs

Clinical Records:
• Max Healthcare - Cardiology Department
• ABHA Health Records System

Patient-Reported Data:
• Daily health logs
• Medication adherence tracking

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This summary presents objective measurements and observed trends from verified health data sources over the specified 3-month period. All data points are sourced by ABHA/ABDM-integrated health records, certified diagnostic laboratories, and FDA-approved monitoring devices.`;
      
      setAiSummary(summary);
      setSummaryGenerated(true);
    }, 2000);
  };

  const handleCopySummary = () => {
    const textArea = document.createElement('textarea');
    textArea.value = aiSummary;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      textArea.remove();
      showAppAlert('Copied!', 'Summary copied to clipboard successfully.', 'success');
    } catch (err) {
      console.error('Failed to copy:', err);
      textArea.remove();
      showAppAlert('Copy Failed', 'Please manually select and copy the text from the summary above.', 'warning');
    }
  };

  const handleEmailSummary = () => {
    showAppAlert(
      'Email Summary',
      `This feature would open your email client with:\n\nTo: doctor@hospital.com\nSubject: Medical Summary for Rahul Sharma - ${timelineRange}\nBody: [AI-generated summary]`,
      'info'
    );
  };

  const getTrendDirection = (data: number[], latest: number) => {
    if (data.length < 2) return 'stable';
    const previous = data[data.length - 2];
    const change = ((latest - previous) / previous) * 100;
    if (change > 2) return 'up';
    if (change < -2) return 'down';
    return 'stable';
  };

  const getTrendIcon = (direction: string) => {
    if (direction === 'up') return <TrendingUp className="w-4 h-4 text-orange-400" />;
    if (direction === 'down') return <TrendingDown className="w-4 h-4 text-cyan-400" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
  };

  const filteredTimeline = timelineData.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || event.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="px-4 md:px-8 py-4 md:py-5">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div>
              <h1 className="text-white mb-1 text-xl md:text-3xl">Health Records</h1>
              <p className="text-slate-400 text-sm md:text-base">Your unified health timeline & daily logs</p>
            </div>
          </div>
        </div>
      </header>

      {/* View Toggle */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="flex gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-slate-700/50 w-fit">
          <button
            onClick={() => setActiveView('timeline')}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg transition-all duration-200 text-sm md:text-base ${
              activeView === 'timeline'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Medical Timeline
            </div>
          </button>
          <button
            onClick={() => setActiveView('daily-log')}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg transition-all duration-200 text-sm md:text-base ${
              activeView === 'daily-log'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Daily Log
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-8">
        {activeView === 'timeline' ? (
          <div className="space-y-6">
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search medical records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-500"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">All Records</option>
                <option value="lab">Lab Results</option>
                <option value="prescription">Prescriptions</option>
                <option value="vitals">Vitals</option>
                <option value="appointment">Appointments</option>
                <option value="imaging">Imaging</option>
              </select>
            </div>

            {/* Quick Actions Bar - Compact */}
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 rounded-xl p-3">
              <div className="flex items-center flex-wrap gap-2">
                <div className="flex items-center gap-1.5 mr-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="text-slate-400 text-xs font-medium">Quick Actions</span>
                </div>
                
                {/* Upload Report */}
                <button
                  onClick={() => setShowUploadReport(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/30 hover:border-cyan-500/50 rounded-lg transition-all group"
                >
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-slate-300 text-xs font-medium">Upload</span>
                </button>

                {/* My Reports */}
                <button
                  onClick={() => setShowMyReports(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/30 hover:border-orange-500/50 rounded-lg transition-all group"
                >
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileStack className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-slate-300 text-xs font-medium">My Reports</span>
                </button>

                {/* Sync ABHA */}
                <button
                  onClick={() => showAppAlert('Syncing Records', 'Syncing latest records from ABHA/ABDM health locker...', 'info')}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/30 hover:border-emerald-500/50 rounded-lg transition-all group"
                >
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <RefreshCw className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-slate-300 text-xs font-medium">Sync ABHA</span>
                </button>

                {/* Log Vitals */}
                <button
                  onClick={() => setActiveView('daily-log')}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/30 hover:border-pink-500/50 rounded-lg transition-all group"
                >
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Heart className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-slate-300 text-xs font-medium">Log Vitals</span>
                </button>

                {/* Generate AI Summary */}
                <button
                  onClick={handleGenerateAISummary}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/30 hover:border-purple-500/50 rounded-lg transition-all group"
                >
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-slate-300 text-xs font-medium">AI Summary</span>
                </button>
              </div>
            </div>

            {/* Medical Records - Lab Results L3M Trends */}
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              {/* Header with Timeline Selector and Export */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-semibold">Clinical Lab Results</h3>
                    <p className="text-slate-400 text-sm">From ABHA/ABDM health records • Last 3 months</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Timeline Range Selector */}
                  <div className="flex gap-1 bg-slate-800/50 p-1 rounded-lg border border-slate-700/30">
                    {['1M', '3M', '6M', '1Y'].map((range) => (
                      <button
                        key={range}
                        onClick={() => setTimelineRange(range as typeof timelineRange)}
                        className={`px-3 py-1 rounded-md text-xs transition-all ${
                          timelineRange === range
                            ? 'bg-cyan-500 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>

                  {/* Export Buttons */}
                  <Button
                    onClick={handleExportData}
                    className="bg-slate-700/50 hover:bg-slate-600/50 text-white border border-slate-600/50"
                    size="sm"
                  >
                    <FileDown className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button
                    onClick={handleExportSummary}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Summary
                  </Button>
                </div>
              </div>

              {/* Trends Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* CBC Trends */}
                <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-medium">Complete Blood Count</h4>
                    {getTrendIcon(getTrendDirection(cbcTrendData.map(d => d.hemoglobin), cbcTrendData[cbcTrendData.length - 1].hemoglobin))}
                  </div>
                  
                  <div className="h-48 mb-4" style={{ minHeight: '192px' }}>
                    <ResponsiveContainer width="100%" height={192}>
                      <LineChart data={cbcTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                        <YAxis stroke="#94a3b8" fontSize={10} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                          }}
                        />
                        <Line type="monotone" dataKey="hemoglobin" stroke="#22d3ee" strokeWidth={2} dot={{ fill: '#22d3ee', r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs">Hemoglobin</span>
                      <span className="text-white text-sm font-semibold">14.2 g/dL</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs">WBC Count</span>
                      <span className="text-white text-sm font-semibold">7,200/μL</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs">Status</span>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
                        Normal
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Lipid Panel Trends */}
                <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-medium">Lipid Panel</h4>
                    {getTrendIcon(getTrendDirection(lipidTrendData.map(d => d.totalCholesterol), lipidTrendData[lipidTrendData.length - 1].totalCholesterol))}
                  </div>
                  
                  <div className="h-48 mb-4" style={{ minHeight: '192px' }}>
                    <ResponsiveContainer width="100%" height={192}>
                      <LineChart data={lipidTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                        <YAxis stroke="#94a3b8" fontSize={10} domain={[40, 220]} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                          }}
                        />
                        <Line type="monotone" dataKey="totalCholesterol" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 4 }} />
                        <Line type="monotone" dataKey="ldl" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} />
                        <Line type="monotone" dataKey="hdl" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs">Total Cholesterol</span>
                      <span className="text-white text-sm font-semibold">210 mg/dL</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs">LDL / HDL</span>
                      <span className="text-white text-sm font-semibold">140 / 45 mg/dL</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs">Status</span>
                      <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs">
                        Elevated
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Blood Sugar Trends */}
                <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-medium">Blood Sugar</h4>
                    {getTrendIcon(getTrendDirection(sugarTrendData.map(d => d.fasting), sugarTrendData[sugarTrendData.length - 1].fasting))}
                  </div>
                  
                  <div className="h-48 mb-4" style={{ minHeight: '192px' }}>
                    <ResponsiveContainer width="100%" height={192}>
                      <LineChart data={sugarTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                        <YAxis stroke="#94a3b8" fontSize={10} domain={[90, 160]} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                          }}
                        />
                        <Line type="monotone" dataKey="fasting" stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7', r: 4 }} />
                        <Line type="monotone" dataKey="postMeal" stroke="#ec4899" strokeWidth={2} dot={{ fill: '#ec4899', r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs">Fasting</span>
                      <span className="text-white text-sm font-semibold">110 mg/dL</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs">HbA1c</span>
                      <span className="text-white text-sm font-semibold">6.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs">Status</span>
                      <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs">
                        Pre-Diabetic
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Insights Summary */}
              <div className="mt-6 p-3 md:p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <div className="flex items-start gap-2 md:gap-3">
                  <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-blue-300 font-medium mb-1 text-sm">L3M Clinical Summary</h5>
                    <p className="text-slate-300 text-xs md:text-sm">
                      CBC stable and within normal range. Blood sugar in pre-diabetic range (HbA1c 6.2%). Lipid panel shows elevated cholesterol (210 mg/dL) and LDL (140 mg/dL).
                    </p>
                  </div>
                  <Button
                    onClick={handleGenerateAISummary}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white whitespace-nowrap flex-shrink-0"
                    size="sm"
                  >
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                    <span className="hidden md:inline">AI Summary</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* VITALS LOGGED - Manual/Device Entries */}
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              {/* Header with Timeline Selector and Export */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-semibold">Vitals Logged</h3>
                    <p className="text-slate-400 text-sm">Manual entries & device readings • Last 3 months</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Timeline Range Selector */}
                  <div className="flex gap-1 bg-slate-800/50 p-1 rounded-lg border border-slate-700/30">
                    {['1M', '3M', '6M', '1Y'].map((range) => (
                      <button
                        key={range}
                        onClick={() => setTimelineRange(range as typeof timelineRange)}
                        className={`px-3 py-1 rounded-md text-xs transition-all ${
                          timelineRange === range
                            ? 'bg-cyan-500 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>

                  {/* Export Buttons */}
                  <Button
                    onClick={handleExportData}
                    className="bg-slate-700/50 hover:bg-slate-600/50 text-white border border-slate-600/50"
                    size="sm"
                  >
                    <FileDown className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button
                    onClick={handleExportSummary}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Summary
                  </Button>
                </div>
              </div>

              {/* Vitals Grid - 3 Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Blood Pressure */}
                <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-medium">Blood Pressure</h4>
                    {getTrendIcon(getTrendDirection(loggedBPData.map(d => d.systolic), loggedBPData[loggedBPData.length - 1].systolic))}
                  </div>
                  
                  <div className="h-48 mb-4" style={{ minHeight: '192px' }}>
                    <ResponsiveContainer width="100%" height={192}>
                      <AreaChart data={loggedBPData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                        <YAxis stroke="#94a3b8" fontSize={10} domain={[70, 140]} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                          }}
                        />
                        <Area type="monotone" dataKey="systolic" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                        <Area type="monotone" dataKey="diastolic" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs">Latest Reading</span>
                      <span className="text-white text-sm font-semibold">128/82 mmHg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs">Avg (L3M)</span>
                      <span className="text-white text-sm font-semibold">126/81 mmHg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs">Status</span>
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">
                        Monitor
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Blood Glucose */}
                <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-medium">Blood Glucose</h4>
                    {getTrendIcon(getTrendDirection(loggedGlucoseData.map(d => d.fasting), loggedGlucoseData[loggedGlucoseData.length - 1].fasting))}
                  </div>
                  
                  <div className="h-48 mb-4" style={{ minHeight: '192px' }}>
                    <ResponsiveContainer width="100%" height={192}>
                      <LineChart data={loggedGlucoseData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                        <YAxis stroke="#94a3b8" fontSize={10} domain={[90, 120]} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                          }}
                        />
                        <Line type="monotone" dataKey="fasting" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs">Latest Fasting</span>
                      <span className="text-white text-sm font-semibold">108 mg/dL</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs">Avg (L3M)</span>
                      <span className="text-white text-sm font-semibold">106 mg/dL</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs">Status</span>
                      <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs">
                        Pre-Diabetic
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Daily Steps */}
                <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-medium">Daily Steps</h4>
                    {getTrendIcon(getTrendDirection(loggedStepsData.map(d => d.steps), loggedStepsData[loggedStepsData.length - 1].steps))}
                  </div>
                  
                  <div className="h-48 mb-4" style={{ minHeight: '192px' }}>
                    <ResponsiveContainer width="100%" height={192}>
                      <BarChart data={loggedStepsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                        <YAxis stroke="#94a3b8" fontSize={10} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                          }}
                        />
                        <Bar dataKey="steps" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs">Latest Count</span>
                      <span className="text-white text-sm font-semibold">8,650</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs">Avg (L3M)</span>
                      <span className="text-white text-sm font-semibold">8,398/day</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs">Status</span>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Insights Summary */}
              <div className="mt-6 p-3 md:p-4 bg-cyan-900/20 border border-cyan-700/30 rounded-xl">
                <div className="flex items-start gap-2 md:gap-3">
                  <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-cyan-300 font-medium mb-1 text-sm">L3M Manual Logs Summary</h5>
                    <p className="text-slate-300 text-xs md:text-sm">
                      BP averaging 126/81 mmHg (monitor zone). Blood glucose averaging 106 mg/dL (pre-diabetic). Daily steps: 8,398 avg (meeting activity goals).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Summary Modal */}
            {showAISummary && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white text-lg font-semibold">AI-Generated Medical Summary</h3>
                        <p className="text-slate-400 text-sm">For {timelineRange} Timeline Period</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAISummary(false)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Content */}
                  {!summaryGenerated ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin mb-4" />
                      <p className="text-white font-medium">Generating AI Summary...</p>
                      <p className="text-slate-400 text-sm mt-2">Analyzing {timelineRange} of health data</p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-slate-800/50 rounded-xl p-6 space-y-4">
                        <div>
                          <h4 className="text-white font-medium mb-2">Overview</h4>
                          <p className="text-slate-300 text-sm leading-relaxed">
                            Based on your health records from the past {timelineRange.toLowerCase()}, your CBC levels are within normal range with hemoglobin at 14.2 g/dL. Blood sugar shows pre-diabetic patterns with HbA1c at 6.2%. Lipid panel indicates elevated cholesterol (210 mg/dL) and LDL (140 mg/dL) requiring attention.
                          </p>
                        </div>

                        <div>
                          <h4 className="text-white font-medium mb-2">Recommendations</h4>
                          <ul className="text-slate-300 text-sm space-y-2">
                            <li>• Consult with your physician about lipid management strategies</li>
                            <li>• Consider dietary modifications to improve blood sugar control</li>
                            <li>• Continue monitoring vitals and maintain physical activity</li>
                            <li>• Schedule follow-up labs in 3 months to track progress</li>
                          </ul>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="space-y-4">
              {filteredTimeline.map((event, index) => {
                const Icon = getTypeIcon(event.type);
                const colorClass = getTypeColor(event.type);

                return (
                  <div
                    key={event.id}
                    className="bg-slate-900/50 border border-slate-700/50 rounded-xl md:rounded-2xl p-4 md:p-6 hover:border-slate-600/50 transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <h3 className="text-white text-base md:text-lg font-medium mb-1">{event.title}</h3>
                            <p className="text-slate-400 text-sm">{event.details}</p>
                          </div>
                          {getStatusBadge(event.status)}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {event.source}
                          </span>
                          {event.fileUrl && (
                            <>
                              <span>•</span>
                              <a
                                href={event.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                              >
                                <Download className="w-3 h-3" />
                                View Report
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <DailyLog />
        )}
      </div>

      {/* AI Summary Modal */}
      {showAISummary && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">AI-Generated Medical Summary</h3>
                  <p className="text-slate-400 text-xs mt-0.5">Last {timelineRange} • Data-verified report</p>
                </div>
              </div>
              <button
                onClick={() => setShowAISummary(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {!summaryGenerated ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 animate-pulse">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <p className="text-white font-medium mb-2">Generating comprehensive medical summary...</p>
                <p className="text-slate-400 text-sm text-center max-w-md">
                  Analyzing {timelineRange} of lab results, vitals, prescriptions, and clinical encounters
                </p>
              </div>
            ) : (
              <>
                <div className="bg-slate-950/50 rounded-xl p-6 mb-4 border border-slate-700/30">
                  <pre className="text-slate-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                    {aiSummary}
                  </pre>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleCopySummary}
                    className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Summary
                  </Button>
                  <Button
                    onClick={handleEmailSummary}
                    className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                  >
                    <Mail className="w-4 h-4" />
                    Email to Doctor
                  </Button>
                  <Button
                    onClick={handleExportSummary}
                    className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white"
                  >
                    <FileDown className="w-4 h-4" />
                    Export PDF
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Log Vitals Modal */}
      {showLogVitals && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                <h3 className="text-white font-semibold">Log Vital Signs</h3>
              </div>
              <button onClick={() => setShowLogVitals(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-slate-300 text-sm">Heart Rate (bpm)</label>
                <Input type="number" placeholder="e.g., 72" value={newVitals.heartRate} onChange={(e) => setNewVitals({...newVitals, heartRate: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 text-sm">Systolic (mmHg)</label>
                  <Input type="number" placeholder="e.g., 120" value={newVitals.systolic} onChange={(e) => setNewVitals({...newVitals, systolic: e.target.value})} />
                </div>
                <div>
                  <label className="text-slate-300 text-sm">Diastolic (mmHg)</label>
                  <Input type="number" placeholder="e.g., 80" value={newVitals.diastolic} onChange={(e) => setNewVitals({...newVitals, diastolic: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-slate-300 text-sm">Blood Glucose (mg/dL)</label>
                <Input type="number" placeholder="e.g., 100" value={newVitals.glucose} onChange={(e) => setNewVitals({...newVitals, glucose: e.target.value})} />
              </div>
              <div>
                <label className="text-slate-300 text-sm">Temperature (°C)</label>
                <Input type="number" placeholder="e.g., 37" step="0.1" value={newVitals.temperature} onChange={(e) => setNewVitals({...newVitals, temperature: e.target.value})} />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={() => setShowLogVitals(false)} variant="outline" className="flex-1">Cancel</Button>
              <Button onClick={handleLogVitals} className="flex-1 bg-green-600 hover:bg-green-700">Save Vitals</Button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Report Modal */}
      {showUploadReport && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-400" />
                <h3 className="text-white font-semibold">Upload Medical Report</h3>
              </div>
              <button onClick={() => setShowUploadReport(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Upload Section */}
            <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-cyan-500/50 transition-colors cursor-pointer">
              <input type="file" id="file-upload" accept=".pdf,.jpg,.png,.doc,.docx" onChange={handleFileUpload} disabled={isUploading} style={{ display: 'none' }} />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-7 h-7 text-cyan-400" />
                </div>
                <p className="text-white font-medium">Click to upload</p>
                <p className="text-slate-400 text-xs mt-1">or drag and drop</p>
                <p className="text-slate-500 text-xs mt-3">Supported: PDF, JPG, PNG, DOC (max 10MB)</p>
              </label>
              {isUploading && (
                <div className="mt-4">
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                  <p className="text-cyan-400 text-sm mt-2">Uploading to S3...</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={() => setShowUploadReport(false)} variant="outline" className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* My Reports Modal */}
      {showMyReports && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileStack className="w-5 h-5 text-orange-400" />
                <h3 className="text-white font-semibold">My Reports</h3>
                <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">{uploadedFiles.length}</Badge>
              </div>
              <button onClick={() => setShowMyReports(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-400 text-sm mb-4">Your uploaded medical reports stored in S3</p>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {uploadedFiles.length > 0 ? (
                uploadedFiles.map((file) => (
                  <div key={file.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center justify-between hover:border-slate-600 transition-colors">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <File className="w-5 h-5 text-orange-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-sm font-medium truncate">{file.name}</p>
                        <p className="text-slate-500 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.uploadedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleDownloadFile(file.id, file.name)} className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                    <FileStack className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-slate-400 text-sm">No reports uploaded yet</p>
                  <p className="text-slate-500 text-xs mt-1">Upload your first report using the Upload button</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={() => setShowMyReports(false)} variant="outline" className="flex-1">Close</Button>
              <Button onClick={() => { setShowMyReports(false); setShowUploadReport(true); }} className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500">
                <Upload className="w-4 h-4 mr-2" />
                Upload New
              </Button>
            </div>
          </div>
        </div>
      )}

      <AppAlert
        open={alertDialog.open}
        onClose={() => setAlertDialog(prev => ({ ...prev, open: false }))}
        title={alertDialog.title}
        message={alertDialog.message}
        type={alertDialog.type}
      />
    </div>
  );
}