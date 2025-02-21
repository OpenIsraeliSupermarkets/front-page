import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

const TARGET_URL = "http://erlichsefi.ddns.net:8080";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);

    // Remove either URL prefix pattern
    const cleanPathname = url.pathname
      .replace("/functions/v1/api-proxy", "")
      .replace("/api-proxy", "");

    const targetUrl = new URL(cleanPathname + url.search, TARGET_URL);

    // Log incoming request details
    console.log("Incoming request:", {
      method: req.method,
      url: req.url,
      targetUrl: targetUrl.toString(),
      headers: Object.fromEntries(req.headers),
      pathname: url.pathname,
      cleanPathname: cleanPathname,
      search: url.search,
    });

    // Log request body for non-GET requests
    if (req.method !== "GET" && req.method !== "HEAD") {
      try {
        const clonedReq = req.clone();
        const bodyText = await clonedReq.text();
        console.log("Request body:", bodyText);
      } catch (e) {
        console.log("Could not read request body:", e);
      }
    }

    const response = await fetch(targetUrl.toString(), {
      method: req.method,
      headers: {
        ...Object.fromEntries(req.headers),
        // Remove headers that might cause issues
        host: new URL(TARGET_URL).host,
      },
      body: req.method !== "GET" && req.method !== "HEAD" ? req.body : null,
    });

    // Get the response body as an ArrayBuffer
    const responseBody = await response.arrayBuffer();

    // Log response details
    console.log("Response:", {
      status: response.status,
      headers: Object.fromEntries(response.headers),
      size: responseBody.byteLength,
    });

    // Return the response with CORS headers
    return new Response(responseBody, {
      status: response.status,
      headers: {
        ...Object.fromEntries(response.headers),
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
});
