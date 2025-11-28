import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import {
  Plus,
  Pill,
  Droplet,
  Activity,
  UtensilsCrossed,
  Moon,
  Dumbbell,
  Calendar,
  Stethoscope,
  Bell,
  Sparkles,
  Clock,
  Repeat,
  ChevronRight,
  X,
  Check,
  Mail,
  Copy,
  Send,
  Edit3,
  Trash2,
} from 'lucide-react';

interface Routine {
  id: string;
  name: string;
  templateId: string;
  frequency: string;
  startDate: string;
  time?: string;
  reminderEnabled: boolean;
  reminderTime?: string;
  enabled: boolean;
  icon: any;
  color: string;
  emailBody?: string;
  doctorEmail?: string;
}

const routineTemplates = [
  {
    id: 'medication',
    name: 'Medication Reminder',
    icon: Pill,
    color: 'from-indigo-500 to-purple-500',
    description: 'Get reminded to take meds on time',
    category: 'health',
    hasEmail: false,
  },
  {
    id: 'vitals-log',
    name: 'Log Vitals (BP/Sugar/Weight)',
    icon: Activity,
    color: 'from-orange-500 to-red-500',
    description: 'Daily vitals tracking reminders',
    category: 'health',
    hasEmail: false,
  },
  {
    id: 'hydration',
    name: 'Hydration Reminder',
    icon: Droplet,
    color: 'from-blue-500 to-cyan-500',
    description: 'Stay hydrated throughout the day',
    category: 'health',
    hasEmail: false,
  },
  {
    id: 'exercise',
    name: 'Exercise Routine',
    icon: Dumbbell,
    color: 'from-cyan-500 to-blue-500',
    description: 'Daily movement reminders',
    category: 'health',
    hasEmail: false,
  },
  {
    id: 'meal-log',
    name: 'Meal Logging',
    icon: UtensilsCrossed,
    color: 'from-green-500 to-emerald-500',
    description: 'Log your meals and nutrition',
    category: 'health',
    hasEmail: false,
  },
  {
    id: 'sleep',
    name: 'Sleep Reminder',
    icon: Moon,
    color: 'from-violet-500 to-purple-500',
    description: 'Wind-down for better sleep',
    category: 'health',
    hasEmail: false,
  },
  {
    id: 'doctor-report',
    name: 'Doctor Report Email',
    icon: Mail,
    color: 'from-pink-500 to-rose-500',
    description: 'Auto-send health summary to doctor',
    category: 'automation',
    hasEmail: true,
  },
  {
    id: 'appointment',
    name: 'Appointment Reminder',
    icon: Calendar,
    color: 'from-purple-500 to-pink-500',
    description: 'Never miss doctor visits',
    category: 'automation',
    hasEmail: false,
  },
];

const defaultEmailTemplate = `Dear Dr. {{doctor_name}},

I hope this message finds you well. Please find my health summary below for your review.

{{AI_GENERATED_SUMMARY}}

Please let me know if you need any additional information or if we should schedule a follow-up appointment.

Best regards,
{{patient_name}}`;

