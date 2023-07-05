import { db } from "../../../config/database"
import { Appointment, AppointmentReq, AppointmentResDB } from "./model"
import logger from '../../../utils/logger'
import { CreationError, DeleteError, GetAllError, RecordNotFoundError, UpdateError } from "../../../utils/customErrors"

export class AppointmentRepository {
    public async createAppointment(appointment: AppointmentReq): Promise<AppointmentResDB> {
        try {
            const [createdAppointment] = await db('citas').insert(appointment).returning('*') 
            return createdAppointment
        } catch (error) {
            throw new CreationError('Failed to create appointment', "Appointment")
        }
    }

    public async getAllAppointments(): Promise<Appointment[]> {
        try {
            const appointments : any = await db.select('*').from('citas')  
            return appointments
        } catch (error) {
            throw new GetAllError('Failed getting appointments from repository', "Appointment")
        }
    }

    public async getAppointmentById (id: number): Promise<AppointmentResDB> {
        try{
            const appointment = await db('citas').where({ id_cita:id}).first()
            return appointment
        } catch (error){
            logger.error(`Failed get appointment by id in repository ${error}`)
            throw new RecordNotFoundError()
        }
    }

    public async updateAppointment (id: number, updates: Partial<AppointmentReq>): Promise<void> {
        try{
            await db('citas').where({ id_cita:id}).update(updates)
        } catch (error){
            logger.error(`Failed updated appointment in repository ${error}`)
            throw new UpdateError('Failed updated appointment', "Appointment")
        }
    }

    public async deleteAppointment (id: number): Promise<void> {
        try{
            await db('citas').where({ id_cita:id}).del()
        } catch (error){
            logger.error(`Failed deleting patient in repository ${error}}`)
            throw new DeleteError('Failed deleting doctor', "Doctor")
        }
    }
}