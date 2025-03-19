import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
  id: string;
  name: string;
  status: "operational" | "degraded" | "down";
  uptime: number;
  responseTime: number;
  lastCheck: Date;
  translations: {
    he: string;
    en: string;
  };
}

const ENDPOINTS = {
  "long-term": {
    url: "https://www.openisraelisupermarkets.co.il/api/long_term_health",
    translations: {
      he: "אחסון נתונים היסטורי",
      en: "Long Term Historical Data Storage",
    },
  },
  "short-term": {
    url: "https://www.openisraelisupermarkets.co.il/api/short_term_health",
    translations: {
      he: "עיבוד נתונים",
      en: "Data Processing",
    },
  },
  service: {
    url: "https://www.openisraelisupermarkets.co.il/api/service_health",
    translations: {
      he: "פונקציונליות ה-API",
      en: "API Functionality",
    },
  },
  home: {
    url: "https://www.openisraelisupermarkets.co.il",
    translations: {
      he: "דף הבית",
      en: "Home Page",
    },
  },
};

serve(async (req) => {
  // Handle preflight OPTIONS request for CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers":
          "Authorization, Content-Type, x-client-info, apikey",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // Create Supabase client
  const supabase = createClient(
    Deno.env.get("URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  // Get time range from query params
  const url = new URL(req.url);
  const timeRange = url.searchParams.get("timeRange") || "24h";

  try {
    // Calculate start date based on time range
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

    // Fetch health check data
    const { data, error } = await supabase
      .from("health_checks")
      .select("*")
      .gte("timestamp", startDate.toISOString())
      .order("timestamp", { ascending: true });

    if (error) throw error;

    // Process data to calculate endpoint statuses
    const statuses = Object.entries(ENDPOINTS).map(([id, config]) => {
      const endpointChecks = data.filter(
        (check: HealthCheck) => check.endpoint === config.url
      );
      const recentChecks = endpointChecks.slice(-5);
      const lastCheck = new Date(
        endpointChecks[endpointChecks.length - 1]?.timestamp || new Date()
      );

      // Calculate average response time
      const avgResponseTime = Math.round(
        recentChecks.reduce((acc, check) => acc + check.response_time, 0) /
          recentChecks.length
      );

      // Calculate uptime percentage
      const uptime = Math.round(
        (endpointChecks.filter((check) => check.is_healthy).length /
          endpointChecks.length) *
          100
      );

      // Determine status
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
        id,
        name: config.url,
        status,
        uptime,
        responseTime: avgResponseTime,
        lastCheck,
        translations: config.translations,
      };
    });

    return new Response(JSON.stringify({ statuses, healthData: data }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error processing health data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process health data" }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: 500,
      }
    );
  }
});
