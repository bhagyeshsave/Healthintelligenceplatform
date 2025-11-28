import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  QrCode, 
  Share2, 
  Shield, 
  Clock,
  UserCheck,
  AlertCircle,
  Download,
  Copy,
  Check
} from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface DataSharingProps {
  userData: {
    name: string;
    abhaId: string;
    bloodGroup: string;
  };
}

export function DataSharing({ userData }: DataSharingProps) {
  const [qrGenerated, setQrGenerated] = useState(false);
  const [shareMode, setShareMode] = useState('emergency');
  const [copied, setCopied] = useState(false);

  const emergencyContacts = [
    { name: 'Dr. Sharma', hospital: 'Apollo Hospital', access: 'Full', added: '2 months ago' },
    { name: 'Dr. Patel', hospital: 'Max Healthcare', access: 'Limited', added: '1 month ago' },
  ];

  const shareHistory = [
    { doctor: 'Dr. Kumar', date: '2024-11-20', duration: '1 hour', type: 'Consultation' },
    { doctor: 'Dr. Reddy', date: '2024-11-15', duration: '30 min', type: 'Follow-up' },
  ];

  const generateQRCode = () => {
    setQrGenerated(true);
  };

  const copyAbhaId = () => {
    navigator.clipboard.writeText(userData.abhaId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* QR Code Generator */}
      <Card>
        <CardHeader>
          <CardTitle>Share Health Data</CardTitle>
          <CardDescription>Generate a secure QR code for doctor visits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Share Mode Selection */}
          <div>
            <Label>Share Mode</Label>
            <Select value={shareMode} onValueChange={setShareMode}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="emergency">Emergency - Full Access</SelectItem>
                <SelectItem value="consultation">Consultation - Recent Records</SelectItem>
                <SelectItem value="limited">Limited - Specific Records Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* QR Code Display */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-lg p-8 flex flex-col items-center justify-center min-h-[300px]">
            {!qrGenerated ? (
              <>
                <QrCode className="size-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-center mb-4">
                  Generate a QR code to share your health data securely
                </p>
                <Button onClick={generateQRCode} className="gap-2">
                  <QrCode className="size-4" />
                  Generate QR Code
                </Button>
              </>
            ) : (
              <>
                {/* Mock QR Code */}
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <div className="grid grid-cols-8 gap-1">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`size-3 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                      />
                    ))}
                  </div>
                </div>
                <Badge className="mt-4 bg-green-500">Active</Badge>
                <p className="text-sm text-gray-600 mt-2">Valid for 5 minutes</p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    <Download className="size-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setQrGenerated(false)}>
                    Regenerate
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Privacy Info */}
          <Alert>
            <Shield className="size-4" />
            <AlertDescription className="text-xs">
              QR codes are encrypted and expire after single use or 5 minutes. 
              You control what data is shared.
            </AlertDescription>
          </Alert>

          {/* ABHA ID */}
          <div className="bg-gray-50 border rounded-lg p-4">
            <Label className="text-xs text-gray-600">Your ABHA ID</Label>
            <div className="flex items-center justify-between mt-2">
              <code className="text-sm">{userData.abhaId}</code>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={copyAbhaId}
              >
                {copied ? (
                  <Check className="size-4 text-green-600" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Authorized Access & History */}
      <div className="space-y-6">
        {/* Emergency Access */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Emergency Access</CardTitle>
            <CardDescription>Doctors with permanent access to your health data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex gap-3">
                  <div className="bg-blue-500 rounded-full p-2 size-10 flex items-center justify-center flex-shrink-0">
                    <UserCheck className="size-5 text-white" />
                  </div>
                  <div>
                    <p>{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.hospital}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{contact.access}</Badge>
                      <span className="text-xs text-gray-500">Added {contact.added}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Revoke</Button>
              </div>
            ))}
            
            <Button variant="outline" className="w-full">
              <UserCheck className="size-4 mr-2" />
              Add Emergency Contact
            </Button>
          </CardContent>
        </Card>

        {/* Share History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sharing History</CardTitle>
            <CardDescription>Recent data access log</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {shareHistory.map((history, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm">{history.doctor}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Clock className="size-3" />
                    {history.date} • {history.duration}
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">{history.type}</Badge>
              </div>
            ))}
            
            <Button variant="link" className="w-full text-sm">
              View Full History →
            </Button>
          </CardContent>
        </Card>

        {/* Emergency SOS */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="size-5 text-red-600" />
              <CardTitle className="text-base">Emergency SOS</CardTitle>
            </div>
            <CardDescription>In case of emergency, share critical health info instantly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white rounded-lg p-3 border border-red-200">
              <p className="text-sm mb-2">Critical Information</p>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Blood Group:</span>
                  <span>{userData.bloodGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span>Allergies:</span>
                  <span>Penicillin</span>
                </div>
                <div className="flex justify-between">
                  <span>Chronic Conditions:</span>
                  <span>Pre-diabetes</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="sos-mode">Enable SOS Mode</Label>
              <Switch id="sos-mode" />
            </div>

            <Button variant="destructive" className="w-full gap-2">
              <AlertCircle className="size-4" />
              Activate Emergency SOS
            </Button>

            <p className="text-xs text-gray-600 text-center">
              This will share your location and critical health data with emergency contacts
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
