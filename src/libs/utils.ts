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

export function formatTimeForInput(dateTimeString: string): string {
  return dayjs(dateTimeString).format("HH:mm:ss");
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

/**
 * 現在の日時が行程の時間範囲内にあるかどうかを判定する
 * @param plannedArrival 予定到着時間
 * @param stayDuration 滞在時間（例: "2 hr 30 min"）
 * @param currentTime 現在の日時（省略時は現在時刻）
 * @returns 現在時刻が行程の時間範囲内にある場合はtrue
 */
export function isItineraryActive(
  plannedArrival: string | null | undefined,
  stayDuration: string | null | undefined,
  currentTime: Date = new Date()
): boolean {
  if (!plannedArrival) return false;
  
  const arrivalTime = dayjs(plannedArrival);
  
  // 滞在時間がない場合は到着時間のみで判定（到着時間から1時間をデフォルト滞在時間とする）
  if (!stayDuration) {
    const defaultEndTime = arrivalTime.add(1, 'hour');
    return dayjs(currentTime).isAfter(arrivalTime) && dayjs(currentTime).isBefore(defaultEndTime);
  }
  
  // 滞在時間の解析（例: "2 hr 30 min" → 150分）
  let totalMinutes = 0;
  const hourMatch = stayDuration.match(/(\d+)\s*hr/);
  const minuteMatch = stayDuration.match(/(\d+)\s*min/);
  
  if (hourMatch) totalMinutes += parseInt(hourMatch[1]) * 60;
  if (minuteMatch) totalMinutes += parseInt(minuteMatch[1]);
  
  const endTime = arrivalTime.add(totalMinutes, 'minute');
  
  return dayjs(currentTime).isAfter(arrivalTime) && dayjs(currentTime).isBefore(endTime);
}
