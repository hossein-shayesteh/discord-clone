import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to fetch data from a given URL
export const fetcher = (url: string) => fetch(url).then((res) => res.json());
