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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format, subDays, isWithinInterval } from "date-fns";
import { he } from "date-fns/locale";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";

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

interface EndpointStatus {
  name: string;
  status: "operational" | "degraded" | "down";
  uptime: number;
  responseTime: number;
  lastCheck: Date;
}

interface UptimeInterval {
  startTime: Date;
  endTime: Date;
  isHealthy: boolean;
}

const HealthMonitor = () => {
  const [healthData, setHealthData] = useState<HealthCheck[]>([]);
  const [endpointStatuses, setEndpointStatuses] = useState<EndpointStatus[]>(
    []
  );
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("24h");
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { language } = useLanguage();

  const translations: Record<string, { he: string; en: string }> = {
    "https://www.openisraelisupermarkets.co.il/api/long_term_health": {
      he: "אחסון נתונים היסטורי",
      en: "Long Term Historical Data Storage",
    },
    "https://www.openisraelisupermarkets.co.il/api/short_term_health": {
      he: "עיבוד נתונים",
      en: "Data Processing",
    },
    "https://www.openisraelisupermarkets.co.il/api/service_health": {
      he: "פונקציונליות ה-API",
      en: "API Functionality",
    },
    "https://www.openisraelisupermarkets.co.il": {
      he: "דף הבית",
      en: "Home Page",
    },
  };

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
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

        // חישוב סטטוס לכל נקודת קצה
        const endpoints = [...new Set(data.map((check) => check.endpoint))];
        const statuses = endpoints.map((endpoint) => {
          const endpointChecks = data.filter(
            (check) => check.endpoint === endpoint
          );
          const recentChecks = endpointChecks.slice(-5);
          const lastCheck = new Date(
            endpointChecks[endpointChecks.length - 1]?.timestamp || new Date()
          );

          // חישוב זמן תגובה ממוצע
          const avgResponseTime = Math.round(
            recentChecks.reduce((acc, check) => acc + check.response_time, 0) /
              recentChecks.length
          );

          // חישוב אחוז זמינות
          const uptime = Math.round(
            (endpointChecks.filter((check) => check.is_healthy).length /
              endpointChecks.length) *
              100
          );

          // קביעת סטטוס
          let status: "operational" | "degraded" | "down" = "operational";
          const recentFailures = recentChecks.filter(
            (check) => !check.is_healthy
          ).length;
          if (recentFailures === recentChecks.length) {
            status = "down";
          } else if (recentFailures > 0) {
            status = "degraded";
          }

          return {
            name: endpoint,
            status,
            uptime,
            responseTime: avgResponseTime,
            lastCheck,
          };
        });

        setEndpointStatuses(statuses);
      } catch (error) {
        console.error("שגיאה בטעינת נתוני בריאות:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, [timeRange]);

  const getStatusColor = (status: "operational" | "degraded" | "down") => {
    switch (status) {
      case "operational":
        return "bg-green-500";
      case "degraded":
        return "bg-yellow-500";
      case "down":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getUptimeGraph = (endpoint: string) => {
    const endpointData = healthData.filter(
      (check) => check.endpoint === endpoint
    );
    const totalIntervals = 90; // מספר האינטרבלים בגרף
    const intervalSize = Math.ceil(endpointData.length / totalIntervals);

    const intervals: UptimeInterval[] = Array.from(
      { length: totalIntervals },
      (_, i) => {
        const intervalChecks = endpointData.slice(
          i * intervalSize,
          (i + 1) * intervalSize
        );
        if (intervalChecks.length === 0) {
          return {
            startTime: new Date(),
            endTime: new Date(),
            isHealthy: true,
          };
        }

        return {
          startTime: new Date(intervalChecks[0].timestamp),
          endTime: new Date(
            intervalChecks[intervalChecks.length - 1].timestamp
          ),
          isHealthy: intervalChecks.every((check) => check.is_healthy),
        };
      }
    );

    return (
      <div className="flex gap-1 h-8 overflow-hidden rounded">
        {intervals.map((interval, i) => (
          <TooltipProvider key={i}>
            <Tooltip>
              <TooltipTrigger>
                <div
                  className={`h-8 w-1 ${
                    interval.isHealthy ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {format(interval.startTime, "dd/MM HH:mm", {
                    locale: language === "he" ? he : undefined,
                  })}{" "}
                  -{" "}
                  {format(interval.endTime, "dd/MM HH:mm", {
                    locale: language === "he" ? he : undefined,
                  })}
                </p>
                <p>{interval.isHealthy ? t("healthy") : t("unhealthy")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    );
  };

  const getEndpointDisplayName = (endpoint: string) => {
    const translation = translations[endpoint];
    if (!translation) return endpoint;
    return language === "he" ? translation.he : translation.en;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        {t("loading")}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-4 rtl">
      <h1 className="text-3xl font-bold mb-6">{t("healthMonitorTitle")}</h1>

      <div className="mb-6">
        <Select
          value={timeRange}
          onValueChange={(value: "24h" | "7d" | "30d") => setTimeRange(value)}
        >
          <SelectTrigger className="w-[200px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="24h" className="hover:bg-gray-100">
              {t("last24Hours")}
            </SelectItem>
            <SelectItem value="7d" className="hover:bg-gray-100">
              {t("last7Days")}
            </SelectItem>
            <SelectItem value="30d" className="hover:bg-gray-100">
              {t("last30Days")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {endpointStatuses.map((endpointStatus) => (
          <Card key={endpointStatus.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CardTitle className="text-lg">
                    {getEndpointDisplayName(endpointStatus.name)}
                  </CardTitle>
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(
                      endpointStatus.status
                    )}`}
                  >
                    {t(endpointStatus.status)}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {format(endpointStatus.lastCheck, "dd/MM/yyyy HH:mm", {
                    locale: language === "he" ? he : undefined,
                  })}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getUptimeGraph(endpointStatus.name)}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">
                      {t("availability")}
                    </div>
                    <div className="text-2xl font-bold">
                      {endpointStatus.uptime}%
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">
                      {t("averageResponseTime")}
                    </div>
                    <div className="text-2xl font-bold">
                      {endpointStatus.responseTime} {t("milliseconds")}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">
                      {t("currentStatus")}
                    </div>
                    <div className="text-2xl font-bold">
                      {t(endpointStatus.status)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HealthMonitor;
