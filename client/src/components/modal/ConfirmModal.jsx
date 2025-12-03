import React from "react";
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  isLoading = false
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = async() => {
    try {
      await onConfirm();
    } catch (error) {
      console.log(error.message)
    }
  };

  // Variant styles
  const variantStyles = {
    default: {
      icon: Info,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    danger: {
      icon: AlertTriangle,
      iconColor: "text-red-600",
      bgColor: "bg-red-100",
      buttonColor: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      icon: AlertCircle,
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-100",
      buttonColor: "bg-yellow-600 hover:bg-yellow-700",
    },
    success: {
      icon: CheckCircle,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
      buttonColor: "bg-green-600 hover:bg-green-700",
    }
  };

  const currentVariant = variantStyles[variant];
  const IconComponent = currentVariant.icon;

  return (
    <div
      className="fixed inset-0 w-full h-full bg-black/50 flex justify-center items-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-md transform transition-all duration-200 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`p-2 ${currentVariant.bgColor} rounded-lg`}>
              <IconComponent className={`w-5 h-5 ${currentVariant.iconColor}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Message */}
        <div className="p-6">
          <p className="text-gray-600 whitespace-pre-wrap">{message}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-gray-300"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 ${currentVariant.buttonColor} text-white py-3 px-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;