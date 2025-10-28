
import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
export const users = pgTable("users", {
export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  patientName: text("patient_name").notNull(),
  patientEmail: text("patient_email").notNull(),
  patientPhone: text("patient_phone").notNull(),
  appointmentType: text("appointment_type").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  status: text("status").notNull().default("confirmed"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
  status: true,
}).extend({
  patientEmail: z.string().email("Email inválido"),
  patientPhone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  patientName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  appointmentType: z.string().min(1, "Selecione o tipo de consulta"),
  date: z.string().min(1, "Selecione uma data"),
  time: z.string().min(1, "Selecione um horário"),
  notes: z.string().optional(),
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;
export const appointmentTypes = [
  { value: "general", label: "Consulta Geral" },
  { value: "followup", label: "Retorno" },
  { value: "specialist", label: "Especialista" },
  { value: "exam", label: "Exame" },
  { value: "vaccination", label: "Vacinação" },
];
export const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];