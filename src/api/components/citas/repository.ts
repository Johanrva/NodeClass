import { db } from "../../../config/database"
import { Appointment, AppointmentReq, AppointmentResDB } from "./model"
import logger from '../../../utils/logger'
import { DoctorCreationError, GetAllError, PatientGetAllError, RecordNotFoundError } from "../../../utils/customErrors"

export class AppointmentRepository {
    public async createAppointment(appointment: AppointmentReq): Promise<AppointmentResDB> {
        try {
            const [createdAppointment] = await db('citas').insert(appointment).returning('*') 
            return createdAppointment
        } catch (error) {
            throw new DoctorCreationError(`Failed to create appointment dubt: ${error}`)
        }
    }

    public async getAllAppointments(): Promise<Appointment[]> {
        try {
            const appointments : any = await db.select('*').from('citas')  
            return appointments
        } catch (error) {
            throw new GetAllError("Failed getting appointments from repository", "appointments")
        }
    }

    public async getAppointmentById (id: number): Promise<AppointmentResDB> {
        try{
            const appointment = await db('citas').where({ id_cita:id}).first()
            return appointment
        } catch (error){
            logger.error(`Failed get appointment by id in repository ${{error}}`)
            throw new RecordNotFoundError()
        }
    }

}