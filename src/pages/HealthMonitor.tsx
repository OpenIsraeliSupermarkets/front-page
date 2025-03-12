import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subDays } from "date-fns";
import { he } from "date-fns/locale";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "react-i18next";

interface HealthCheck {
  id: number;
  endpoint: string;
  timestamp: string;
  is_healthy: boolean;
  response_time: number;
  status_code: number;
  error_message?: string;
  response_data?: Record<string, unknown>;
  is_updated?: boolean;
  created_at: string;
}

const HealthMonitor = () => {
  const [healthData, setHealthData] = useState<HealthCheck[]>([]);
  const [endpoints, setEndpoints] = useState<string[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("24h");
  const { t } = useTranslation();

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        // חישוב תאריך התחלה בהתאם לטווח הזמן שנבחר
        const startDate = new Date();
        switch (timeRange) {
          case "7d":
            startDate.setDate(startDate.getDate() - 7);
            break;
          case "30d":
            startDate.setDate(startDate.getDate() - 30);
            break;
          default: // 24h
            startDate.setDate(startDate.getDate() - 1);
        }

        const { data, error } = await supabase
          .from("health_checks")
          .select("*")
          .gte("timestamp", startDate.toISOString())
          .order("timestamp", { ascending: true });

        if (error) throw error;

        setHealthData(data);

        // חילוץ נקודות קצה ייחודיות
        const uniqueEndpoints = [
          ...new Set(data.map((check) => check.endpoint)),
        ];
        setEndpoints(uniqueEndpoints);
        if (uniqueEndpoints.length > 0) {
          setSelectedEndpoint(uniqueEndpoints[0]);
        }
      } catch (error) {
        console.error("שגיאה בטעינת נתוני בריאות:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, [timeRange]);

  const filteredData = healthData
    .filter((check) => check.endpoint === selectedEndpoint)
    .map((check) => ({
      ...check,
      timestamp: format(new Date(check.timestamp), "dd/MM HH:mm", {
        locale: he,
      }),
      status: check.is_healthy ? 100 : 0,
    }));

  const calculateUptime = () => {
    const endpointData = healthData.filter(
      (check) => check.endpoint === selectedEndpoint
    );
    if (endpointData.length === 0) return 0;
    const healthyChecks = endpointData.filter(
      (check) => check.is_healthy
    ).length;
    return Math.round((healthyChecks / endpointData.length) * 100);
  };

  const calculateAverageResponseTime = () => {
    const endpointData = healthData.filter(
      (check) => check.endpoint === selectedEndpoint
    );
    if (endpointData.length === 0) return 0;
    return Math.round(
      endpointData.reduce((acc, curr) => acc + curr.response_time, 0) /
        endpointData.length
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">טוען...</div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-4 rtl">
      <h1 className="text-3xl font-bold mb-6">ניטור יציבות מערכת</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <Card className="flex-1 min-w-[250px]">
          <CardHeader>
            <CardTitle>בחר נקודת קצה</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedEndpoint}
              onValueChange={setSelectedEndpoint}
            >
              <SelectTrigger>
                <SelectValue placeholder="בחר נקודת קצה" />
              </SelectTrigger>
              <SelectContent>
                {endpoints.map((endpoint) => (
                  <SelectItem key={endpoint} value={endpoint}>
                    {endpoint}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="flex-1 min-w-[250px]">
          <CardHeader>
            <CardTitle>טווח זמן</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={timeRange}
              onValueChange={(value: "24h" | "7d" | "30d") =>
                setTimeRange(value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24 שעות אחרונות</SelectItem>
                <SelectItem value="7d">7 ימים אחרונים</SelectItem>
                <SelectItem value="30d">30 ימים אחרונים</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader>
            <CardTitle>זמינות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-700">
              {calculateUptime()}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader>
            <CardTitle>זמן תגובה ממוצע</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-700">
              {calculateAverageResponseTime()} ms
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader>
            <CardTitle>בדיקות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-700">
              {filteredData.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>גרף ביצועים</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="status"
                  stroke="#4CAF50"
                  name="סטטוס"
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="response_time"
                  stroke="#2196F3"
                  name="זמן תגובה (ms)"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {selectedEndpoint && (
        <Card>
          <CardHeader>
            <CardTitle>שגיאות אחרונות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {healthData
                .filter(
                  (check) =>
                    check.endpoint === selectedEndpoint && !check.is_healthy
                )
                .slice(-5)
                .reverse()
                .map((error) => (
                  <div key={error.id} className="p-4 bg-red-50 rounded-lg">
                    <div className="font-semibold text-red-700">
                      {format(
                        new Date(error.timestamp),
                        "dd/MM/yyyy HH:mm:ss",
                        { locale: he }
                      )}
                    </div>
                    <div className="text-red-600">
                      קוד שגיאה: {error.status_code}
                    </div>
                    {error.error_message && (
                      <div className="text-sm text-red-500 mt-1">
                        {error.error_message}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HealthMonitor;
