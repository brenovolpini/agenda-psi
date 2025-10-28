import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAppointmentSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { sendConfirmationEmail } from "./email";
export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api
  app.get('/api/appointments', async (req, res) => {
    try {
      const appointments = await storage.getAllAppointments();
      res.json(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ message: 'Failed to fetch appointments' });
    }
  });
  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)
  app.get('/api/appointments/:id', async (req, res) => {
    try {
      const appointment = await storage.getAppointment(req.params.id);
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      res.json(appointment);
    } catch (error) {
      console.error('Error fetching appointment:', error);
      res.status(500).json({ message: 'Failed to fetch appointment' });
    }
  });
  app.post('/api/appointments', async (req, res) => {
    try {
      const validationResult = insertAppointmentSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      const appointmentData = validationResult.data;
      const existingAppointments = await storage.getAppointmentsByDate(appointmentData.date);
      const timeConflict = existingAppointments.find(apt => apt.time === appointmentData.time);
      
      if (timeConflict) {
        return res.status(409).json({ message: 'Este horário já está ocupado. Por favor, escolha outro.' });
      }
      const appointment = await storage.createAppointment(appointmentData);
      try {
        await sendConfirmationEmail(appointment);
      } catch (emailError) {
        console.error('Email sending failed, but appointment was created:', emailError);
      }
      res.status(201).json(appointment);
    } catch (error) {
      console.error('Error creating appointment:', error);
      res.status(500).json({ message: 'Failed to create appointment' });
    }
  });
  app.delete('/api/appointments/:id', async (req, res) => {
    try {
      const appointment = await storage.cancelAppointment(req.params.id);
      
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      res.json(appointment);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      res.status(500).json({ message: 'Failed to cancel appointment' });
    }
  });
  const httpServer = createServer(app);