export function Routines() {
  const [activeRoutines, setActiveRoutines] = useState<Routine[]>([
    {
      id: '1',
      name: 'Morning Metformin',
      templateId: 'medication',
      frequency: 'daily',
      startDate: '2024-01-01',
      time: '08:00',
      reminderEnabled: true,
      reminderTime: '07:45',
      enabled: true,
      icon: Pill,
      color: 'from-indigo-500 to-purple-500',
    },
    {
      id: '2',
      name: 'Weekly Doctor Report',
      templateId: 'doctor-report',
      frequency: 'weekly',
      startDate: '2024-01-01',
      reminderEnabled: true,
      enabled: true,
      icon: Mail,
      color: 'from-pink-500 to-rose-500',
      emailBody: defaultEmailTemplate,
      doctorEmail: 'doctor@example.com',
    },
  ]);

  const [showSetupModal, setShowSetupModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [editingRoutineId, setEditingRoutineId] = useState<string | null>(null);
  const [setupData, setSetupData] = useState({
    name: '',
    frequency: 'daily',
    startDate: new Date().toISOString().split('T')[0],
    time: '09:00',
    reminderEnabled: true,
    reminderTime: '08:45',
    emailBody: defaultEmailTemplate,
    doctorEmail: '',
  });

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setSetupData({
      ...setupData,
      name: template.name,
      emailBody: template.hasEmail ? defaultEmailTemplate : '',
    });
    setShowSetupModal(true);
  };

  const handleEditRoutine = (routine: Routine) => {
    const template = routineTemplates.find((t) => t.id === routine.templateId);
    setSelectedTemplate(template);
    setEditingRoutineId(routine.id);
    setSetupData({
      name: routine.name,
      frequency: routine.frequency,
      startDate: routine.startDate,
      time: routine.time || '09:00',
      reminderEnabled: routine.reminderEnabled,
      reminderTime: routine.reminderTime || '08:45',
      emailBody: routine.emailBody || defaultEmailTemplate,
      doctorEmail: routine.doctorEmail || '',
    });
    setShowSetupModal(true);
  };

  const handleSaveRoutine = () => {
    if (editingRoutineId) {
      // Update existing routine
      setActiveRoutines(
        activeRoutines.map((r) =>
          r.id === editingRoutineId
            ? {
                ...r,
                name: setupData.name,
                frequency: setupData.frequency,
                startDate: setupData.startDate,
                time: setupData.time,
                reminderEnabled: setupData.reminderEnabled,
                reminderTime: setupData.reminderTime,
                emailBody: selectedTemplate.hasEmail ? setupData.emailBody : undefined,
                doctorEmail: selectedTemplate.hasEmail ? setupData.doctorEmail : undefined,
              }
            : r
        )
      );
    } else {
      // Create new routine
      const newRoutine: Routine = {
        id: Date.now().toString(),
        name: setupData.name,
        templateId: selectedTemplate.id,
        frequency: setupData.frequency,
        startDate: setupData.startDate,
        time: setupData.time,
        reminderEnabled: setupData.reminderEnabled,
        reminderTime: setupData.reminderTime,
        enabled: true,
        icon: selectedTemplate.icon,
        color: selectedTemplate.color,
        emailBody: selectedTemplate.hasEmail ? setupData.emailBody : undefined,
        doctorEmail: selectedTemplate.hasEmail ? setupData.doctorEmail : undefined,
      };
      setActiveRoutines([...activeRoutines, newRoutine]);
    }
    setShowSetupModal(false);
    setSelectedTemplate(null);
    setEditingRoutineId(null);
    setSetupData({
      name: '',
      frequency: 'daily',
      startDate: new Date().toISOString().split('T')[0],
      time: '09:00',
      reminderEnabled: true,
      reminderTime: '08:45',
      emailBody: defaultEmailTemplate,
      doctorEmail: '',
    });
  };

  const toggleRoutine = (id: string) => {
    setActiveRoutines(
      activeRoutines.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const deleteRoutine = (id: string) => {
    setActiveRoutines(activeRoutines.filter((r) => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-8">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="px-4 md:px-6 py-3 md:py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-white mb-0.5">Routines & Automations</h1>
              <p className="text-slate-400 text-sm">
                Set up health reminders and automations
              </p>
            </div>
            <Button
              onClick={() => setShowSetupModal(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm px-4 py-2 h-auto"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              New
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-4 space-y-4">
        {/* Active Routines */}
        {activeRoutines.length > 0 && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white text-sm font-medium">Active Routines</h3>
              <span className="text-slate-500 text-xs">
                {activeRoutines.filter((r) => r.enabled).length} of {activeRoutines.length} enabled
              </span>
            </div>

            <div className="space-y-2">
              {activeRoutines.map((routine) => {
                const Icon = routine.icon;
                return (
                  <div
                    key={routine.id}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-3 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg bg-gradient-to-br ${routine.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="text-white text-sm font-medium">{routine.name}</h4>
                          <button
                            onClick={() => toggleRoutine(routine.id)}
                            className="flex-shrink-0"
                          >
                            {routine.enabled ? (
                              <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded-md">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                <span className="text-green-300 text-xs">ON</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-800 border border-slate-700 rounded-md">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                <span className="text-slate-400 text-xs">OFF</span>
                              </div>
                            )}
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-2">
                          <div className="flex items-center gap-1">
                            <Repeat className="w-3 h-3" />
                            <span className="capitalize">{routine.frequency}</span>
                          </div>
                          {routine.time && (
                            <>
                              <span className="text-slate-600">•</span>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{routine.time}</span>
                              </div>
                            </>
                          )}
                          {routine.reminderEnabled && (
                            <>
                              <span className="text-slate-600">•</span>
                              <div className="flex items-center gap-1">
                                <Bell className="w-3 h-3" />
                                <span>Reminder at {routine.reminderTime}</span>
                              </div>
                            </>
                          )}
                        </div>

                        {routine.emailBody && (
                          <div className="mt-2 pt-2 border-t border-slate-800">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Mail className="w-3 h-3 text-pink-400" />
                                <span className="text-xs text-slate-400">Sending to:</span>
                                <span className="text-xs text-pink-300 font-medium">
                                  {routine.doctorEmail || 'No email set'}
                                </span>
                              </div>
                            </div>
                            <div className="bg-slate-800/50 rounded p-2 text-xs text-slate-400 font-mono max-h-20 overflow-y-auto">
                              {routine.emailBody.split('\n').slice(0, 4).join('\n')}...
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                onClick={() => handleEditRoutine(routine)}
                                variant="ghost"
                                className="text-xs h-auto py-1 px-2 text-slate-400 hover:text-white"
                              >
                                <Edit3 className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                className="text-xs h-auto py-1 px-2 text-slate-400 hover:text-white"
                              >
                                <Send className="w-3 h-3 mr-1" />
                                Test Send
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => deleteRoutine(routine.id)}
                        className="flex-shrink-0 text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Template Library */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h3 className="text-white text-sm font-medium">Template Library</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {routineTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className="text-left bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/30 rounded-lg p-3 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="text-white text-sm font-medium">{template.name}</h4>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors flex-shrink-0" />
                      </div>
                      <p className="text-slate-400 text-xs">{template.description}</p>
                      {template.hasEmail && (
                        <Badge className="mt-2 bg-pink-500/20 text-pink-300 border-pink-500/30 text-xs px-1.5 py-0">
                          <Mail className="w-2.5 h-2.5 mr-0.5" />
                          Email
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white text-sm font-medium mb-1">Pro Tip</h4>
              <p className="text-purple-300/80 text-xs">
                Use the Doctor Report Email automation to automatically send weekly health summaries
                to your healthcare provider. You can customize the email template to include the
                metrics that matter most.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Setup Modal */}
      {showSetupModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-4 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white font-medium">
                    {selectedTemplate ? 'Setup Routine' : 'Choose Template'}
                  </h2>
                  <p className="text-slate-400 text-xs">
                    {selectedTemplate
                      ? 'Configure your routine details'
                      : 'Select a template to get started'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowSetupModal(false);
                    setSelectedTemplate(null);
                  }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {!selectedTemplate ? (
                /* Template Selection */
                <div className="grid md:grid-cols-2 gap-3">
                  {routineTemplates.map((template) => {
                    const Icon = template.icon;
                    return (
                      <button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className="text-left bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 rounded-lg p-3 transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center flex-shrink-0`}
                          >
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white text-sm font-medium mb-0.5">
                              {template.name}
                            </h4>
                            <p className="text-slate-400 text-xs">{template.description}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 flex-shrink-0" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Configuration Form */
                <>
                  {/* Selected Template Badge */}
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg bg-gradient-to-br ${selectedTemplate.color} flex items-center justify-center`}
                      >
                        <selectedTemplate.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white text-sm font-medium">{selectedTemplate.name}</h4>
                        <p className="text-purple-300 text-xs">{selectedTemplate.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="text-slate-300 text-xs font-medium mb-1.5 block">
                      Routine Name
                    </label>
                    <input
                      type="text"
                      value={setupData.name}
                      onChange={(e) => setSetupData({ ...setupData, name: e.target.value })}
                      placeholder="e.g., Morning Metformin"
                      className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500/50"
                    />
                  </div>

                  {/* Frequency */}
                  <div>
                    <label className="text-slate-300 text-xs font-medium mb-1.5 block">
                      Frequency
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {['daily', 'weekly', 'monthly', 'custom'].map((freq) => (
                        <button
                          key={freq}
                          onClick={() => setSetupData({ ...setupData, frequency: freq })}
                          className={`py-2 rounded-lg text-xs font-medium transition-all ${
                            setupData.frequency === freq
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                          }`}
                        >
                          {freq.charAt(0).toUpperCase() + freq.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="text-slate-300 text-xs font-medium mb-1.5 block">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={setupData.startDate}
                      onChange={(e) => setSetupData({ ...setupData, startDate: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500/50"
                    />
                  </div>

                  {/* Time (if not email automation) */}
                  {!selectedTemplate.hasEmail && (
                    <div>
                      <label className="text-slate-300 text-xs font-medium mb-1.5 block">
                        Time
                      </label>
                      <input
                        type="time"
                        value={setupData.time}
                        onChange={(e) => setSetupData({ ...setupData, time: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500/50"
                      />
                    </div>
                  )}

                  {/* Reminder Options */}
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-cyan-400" />
                        <span className="text-white text-sm font-medium">Reminder</span>
                      </div>
                      <button
                        onClick={() =>
                          setSetupData({
                            ...setupData,
                            reminderEnabled: !setupData.reminderEnabled,
                          })
                        }
                        className={`w-11 h-6 rounded-full transition-all ${
                          setupData.reminderEnabled
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                            : 'bg-slate-700'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full transition-transform ${
                            setupData.reminderEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {setupData.reminderEnabled && (
                      <div>
                        <label className="text-slate-400 text-xs mb-1.5 block">
                          Remind me at
                        </label>
                        <input
                          type="time"
                          value={setupData.reminderTime}
                          onChange={(e) =>
                            setSetupData({ ...setupData, reminderTime: e.target.value })
                          }
                          className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500/50"
                        />
                      </div>
                    )}
                  </div>

                  {/* Email Body Editor (for email automations) */}
                  {selectedTemplate.hasEmail && (
                    <>
                      {/* Doctor Email */}
                      <div>
                        <label className="text-slate-300 text-xs font-medium mb-1.5 block">
                          Doctor's Email
                        </label>
                        <input
                          type="email"
                          value={setupData.doctorEmail}
                          onChange={(e) => setSetupData({ ...setupData, doctorEmail: e.target.value })}
                          placeholder="doctor@example.com"
                          className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500/50"
                        />
                        <p className="text-slate-500 text-xs mt-1">
                          Email will be sent to this address automatically
                        </p>
                      </div>

                      <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-slate-300 text-xs font-medium">
                          Email Template
                        </label>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            className="text-xs h-auto py-1 px-2 text-slate-400 hover:text-white"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                          <Button
                            variant="ghost"
                            className="text-xs h-auto py-1 px-2 text-slate-400 hover:text-white"
                          >
                            Reset
                          </Button>
                        </div>
                      </div>
                      
                      {/* AI Auto-generation Note */}
                      <div className="mb-3 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-cyan-300 text-xs font-medium mb-1">
                              AI-Powered Smart Summary
                            </p>
                            <p className="text-cyan-300/80 text-xs leading-relaxed">
                              Just customize the greeting and closing. The AI agent will automatically generate a comprehensive health summary based on your selected frequency:
                            </p>
                            <ul className="text-cyan-300/80 text-xs mt-2 space-y-1 ml-4">
                              <li className="flex items-center gap-1.5">
                                <div className="w-1 h-1 rounded-full bg-cyan-400" />
                                <span><span className="font-medium">Weekly:</span> Last 7 days of health data</span>
                              </li>
                              <li className="flex items-center gap-1.5">
                                <div className="w-1 h-1 rounded-full bg-cyan-400" />
                                <span><span className="font-medium">Monthly:</span> Last 30 days of health data</span>
                              </li>
                              <li className="flex items-center gap-1.5">
                                <div className="w-1 h-1 rounded-full bg-cyan-400" />
                                <span><span className="font-medium">Daily:</span> Last 24 hours of health data</span>
                              </li>
                            </ul>
                            <p className="text-cyan-300/80 text-xs mt-2">
                              The AI will include vitals, trends, insights, and key observations automatically.
                            </p>
                          </div>
                        </div>
                      </div>

                      <Textarea
                        value={setupData.emailBody}
                        onChange={(e) => setSetupData({ ...setupData, emailBody: e.target.value })}
                        className="bg-slate-800 border-slate-700 text-white text-xs font-mono min-h-[200px] resize-none"
                        placeholder="Customize your email greeting and closing..."
                      />
                      <p className="text-slate-500 text-xs mt-2">
                        <span className="font-medium">Available variables:</span> {`{{doctor_name}}`}, {`{{patient_name}}`}
                        <br />
                        <span className="font-medium text-cyan-400">AI auto-fills:</span> {`{{AI_GENERATED_SUMMARY}}`} with complete health data
                      </p>
                    </div>
                    </>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      onClick={() => {
                        setSelectedTemplate(null);
                        setSetupData({
                          name: '',
                          frequency: 'daily',
                          startDate: new Date().toISOString().split('T')[0],
                          time: '09:00',
                          reminderEnabled: true,
                          reminderTime: '08:45',
                          emailBody: defaultEmailTemplate,
                          doctorEmail: '',
                        });
                      }}
                      variant="outline"
                      className="flex-1 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleSaveRoutine}
                      disabled={!setupData.name.trim()}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white disabled:opacity-50"
                    >
                      <Check className="w-4 h-4 mr-1.5" />
                      Create Routine
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}