import { isRedirectError } from "next/dist/client/components/redirect-error";

type ActionOptions<T> = {
  action: () => Promise<T>; // Function to execute
  successMessage?: string; // Custom success message
  errorMessage?: string; // Custom fallback error message
  onSuccess?: (data: T) => void; // Optional success callback
  onError?: (error: unknown) => void; // Optional error callback
  logErrors?: boolean; // Whether to log errors to console
};

type ActionResult<T> = {
  success: boolean;
  message: string;
  data?: T;
  error?: unknown;
};

const executeAction = async <T>({
  action: action,
  successMessage = "The action was successful",
  errorMessage = "An error has occurred while executing the action",
  onSuccess,
  onError,
  logErrors = true,
}: ActionOptions<T>): Promise<ActionResult<T>> => {
  try {
    const data = await action();

    if (onSuccess) onSuccess(data); // Call success callback if provided

    return { success: true, message: successMessage, data };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error; // Let Next.js handle redirects
    }

    if (logErrors) {
      console.error("Error executing action:", error);
    }

    if (onError) onError(error); // Call error callback if provided

    return {
      success: false,
      message: error instanceof Error ? error.message : errorMessage,
      error,
    };
  }
};

export { executeAction };
