// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

console.log("Hello from Functions!");

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Add a function to create consistent headers with CORS
function createResponseHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // In production, specify your actual origin
  };
}

serve(async (req) => {
  // Handle preflight OPTIONS request for CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*", // In production, specify your actual origin instead of *
        "Access-Control-Allow-Methods": "POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Authorization, Content-Type, x-client-info, apikey",
        "Access-Control-Max-Age": "86400", // 24 hours
      },
    });
  }

  // Get token ID from the request body instead of URL
  const { tokenId } = await req.json();
  
  if (!tokenId) {
    return new Response(JSON.stringify({ error: "Token ID is required" }), {
      headers: createResponseHeaders(),
      status: 400,
    });
  }

  // Create a Supabase client with the Auth context
  const supabaseClient = createClient(
    Deno.env.get("URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    }
  );

  // Get the user from the Auth context
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser();

  if (userError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      headers: createResponseHeaders(),
      status: 401,
    });
  }

  // Verify token ownership
  const { data: tokenData, error: tokenError } = await supabaseClient
    .from("api_tokens")
    .select("user_id, name")
    .eq("id", tokenId)
    .single();

  if (tokenError || !tokenData) {
    return new Response(JSON.stringify({ error: "Token not found" }), {
      headers: createResponseHeaders(),
      status: 404,
    });
  }

  if (tokenData.user_id !== user.id) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      headers: createResponseHeaders(),
      status: 403,
    });
  }

  if (tokenData.name === "Playground") {
    return new Response(
      JSON.stringify({ error: "Cannot deactivate Playground token" }),
      {
        headers: createResponseHeaders(),
        status: 400,
      }
    );
  }

  // Deactivate the token
  const { data, error } = await supabaseClient
    .from("api_tokens")
    .update({ is_active: false })
    .eq("id", tokenId)
    .select();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: createResponseHeaders(),
      status: 500,
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: createResponseHeaders(),
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/deactivate-token' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
