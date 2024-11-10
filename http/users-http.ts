"use server";

import { handleHttpError } from "@/lib/utils";
import { UserData } from "@/types/user-types";

const PAGELIMIT = 10;

export const fetchUsers = async (page: number = 1): Promise<UserData[]> => {
  try {
    const url = `https://${process.env.MOCK_API_PROJECT_SECRET}.mockapi.io/api/v1/users?page=${page}&limit=${PAGELIMIT}`;

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
        `Error fetching user data: ${response.status} ${response.statusText} - ${errorDetails}`
      );
    }

    return (await response.json()) as UserData[];
  } catch (error: unknown) {
    const { message, statusCode } = handleHttpError(error);
    console.error(
      `HTTP Error from users-http.ts-fetchUsersFN code: ${statusCode}:`,
      message
    );
    throw new Error(message);
  }
};
