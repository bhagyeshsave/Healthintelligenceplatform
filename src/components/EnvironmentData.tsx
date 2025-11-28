import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Wind, Sun, Droplets, ThermometerSun } from 'lucide-react';
import { Badge } from './ui/badge';

export function EnvironmentData() {
  const environmentData = {
    aqi: {
      value: 187,
      status: 'Unhealthy',
      color: 'bg-orange-500',
    },
    uv: {
      value: 8,
      status: 'Very High',
      color: 'bg-red-500',
    },
    temperature: 32,
    humidity: 68,
  };

  const getAQIRecommendation = (aqi: number) => {
    if (aqi > 150) return 'Avoid outdoor activities. Wear N95 mask if going out.';
    if (aqi > 100) return 'Limit prolonged outdoor exertion.';
    return 'Air quality is acceptable.';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Environmental Health</CardTitle>
        <CardDescription>Real-time environmental factors affecting your health</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AQI */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Wind className="size-5 text-orange-600" />
              <span className="text-sm">Air Quality Index</span>
            </div>
            <Badge className={environmentData.aqi.color}>
              {environmentData.aqi.status}
            </Badge>
          </div>
          <p className="text-2xl mb-1">{environmentData.aqi.value}</p>
          <p className="text-xs text-gray-600">{getAQIRecommendation(environmentData.aqi.value)}</p>
        </div>

        {/* UV Index */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sun className="size-5 text-red-600" />
              <span className="text-sm">UV Index</span>
            </div>
            <Badge className={environmentData.uv.color}>
              {environmentData.uv.status}
            </Badge>
          </div>
          <p className="text-2xl mb-1">{environmentData.uv.value}</p>
          <p className="text-xs text-gray-600">Use SPF 30+ sunscreen. Wear sunglasses.</p>
        </div>

        {/* Other Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <ThermometerSun className="size-4 text-blue-600" />
              <span className="text-xs text-gray-600">Temperature</span>
            </div>
            <p className="text-xl">{environmentData.temperature}°C</p>
          </div>
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Droplets className="size-4 text-cyan-600" />
              <span className="text-xs text-gray-600">Humidity</span>
            </div>
            <p className="text-xl">{environmentData.humidity}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
