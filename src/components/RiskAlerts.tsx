import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { AlertTriangle, TrendingUp, Bell, CheckCircle, Clock, ChevronRight, X } from "lucide-react";
import { useState } from "react";

interface Alert {
  id: string;
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  recommendation: string;
  date: string;
  dismissed: boolean;
  category: string;
}

export function RiskAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      severity: "high",
      title: "Pre-Diabetes Risk Detected",
      description: "Your HbA1c level of 6.2% and fasting glucose of 110 mg/dL indicate pre-diabetic range. This pattern has been consistent over the past 3 months.",
      recommendation: "Schedule an appointment with your doctor to discuss lifestyle modifications and potential preventive interventions.",
      date: "2024-11-20",
      dismissed: false,
      category: "Metabolic Health",
    },
    {
      id: "2",
      severity: "medium",
      title: "Elevated Cholesterol Levels",
      description: "Your total cholesterol (210 mg/dL) and LDL (140 mg/dL) are above optimal ranges. This increases cardiovascular risk.",
      recommendation: "Consider dietary changes: reduce saturated fats, increase fiber intake, and discuss statin therapy with your doctor.",
      date: "2024-11-18",
      dismissed: false,
      category: "Cardiovascular",
    },
    {
      id: "3",
      severity: "medium",
      title: "Blood Pressure Trending Up",
      description: "Your last 5 readings show systolic BP averaging 128 mmHg. While not hypertensive, this is higher than your baseline of 118 mmHg.",
      recommendation: "Monitor stress levels, reduce sodium intake, and increase physical activity. Recheck in 2 weeks.",
      date: "2024-11-15",
      dismissed: false,
      category: "Cardiovascular",
    },
    {
      id: "4",
      severity: "low",
      title: "Vitamin D Follow-up Due",
      description: "Your last Vitamin D test showed levels at 18 ng/mL (deficient). You've been on supplements for 3 months.",
      recommendation: "Schedule a follow-up Vitamin D test to assess supplement effectiveness.",
      date: "2024-11-10",
      dismissed: false,
      category: "Nutrition",
    },
    {
      id: "5",
      severity: "low",
      title: "Inactive Day Pattern",
      description: "You've had 3 days this week with less than 5,000 steps. Regular movement is important for metabolic health.",
      recommendation: "Try to incorporate short walking breaks throughout the day. Aim for at least 7,000 steps daily.",
      date: "2024-11-08",
      dismissed: false,
      category: "Activity",
    },
  ]);

  const dismissAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, dismissed: true } : alert
    ));
  };

  const activeAlerts = alerts.filter(a => !a.dismissed);
  const dismissedAlerts = alerts.filter(a => a.dismissed);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-700 border-red-300";
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-300";
      case "low":
        return "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "medium":
        return <TrendingUp className="w-5 h-5 text-amber-600" />;
      case "low":
        return <Bell className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const AlertCard = ({ alert }: { alert: Alert }) => (
    <Card className={`${alert.severity === "high" ? "border-2 border-red-300" : ""}`}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="mt-1">
                {getSeverityIcon(alert.severity)}
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-gray-900">{alert.title}</h3>
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)} Priority
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Badge variant="outline">{alert.category}</Badge>
                  <span>•</span>
                  <Clock className="w-3 h-3" />
                  <span>{new Date(alert.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                </div>
              </div>
            </div>
            {!alert.dismissed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissAlert(alert.id)}
                className="flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Description */}
          <div className="ml-8 space-y-3">
            <p className="text-sm text-gray-700">{alert.description}</p>
            
            {/* Recommendation */}
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Recommended Action:</p>
              <p className="text-sm text-gray-900">{alert.recommendation}</p>
            </div>

            {/* Actions */}
            {!alert.dismissed && (
              <div className="flex gap-2">
                <Button size="sm" className="gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Take Action
                </Button>
                <Button size="sm" variant="outline" className="gap-2">
                  <ChevronRight className="w-4 h-4" />
                  Learn More
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50">
        <CardHeader>
          <CardTitle>Risk Alerts & Preventive Nudges</CardTitle>
          <CardDescription>
            AI-powered early warnings based on your health trends and data patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-sm text-gray-600">High Priority</span>
              </div>
              <p className="text-gray-900">
                {activeAlerts.filter(a => a.severity === "high").length}
              </p>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-amber-600" />
                <span className="text-sm text-gray-600">Medium Priority</span>
              </div>
              <p className="text-gray-900">
                {activeAlerts.filter(a => a.severity === "medium").length}
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">Low Priority</span>
              </div>
              <p className="text-gray-900">
                {activeAlerts.filter(a => a.severity === "low").length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-gray-900">Active Alerts ({activeAlerts.length})</h3>
          {activeAlerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}

      {activeAlerts.length === 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="py-12 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <p className="text-gray-900 mb-2">No Active Alerts</p>
            <p className="text-sm text-gray-600">
              Great job! You're staying on top of your health. Keep up the good work!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Dismissed Alerts */}
      {dismissedAlerts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-gray-600">Dismissed Alerts ({dismissedAlerts.length})</h3>
          {dismissedAlerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}

      {/* Educational Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Understanding Your Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-700">
          <p>
            <strong className="text-gray-900">High Priority:</strong> Requires immediate attention or discussion with your healthcare provider.
          </p>
          <p>
            <strong className="text-gray-900">Medium Priority:</strong> Important trends to monitor and address in the near term.
          </p>
          <p>
            <strong className="text-gray-900">Low Priority:</strong> Helpful reminders and preventive suggestions for optimal health.
          </p>
          <p className="text-xs text-gray-500 pt-2 border-t border-gray-200">
            These alerts are generated by analyzing your health data patterns using AI. They are informational and should not replace professional medical advice.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
