export function formatTimeWithoutSeconds(timeString) {
  const [hours, minutes] = timeString.split(":");
  return `${hours}:${minutes}`;
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}
