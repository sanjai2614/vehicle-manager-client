
import { FileX } from "lucide-react";

const EmptyState = ({
  title = "No records found",
  description = "There is no data to display right now.",
  icon: Icon = FileX,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 rounded-full bg-gray-100 p-4 text-gray-500">
        <Icon size={30} />
      </div>

      <h3 className="text-lg font-semibold text-gray-800">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-sm text-gray-500">
        {description}
      </p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;
