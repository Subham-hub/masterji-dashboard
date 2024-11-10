"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePagination } from "@/hooks/usePagination";
import { useToast } from "@/hooks/use-toast";
import { fetchUsers } from "@/http/users-http";
import { Input } from "@/components/ui/input";
import { UserData } from "@/types/user-types";

const UserTable = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [userData, setUserData] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const {
    currentPage,
    maxPage,
    setMaxPage,
    handlePreviousPage,
    handleNextPage,
  } = usePagination();

  useEffect(() => {
    setIsLoading(true);
    fetchUsers(currentPage)
      .then((data) => {
        setUserData(data);
        setMaxPage(Math.ceil(35 / 10)); //mock limit
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
    <>
      {isLoading && <Loader2 className="animate-spin h-16 w-16" />}
      {!isLoading && (
        <div>
          <Input
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-1/5 mb-3"
            placeholder="Search Users..."
          />
          <div className="overflow-x-auto mb-5">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Company</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userData
                  .filter((user) => user.name.includes(searchQuery))
                  .map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.website}</TableCell>
                      <TableCell>{user.company}</TableCell>
                    </TableRow>
                  ))}
                <TableRow>
                  <TableCell className="font-semibold" colSpan={5}>
                    Total Users
                  </TableCell>
                  <TableCell className="font-medium">
                    {userData.length} Users
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <Pagination className="mb-5">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  disabled={currentPage <= 1 || isLoading}
                  onClick={handlePreviousPage}
                />
              </PaginationItem>
              <PaginationItem>
                {currentPage} of {maxPage}
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  disabled={isLoading || maxPage === currentPage}
                  onClick={handleNextPage}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
};

export default UserTable;
