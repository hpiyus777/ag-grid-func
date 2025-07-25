import type { CrewCard, CrewCardHistory, FormData } from "../../../Types";

export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
  })} ${formatTime(dateString)}`;
};

export const calculateTotalHours = (card: CrewCard): string => {
  if (!card.clockInTime) return "00:00 Hrs";
  const start = new Date(card.clockInTime).getTime();
  const end = card.clockOutTime
    ? new Date(card.clockOutTime).getTime()
    : Date.now();
  const breakTime = card.totalBreakTime || 0;
  const totalMs = end - start - breakTime;
  const hours = Math.floor(totalMs / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} Hrs`;
};

export const addHistoryEntry = (
  action: CrewCardHistory["action"],
  card: CrewCard,
  formData: FormData
) => {
  const entry: CrewCardHistory = {
    timestamp: new Date().toISOString(),
    action,
    employee: formData.employees || "",
    project: formData.project,
    costCode: formData.costCode,
  };
  return [...(card.history || []), entry];
};
