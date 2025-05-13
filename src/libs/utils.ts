import { redirect } from "next/navigation";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', { 
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatTime(timeString: string): string {
  const date = new Date(timeString);
  return date.toLocaleTimeString('ja-JP', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
}

export function calculateDuration(start: string | null, end: string | null): string {
  if (!start || !end) return '';
  
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffInMinutes = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60));
  
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;
  
  if (hours > 0) {
    return `${hours} hr ${minutes > 0 ? `${minutes} min` : ''}`;
  }
  return `${minutes} min`;
}
