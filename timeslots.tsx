import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { timeSlots } from "@shared/schema";

interface TimeSlotsProps {
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  bookedTimes?: string[];
  selectedDate: Date | null;
}

export function TimeSlots({ selectedTime, onTimeSelect, bookedTimes = [], selectedDate }: TimeSlotsProps) {
  if (!selectedDate) {
    return (
      <div className="text-center py-12">
        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Selecione uma data primeiro</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 text-foreground">
        Horários Disponíveis
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {timeSlots.map((time) => {
          const isBooked = bookedTimes.includes(time);
          const isSelected = selectedTime === time;

          return (
            <Button
              key={time}
              onClick={() => onTimeSelect(time)}
              disabled={isBooked}
              variant={isSelected ? "default" : "outline"}
              data-testid={`button-time-${time.replace(":", "-")}`}
              className={cn(
                "font-mono text-base",
                isBooked && "opacity-40 cursor-not-allowed"
              )}
            >
              {time}
            </Button>
          );
        })}
      </div>
    </div>
  );
}