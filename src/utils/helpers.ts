// Format ISO date strings into a readable Norwegian date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("nb-NO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

// Read and parse JSON data from localStorage
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

// Save data to localStorage as JSON
export function saveToStorage(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Remove a value from localStorage
export function removeFromStorage(key: string): void {
  localStorage.removeItem(key);
}
