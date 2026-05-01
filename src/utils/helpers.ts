// Formats ISO date strings into a readable Norwegian date and time.
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("nb-NO", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// Formats the remaining time until a date in a readable way.
export function formatTimeRemaining(dateString: string): string {
  const targetDate = new Date(dateString);
  const now = new Date();

  const differenceInMs = targetDate.getTime() - now.getTime();

  if (differenceInMs <= 0) {
    return "Auction ended";
  }

  const totalMinutes = Math.floor(differenceInMs / (1000 * 60));
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  const remainingHours = totalHours % 24;
  const remainingMinutes = totalMinutes % 60;

  if (totalDays >= 1) {
    if (remainingHours === 0) {
      return `${totalDays} day${totalDays === 1 ? "" : "s"} left`;
    }

    return `${totalDays} day${totalDays === 1 ? "" : "s"}, ${remainingHours} hour${remainingHours === 1 ? "" : "s"} left`;
  }

  if (totalHours >= 1) {
    if (remainingMinutes === 0) {
      return `${totalHours} hour${totalHours === 1 ? "" : "s"} left`;
    }

    return `${totalHours} hour${totalHours === 1 ? "" : "s"}, ${remainingMinutes} minute${remainingMinutes === 1 ? "" : "s"} left`;
  }

  return `${totalMinutes} minute${totalMinutes === 1 ? "" : "s"} left`;
}

// Formats the remaining time until a date in a short live countdown format.
export function formatLiveTimeRemaining(dateString: string): string {
  const targetDate = new Date(dateString);
  const now = new Date();

  const differenceInMs = targetDate.getTime() - now.getTime();

  if (differenceInMs <= 0) {
    return "Auction ended";
  }

  const totalSeconds = Math.floor(differenceInMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${seconds}s left`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s left`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s left`;
  }

  return `${seconds}s left`;
}

// Returns the countdown urgency style based on remaining time.
export function getCountdownTone(dateString: string): string {
  const targetDate = new Date(dateString);
  const now = new Date();

  const differenceInMs = targetDate.getTime() - now.getTime();

  if (differenceInMs <= 0) {
    return "text-red-600 font-medium";
  }

  const hoursRemaining = differenceInMs / (1000 * 60 * 60);

  if (hoursRemaining < 1) {
    return "text-red-600 font-medium";
  }

  if (hoursRemaining < 24) {
    return "text-orange-600 font-medium";
  }

  return "text-text-muted";
}

// Reads and parses JSON data from localStorage.
export function getFromStorage<T>(key: string): T | null {
  const value = localStorage.getItem(key);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

// Saves data to localStorage as JSON.
export function saveToStorage(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Removes a value from localStorage.
export function removeFromStorage(key: string): void {
  localStorage.removeItem(key);
}
