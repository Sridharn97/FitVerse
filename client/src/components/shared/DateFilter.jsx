import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DATE_FILTER_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "last-7-days", label: "Last 7 Days" },
  { value: "last-30-days", label: "Last 30 Days" },
  { value: "this-week", label: "This Week" },
  { value: "last-week", label: "Last Week" },
  { value: "this-month", label: "This Month" },
  { value: "last-month", label: "Last Month" },
  { value: "this-year", label: "This Year" },
  { value: "all-time", label: "All Time" },
];

export const DateFilter = ({ value, onValueChange, className }) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className || "w-[150px] shrink-0"}>
        <SelectValue placeholder="Date filter" />
      </SelectTrigger>
      <SelectContent>
        {DATE_FILTER_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
