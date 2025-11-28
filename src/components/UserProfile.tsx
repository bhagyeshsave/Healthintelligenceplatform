import { QrCode, Edit, Watch, Shield, Bell, Share2, Heart, AlertCircle, User, Phone, Mail, Calendar, Droplet, Ruler, Weight, Check, Plus, Activity, Search, Zap, Clock, AlertTriangle, MapPin, FileText } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { GoogleFitIntegration } from './GoogleFitIntegration';

export function UserProfile() {
  const [showQR, setShowQR] = useState(false);
  const [showIntegrationsDialog, setShowIntegrationsDialog] = useState(false);
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [emergencyContacts, setEmergencyContacts] = useState({
    primary: {
      name: 'Priya Sharma',
      relation: 'Spouse',
      phone: '+91 98765 43211',
    },
    secondary: {
      name: 'Amit Sharma',
      relation: 'Brother',
      phone: '+91 98765 43222',
    }
  });

  const profile = {
    name: 'Rahul Sharma',
    abhaId: 'rahul.sharma@abdm',
    email: 'rahul.sharma@email.com',
    phone: '+91 98765 43210',
    dateOfBirth: '1989-05-15',
    gender: 'Male',
    bloodGroup: 'A+',
    height: 175,
    weight: 78,
    emergencyContact: {
      name: 'Priya Sharma',
      relation: 'Spouse',
      phone: '+91 98765 43211',
    },
  };

  const connectedDevices = [
    { 
      name: 'ABHA / ABDM', 
      type: 'National Health Records', 
      status: 'Connected', 
      lastSync: '2 hours ago',
      logo: '🏥',
      color: 'from-blue-500 to-indigo-600',
      category: 'popular',
      isPrimary: true // Flag for ABHA
    },
    { 
      name: 'Google Fit', 
      type: 'Activity & Health Tracking', 
      status: 'Connected', 
      lastSync: '15 minutes ago',
      logo: '🏃',
      color: 'from-emerald-500 to-teal-500',
      category: 'popular',
      isPrimary: false
    },
    { 
      name: 'Apple Health', 
      type: 'Health Data Platform', 
      status: 'Not Connected', 
      lastSync: null,
      logo: '🍎',
      color: 'from-slate-500 to-slate-600',
      category: 'popular',
      isPrimary: false
    },
    { 
      name: 'WHOOP', 
      type: 'Performance Optimization', 
      status: 'Not Connected', 
      lastSync: null,
      logo: '⚡',
      color: 'from-slate-500 to-slate-600',
      category: 'popular',
      isPrimary: false
    },
    { 
      name: 'Oura Ring', 
      type: 'Sleep & Recovery', 
      status: 'Not Connected', 
      lastSync: null,
      logo: '💍',
      color: 'from-purple-500 to-pink-500',
      category: 'wearables',
      isPrimary: false
    },
    { 
      name: 'Fitbit', 
      type: 'Fitness Tracking', 
      status: 'Not Connected', 
      lastSync: null,
      logo: '⌚',
      color: 'from-blue-500 to-cyan-500',
      category: 'wearables',
      isPrimary: false
    },
    { 
      name: 'Garmin', 
      type: 'Sports & Training', 
      status: 'Not Connected', 
      lastSync: null,
      logo: '🏁',
      color: 'from-blue-600 to-indigo-600',
      category: 'wearables',
      isPrimary: false
    },
    { 
      name: 'Samsung Health', 
      type: 'Health Monitoring', 
      status: 'Not Connected', 
      lastSync: null,
      logo: '📱',
      color: 'from-blue-500 to-purple-500',
      category: 'health-apps',
      isPrimary: false
    },
    { 
      name: 'Strava', 
      type: 'Athletic Performance', 
      status: 'Not Connected', 
      lastSync: null,
      logo: '🚴',
      color: 'from-orange-500 to-red-500',
      category: 'health-apps',
      isPrimary: false
    },
    { 
      name: 'MyFitnessPal', 
      type: 'Nutrition Tracking', 
      status: 'Not Connected', 
      lastSync: null,
      logo: '🍽️',
      color: 'from-blue-500 to-teal-500',
      category: 'health-apps',
      isPrimary: false
    },
    { 
      name: 'Withings', 
      type: 'Smart Scale & BP Monitor', 
      status: 'Not Connected', 
      lastSync: null,
      logo: '⚖️',
      color: 'from-slate-500 to-slate-600',
      category: 'medical-devices',
      isPrimary: false
    },
    { 
      name: 'Omron', 
      type: 'Blood Pressure Monitor', 
      status: 'Not Connected', 
      lastSync: null,
      logo: '🩺',
      color: 'from-red-500 to-pink-500',
      category: 'medical-devices',
      isPrimary: false
    },
    { 
      name: 'Abbott FreeStyle Libre', 
      type: 'Continuous Glucose Monitor', 
      status: 'Not Connected', 
      lastSync: null,
      logo: '💉',
      color: 'from-blue-500 to-cyan-500',
      category: 'medical-devices',
      isPrimary: false
    },
  ];

  // Featured devices logic - smart platform detection
  const connectedFitApps = connectedDevices.filter(d => d.status === 'Connected' && !d.isPrimary);
  const isAndroidUser = connectedFitApps.some(d => d.name === 'Google Fit');
  const isAppleUser = connectedFitApps.some(d => d.name === 'Apple Health');
  
  // Get ABHA (always first)
  const abhaDevice = connectedDevices.find(d => d.isPrimary);
  
  // Get connected non-primary devices
  const connectedSecondary = connectedDevices.filter(d => d.status === 'Connected' && !d.isPrimary);
  
  // Get suggested devices based on platform
  const suggestedDevices = connectedDevices.filter(d => {
    if (d.status === 'Connected') return false; // Already connected
    if (isAndroidUser && d.name === 'Apple Health') return false; // Android user, hide Apple
    if (isAppleUser && d.name === 'Google Fit') return false; // Apple user, hide Google
    return true;
  }).slice(0, 2); // Get top 2 suggestions

  // Filter devices for dialog
  const filteredDevices = connectedDevices.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [
    { id: 'popular', name: 'Popular', icon: '⭐' },
    { id: 'wearables', name: 'Wearables', icon: '⌚' },
    { id: 'health-apps', name: 'Health Apps', icon: '📱' },
    { id: 'medical-devices', name: 'Medical Devices', icon: '🩺' },
  ];

  const insuranceDetails = [
    { provider: 'Star Health Insurance', policyNumber: 'SH123456789', type: 'Health', validity: 'Valid until Dec 2025' },
    { provider: 'HDFC Life', policyNumber: 'HDFC987654321', type: 'Life', validity: 'Valid until Mar 2030' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="px-4 md:px-8 py-4 md:py-5">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div>
              <h1 className="text-white mb-1 text-xl md:text-3xl">Profile</h1>
              <p className="text-slate-400 text-sm md:text-base">Manage your health profile & settings</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">
        
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
              {profile.name.split(' ').map(n => n[0]).join('')}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-white text-2xl md:text-3xl mb-2">{profile.name}</h2>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs md:text-sm">
                    ABHA ID: {profile.abhaId}
                  </span>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs md:text-sm flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Verified
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-400 text-xs">Age</span>
                  </div>
                  <p className="text-white text-lg font-semibold">35 years</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Droplet className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-400 text-xs">Blood Group</span>
                  </div>
                  <p className="text-white text-lg font-semibold">{profile.bloodGroup}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Ruler className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-400 text-xs">Height</span>
                  </div>
                  <p className="text-white text-lg font-semibold">{profile.height} cm</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Weight className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-400 text-xs">Weight</span>
                  </div>
                  <p className="text-white text-lg font-semibold">{profile.weight} kg</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Button className="bg-slate-700/50 hover:bg-slate-600/50 text-white border border-slate-600/50">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button
                  onClick={() => setShowQR(!showQR)}
                  className="bg-slate-700/50 hover:bg-slate-600/50 text-white border border-slate-600/50"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  {showQR ? 'Hide' : 'Show'} QR Code
                </Button>
              </div>
            </div>
          </div>

          {/* QR Code */}
          {showQR && (
            <div className="mt-6 p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl text-center">
              <p className="text-sm text-slate-400 mb-4">Scan this QR code to share your health summary with healthcare providers</p>
              <div className="inline-block p-4 bg-white rounded-lg">
                <svg width="200" height="200" viewBox="0 0 200 200">
                  <rect width="200" height="200" fill="white" />
                  <rect x="20" y="20" width="30" height="30" fill="black" />
                  <rect x="60" y="20" width="30" height="30" fill="black" />
                  <rect x="100" y="20" width="30" height="30" fill="black" />
                  <rect x="140" y="20" width="30" height="30" fill="black" />
                  <rect x="20" y="60" width="30" height="30" fill="black" />
                  <rect x="140" y="60" width="30" height="30" fill="black" />
                  <rect x="20" y="100" width="30" height="30" fill="black" />
                  <rect x="60" y="100" width="30" height="30" fill="black" />
                  <rect x="100" y="100" width="30" height="30" fill="black" />
                  <rect x="140" y="100" width="30" height="30" fill="black" />
                  <rect x="20" y="140" width="30" height="30" fill="black" />
                  <rect x="100" y="140" width="30" height="30" fill="black" />
                  <rect x="140" y="140" width="30" height="30" fill="black" />
                  <text x="100" y="195" textAnchor="middle" fontSize="10" fill="black">{profile.abhaId}</text>
                </svg>
              </div>
              <p className="text-xs text-slate-500 mt-4">Valid for 5 minutes • Auto-refresh enabled</p>
            </div>
          )}
        </div>

        {/* Contact & Emergency */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact Info */}
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-400" />
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-400 text-xs">Email</span>
                </div>
                <p className="text-white text-sm">{profile.email}</p>
              </div>
              <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-400 text-xs">Phone</span>
                </div>
                <p className="text-white text-sm">{profile.phone}</p>
              </div>
              <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-400 text-xs">Date of Birth</span>
                </div>
                <p className="text-white text-sm">{profile.dateOfBirth}</p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-gradient-to-br from-red-900/20 to-red-800/10 border border-red-700/50 rounded-2xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              Emergency Contacts
            </h3>
            
            {/* Primary Contact */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 uppercase tracking-wide">Primary</span>
              </div>
              <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{emergencyContacts.primary.name}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{emergencyContacts.primary.relation}</p>
                    <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {emergencyContacts.primary.phone}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Secondary Contact */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 uppercase tracking-wide">Secondary</span>
              </div>
              <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{emergencyContacts.secondary.name}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{emergencyContacts.secondary.relation}</p>
                    <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {emergencyContacts.secondary.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => setShowEmergencyDialog(true)}
              className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-600/30"
            >
              <Edit className="w-4 h-4 mr-2" />
              Manage Contacts
            </Button>
          </div>
        </div>

        {/* SOS Emergency Alert System */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/80 to-cyan-600/80 flex items-center justify-center shadow-lg shadow-blue-900/30">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
                Emergency Alert System
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-full text-xs">
                  Active
                </span>
              </h3>
              <p className="text-slate-400 text-sm">
                Quick emergency assistance when critical health anomalies are detected
              </p>
            </div>
          </div>

          {/* SOS Features Grid */}
          <div className="grid md:grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-800/40 border border-slate-700/40 rounded-lg p-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium mb-0.5">Instant Alerts</p>
                  <p className="text-slate-400 text-xs">SMS & call to emergency contacts</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/40 rounded-lg p-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-600/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium mb-0.5">Live Location</p>
                  <p className="text-slate-400 text-xs">GPS tracking shared with contacts</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/40 rounded-lg p-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-600/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium mb-0.5">Health Summary</p>
                  <p className="text-slate-400 text-xs">Auto-send vitals & medical history</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/40 rounded-lg p-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium mb-0.5">Smart Detection</p>
                  <p className="text-slate-400 text-xs">Auto-trigger on critical anomalies</p>
                </div>
              </div>
            </div>
          </div>

          {/* Auto-trigger info */}
          <div className="mb-4 p-3 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-700/30 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-300 text-xs font-medium mb-1">Automated Triggers</p>
                <p className="text-slate-400 text-xs">
                  Alert activates if detected: Heart rate {'>'} 150 bpm for 10+ mins • Blood pressure spike • Sudden glucose crash • Fall detection
                </p>
              </div>
            </div>
          </div>

          {/* SOS Buttons */}
          <div className="grid md:grid-cols-2 gap-3">
            <Button 
              className="bg-gradient-to-r from-blue-600/80 to-cyan-600/80 hover:from-blue-600 hover:to-cyan-600 text-white border-0 h-11 shadow-lg shadow-blue-900/20"
              onClick={() => {
                // SOS trigger logic
                alert('Emergency Alert Triggered!\n\n✓ Emergency contacts notified\n✓ Location shared\n✓ Health summary sent');
              }}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Trigger Alert
            </Button>
            
            <Button 
              className="bg-slate-700/50 hover:bg-slate-600/50 text-white border border-slate-600/50 h-11"
              onClick={() => {
                // Test SOS
                alert('Test Alert Sent!\n\nYour emergency contacts will receive a test message.');
              }}
            >
              <Bell className="w-4 h-4 mr-2" />
              Test System
            </Button>
          </div>
        </div>

        {/* Emergency Contact Edit Dialog */}
        <Dialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
          <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl">Manage Emergency Contacts</DialogTitle>
              <DialogDescription className="text-slate-400">
                Update who should be notified in case of a health emergency
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Primary Contact */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <Label className="text-sm font-semibold text-white">Primary Contact</Label>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-slate-400">Full Name</Label>
                    <Input
                      defaultValue={emergencyContacts.primary.name}
                      className="mt-1 bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-400">Relationship</Label>
                    <Input
                      defaultValue={emergencyContacts.primary.relation}
                      className="mt-1 bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-400">Phone Number</Label>
                    <Input
                      defaultValue={emergencyContacts.primary.phone}
                      className="mt-1 bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Secondary Contact */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <Label className="text-sm font-semibold text-white">Secondary Contact</Label>
                  <span className="text-xs text-slate-500">(Optional)</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-slate-400">Full Name</Label>
                    <Input
                      defaultValue={emergencyContacts.secondary.name}
                      className="mt-1 bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-400">Relationship</Label>
                    <Input
                      defaultValue={emergencyContacts.secondary.relation}
                      className="mt-1 bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-400">Phone Number</Label>
                    <Input
                      defaultValue={emergencyContacts.secondary.phone}
                      className="mt-1 bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setShowEmergencyDialog(false)}
                  className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-white border border-slate-600/50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Save logic here
                    setShowEmergencyDialog(false);
                    alert('Emergency contacts updated successfully!');
                  }}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white border-0"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Connected Devices - Compact Layout with Side-by-Side */}
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Data Sources
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">
                {connectedSecondary.length + 1} connected • {suggestedDevices.length} suggested
              </p>
            </div>
          </div>
          
          {/* Connected Devices Grid - ABHA + Google Fit Side by Side on Desktop */}
          <div className="grid md:grid-cols-2 gap-3 mb-3">
            {/* ABHA */}
            {abhaDevice && (
              <div className="bg-gradient-to-br from-blue-900/40 via-indigo-900/30 to-slate-800/30 border border-blue-500/50 rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl shadow-lg">
                      {abhaDevice.logo}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <p className="text-white font-semibold text-sm">{abhaDevice.name}</p>
                        <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-xs flex items-center gap-0.5">
                          <Shield className="w-2.5 h-2.5" />
                          Primary
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs">{abhaDevice.type}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3 text-xs">
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    <span>Active</span>
                  </div>
                  <span className="text-slate-500">• {abhaDevice.lastSync}</span>
                </div>
                {/* ABHA Stats - Compact Grid */}
                <div className="grid grid-cols-4 gap-2 pt-3 border-t border-blue-500/20">
                  <div className="text-center">
                    <p className="text-blue-300 text-sm font-semibold">47</p>
                    <p className="text-slate-500 text-[10px] mt-0.5">Records</p>
                  </div>
                  <div className="text-center">
                    <p className="text-blue-300 text-sm font-semibold">12</p>
                    <p className="text-slate-500 text-[10px] mt-0.5">Labs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-blue-300 text-sm font-semibold">8</p>
                    <p className="text-slate-500 text-[10px] mt-0.5">Rx</p>
                  </div>
                  <div className="text-center">
                    <p className="text-blue-300 text-sm font-semibold">5</p>
                    <p className="text-slate-500 text-[10px] mt-0.5">Facilities</p>
                  </div>
                </div>
              </div>
            )}

            {/* Google Fit or other connected secondary */}
            {connectedSecondary.map((device, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-emerald-900/30 via-teal-900/20 to-slate-800/30 border border-emerald-500/40 rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${device.color} flex items-center justify-center text-xl shadow-lg`}>
                      {device.logo}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{device.name}</p>
                      <p className="text-slate-400 text-xs">{device.type}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3 text-xs">
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Active</span>
                  </div>
                  <span className="text-slate-500">• {device.lastSync}</span>
                </div>
                {/* Google Fit Stats - Compact Grid */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-emerald-500/20">
                  <div className="text-center">
                    <p className="text-emerald-300 text-sm font-semibold">12.8K</p>
                    <p className="text-slate-500 text-[10px] mt-0.5">Steps</p>
                  </div>
                  <div className="text-center">
                    <p className="text-emerald-300 text-sm font-semibold">94</p>
                    <p className="text-slate-500 text-[10px] mt-0.5">HR</p>
                  </div>
                  <div className="text-center">
                    <p className="text-emerald-300 text-sm font-semibold">7.2h</p>
                    <p className="text-slate-500 text-[10px] mt-0.5">Sleep</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Suggested Devices - Compact Cards */}
          {suggestedDevices.length > 0 && (
            <div className="grid md:grid-cols-2 gap-2 mb-3">
              {suggestedDevices.map((device, index) => (
                <div 
                  key={index}
                  className="bg-slate-800/20 border border-slate-700/30 hover:border-slate-600/50 rounded-lg p-3 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${device.color} flex items-center justify-center text-lg opacity-50 group-hover:opacity-100 transition-opacity`}>
                      {device.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-xs truncate">{device.name}</p>
                      <p className="text-slate-500 text-[10px] truncate">{device.type}</p>
                    </div>
                    <Button 
                      className="bg-gradient-to-r from-cyan-600/70 to-blue-600/70 hover:from-cyan-500 hover:to-blue-500 text-white border-0 h-7 px-3 text-xs"
                      size="sm"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Browse All + Security - Single Row */}
          <div className="flex flex-col md:flex-row gap-2">
            <Button
              onClick={() => setShowIntegrationsDialog(true)}
              className="w-full bg-slate-800/40 hover:bg-slate-700/40 text-slate-300 hover:text-white border border-slate-700/40 hover:border-slate-600/50 h-9 transition-all duration-200 text-xs"
            >
              <Search className="w-3.5 h-3.5 mr-2" />
              Browse All
              <span className="ml-2 px-1.5 py-0.5 bg-slate-700/50 rounded-full text-[10px]">
                {connectedDevices.length - connectedSecondary.length - 1}+
              </span>
            </Button>
          </div>
        </div>

        {/* Integrations Dialog */}
        <Dialog open={showIntegrationsDialog} onOpenChange={setShowIntegrationsDialog}>
          <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-2xl">Connect Your Health Data</DialogTitle>
              <DialogDescription className="text-slate-400">
                Link wearables, health apps, and medical devices to get a unified view of your health
              </DialogDescription>
            </DialogHeader>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                type="text"
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            {/* Categories & Devices */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              {categories.map((category) => {
                const categoryDevices = filteredDevices.filter(d => d.category === category.id);
                if (categoryDevices.length === 0) return null;

                return (
                  <div key={category.id}>
                    <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      {category.name}
                      <span className="text-slate-500 text-xs font-normal">({categoryDevices.length})</span>
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {categoryDevices.map((device, index) => (
                        <div
                          key={index}
                          className={`border rounded-xl p-4 transition-all duration-200 ${
                            device.status === 'Connected'
                              ? 'bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-emerald-500/40'
                              : 'bg-slate-800/30 border-slate-700/40 hover:border-slate-600/60'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${device.color} flex items-center justify-center text-lg`}>
                                {device.logo}
                              </div>
                              <div>
                                <p className="text-white font-medium text-sm">{device.name}</p>
                                <p className="text-slate-400 text-xs mt-0.5">{device.type}</p>
                              </div>
                            </div>
                            {device.status === 'Connected' && (
                              <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                          
                          {device.status === 'Connected' ? (
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Synced {device.lastSync}
                            </div>
                          ) : (
                            <Button 
                              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0"
                              size="sm"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Connect
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {filteredDevices.length === 0 && (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No integrations found</p>
                  <p className="text-slate-500 text-sm mt-1">Try searching with different keywords</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Google Fit Integration */}
        <GoogleFitIntegration 
          onConnectionChange={(isConnected) => {
            console.log('Google Fit connection status:', isConnected);
          }}
        />

        {/* Insurance */}
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white text-lg font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              Insurance Details
            </h3>
            <Button className="bg-slate-700/50 hover:bg-slate-600/50 text-white border border-slate-600/50">
              <Shield className="w-4 h-4 mr-2" />
              Add Policy
            </Button>
          </div>
          <div className="grid gap-3">
            {insuranceDetails.map((insurance, index) => (
              <div key={index} className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-white font-medium">{insurance.provider}</p>
                    <p className="text-slate-400 text-sm">Policy: {insurance.policyNumber}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs">
                    {insurance.type}
                  </span>
                </div>
                <p className="text-slate-400 text-sm">{insurance.validity}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-white text-lg font-semibold mb-6">Privacy & Notification Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-white font-medium text-sm">Health Nudges</p>
                  <p className="text-slate-400 text-xs">Daily reminders and health tips</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-white font-medium text-sm">Risk Alerts</p>
                  <p className="text-slate-400 text-xs">Critical health warnings</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Share2 className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-white font-medium text-sm">Auto-Share with Doctor</p>
                  <p className="text-slate-400 text-xs">Share new reports automatically</p>
                </div>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-white font-medium text-sm">Continuous Monitoring</p>
                  <p className="text-slate-400 text-xs">24/7 device data sync</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}