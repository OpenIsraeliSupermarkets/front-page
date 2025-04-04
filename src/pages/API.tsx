import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BackButton } from "@/components/BackButton";

const API = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleApiRequest = async () => {
      const errorPre = document.createElement("pre");
      errorPre.textContent =
        "This API endpoint is deprecated. Please check the documentation at http://api.openisraelisupermarkets.co.il/ for the latest API endpoints.";
      document.body.appendChild(errorPre);
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
