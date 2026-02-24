
export function toBanglaDigits(str: string | number): string {
    const english = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const bangla = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    
    let result = String(str);
    for (let i = 0; i < 10; i++) {
        result = result.replaceAll(english[i], bangla[i]);
    }
    return result;
}

export function localizeTime(timeStr: string): string {
    // Converts "3 hours ago" -> "৩ ঘণ্টা আগে"
    const localized = timeStr
        .replace("hours ago", "ঘণ্টা আগে")
        .replace("hour ago", "ঘণ্টা আগে")
        .replace("mins ago", "মিনিট আগে")
        .replace("min ago", "মিনিট আগে")
        .replace("days ago", "দিন আগে")
        .replace("day ago", "দিন আগে")
        .replace("Just now", "মাত্র");

    return toBanglaDigits(localized);
}

// New robust formatter for ISO dates
export function formatRelativeTime(dateString: string): string {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    // If future or invalid, return formatted date
    if (isNaN(diffInSeconds) || diffInSeconds < 0) {
        return formatDateBangla(date);
    }

    // Less than 24 hours (86400 seconds)
    if (diffInSeconds < 86400) {
        if (diffInSeconds < 60) {
            return "মাত্র";
        }
        const minutes = Math.floor(diffInSeconds / 60);
        if (minutes < 60) {
            return `${toBanglaDigits(minutes)} মিনিট আগে`;
        }
        const hours = Math.floor(minutes / 60);
        return `${toBanglaDigits(hours)} ঘণ্টা আগে`;
    }

    // More than 24 hours, return Date
    return formatDateBangla(date);
}

export function formatDateBangla(date: Date): string {
    const months = [
        "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
        "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
    ];
    
    const day = toBanglaDigits(date.getDate());
    const month = months[date.getMonth()];
    const year = toBanglaDigits(date.getFullYear());
    
    return `${day} ${month} ${year}`;
}
