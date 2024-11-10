"use server";

import { Article } from "@/types/news-types";
import { handleHttpError } from "@/lib/utils";

const PAGESIZE = 10;

export async function fetchLatestHeadlines(
  page: number = 1
): Promise<{ articles: Article[]; totalPageCount: number }> {
  const newsApiUrl = "https://newsapi.org/v2/top-headlines?country=us";

  try {
    const url = `${newsApiUrl}&apiKey=${process.env.NEWS_API_KEY}&pageSize=${PAGESIZE}&page=${page}`;

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
        `Error fetching headlines: ${response.status} ${response.statusText} - ${errorDetails}`
      );
    }

    const data = await response.json();

    const totalResults = data.totalResults;
    const totalPageCount = Math.ceil(totalResults / PAGESIZE);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- no energy to write soo big interface
    const articles: Article[] = data.articles.map((article: any) => ({
      title: article.title,
      image: article.urlToImage || null,
      author: article.author || "Unknown",
      publicationDate: article.publishedAt,
      summary: article.description || null,
      fullArticleLink: article.url,
    }));

    return { articles, totalPageCount };
  } catch (error: unknown) {
    const { message, statusCode } = handleHttpError(error);
    console.error(
      `HTTP Error from news-http.ts-fetchLatestHeadlinesFN, code: ${statusCode}:`,
      message
    );
    throw new Error(message || "Failed to fetch data from NewsAPI");
  }
}
