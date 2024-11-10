import { useState } from "react";

export function usePagination(initialPage: number = 1) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [maxPage, setMaxPage] = useState<number>(0);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < maxPage) setCurrentPage(currentPage + 1);
  };

  const setPage = (page: number) => {
    if (page >= 1 && page <= maxPage) {
      setCurrentPage(page);
    }
  };

  return {
    currentPage,
    maxPage,
    setMaxPage,
    handlePreviousPage,
    handleNextPage,
    setPage,
  };
}
