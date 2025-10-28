import { useQuery, useMutation } from "@tanstack/react-query";
import { AppointmentCard } from "@/components/AppointmentCard";
import { type Appointment } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Admin() {
  const { toast } = useToast();

  const { data: appointments, isLoading } = useQuery<Appointment[]>({
    queryKey: ['/api/appointments'],
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/appointments/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      toast({
        title: "Consulta Cancelada",
        description: "A consulta foi cancelada com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao Cancelar",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const confirmedAppointments = appointments?.filter(apt => apt.status === 'confirmed') || [];
  const cancelledAppointments = appointments?.filter(apt => apt.status === 'cancelled') || [];
  const todayAppointments = appointments?.filter(apt => {
    const today = new Date();
    const aptDate = apt.date;
    const [year, month, day] = aptDate.split('-');
    return (
      parseInt(day) === today.getDate() &&
      parseInt(month) === today.getMonth() + 1 &&
      parseInt(year) === today.getFullYear()
    );
  }) || [];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Painel Administrativo
          </h1>
          <p className="text-muted-foreground">
            Gerencie todos os agendamentos da clínica
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Consultas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-appointments">
                {appointments?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Todas as consultas registradas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-2" data-testid="text-confirmed-appointments">
                {confirmedAppointments.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Agendamentos ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hoje</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-3" data-testid="text-today-appointments">
                {todayAppointments.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Consultas agendadas para hoje
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              Consultas Confirmadas
            </h2>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-24 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : confirmedAppointments.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">
                    Nenhuma consulta confirmada no momento
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {confirmedAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onCancel={cancelMutation.mutate}
                    isCancelling={cancelMutation.isPending}
                  />
                ))}
              </div>
            )}
          </div>

          {cancelledAppointments.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                Consultas Canceladas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cancelledAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}