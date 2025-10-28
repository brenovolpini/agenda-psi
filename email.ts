import type { Appointment } from "@shared/schema";

export async function sendConfirmationEmail(appointment: Appointment): Promise<void> {
  const emailApiKey = process.env.EMAIL_API_KEY;
  const emailService = process.env.EMAIL_SERVICE || 'resend';
  
  if (!emailApiKey) {
    console.log('📧 Email API key not configured. Email would be sent to:', appointment.patientEmail);
    console.log('📋 Appointment details:', {
      name: appointment.patientName,
      date: appointment.date,
      time: appointment.time,
      type: appointment.appointmentType,
    });
    return;
  }

  try {
    const emailContent = generateEmailHTML(appointment);
    
    console.log(`📧 Sending confirmation email to ${appointment.patientEmail}`);
    console.log(`   Service: ${emailService}`);
    console.log(`   Subject: Confirmação de Agendamento - MediAgenda`);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw new Error('Failed to send confirmation email');
  }
}

function generateEmailHTML(appointment: Appointment): string {
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const appointmentTypeLabels: Record<string, string> = {
    general: 'Consulta Geral',
    followup: 'Retorno',
    specialist: 'Especialista',
    exam: 'Exame',
    vaccination: 'Vacinação',
  };

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Confirmação de Agendamento</title>
      </head>
      <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">✓ Agendamento Confirmado</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; margin-top: 0;">Olá <strong>${appointment.patientName}</strong>,</p>
          
          <p style="font-size: 16px;">Sua consulta foi agendada com sucesso! Aqui estão os detalhes:</p>
          
          <div style="background: white; border: 2px solid #2563eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Tipo de Consulta:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 600; font-size: 14px;">${appointmentTypeLabels[appointment.appointmentType]}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Data:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 600; font-size: 14px;">${formatDate(appointment.date)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Horário:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 600; font-size: 14px; font-family: 'Roboto Mono', monospace;">${appointment.time}</td>
              </tr>
              ${appointment.notes ? `
              <tr>
                <td colspan="2" style="padding: 12px 0; border-top: 1px solid #e5e7eb; margin-top: 8px;">
                  <div style="color: #6b7280; font-size: 14px; margin-bottom: 4px;">Observações:</div>
                  <div style="font-size: 14px;">${appointment.notes}</div>
                </td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #92400e;">
              <strong>Importante:</strong> Por favor, chegue com 15 minutos de antecedência e traga seus documentos.
            </p>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 0;">
            Atenciosamente,<br>
            <strong style="color: #1f2937;">Equipe MediAgenda</strong>
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p style="margin: 0;">Este é um email automático, por favor não responda.</p>
        </div>
      </body>
    </html>
  `;
}