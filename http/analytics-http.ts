import { handleHttpError } from "@/lib/utils";
import { AnalyticsType } from "@/types/analytics-types";

export const fetchUserActivity = async (): Promise<AnalyticsType> => {
  try {
    const url = `https://${process.env.MOCK_API_PROJECT_SECRET}.mockapi.io/api/v1/analytics`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "force-cache",
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(
        `Error fetching user activity: ${response.status} ${response.statusText} - ${errorDetails}`
      );
    }

    const data = await response.json();

    return data[1] as AnalyticsType;
  } catch (error: unknown) {
    const { message, statusCode } = handleHttpError(error);
    console.error(
      `HTTP Error from anayltics-http.ts-fetchUserActivityFN, code: ${statusCode}:`,
      message
    );
    throw new Error(message || "Failed to fetch user activity data");
  }
};

export const fetchMonthlySales = async (): Promise<AnalyticsType> => {
  try {
    const url = `https://${process.env.MOCK_API_PROJECT_SECRET}.mockapi.io/api/v1/analytics`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "force-cache",
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(
        `Error fetching monthly sales: ${response.status} ${response.statusText} - ${errorDetails}`
      );
    }

    const data = await response.json();

    return data[0] as AnalyticsType;
  } catch (error: unknown) {
    const { message, statusCode } = handleHttpError(error);
    console.error(
      `HTTP Error from anayltics-http.ts-fetchMonthlySalesFN, code: ${statusCode}:`,
      message
    );
    throw new Error(message || "Failed to fetch monthly sales data");
  }
};
