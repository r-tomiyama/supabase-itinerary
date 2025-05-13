import { clsx, type ClassValue } from "clsx";
import { redirect } from "next/navigation";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs"; // dayjs をインポート

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

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return dayjs(dateString).format("YYYY/MM/DD"); // dayjs を使用
}

export function formatTime(timeString: string): string {
  return dayjs(timeString).format("HH:mm"); // dayjs を使用
}

export function calculateDuration(
  start: string | null,
  end: string | null,
): string {
  if (!start || !end) return "";

  const startDate = dayjs(start); // dayjs を使用
  const endDate = dayjs(end); // dayjs を使用
  const diffInMinutes = endDate.diff(startDate, "minute"); // dayjs を使用

  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;

  if (hours > 0) {
    return `${hours.toString()} hr ${minutes > 0 ? `${minutes.toString()} min` : ""}`;
  }
  return `${minutes.toString()} min`;
}
