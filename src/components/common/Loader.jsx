
import { LoaderCircle } from "lucide-react";

const Loader = ({
  size = 24,
  text = "Loading...",
  fullScreen = false,
}) => {
  return (
    <div
      className={`flex items-center justify-center gap-3 ${
        fullScreen ? "min-h-screen" : "py-8"
      }`}
    >
      <LoaderCircle
        size={size}
        className="animate-spin text-blue-700"
      />
      {text && (
        <span className="text-sm font-medium text-gray-600">
          {text}
        </span>
      )}
    </div>
  );
};

export default Loader;
