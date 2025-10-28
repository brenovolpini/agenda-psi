import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  bookedDates?: string[];
}

export function Calendar({ selectedDate, onDateSelect, bookedDates = [] }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isDateBooked = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return bookedDates.includes(dateStr);
  };

  const isDatePast = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isDateToday = (day: number) => {
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isWeekend = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const handleDateClick = (day: number) => {
    if (isDatePast(day) || isWeekend(day)) return;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onDateSelect(date);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={previousMonth}
            data-testid="button-prev-month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={nextMonth}
            data-testid="button-next-month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}

        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const isPast = isDatePast(day);
          const isSelected = isDateSelected(day);
          const isToday = isDateToday(day);
          const isBooked = isDateBooked(day);
          const weekend = isWeekend(day);
          const isDisabled = isPast || weekend;

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              disabled={isDisabled}
              data-testid={`button-date-${day}`}
              className={cn(
                "aspect-square rounded-md text-sm font-medium transition-all",
                "hover-elevate active-elevate-2",
                "flex items-center justify-center",
                isDisabled && "opacity-40 cursor-not-allowed no-default-hover-elevate no-default-active-elevate",
                !isDisabled && !isSelected && "bg-background border border-border",
                isSelected && "bg-primary text-primary-foreground shadow-sm border border-primary-border",
                isToday && !isSelected && "border-2 border-primary",
                isBooked && !isSelected && "bg-muted border-muted-border"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-primary border border-primary-border" />
          <span>Selecionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md border-2 border-primary" />
          <span>Hoje</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-muted border border-muted-border" />
          <span>Ocupado</span>
        </div>
      </div>
    </div>
  );
}