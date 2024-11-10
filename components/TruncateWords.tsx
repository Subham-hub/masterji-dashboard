import React from "react";

import { Button } from "./ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TruncateWordsProps {
  text: string;
  numWords: number;
  onReadMore?: () => void;
}

export function TruncateWords({
  text,
  numWords,
  onReadMore,
}: TruncateWordsProps) {
  if (onReadMore && typeof onReadMore !== "function") {
    throw new Error("onReadMore must be a function");
  }

  const words = text.split(" ");
  if (words.length <= numWords) {
    return <>{text}</>;
  }

  const truncatedText = words.slice(0, numWords).join(" ") + " ";

  const handleCBReadMore = () => {
    if (onReadMore) {
      onReadMore();
    }
  };

  return (
    <>
      <p> {truncatedText}...</p>
      <Popover open={onReadMore ? false : undefined}>
        <PopoverTrigger asChild>
          <Button variant="link" className="p-0" onClick={handleCBReadMore}>
            Read More
          </Button>
        </PopoverTrigger>
        <PopoverContent>{text}</PopoverContent>
      </Popover>
    </>
  );
}
