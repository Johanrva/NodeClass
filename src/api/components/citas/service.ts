import { DoctorCreationError, DoctorDeleteError, DoctorUpdateError, GetAllError, RecordNotFoundError } from "../../../utils/customErrors"
import logger from "../../../utils/logger"
import { Appointment, AppointmentReq, AppointmentResDB } from "./model"
import { AppointmentRepository } from "./repository"
import { DoctorRepository } from "../doctores/repository"
import { Doctor } from "../doctores/model"
export interface AppointmentService {
    getAllAppointments() : Promise<Appointment[]>
    createAppointment(patientReq: AppointmentReq) : Promise <Appointment> 
    getAppointmentById (id: number) : Promise <Appointment>
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
            console.log("llegamos")
            console.log(patients)
            return patients
        } catch (error) {
            logger.error(error)
            throw new GetAllError("Failed getting appointments from service", "appointments")
        }
    }

    public async createAppointment(appointmentReq: AppointmentReq): Promise<Appointment> {
        try {
            const appointmentDB = await this.appointmentRepository.createAppointment(appointmentReq)
            const doctor = await this.doctorRepository.getDoctorById(appointmentDB.id_doctor)
            const appointment: Appointment = mapAppointment (appointmentDB, doctor)
            return appointment
        } catch (error) {
            logger.error(error)
            throw new DoctorCreationError("Failed to create appointment from service")
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
