"use client";

import { useState, useEffect } from "react";
import { useToast } from "./use-toast";

type UseLocalStorage<T> = [T | undefined, (value: T) => void];

export function useLocalStorage<T>(
  key: string,
  initialValue?: T
): UseLocalStorage<T> {
  const [storedValue, setStoredValue] = useState<T | undefined>(initialValue);
  const { toast } = useToast();
  const extendedKey = `__dashboard_app_${key}__`;

  const setValue = (newValue: T): void => {
    if (typeof window === "undefined") return;

    try {
      const valueToStore =
        newValue instanceof Object ? JSON.stringify(newValue) : newValue;
      localStorage.setItem(extendedKey, valueToStore as string);
      setStoredValue(newValue);
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("error setting localStorage key", extendedKey, error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "An error occurred. Please try again.",
      });
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = () => {
      const item = localStorage.getItem(extendedKey);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    };

    try {
      const storedValue = localStorage.getItem(extendedKey);
      if (storedValue) {
        setStoredValue(JSON.parse(storedValue));
      } else if (initialValue) {
        setValue(initialValue);
      }
    } catch (error) {
      console.error("Error reading localStorage key", extendedKey, error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "An error occurred. Please try again.",
      });
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return [storedValue, setValue];
}
