import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs"; // dayjs をインポート
import { redirect } from "next/navigation";
import { twMerge } from "tailwind-merge";

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

export function convertDurationStringToMinutes(duration: string): number {
  // 00:01:30 を受け取ったら 90を返す
  const [h, m, s] = duration.split(":").map(Number);
  return h * 3600 + m * 60 + s;
}

/**
 * 現在の日時が行程の時間範囲内にあるかどうかを判定する
 * @param plannedArrival 予定到着時間
 * @param stayDuration 滞在時間（例: "00:01:30"）
 * @param currentTime 現在の日時（省略時は現在時刻）
 * @returns 現在時刻が行程の時間範囲内にある場合はtrue
 */
export function isItineraryActive(
  plannedArrival: string | null | undefined,
  stayDuration: string | null | undefined,
  currentTime: Date = new Date(),
  itineraryDate?: string | null,
): boolean {
  if (!plannedArrival) return false;

  // 現在の日付
  const currentDate = dayjs(currentTime);

  // 旅程の日付と時間を組み合わせる
  let arrivalDateTime;

  // plannedArrivalが時間のみの形式（HH:MM:SS）の場合
  if (
    plannedArrival.includes(":") &&
    !plannedArrival.includes("T") &&
    !plannedArrival.includes("-")
  ) {
    if (itineraryDate) {
      // 旅程の日付と時間を組み合わせる
      const datePart = dayjs(itineraryDate).format("YYYY-MM-DD");
      arrivalDateTime = dayjs(`${datePart}T${plannedArrival}`);
    } else {
      // 日付情報がない場合は現在の日付を使用
      const datePart = currentDate.format("YYYY-MM-DD");
      arrivalDateTime = dayjs(`${datePart}T${plannedArrival}`);
    }
  } else {
    // ここはデッドコード
    // 既に日付と時間が含まれている場合
    arrivalDateTime = dayjs(plannedArrival);
  }

  // 滞在時間がない場合は到着時間のみで判定（到着時間から1時間をデフォルト滞在時間とする）
  if (!stayDuration) {
    const defaultEndTime = arrivalDateTime.add(1, "hour");
    return (
      currentDate.isAfter(arrivalDateTime) &&
      currentDate.isBefore(defaultEndTime)
    );
  }

  // 滞在時間の解析（例: "2 hr 30 min" → 150分）
  const totalMinutes = convertDurationStringToMinutes(stayDuration);

  const endTime = arrivalDateTime.add(totalMinutes, "minute");

  return currentDate.isAfter(arrivalDateTime) && currentDate.isBefore(endTime);
}

/**
 * 時間文字列（HH:MM:SS）を比較可能な数値に変換する
 * @param timeString 時間文字列（例: "14:15:00"）
 * @returns 秒数、または無効な時間の場合はInfinity
 */
export function parseTimeToSeconds(
  timeString: string | null | undefined,
): number {
  if (!timeString) return Infinity; // 時間がない場合は最後に表示

  // 時間文字列が日付を含む場合（ISO形式など）
  if (timeString.includes("T") || timeString.includes("-")) {
    return dayjs(timeString).valueOf();
  }

  // 時間のみの文字列（HH:MM:SS）の場合
  const parts = timeString.split(":");
  if (parts.length >= 2) {
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parts.length > 2 ? parseInt(parts[2], 10) : 0;

    if (!isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
      return hours * 3600 + minutes * 60 + seconds;
    }
  }

  return Infinity; // 解析できない場合は最後に表示
}
