import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute top-4 left-4 z-50"
      onClick={() => navigate(-1)}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">חזור</span>
    </Button>
  );
};
