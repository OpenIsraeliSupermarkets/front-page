
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
        
        // Forward to the edge function URL
        window.location.href = edgeFunctionUrl;
      } catch (error) {
        console.error('API forwarding error:', error);
        navigate('/404');
      }
    };

    handleApiRequest();
  }, [location, navigate]);

  return null; // This component doesn't render anything
};

export default API;
