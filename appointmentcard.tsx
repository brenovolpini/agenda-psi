import { Calendar, Clock, Mail, Phone, User, FileText, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Appointment } from "@shared/schema";

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (id: string) => void;
  isCancelling?: boolean;
}

export function AppointmentCard({ appointment, onCancel, isCancelling }: AppointmentCardProps) {
  const statusColors = {
    confirmed: "bg-chart-2 text-white",
    cancelled: "bg-muted text-muted-foreground",
  };

  const statusLabels = {
    confirmed: "Confirmada",
    cancelled: "Cancelada",
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <Card className="overflow-hidden" data-testid={`card-appointment-${appointment.id}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground text-lg truncate" data-testid="text-patient-name">
                {appointment.patientName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {appointment.appointmentType === 'general' && 'Consulta Geral'}
                {appointment.appointmentType === 'followup' && 'Retorno'}
                {appointment.appointmentType === 'specialist' && 'Especialista'}
                {appointment.appointmentType === 'exam' && 'Exame'}
                {appointment.appointmentType === 'vaccination' && 'Vacinação'}
              </p>
            </div>
          </div>
          <Badge className={statusColors[appointment.status as keyof typeof statusColors]}>
            {statusLabels[appointment.status as keyof typeof statusLabels]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-foreground font-medium" data-testid="text-appointment-date">
              {formatDate(appointment.date)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-foreground font-medium font-mono" data-testid="text-appointment-time">
              {appointment.time}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground truncate">{appointment.patientEmail}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">{appointment.patientPhone}</span>
          </div>
        </div>

        {appointment.notes && (
          <div className="flex items-start gap-2 text-sm pt-2 border-t border-border">
            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-muted-foreground">{appointment.notes}</p>
          </div>
        )}

        {appointment.status === 'confirmed' && onCancel && (
          <Button
            variant="destructive"
            size="sm"
            className="w-full mt-4"
            onClick={() => onCancel(appointment.id)}
            disabled={isCancelling}
            data-testid="button-cancel-appointment"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isCancelling ? "Cancelando..." : "Cancelar Consulta"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}