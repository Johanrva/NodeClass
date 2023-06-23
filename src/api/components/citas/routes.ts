import express, {Router, Request, Response } from 'express'
import logger from '../../../utils/logger'
import { AppointmentController, AppointmentControllerImpl } from './controller'
import { AppointmentServiceImpl } from './service'

const router = Router ()
const appointmentService = new AppointmentServiceImpl()
const appointmentController: AppointmentController = new AppointmentControllerImpl(appointmentService)

router.post('/create', appointmentController.createAppointment.bind(appointmentController))
router.get('/list', appointmentController.getAllAppointments.bind(appointmentController))

export default router 