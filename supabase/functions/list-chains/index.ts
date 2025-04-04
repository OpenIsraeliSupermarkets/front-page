import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const API_URL =
  Deno.env.get("API_URL") ?? "http://api.openisraelisupermarkets.co.il:8080";

serve(async (req) => {
  console.log("Received request to list-chains");

  // Handle preflight OPTIONS request for CORS
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request");
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  try {
    const { token } = await req.json();
    console.log("Extracted playground token:", token ? "present" : "missing");

    if (!token) {
      throw new Error("Playground token is required");
    }

    console.log("Making request to API:", `${API_URL}/list_chains`);
    const response = await fetch(`${API_URL}/list_chains`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error(
        "API request failed:",
        response.status,
        response.statusText
      );
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Successfully retrieved chains data");

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error in list-chains:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
