import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to get Bangla numeral
const toBanglaNumeral = (num: number) => {
  const banglaNumerals = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num.toString().split("").map(d => banglaNumerals[parseInt(d)] || d).join("");
};

// Helper to get Bangla month
const getBanglaMonth = (monthIndex: number) => {
  const banglaMonths = [
    "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
    "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
  ];
  return banglaMonths[monthIndex];
};

export function formatBanglaDate(dateInput: string | Date | undefined): string {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  const day = toBanglaNumeral(date.getDate());
  const month = getBanglaMonth(date.getMonth());
  const year = toBanglaNumeral(date.getFullYear());

  return `${day} ${month} ${year}`;
}

export function formatBanglaTime(dateInput: string | Date | undefined): string {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  const hours = date.getHours();
  const minutes = toBanglaNumeral(date.getMinutes());

  let period = "";
  if (hours >= 5 && hours < 12) period = "সকাল";
  else if (hours >= 12 && hours < 16) period = "দুপুর";
  else if (hours >= 16 && hours < 18) period = "বিকেল";
  else if (hours >= 18 && hours < 20) period = "সন্ধ্যা";
  else if (hours >= 20 && hours <= 23) period = "রাত";
  else period = "রাত"; // 12 AM - 5 AM

  const twelveHour = hours % 12 || 12;
  const banglaHour = toBanglaNumeral(twelveHour);

  return `${period} ${banglaHour}:${minutes}`;
}

export function formatBanglaDateTime(dateInput: string | Date | undefined): string {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  return `${formatBanglaDate(date)}, ${formatBanglaTime(date)}`;
}
