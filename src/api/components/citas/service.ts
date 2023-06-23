import { Appointment } from "./model"

export interface AppointmentService {
    createAppointment(): Appointment | null
    getAllApointments(): Appointment[]
}

export class AppointmentServiceImpl implements AppointmentService {

    public createAppointment(): Appointment | null {
        return null
    }

    public getAllApointments(): Appointment[]  {
        return []
    }
}