import React from "react";
import { X } from "lucide-react";

const AlertBox = ({ type = "info", message, onClose }) => {
  const baseStyle =
    "flex items-start gap-3 w-full p-4 rounded-xl shadow-md transition-all";

  const typeStyles = {
    success: "bg-green-100 text-green-800 border border-green-300",
    error: "bg-red-100 text-red-800 border border-red-300",
    info: "bg-blue-100 text-blue-800 border border-blue-300",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  };

  const iconStyles = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
    warning: "⚠️",
  };

  return (
    <div className={`${baseStyle} ${typeStyles[type]}`}>
      <div className="text-xl">{iconStyles[type]}</div>
      <div className="flex-1 text-sm font-medium">{message}</div>
      {onClose && (
        <button onClick={onClose} className="text-gray-500 hover:text-black">
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default AlertBox;
