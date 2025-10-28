import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAppointmentSchema, type InsertAppointment, appointmentTypes } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, User, Mail, Phone, FileText } from "lucide-react";

interface AppointmentFormProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onSubmit: (data: InsertAppointment) => void;
  isPending?: boolean;
}

export function AppointmentForm({ selectedDate, selectedTime, onSubmit, isPending }: AppointmentFormProps) {
  const form = useForm<InsertAppointment>({
    resolver: zodResolver(insertAppointmentSchema),
    defaultValues: {
     patientEmail: "",
      patientPhone: "",
      appointmentType: "",
      date: selectedDate
        ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
        : "",
      time: selectedTime || "",
      date: "",
      time: "",
      notes: "",
    },
  });

 useEffect(() => {
    if (selectedDate) {
      const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
      form.setValue('date', dateStr);
    }
  }, [selectedDate, form]);
  useEffect(() => {
    if (selectedTime) {
      form.setValue('time', selectedTime);
    }
  }, [selectedTime, form]);

 const handleSubmit = (data: InsertAppointment) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-accent rounded-md border border-accent-border">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-accent-foreground">Data e Hora Selecionadas</p>
              <p className="text-base font-semibold text-foreground font-mono">
                {selectedDate && selectedTime
                  ? `${selectedDate.toLocaleDateString('pt-BR')} às ${selectedTime}`
                  : "Selecione no calendário"}
              </p>
            </div>
          </div>

          <FormField
            control={form.control}
            name="appointmentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-medium">Tipo de Consulta</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-appointment-type">
                      <SelectValue placeholder="Selecione o tipo de consulta" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {appointmentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="patientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-medium">Nome Completo</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Seu nome completo"
                      className="pl-10"
                      data-testid="input-patient-name"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="patientEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-medium">Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10"
                      data-testid="input-patient-email"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="patientPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-medium">Telefone</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="(00) 00000-0000"
                      className="pl-10"
                      data-testid="input-patient-phone"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-medium">Observações (Opcional)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      placeholder="Alguma informação adicional..."
                      className="pl-10 min-h-[100px] resize-none"
                      data-testid="input-notes"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isPending || !selectedDate || !selectedTime}
          data-testid="button-submit-appointment"
        >
          {isPending ? "Agendando..." : "Confirmar Agendamento"}
        </Button>
      </form>
    </Form>
  );
}