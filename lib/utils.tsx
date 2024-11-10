import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleHttpError(error: unknown): {
  message: string;
  statusCode: number;
} {
  if (error instanceof Error) {
    if (error.message.includes("fetch")) {
      return {
        message: "Network error: Unable to reach the server.",
        statusCode: 503,
      };
    } else if (error.message.includes("Error fetching users")) {
      return {
        message: "Error fetching users: Bad request or internal error.",
        statusCode: 400,
      };
    }
    return { message: error.message, statusCode: 500 };
  } else {
    return { message: "An unexpected error occurred.", statusCode: 500 };
  }
}
