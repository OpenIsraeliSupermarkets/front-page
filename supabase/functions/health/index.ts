import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const API_URL =
  Deno.env.get("API_URL") ?? "https://www.openisraelisupermarkets.co.il";
const TOKEN = Deno.env.get("AUTH_TOKEN") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

const ENDPOINTS = [
  `${API_URL}`,
  `${API_URL}/api/service_health`,
  `${API_URL}/api/short_term_health`,
  `${API_URL}/api/long_term_health`,
];

interface HealthCheckResult {
  endpoint: string;
  timestamp: string;
  is_healthy: boolean;
  response_time: number;
  status_code: number;
  error_message?: string;

  response_data?: any;
  is_updated?: boolean;
}

const TIMEOUT_MS = 30000; // 30 seconds timeout

serve(async () => {
  console.log("Starting health check process");
  const results: HealthCheckResult[] = [];
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log(`Checking ${ENDPOINTS.length} endpoints`);

  for (const endpoint of ENDPOINTS) {
    console.log(`Checking endpoint: ${endpoint}`);
    try {
      const startTime = Date.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const response = await fetch(endpoint, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "User-Agent": "HealthCheck/1.0",
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      console.log(
        `Response received in ${responseTime}ms with status ${response.status}`
      );
      let responseData;

      try {
        if (endpoint === `${API_URL}`) {
          // עבור דף הבית, אם יש תגובה בכלל, נחשיב אותה כתקינה
          responseData = { status: "ok", message: "Site is accessible" };
        } else {
          responseData = await response.json();
        }
        console.log("Response data:", responseData);
      } catch (e) {
        console.error("Failed to parse response as JSON:", e);
        responseData = null;
      }

      const result: HealthCheckResult = {
        endpoint,
        timestamp: new Date().toISOString(),
        is_healthy:
          response.ok &&
          (endpoint === `${API_URL}/`
            ? true // בדיקת זמינות בלבד עבור דף הבית
            : endpoint.endsWith("/service_health")
            ? responseData?.status === "healthy"
            : !responseData?.is_updated || responseData?.is_updated === true),
        response_time: responseTime,
        status_code: response.status,
        response_data: responseData,
      };

      if (!response.ok) {
        result.error_message = `HTTP error! status: ${response.status}`;
        console.error(`Error for ${endpoint}:`, result.error_message);
      }

      results.push(result);
    } catch (error) {
      console.error(`Failed to check ${endpoint}:`, error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      results.push({
        endpoint,
        timestamp: new Date().toISOString(),
        is_healthy: false,
        response_time: -1,
        status_code: error.name === "AbortError" ? 408 : 500,
        error_message:
          error.name === "AbortError" ? "Request timeout" : errorMessage,
      });
    }
  }

  console.log("Saving results to database");
  const { error } = await supabase.from("health_checks").insert(results);

  if (error) {
    console.error("Failed to save results:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

  console.log("Health check process completed successfully");
  return new Response(JSON.stringify(results), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
