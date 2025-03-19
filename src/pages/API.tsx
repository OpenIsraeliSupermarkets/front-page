import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BackButton } from "@/components/BackButton";
import { sanitizeHtml } from "@/lib/utils";

const API = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleApiRequest = async () => {
      try {
        // Get the path after /api
        const path = location.pathname.replace(/^\/api/, "");

        // Construct the target URL
        const targetUrl = new URL(
          path + location.search,
          import.meta.env.VITE_API_URL
        );

        // Forward the request and get the response
        const response = await fetch(targetUrl.toString(), {
          method: "GET",
          headers: {
            Accept: "application/json",
            Host: new URL(import.meta.env.VITE_API_URL).host,
          },
        });

        // Get the response body as an ArrayBuffer
        const responseBody = await response.arrayBuffer();

        // Set the appropriate content type
        document.getElementsByTagName("pre")[0]?.remove(); // Clean up any existing response
        const pre = document.createElement("pre");

        // Convert ArrayBuffer to text for display
        const decoder = new TextDecoder("utf-8");
        // Sanitize the content before setting it to prevent XSS
        const content = decoder.decode(responseBody);
        pre.textContent = content; // textContent automatically escapes HTML

        document.body.appendChild(pre);

        // Set content type and CORS headers - Using a safer approach
        const headers = {
          "Content-Type":
            response.headers.get("content-type") || "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "authorization, x-client-info, apikey, content-type",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        };

        // Create meta tags safely instead of using innerHTML
        Object.entries(headers).forEach(([key, value]) => {
          if (value) {
            const meta = document.createElement("meta");
            meta.setAttribute("http-equiv", key);
            meta.setAttribute("content", value);
            document.getElementsByTagName("head")[0].appendChild(meta);
          }
        });
      } catch (error) {
        console.error("API request failed:", error);
        
        const errorPre = document.createElement("pre");
        errorPre.textContent = "API request failed. Please try again.";
        document.body.appendChild(errorPre);
      }
    };

    handleApiRequest();
  }, [location, navigate]);

  return (
    <div className="container">
      <BackButton />
    </div>
  );
};

export default API;
