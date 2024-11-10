"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Grid, List, Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { TruncateWords } from "@/components/TruncateWords";
import { fetchLatestHeadlines } from "@/http/news-http";

import { Article } from "@/types/news-types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { usePagination } from "@/hooks/usePagination";

export default function NewsCard() {
  const [isGrid, setIsGrid] = useState<boolean>(true);
  const [newsData, setNewsData] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    currentPage,
    maxPage,
    handlePreviousPage,
    setMaxPage,
    handleNextPage,
  } = usePagination();

  useEffect(() => {
    setIsLoading(true);
    fetchLatestHeadlines(currentPage)
      .then(({ articles, totalPageCount }) => {
        setNewsData(articles);
        setMaxPage(totalPageCount);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.message || "An error occurred. Please try again.",
        });
        setIsLoading(false);
      });
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Card className="lg:w-[70%]">
      <CardHeader className="flex flex-col sm:flex-row justify-between">
        <CardTitle className="flex justify-evenly">
          <h2>What&apos;s happening around the world?</h2>
        </CardTitle>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <List />
            <p>List View</p>
          </div>
          <Switch checked={isGrid} onCheckedChange={(e) => setIsGrid(e)} />
          <div className="flex gap-1">
            <Grid />
            <p>Grid View</p>
          </div>
        </div>
      </CardHeader>
      {isLoading ? (
        <div className="flex justify-center items-center w-full sm:h-[80%]">
          <Loader2 className="animate-spin text-gray-500" size={48} />
        </div>
      ) : (
        <CardContent
          className={`${
            isGrid ? "grid grid-cols-1 sm:grid-cols-2 gap-6" : "space-y-7"
          } overflow-y-scroll sm:h-[80%]`}
        >
          {newsData.map((item, index) => (
            <NewsDetailsCard key={index} newsData={item} />
          ))}
        </CardContent>
      )}

      <CardFooter className="flex justify-between mt-4">
        <Button
          variant="secondary"
          onClick={handlePreviousPage}
          disabled={currentPage <= 1 || isLoading}
        >
          Previous Page
        </Button>
        <p>
          {currentPage} of {maxPage}
        </p>
        <Button
          onClick={handleNextPage}
          disabled={isLoading || maxPage === currentPage}
        >
          Next Page
        </Button>
      </CardFooter>
    </Card>
  );
}

function NewsDetailsCard({ newsData }: { newsData: Article }) {
  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="relative w-full h-40">
          <Image
            src={newsData.image || "/not-found.webp"}
            alt={newsData.title}
            fill
            className="rounded object-cover"
            priority
            placeholder="blur"
            blurDataURL="/not-found.webp"
          />
        </div>
        <CardTitle>{newsData.title}</CardTitle>
        <CardDescription>
          By {newsData.author}{" "}
          {new Date(newsData.publicationDate).toLocaleDateString("en-US")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TruncateWords text={newsData.summary || ""} numWords={15} />
      </CardContent>
      <CardFooter className="flex justify-center">
        {newsData.title !== "[Removed]" && (
          <Link
            target="_blank"
            href={newsData.fullArticleLink}
            className="text-blue-400 hover:text-blue-500 hover:underline underline-offset-4 text-xl"
          >
            View Full Article
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
