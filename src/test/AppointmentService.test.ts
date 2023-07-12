import { AppointmentService, AppointmentServiceImpl } from "../api/components/citas/service"
import { Appointment, AppointmentReq, AppointmentResDB } from "../api/components/citas/model"
import { Doctor, DoctorReq } from "../api/components/doctores/model";
import { AppointmentRepository } from "../api/components/citas/repository";
import { PatientRepository } from "../api/components/pacientes/repository";
import { DoctorRepository } from "../api/components/doctores/repository";
import { CreationError, DeleteError, GetAllError, RecordNotFoundError, UpdateError } from "../utils/customErrors";

describe ('AppointmentService', () => {
    let appointmentService : AppointmentService
    let appointmentRepository : AppointmentRepository
    let doctorRepository : DoctorRepository
    let patientRepository : PatientRepository

    beforeEach ( () => {
        appointmentRepository = {
            getAllAppointments : jest.fn(),
            createAppointment : jest.fn(),
            getAppointmentById : jest.fn(),
            updateAppointment : jest.fn(),
            deleteAppointment : jest.fn()
        }
        doctorRepository = {
            getAllDoctors : jest.fn(),
            createDoctor : jest.fn(),
            getDoctorById : jest.fn(),
            updateDoctor: jest.fn(),
            deleteDoctor: jest.fn()
        }
        patientRepository = {
            getAllPatients : jest.fn(),
            createPatient : jest.fn(),
            getPatientById : jest.fn(),
            getPatientByIdentification : jest.fn(),
            updatePatient: jest.fn(),
            deletePatient: jest.fn()
        }
        appointmentService = new AppointmentServiceImpl(appointmentRepository,doctorRepository,patientRepository)
    })

    describe ('getAllAppointments', () => {
        it('should get all appointments from service', async () => {
            //Mock Process
            const appointments: Appointment[] = [
                {identificacion_paciente: "123456789", especialidad: "Medicina General", doctor: "Carlos Caceres", consultorio: 100, horario: "7:30"},
                {identificacion_paciente: "1234567890", especialidad: "Medicina General", doctor: "Carlos Caceres", consultorio: 100, horario: "9:30"},
            ]
            
            const appointmentsRes: AppointmentResDB[] = [
                {id_cita: 1, horario: "7:30", especialidad: "Medicina General", id_doctor: 1, identificacion_paciente: "123456789"},
                {id_cita: 1, horario: "9:30", especialidad: "Medicina General", id_doctor: 1, identificacion_paciente: "1234567890"},
            ]
            const doctor: Doctor = {id_doctor : 1, nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100};
            
            (appointmentRepository.getAllAppointments as jest.Mock).mockResolvedValue(appointmentsRes);
            (doctorRepository.getDoctorById as jest.Mock).mockResolvedValue(doctor);
            // Method excecution
            const result = await appointmentService.getAllAppointments()
            //Asserts
            expect(appointmentRepository.getAllAppointments).toHaveBeenCalled()
            expect(doctorRepository.getDoctorById).toHaveBeenCalled()
            expect(result).toEqual(appointments)
            
        })

        it('should return an empty array when no appointments are found', async () => {
            //Mock Process           
            (appointmentRepository.getAllAppointments as jest.Mock).mockResolvedValue([]);
            // Method excecution
            const result = await appointmentService.getAllAppointments()
            //Asserts
            expect(appointmentRepository.getAllAppointments).toHaveBeenCalled()
            expect(result).toEqual([])
        })

        it('should throw an error if getting fails', async () => {
            //Mock Process    
            const error = new RecordNotFoundError();
            const error1 = new GetAllError("Failed getting appointments from service", "Appointment");
            (appointmentRepository.getAllAppointments as jest.Mock).mockRejectedValue(error)
           
            //Asserts
            await expect(appointmentService.getAllAppointments).rejects.toThrowError(error1)
        })
    })

    describe ('crateAppointment', () => {
        it('should create a new patient an return it from service', async () => {
            //Mock Process
            const appointment: Appointment = {identificacion_paciente: "123456789", especialidad: "Medicina General", doctor: "Carlos Caceres", consultorio: 100, horario: "7:30"};
            const doctor: Doctor = {id_doctor : 1, nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100};
            const patient : Boolean = true;
            const appointmentReq : AppointmentReq = {identificacion_paciente: "123456789", especialidad: "Medicina General", id_doctor : 1, horario: "7:30"};
            const appointmentDB : AppointmentResDB = {id_cita: 1, horario: "7:30", especialidad: "Medicina General", id_doctor: 1, identificacion_paciente: "123456789"};

            (doctorRepository.getDoctorById as jest.Mock).mockResolvedValue(doctor);
            (patientRepository.getPatientByIdentification as jest.Mock).mockResolvedValue(patient);
            (appointmentRepository.createAppointment as jest.Mock).mockResolvedValue(appointmentDB);
            // Method excecution
            const result = await appointmentService.createAppointment(appointmentReq);
            //Asserts
            expect(doctorRepository.getDoctorById).toHaveBeenCalled();
            expect(patientRepository.getPatientByIdentification).toHaveBeenCalled();
            expect(appointmentRepository.createAppointment).toHaveBeenCalled();
            expect(result).toEqual(appointment);
            
        })

        it('should throw an error if patient or doctor not found', async () => {
            //Mock Process 
            const error = new CreationError ('Doctor or Patient not Found');
            const appointmentReq : AppointmentReq = {identificacion_paciente: "123456789", especialidad: "Medicina General", id_doctor : 1, horario: "7:30"};
            //(doctorRepository.getDoctorById as jest.Mock).mockResolvedValue({});
            (patientRepository.getPatientByIdentification as jest.Mock).mockResolvedValue(false);
            // Method excecution
            //Asserts
            await expect(appointmentService.createAppointment(appointmentReq)).rejects.toThrowError(error)
        })

        it('should throw an error if appointment creation fails', async () => {
            //Mock Process 
            const appointmentReq : AppointmentReq = {identificacion_paciente: "123456789", especialidad: "Medicina General", id_doctor : 1, horario: "7:30"};
            const error = new Error ('Failed to create appointment');
            (doctorRepository.getDoctorById as jest.Mock).mockRejectedValue(error)
            // Method excecution
            //Asserts
            await expect(appointmentService.createAppointment(appointmentReq)).rejects.toThrowError(error)
        })
    })

    describe ('getAppointmentById', () => {
        it('should get patient by id from service', async () => {
            //Mock Process
            const appointment: Appointment = {identificacion_paciente: "123456789", especialidad: "Medicina General", doctor: "Carlos Caceres", consultorio: 100, horario: "7:30"};
            const appointmentDB : AppointmentResDB = {id_cita: 1, horario: "7:30", especialidad: "Medicina General", id_doctor: 1, identificacion_paciente: "123456789"};
            const doctor: Doctor = {id_doctor : 1, nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100};
            const appointmentId = 1;

            (appointmentRepository.getAppointmentById as jest.Mock).mockResolvedValue(appointmentDB);
            (doctorRepository.getDoctorById as jest.Mock).mockResolvedValue(doctor);
            // Method excecution
            const result = await appointmentService.getAppointmentById(appointmentId)
            //Asserts
            expect(appointmentRepository.getAppointmentById).toHaveBeenCalledWith(1)
            expect(doctorRepository.getDoctorById).toHaveBeenCalledWith(1)
            expect(result).toEqual(appointment)
            
        })

        it('should return an error when appointment or doctor are not found', async () => {
            const error = new RecordNotFoundError ();

            (appointmentRepository.getAppointmentById as jest.Mock).mockResolvedValue(null);
            (doctorRepository.getDoctorById as jest.Mock).mockResolvedValue(null);

            await expect(appointmentService.getAppointmentById(1)).rejects.toThrowError(error)
        })

    })

    describe ('updateAppointment', () => {
        it('should update a appointment and return it from service', async () => {
            //Mock Process
            const appointment: Appointment = {identificacion_paciente: "123456789", especialidad: "Medicina General", doctor: "Carlos Caceres", consultorio: 100, horario: "7:30"};
            const appointmentDB : AppointmentResDB = {id_cita: 1, horario: "7:30", especialidad: "Medicina General", id_doctor: 1, identificacion_paciente: "123456789"};
            const appointmentReq : AppointmentReq = {identificacion_paciente: "123456789", especialidad: "Medicina General", id_doctor : 1, horario: "7:30"};
            const doctor: Doctor = {id_doctor : 1, nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100};
            const id = 1;
            
            (appointmentRepository.getAppointmentById as jest.Mock).mockResolvedValue(appointmentDB);
            (doctorRepository.getDoctorById as jest.Mock).mockResolvedValue(doctor);
            // Method excecution
            const result = await appointmentService.updateAppointment(id,appointmentReq)
            //Asserts
            expect(doctorRepository.getDoctorById).toHaveBeenCalledWith(id)
            expect(appointmentRepository.getAppointmentById).toHaveBeenCalledWith(id)
            expect(appointmentRepository.updateAppointment).toHaveBeenCalledWith(1,appointmentReq)
            expect(result).toEqual(appointment)
            
        })
        
        it('should throw an error if appointment updating fails', async () => {
            //Mock Process 
            const appointmentReq : AppointmentReq = {identificacion_paciente: "123456789", especialidad: "Medicina General", id_doctor : 1, horario: "7:30"};
            const error1 = new UpdateError ('Failed updating Appointment', 'Appointment');
            const id = 1;
            (appointmentRepository.getAppointmentById as jest.Mock).mockRejectedValue(new Error())
            
            await expect(appointmentService.updateAppointment(id,appointmentReq)).rejects.toThrowError(error1)
            expect(appointmentRepository.getAppointmentById).toHaveBeenCalledWith(1)
            
        })

        it('should throw an error if appointment not found', async () => {
            const appointmentReq : AppointmentReq = {identificacion_paciente: "123456789", especialidad: "Medicina General", id_doctor : 1, horario: "7:30"};
            const error = new UpdateError ('Appointment not Found', 'Patient');
            const id = 1;

            (appointmentRepository.getAppointmentById as jest.Mock).mockResolvedValue(null)
            
            await expect(appointmentService.updateAppointment(1,appointmentReq)).rejects.toThrowError(error)
            expect(appointmentRepository.getAppointmentById).toHaveBeenCalledWith(id)
            
        })
    })

    describe ('deleteAppointment', () => {
        it('should delete an appointment and return it from service', async () => {
            const appointmentDB : AppointmentResDB = {id_cita: 1, horario: "7:30", especialidad: "Medicina General", id_doctor: 1, identificacion_paciente: "123456789"};
            const id = 1;

            (appointmentRepository.getAppointmentById as jest.Mock).mockResolvedValue(appointmentDB);

            await appointmentService.deleteAppointment(id)

            expect(appointmentRepository.getAppointmentById).toHaveBeenCalledWith(1)
            expect(appointmentRepository.deleteAppointment).toHaveBeenCalledWith(1)            
        })
        
        it('should throw an error if appointment deleting fails', async () => {
            //Mock Process 
            const error1 = new DeleteError ('Failed deleting appointment', 'Appointment');
            const id = 1;
            (appointmentRepository.getAppointmentById as jest.Mock).mockRejectedValue(new Error())
            
            await expect(appointmentService.deleteAppointment(id)).rejects.toThrowError(error1)
            expect(appointmentRepository.getAppointmentById).toHaveBeenCalledWith(1)
            
        })

        it('should throw an error if appointment not found', async () => {
            const error1 = new DeleteError ('Appointment not Found', 'Patient');
            const id = 1;

            (appointmentRepository.getAppointmentById as jest.Mock).mockResolvedValue(null)
            
            await expect(appointmentService.deleteAppointment(1)).rejects.toThrowError(error1)
            expect(appointmentRepository.getAppointmentById).toHaveBeenCalledWith(1)
            
        })
    })
})