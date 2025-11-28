import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Cloud, Sun, Wind, Droplets, AlertTriangle, ThermometerSun, Eye, Umbrella } from "lucide-react";

export function EnvironmentalData() {
  // Mock environmental data
  const currentConditions = {
    location: "New Delhi, India",
    temperature: 28,
    humidity: 65,
    uvIndex: 7,
    aqi: 178,
    aqiCategory: "Unhealthy",
    pollenLevel: "Medium",
    weather: "Partly Cloudy",
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return { bg: "bg-green-100", text: "text-green-700", border: "border-green-300", label: "Good" };
    if (aqi <= 100) return { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300", label: "Moderate" };
    if (aqi <= 150) return { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-300", label: "Unhealthy for Sensitive Groups" };
    if (aqi <= 200) return { bg: "bg-red-100", text: "text-red-700", border: "border-red-300", label: "Unhealthy" };
    if (aqi <= 300) return { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300", label: "Very Unhealthy" };
    return { bg: "bg-pink-100", text: "text-pink-700", border: "border-pink-300", label: "Hazardous" };
  };

  const getUVColor = (uv: number) => {
    if (uv <= 2) return { bg: "bg-green-100", text: "text-green-700", label: "Low" };
    if (uv <= 5) return { bg: "bg-yellow-100", text: "text-yellow-700", label: "Moderate" };
    if (uv <= 7) return { bg: "bg-orange-100", text: "text-orange-700", label: "High" };
    if (uv <= 10) return { bg: "bg-red-100", text: "text-red-700", label: "Very High" };
    return { bg: "bg-purple-100", text: "text-purple-700", label: "Extreme" };
  };

  const aqiColor = getAQIColor(currentConditions.aqi);
  const uvColor = getUVColor(currentConditions.uvIndex);

  const healthImpacts = [
    {
      factor: "High AQI",
      impact: "May trigger respiratory symptoms, especially if you have asthma or COPD",
      recommendation: "Limit outdoor activities. Use N95 mask if going outside. Consider air purifier indoors.",
      severity: "high",
    },
    {
      factor: "High UV Index",
      impact: "Risk of sunburn and long-term skin damage with prolonged exposure",
      recommendation: "Apply SPF 30+ sunscreen. Wear protective clothing. Avoid sun exposure between 10 AM - 4 PM.",
      severity: "medium",
    },
    {
      factor: "High Humidity",
      impact: "Can make heat feel more intense and may affect those with respiratory conditions",
      recommendation: "Stay hydrated. Avoid strenuous outdoor activities during peak heat hours.",
      severity: "low",
    },
  ];

  const historicalTrends = [
    { date: "Nov 23", aqi: 178, uv: 7, temp: 28 },
    { date: "Nov 22", aqi: 165, uv: 6, temp: 27 },
    { date: "Nov 21", aqi: 192, uv: 7, temp: 26 },
    { date: "Nov 20", aqi: 156, uv: 5, temp: 25 },
    { date: "Nov 19", aqi: 143, uv: 6, temp: 26 },
    { date: "Nov 18", aqi: 168, uv: 7, temp: 27 },
    { date: "Nov 17", aqi: 184, uv: 6, temp: 28 },
  ];

  return (
    <div className="space-y-6">
      {/* Current Conditions */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50">
        <CardHeader>
          <CardTitle>Environmental Health Factors</CardTitle>
          <CardDescription>
            Real-time environmental data that may affect your health • {currentConditions.location}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Metrics Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* AQI */}
            <div className={`p-4 rounded-lg border-2 ${aqiColor.bg} ${aqiColor.border}`}>
              <div className="flex items-center gap-2 mb-2">
                <Wind className={`w-5 h-5 ${aqiColor.text}`} />
                <span className="text-sm text-gray-700">Air Quality</span>
              </div>
              <div className="space-y-1">
                <p className={`text-2xl ${aqiColor.text}`}>{currentConditions.aqi}</p>
                <Badge className={`${aqiColor.bg} ${aqiColor.text} ${aqiColor.border}`}>
                  {aqiColor.label}
                </Badge>
              </div>
            </div>

            {/* UV Index */}
            <div className={`p-4 rounded-lg border-2 ${uvColor.bg} border-orange-300`}>
              <div className="flex items-center gap-2 mb-2">
                <Sun className={`w-5 h-5 ${uvColor.text}`} />
                <span className="text-sm text-gray-700">UV Index</span>
              </div>
              <div className="space-y-1">
                <p className={`text-2xl ${uvColor.text}`}>{currentConditions.uvIndex}</p>
                <Badge className={`${uvColor.bg} ${uvColor.text} border-orange-300`}>
                  {uvColor.label}
                </Badge>
              </div>
            </div>

            {/* Temperature */}
            <div className="p-4 rounded-lg border-2 bg-blue-50 border-blue-300">
              <div className="flex items-center gap-2 mb-2">
                <ThermometerSun className="w-5 h-5 text-blue-700" />
                <span className="text-sm text-gray-700">Temperature</span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl text-blue-700">{currentConditions.temperature}°C</p>
                <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                  {currentConditions.weather}
                </Badge>
              </div>
            </div>

            {/* Humidity */}
            <div className="p-4 rounded-lg border-2 bg-cyan-50 border-cyan-300">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-5 h-5 text-cyan-700" />
                <span className="text-sm text-gray-700">Humidity</span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl text-cyan-700">{currentConditions.humidity}%</p>
                <Badge className="bg-cyan-100 text-cyan-700 border-cyan-300">
                  Moderate
                </Badge>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
              <Eye className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Pollen Level</p>
                <p className="text-gray-900">{currentConditions.pollenLevel}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
              <Umbrella className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Precipitation</p>
                <p className="text-gray-900">0% chance</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Impact Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Personalized Health Impacts</CardTitle>
          <CardDescription>
            How current environmental conditions may affect you based on your health profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {healthImpacts.map((impact, index) => (
            <Alert
              key={index}
              className={
                impact.severity === "high"
                  ? "border-red-300 bg-red-50"
                  : impact.severity === "medium"
                  ? "border-amber-300 bg-amber-50"
                  : "border-blue-300 bg-blue-50"
              }
            >
              <AlertTriangle
                className={`h-4 w-4 ${
                  impact.severity === "high"
                    ? "text-red-600"
                    : impact.severity === "medium"
                    ? "text-amber-600"
                    : "text-blue-600"
                }`}
              />
              <AlertDescription className="space-y-2">
                <div>
                  <p className="text-gray-900 mb-1">
                    <strong>{impact.factor}:</strong> {impact.impact}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Recommendation:</strong> {impact.recommendation}
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>

      {/* Historical Trends */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Environmental Trends</CardTitle>
          <CardDescription>Track how environmental factors have changed over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {historicalTrends.reverse().map((day, index) => {
              const dayAqiColor = getAQIColor(day.aqi);
              const dayUvColor = getUVColor(day.uv);
              
              return (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-20 text-sm text-gray-700">
                    {day.date}
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-gray-600">AQI</p>
                      <p className={`${dayAqiColor.text}`}>{day.aqi}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">UV</p>
                      <p className={`${dayUvColor.text}`}>{day.uv}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Temp</p>
                      <p className="text-gray-900">{day.temp}°C</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Why Environmental Data Matters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-700">
          <p>
            <strong className="text-gray-900">Air Quality (AQI):</strong> Poor air quality can trigger asthma, 
            worsen heart conditions, and affect overall respiratory health.
          </p>
          <p>
            <strong className="text-gray-900">UV Index:</strong> High UV exposure increases risk of skin damage, 
            sunburn, and long-term conditions like skin cancer.
          </p>
          <p>
            <strong className="text-gray-900">Temperature & Humidity:</strong> Extreme conditions can affect 
            cardiovascular health, hydration levels, and exacerbate chronic conditions.
          </p>
          <p className="text-xs text-gray-500 pt-2 border-t border-gray-200">
            Data sourced from trusted environmental monitoring services. Updated hourly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
