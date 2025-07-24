import { useContext } from "react";
import { ToastContext } from "@/app/components/contexts/ToastContext";

export const useApiErrorHandler = () => {
  const { showErrorToast, showSuccessToast } = useContext(ToastContext);

  const handleApiError = (error: string, customTitle?: string) => {
    const title = customTitle || "Operation Failed";
    showErrorToast(title, error);
  };

  const handleApiSuccess = (message: string, customTitle?: string) => {
    const title = customTitle || "Success";
    showSuccessToast(title, message);
  };

  const wrapApiCall = async <T>(
    apiCall: () => Promise<T & { error?: string }>,
    successMessage?: string,
    errorTitle?: string
  ): Promise<T | null> => {
    try {
      const result = await apiCall();

      if (result.error) {
        handleApiError(result.error, errorTitle);
        return null;
      }

      if (successMessage) {
        handleApiSuccess(successMessage);
      }

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      handleApiError(errorMessage, errorTitle);
      return null;
    }
  };

  return {
    handleApiError,
    handleApiSuccess,
    wrapApiCall,
  };
};
