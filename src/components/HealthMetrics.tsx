import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Activity, Heart, Footprints, Flame } from 'lucide-react';
import { Progress } from './ui/progress';

export function HealthMetrics() {
  const metrics = [
    {
      name: 'Steps Today',
      value: 8234,
      goal: 10000,
      icon: Footprints,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Heart Rate',
      value: 72,
      unit: 'bpm',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      status: 'Normal',
    },
    {
      name: 'Calories Burned',
      value: 1842,
      goal: 2200,
      icon: Flame,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      name: 'Active Minutes',
      value: 45,
      goal: 60,
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Today's Activity</CardTitle>
        <CardDescription>Live data from connected devices</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const progress = metric.goal ? (metric.value / metric.goal) * 100 : null;
          
          return (
            <div key={index} className={`${metric.bgColor} rounded-lg p-3`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`size-4 ${metric.color}`} />
                  <span className="text-sm">{metric.name}</span>
                </div>
                {metric.status && (
                  <span className="text-xs text-gray-600">{metric.status}</span>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl">{metric.value.toLocaleString()}</span>
                {metric.unit && <span className="text-xs text-gray-600">{metric.unit}</span>}
                {metric.goal && (
                  <span className="text-xs text-gray-600">/ {metric.goal.toLocaleString()}</span>
                )}
              </div>
              {progress !== null && (
                <Progress value={progress} className="mt-2 h-1" />
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
