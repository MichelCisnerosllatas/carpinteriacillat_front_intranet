import { handleApiError } from "@/shared/api/v1/handleApiError";
import { toast } from "react-hot-toast";

export function getApiErrorHandler() {
    return <T,>(error: unknown) => {
        const result = handleApiError<T>(error);
        toast.error(result.message);
        return result;
    };
}
