import { Eye, Pencil, Trash2 } from "lucide-react";

const ActionButtons = ({
  onView,
  onEdit,
  onDelete,
  showView = true,
  showEdit = true,
  showDelete = true,
  disabled = false,
}) => {
  const actions = [
    {
      key: "view",
      label: "View Details",
      icon: Eye,
      show: showView,
      onClick: onView,
      className: "text-blue-600 hover:bg-blue-50",
    },
    {
      key: "edit",
      label: "Edit",
      icon: Pencil,
      show: showEdit,
      onClick: onEdit,
      className: "text-amber-600 hover:bg-amber-50",
    },
    {
      key: "delete",
      label: "Delete",
      icon: Trash2,
      show: showDelete,
      onClick: onDelete,
      className: "text-red-600 hover:bg-red-50",
    },
  ];

  return (
    <div className="flex items-center gap-1">
      {actions
        .filter((action) => action.show)
        .map(({ key, label, icon: Icon, onClick, className }) => (
          <button
            key={key}
            type="button"
            title={label}
            aria-label={label}
            onClick={onClick}
            disabled={disabled || !onClick}
            className={`rounded-lg p-2 transition disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
          >
            <Icon size={17} />
          </button>
        ))}
    </div>
  );
};

export default ActionButtons;
