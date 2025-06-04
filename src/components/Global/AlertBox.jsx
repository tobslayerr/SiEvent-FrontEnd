import React from "react";
import { X } from "lucide-react";

const AlertBox = ({ type = "info", message, onClose }) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className={`flex items-start gap-3 max-w-md w-full p-6 rounded-xl shadow-xl relative ${typeStyles[type]}`}
      >
        <div className="text-2xl">{iconStyles[type]}</div>
        <div className="flex-1 text-base font-medium">{message}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-black transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertBox;
