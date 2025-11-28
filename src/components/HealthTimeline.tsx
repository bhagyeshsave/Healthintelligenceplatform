import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { FileText, Activity, Pill, Calendar, Download, Search, Filter } from "lucide-react";
import { useState } from "react";

interface TimelineEvent {
  id: string;
  date: string;
  type: "lab" | "prescription" | "vitals" | "appointment" | "imaging";
  title: string;
  details: string;
  source: string;
  status?: string;
  fileUrl?: string;
}

const timelineData: TimelineEvent[] = [
  {
    id: "1",
    date: "2024-11-20",
    type: "lab",
    title: "Complete Blood Count (CBC)",
    details: "All values within normal range. Hemoglobin: 14.2 g/dL, WBC: 7,200/μL",
    source: "Apollo Diagnostics",
    status: "normal",
  },
  {
    id: "2",
    date: "2024-11-18",
    type: "vitals",
    title: "Blood Pressure Reading",
    details: "128/82 mmHg - Slightly elevated systolic reading",
    source: "Home Device - iHealth BP Monitor",
    status: "monitor",
  },
  {
    id: "3",
    date: "2024-11-15",
    type: "prescription",
    title: "Prescription - Dr. Sharma",
    details: "Metformin 500mg (2x daily), Vitamin D3 supplement",
    source: "Max Healthcare - Cardiology",
    status: "active",
  },
  {
    id: "4",
    date: "2024-11-10",
    type: "lab",
    title: "Lipid Profile",
    details: "Total Cholesterol: 210 mg/dL (High), LDL: 140 mg/dL (High), HDL: 45 mg/dL",
    source: "SRL Diagnostics",
    status: "monitor",
  },
  {
    id: "5",
    date: "2024-11-08",
    type: "appointment",
    title: "General Checkup - Dr. Sharma",
    details: "Discussed elevated glucose and cholesterol. Diet modification recommended.",
    source: "Max Healthcare",
  },
  {
    id: "6",
    date: "2024-11-05",
    type: "lab",
    title: "HbA1c Test",
    details: "6.2% - Prediabetic range. Lifestyle changes recommended.",
    source: "Thyrocare",
    status: "warning",
  },
  {
    id: "7",
    date: "2024-10-28",
    type: "vitals",
    title: "Glucose Reading (Fasting)",
    details: "110 mg/dL - Slightly elevated fasting glucose",
    source: "Home Device - Accu-Chek",
    status: "monitor",
  },
  {
    id: "8",
    date: "2024-10-20",
    type: "imaging",
    title: "Chest X-Ray",
    details: "Clear lung fields. No acute findings.",
    source: "Apollo Imaging Center",
    status: "normal",
  },
];

export function HealthTimeline() {
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = timelineData.filter((event) => {
    const matchesType = filterType === "all" || event.type === filterType;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lab":
        return <FileText className="w-5 h-5" />;
      case "prescription":
        return <Pill className="w-5 h-5" />;
      case "vitals":
        return <Activity className="w-5 h-5" />;
      case "appointment":
        return <Calendar className="w-5 h-5" />;
      case "imaging":
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "lab":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "prescription":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "vitals":
        return "bg-green-100 text-green-700 border-green-300";
      case "appointment":
        return "bg-amber-100 text-amber-700 border-amber-300";
      case "imaging":
        return "bg-pink-100 text-pink-700 border-pink-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    switch (status) {
      case "normal":
        return <Badge className="bg-green-100 text-green-700 border-green-300">Normal</Badge>;
      case "warning":
        return <Badge className="bg-red-100 text-red-700 border-red-300">Warning</Badge>;
      case "monitor":
        return <Badge className="bg-amber-100 text-amber-700 border-amber-300">Monitor</Badge>;
      case "active":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-300">Active</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Unified Health Timeline</CardTitle>
          <CardDescription>
            All your health records in one place - labs, prescriptions, vitals, and appointments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Records</SelectItem>
                <SelectItem value="lab">Lab Reports</SelectItem>
                <SelectItem value="prescription">Prescriptions</SelectItem>
                <SelectItem value="vitals">Vitals</SelectItem>
                <SelectItem value="appointment">Appointments</SelectItem>
                <SelectItem value="imaging">Imaging</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-600">Lab Reports</p>
              <p className="text-gray-900">4</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600">Prescriptions</p>
              <p className="text-gray-900">1</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600">Vitals</p>
              <p className="text-gray-900">2</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-gray-600">Appointments</p>
              <p className="text-gray-900">1</p>
            </div>
            <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
              <p className="text-sm text-gray-600">Imaging</p>
              <p className="text-gray-900">1</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="relative space-y-4">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 hidden sm:block"></div>

        {filteredData.map((event, index) => (
          <Card key={event.id} className="relative hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                {/* Icon */}
                <div className={`hidden sm:flex w-12 h-12 rounded-full items-center justify-center border-2 ${getTypeColor(event.type)} z-10 flex-shrink-0`}>
                  {getTypeIcon(event.type)}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-gray-900">{event.title}</h3>
                        {getStatusBadge(event.status)}
                      </div>
                      <p className="text-sm text-gray-600">{event.details}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Download</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span>•</span>
                    <span>{event.source}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredData.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No records found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
