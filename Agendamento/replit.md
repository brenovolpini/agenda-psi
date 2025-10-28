# MediAgenda - Sistema de Agendamento de Consultas

## Visão Geral
Sistema web completo para agendamento de consultas médicas com confirmação por email. Interface moderna, responsiva e intuitiva para pacientes e painel administrativo para gestão de agendamentos.

## Funcionalidades Principais

### Para Pacientes
- ✅ Calendário interativo para seleção de datas disponíveis
- ✅ Grid de horários disponíveis (blocos de 30 minutos)
- ✅ Formulário de agendamento com validação completa
- ✅ Confirmação automática por email (configurável)
- ✅ Visualização de horários ocupados em tempo real
- ✅ Sistema de prevenção de conflitos de horários

### Painel Administrativo
- ✅ Dashboard com métricas (total, confirmadas, hoje)
- ✅ Listagem de todas as consultas
- ✅ Cancelamento de consultas
- ✅ Filtros por status (confirmadas/canceladas)
- ✅ Cards detalhados com informações do paciente

## Tecnologias Utilizadas

### Frontend
- React + TypeScript
- Tailwind CSS para estilização
- Shadcn UI para componentes
- TanStack Query para gerenciamento de estado
- Wouter para roteamento
- React Hook Form + Zod para validação

### Backend
- Express.js
- Armazenamento em memória (MemStorage)
- Sistema de email preparado (requer configuração)
- Validação de dados com Zod

## Estrutura de Dados

### Appointment (Consulta)
```typescript
{
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  appointmentType: "general" | "followup" | "specialist" | "exam" | "vaccination";
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: "confirmed" | "cancelled";
  notes?: string;
  createdAt: Date;
}
```

## Configuração de Email

O sistema está preparado para envio de emails de confirmação. Para ativar:

### Opção 1: Usar Resend (Recomendado)
1. Criar conta em https://resend.com
2. Obter API key
3. Configurar variáveis de ambiente:
   ```
   EMAIL_SERVICE=resend
   EMAIL_API_KEY=seu_api_key_aqui
   ```

### Opção 2: Usar SendGrid
1. Criar conta em https://sendgrid.com
2. Obter API key
3. Configurar variáveis de ambiente:
   ```
   EMAIL_SERVICE=sendgrid
   EMAIL_API_KEY=seu_api_key_aqui
   ```

**Nota:** Sem configuração, o sistema registra os emails no console mas continua funcionando normalmente.

## Horários de Funcionamento
- Segunda a Sexta: 08:00 - 11:30 e 14:00 - 17:30
- Fins de semana: Fechado
- Intervalos de 30 minutos

## Rotas da Aplicação

### Frontend
- `/` - Página de agendamento (pacientes)
- `/admin` - Painel administrativo

### API Endpoints
- `GET /api/appointments` - Lista todas as consultas
- `GET /api/appointments/:id` - Busca consulta específica
- `POST /api/appointments` - Cria nova consulta
- `DELETE /api/appointments/:id` - Cancela consulta

## Design System
- Cores primárias: Azul médico (#2563eb)
- Tipografia: Inter (sans-serif), Roboto Mono (código/horários)
- Modo claro/escuro suportado
- Componentes acessíveis (WCAG AA)

## Próximas Melhorias Sugeridas
1. Lembretes automáticos 24h antes da consulta
2. Sistema de reagendamento
3. Integração com Google Calendar
4. Notificações SMS via Twilio
5. Dashboard com relatórios e métricas
6. Sistema de autenticação para médicos/admin
7. Histórico de consultas do paciente
8. Upload de exames e documentos

## Desenvolvimento Local
```bash
npm run dev
```
Acessa em: http://localhost:5000

## Notas Técnicas
- Armazenamento em memória - dados são perdidos ao reiniciar
- Para produção, considerar PostgreSQL ou outro banco persistente
- Email configurável via variáveis de ambiente
- Frontend totalmente responsivo (mobile-first)