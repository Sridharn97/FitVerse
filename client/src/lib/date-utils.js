import {
  startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, subWeeks,
  startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear
} from "date-fns";

export const getDateRange = (filter, now = new Date()) => {
  switch (filter) {
    case "today":
      return { start: startOfDay(now), end: endOfDay(now) };
    case "last-7-days":
      return { start: startOfDay(subDays(now, 6)), end: endOfDay(now) };
    case "last-30-days":
      return { start: startOfDay(subDays(now, 29)), end: endOfDay(now) };
    case "this-week":
      return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
    case "last-week":
      const lastWeek = subWeeks(now, 1);
      return { start: startOfWeek(lastWeek, { weekStartsOn: 1 }), end: endOfWeek(lastWeek, { weekStartsOn: 1 }) };
    case "this-month":
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case "last-month":
      const lastMonth = subMonths(now, 1);
      return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
    case "this-year":
      return { start: startOfYear(now), end: endOfYear(now) };
    case "all-time":
      return { start: new Date(0), end: new Date(8640000000000000) };
    default:
      return { start: startOfMonth(now), end: endOfMonth(now) };
  }
};

export const formatFilterLabel = (filter) => {
  return filter.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};
