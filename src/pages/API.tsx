
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const API = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleApiRequest = async () => {
      try {
        // Get the path after /api
        const path = location.pathname.replace('/api', '');
        
        // Construct the Supabase Edge Function URL
        const edgeFunctionUrl = `https://sjifhmsdzwktdglnpyba.supabase.co/functions/v1/api-proxy${path}${location.search}`;
        
        // Forward the request and get the response
        const response = await fetch(edgeFunctionUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        // Get the response data
        const data = await response.text();
        
        // Set the appropriate content type
        document.getElementsByTagName('pre')[0]?.remove(); // Clean up any existing response
        const pre = document.createElement('pre');
        pre.textContent = data;
        document.body.appendChild(pre);
        
        // Set content type header
        const contentType = response.headers.get('content-type');
        if (contentType) {
          document.getElementsByTagName('head')[0].innerHTML = `
            <meta http-equiv="Content-Type" content="${contentType}">
          `;
        }

      } catch (error) {
        console.error('API forwarding error:', error);
        navigate('/404');
      }
    };

    handleApiRequest();
  }, [location, navigate]);

  return <div id="api-response"></div>; // Container for the response
};

export default API;
