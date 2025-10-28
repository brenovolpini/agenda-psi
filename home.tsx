import { useState } from "react";
import { Calendar } from "@/components/Calendar";
import { TimeSlots } from "@/components/TimeSlots";
import { AppointmentForm } from "@/components/AppointmentForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type InsertAppointment } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CalendarCheck, Sparkles } from "lucide-react";
import clinicImage from "@assets/stock_images/modern_medical_clini_f76a49ce.jpg";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: appointments } = useQuery({
    queryKey: ['/api/appointments'],
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: InsertAppointment) => {
      return await apiRequest('POST', '/api/appointments', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      toast({
        title: "Agendamento Confirmado!",
        description: "Você receberá um email de confirmação em breve.",
      });
      setSelectedDate(null);
      setSelectedTime(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao Agendar",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
   ,
  });
  const bookedDates = appointments?.map((apt: any) => apt.date) || [];
  const confirmedAppointments = appointments?.filter((apt: any) => apt.status === 'confirmed') || [];
  const bookedDates = confirmedAppointments.map((apt: any) => apt.date);
  const bookedTimesForDate = selectedDate
    ? appointments
        ?.filter((apt: any) => apt.date === `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`)
        .map((apt: any) => apt.time) || []
    ? confirmedAppointments
        .filter((apt: any) => apt.date === `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`)
        .map((apt: any) => apt.time)
    : [];
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleSubmit = (data: InsertAppointment) => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Seleção Incompleta",
        description: "Por favor, selecione uma data e horário.",
        variant: "destructive",
      });
      return;
    }

    createAppointmentMutation.mutate({
      ...data,
      date: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`,
      time: selectedTime,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={clinicImage}
            alt="Clínica Médica"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="text-center max-w-3xl">
            <div className="flex items-center justify-center gap-2 mb-4">
              <CalendarCheck className="h-12 w-12 text-white" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                MediAgenda
              </h1>
            </div>
            <p className="text-lg md:text-xl text-white/90 mb-6">
              Agende sua consulta de forma rápida e fácil
            </p>
            <div className="flex items-center justify-center gap-2 text-white/80">
              <Sparkles className="h-5 w-5" />
              <p className="text-sm md:text-base">
                Confirmação automática por email • Atendimento de segunda a sexta
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Selecione a Data</CardTitle>
                <CardDescription>
                  Escolha um dia disponível para sua consulta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  bookedDates={bookedDates}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Escolha o Horário</CardTitle>
                <CardDescription>
                  Selecione o horário mais conveniente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TimeSlots
                  selectedTime={selectedTime}
                  onTimeSelect={handleTimeSelect}
                  bookedTimes={bookedTimesForDate}
                  selectedDate={selectedDate}
                />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-2xl">Seus Dados</CardTitle>
                <CardDescription>
                  Preencha suas informações para confirmar o agendamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AppointmentForm
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onSubmit={handleSubmit}
                  isPending={createAppointmentMutation.isPending}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}