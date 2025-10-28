import { type User, type InsertUser } from "@shared/schema";
import { type Appointment, type InsertAppointment } from "@shared/schema";
import { randomUUID } from "crypto";
// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAppointment(id: string): Promise<Appointment | undefined>;
  getAllAppointments(): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  cancelAppointment(id: string): Promise<Appointment | undefined>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
}
export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private appointments: Map<string, Appointment>;
  constructor() {
    this.users = new Map();
    this.appointments = new Map();
  }
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  async getAppointment(id: string): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  async getAllAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });
  }
  async createUser(insertUser: InsertUser): Promise<User> {
  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
    const appointment: Appointment = {
      ...insertAppointment,
      id,
      status: "confirmed",
      createdAt: new Date(),
    };
    this.appointments.set(id, appointment);
    return appointment;
  }
  async cancelAppointment(id: string): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;
    const cancelledAppointment: Appointment = {
      ...appointment,
      status: "cancelled",
    };
    this.appointments.set(id, cancelledAppointment);
    return cancelledAppointment;
  }
  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values())
      .filter((apt) => apt.date === date && apt.status === 'confirmed');
  }
}