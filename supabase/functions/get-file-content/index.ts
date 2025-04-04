import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const API_URL =
  Deno.env.get("API_URL") ?? "http://api.openisraelisupermarkets.co.il:8080";
const AUTH_TOKEN = Deno.env.get("AUTH_TOKEN") ?? "";

serve(async (req) => {
  // Handle preflight OPTIONS request for CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  try {
    const url = new URL(req.url);
    const chain = url.searchParams.get("chain");
    const file = url.searchParams.get("file");

    if (!chain || !file) {
      throw new Error("Chain and file parameters are required");
    }

    const response = await fetch(
      `${API_URL}/raw/file_content?chain=${encodeURIComponent(
        chain
      )}&file=${encodeURIComponent(file)}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}); 