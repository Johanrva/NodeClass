import { CreationError, DeleteError, UpdateError, GetAllError, RecordNotFoundError } from "../../../utils/customErrors"
import logger from "../../../utils/logger"
import { Appointment, AppointmentReq, AppointmentResDB } from "./model"
import { AppointmentRepository } from "./repository"
import { DoctorRepository } from "../doctores/repository"
import { Doctor } from "../doctores/model"
export interface AppointmentService {
    getAllAppointments() : Promise<Appointment[]>
    createAppointment(patientReq: AppointmentReq) : Promise <Appointment> 
    getAppointmentById (id: number) : Promise <Appointment>
    updateAppointment (id: number, updates : Partial<AppointmentReq>): Promise <Appointment>
    deleteAppointment (id: number): Promise <void>
}

export class AppointmentServiceImpl implements AppointmentService {
    private appointmentRepository: AppointmentRepository
    private doctorRepository: DoctorRepository

    constructor(appointmentRepository: AppointmentRepository, doctorRepository: DoctorRepository){
        this.appointmentRepository = appointmentRepository
        this.doctorRepository = doctorRepository
    }
    public async getAllAppointments(): Promise<Appointment[]> {
        try {
            const patients = await this.appointmentRepository.getAllAppointments()
            return patients
        } catch (error) {
            logger.error(error)
            throw new GetAllError("Failed getting appointments from service", "Appointment")
        }
    }

    public async createAppointment(appointmentReq: AppointmentReq): Promise<Appointment> {
        try {
            const doctor = await this.doctorRepository.getDoctorById(appointmentReq.id_doctor)
            if (doctor) {
                appointmentReq.created_at = new Date()
                appointmentReq.updated_at = new Date()
                const appointmentDB = await this.appointmentRepository.createAppointment(appointmentReq)
                const appointment: Appointment = mapAppointment (appointmentDB, doctor)
                return appointment
            } else {
                throw new RecordNotFoundError()
            } 
            
        } catch (error) {
            logger.error(error)
            if (error instanceof RecordNotFoundError){
                throw new CreationError('Doctor not Found', "Appointment")
            } else {
                throw new CreationError('Failed to create appointment', "Appointment")
            }            
        }
    }

    public async getAppointmentById (id: number): Promise <Appointment>{
        try {
            const appointmentDB = await this.appointmentRepository.getAppointmentById(id)
            const doctor = await this.doctorRepository.getDoctorById(appointmentDB.id_doctor)
            const appointment : Appointment = mapAppointment (appointmentDB, doctor)
            return appointment
        } catch (error){
            logger.error(`Failed to get appointment from service`)
            throw new RecordNotFoundError ()
        }
    }

    public async updateAppointment (id: number, updates : Partial<AppointmentReq>): Promise <Appointment>{
        try {
            const existAppointment = await this.appointmentRepository.getAppointmentById(id)
            if(existAppointment) {
                updates.updated_at = new Date ()
                await this.appointmentRepository.updateAppointment(id, updates)           
                return this.getAppointmentById(id)
            } else {
                throw new RecordNotFoundError()
            }           
        } catch (error){
            logger.error(error)
            if (error instanceof RecordNotFoundError){
                throw new UpdateError('Appointment not Found', "Appointment")
            } else {
                throw new UpdateError('Failed updating Appointment', "Appointment")
            }
        }
    }

    public async deleteAppointment (id: number): Promise <void>{
        try {
            const existAppointment = await this.appointmentRepository.getAppointmentById(id)
            if (!existAppointment){
                throw new RecordNotFoundError ()
            }
            await this.appointmentRepository.deleteAppointment(id)
        } catch (error){
            logger.error(error)
            if (error instanceof RecordNotFoundError){
                throw new DeleteError('Appointment not Found', "Appointment")
            } else {
                throw new DeleteError('Failed deleting appointment', "Apointment")
            }
        }
    }
}



function mapAppointment (appointmentDB: AppointmentResDB, doctor: Doctor) : Appointment {
    const appointment: Appointment = {
        identificacion_paciente: appointmentDB.identificacion_paciente,
        especialidad: appointmentDB.especialidad,
        doctor: `${doctor.nombre} ${doctor.apellido}`,
        consultorio: doctor.consultorio,
        horario: appointmentDB.horario
    }
    return appointment
}
