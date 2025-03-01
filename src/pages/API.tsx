import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BackButton } from "@/components/BackButton";

const API = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleApiRequest = async () => {
      try {
        // Get the path after /api
        const path = location.pathname.replace("/api", "");

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
        pre.textContent = decoder.decode(responseBody);
        document.body.appendChild(pre);

        // Set content type and CORS headers
        const headers = {
          "Content-Type":
            response.headers.get("content-type") || "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "authorization, x-client-info, apikey, content-type",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        };

        Object.entries(headers).forEach(([key, value]) => {
          if (value) {
            document.getElementsByTagName("head")[0].innerHTML += `
              <meta http-equiv="${key}" content="${value}">
            `;
          }
        });
      } catch (error) {
        console.error("API forwarding error:", error);
        navigate("/404");
      }
    };

    handleApiRequest();
  }, [location, navigate]);

  return (
    <div>
      <BackButton />
      <div id="api-response" className="pt-16"></div>
    </div>
  );
};

export default API;
