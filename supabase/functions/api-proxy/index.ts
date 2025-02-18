
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

const TARGET_URL = "http://erlichsefi.ddns.net:8080"

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const targetUrl = new URL(url.pathname + url.search, TARGET_URL)

    const response = await fetch(targetUrl.toString(), {
      method: req.method,
      headers: {
        ...Object.fromEntries(req.headers),
        // Remove headers that might cause issues
        'host': new URL(TARGET_URL).host,
      },
      body: req.method !== "GET" && req.method !== "HEAD" ? req.body : null,
    })

    // Get the response body as an ArrayBuffer
    const responseBody = await response.arrayBuffer()

    // Return the response with CORS headers
    return new Response(responseBody, {
      status: response.status,
      headers: {
        ...Object.fromEntries(response.headers),
        ...corsHeaders,
      },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    })
  }
})
