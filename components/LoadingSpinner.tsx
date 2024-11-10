import React from "react";
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ fullPage = false }: { fullPage?: boolean }) => {
  return (
    <div
      className={`${
        fullPage ? "min-h-screen" : ""
      } flex items-center justify-center`}
    >
      <Loader2 className="animate-spin h-16 w-16" />
    </div>
  );
};

export default LoadingSpinner;
