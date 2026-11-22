export function compareDates(date1: Date, date2: Date): number {
    return date1.getTime() - date2.getTime();
}

export function isOldEnough(date: Date, thresholdInMinutes: number): boolean {
    const now = new Date();
    const thresholdInMilliseconds = thresholdInMinutes * 60 * 1000;
    return compareDates(now, date) > thresholdInMilliseconds;
}