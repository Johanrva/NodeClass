import { Request, Response } from "express"
import { AppointmentController, AppointmentControllerImpl } from "../api/components/citas/controller"
import { AppointmentService } from "../api/components/citas/service"
import { Appointment, AppointmentReq, AppointmentResDB } from "../api/components/citas/model"
import { CreationError, DeleteError, UpdateError } from "../utils/customErrors"

const mockReq = {} as Request
const mockRes = {} as Response

describe ('AppointmentController', () => {
    let appointmentService : AppointmentService
    let appointmentController : AppointmentController

    beforeEach ( () => {
        appointmentService = {
            getAllAppointments : jest.fn(),
            createAppointment : jest.fn(),
            getAppointmentById: jest.fn(),
            updateAppointment: jest.fn(),
            deleteAppointment: jest.fn()        
        }
        appointmentController = new AppointmentControllerImpl(appointmentService)
        mockRes.status = jest.fn().mockReturnThis()
        mockRes.json = jest.fn().mockReturnThis()
    })
    
    describe ('getAllDoctors', () => {
        it('should get all appointments', async () => {
            //Mock Process
            const appointments: Appointment[] = [
                {identificacion_paciente : "123456789", especialidad: 'Medicina General', consultorio:100, doctor: "Armando Puentes", horario: "9:30"},
                {identificacion_paciente : "1234567890123", especialidad: 'Cardiología', consultorio:101, doctor: "Armando Casas", horario: "12:30"}
            ];

            (appointmentService.getAllAppointments as jest.Mock).mockResolvedValue(appointments)
            // Method excecution
            await appointmentController.getAllAppointments(mockReq, mockRes)
            //Asserts
            expect(appointmentService.getAllAppointments).toHaveBeenCalled()
            expect(mockRes.json).toHaveBeenCalledWith(appointments)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('should be handler a error and return 400 status', async () => {
            const error = new Error ('Internal Server Error');
            (appointmentService.getAllAppointments as jest.Mock).mockRejectedValue(error)

            await appointmentController.getAllAppointments(mockReq, mockRes)

            expect(appointmentService.getAllAppointments).toHaveBeenCalled()
            expect(mockRes.json).toHaveBeenCalledWith({message:"Error getting all appointments"})
            expect(mockRes.status).toHaveBeenCalledWith(400)

        })
    })

    describe ('createAppointment', () => {
        it('should create a new appointment and return info', async () => {
            //Mock Process
            const appointmentRes : Appointment = {identificacion_paciente : "123456789", especialidad: 'Medicina General', consultorio:100, doctor: "Armando Puentes", horario: "9:30"}
            const appointmentReq : AppointmentReq = {identificacion_paciente : "123456789", especialidad: 'Medicina General', id_doctor: 1, horario: "9:30"};
            
            (mockReq.body as AppointmentReq) = appointmentReq;
            (appointmentService.createAppointment as jest.Mock).mockResolvedValue(appointmentRes)
            // Method excecution
            await appointmentController.createAppointment(mockReq, mockRes)
            //Asserts
            expect(appointmentService.createAppointment).toHaveBeenCalledWith(appointmentReq)
            expect(mockRes.json).toHaveBeenCalledWith(appointmentRes)
            expect(mockRes.status).toHaveBeenCalledWith(201)
        })

        it('should be handler a error and return 400 status when request is incorrect', async () => {
            (mockReq.body) = {identificacion_paciente: "123456789"} ;

            await appointmentController.createAppointment(mockReq, mockRes)

            expect(mockRes.json).toHaveBeenCalledWith({message:"\"especialidad\" is required"})
            expect(mockRes.status).toHaveBeenCalledWith(400)

        })

        it('should be handler a error and return 400 status when appointment does not create', async () => {
            //Mock Process
            const error = new CreationError ('Doctor or Patient not Found', "Appointment");
            const appointmentReq : AppointmentReq = {identificacion_paciente : "123456789", especialidad: 'Medicina General', id_doctor: 1, horario: "9:30"};
            
            (mockReq.body as AppointmentReq) = appointmentReq;
            (appointmentService.createAppointment as jest.Mock).mockRejectedValue(error)
            // Method excecution
            await appointmentController.createAppointment(mockReq, mockRes)
            //Asserts
            expect(appointmentService.createAppointment).toHaveBeenCalledWith(appointmentReq)

            expect(mockRes.json).toHaveBeenCalledWith({
                error_name: "Appointment CreationError",
                message: "Doctor or Patient not Found"
            })
            expect(mockRes.status).toHaveBeenCalledWith(400)

        })
        it('should be handler an error and return 400 status failed appointment create', async () => {
            //Mock Process
            const error = new Error ('Internal Server Error');
            const appointmentReq : AppointmentReq = {identificacion_paciente : "123456789", especialidad: 'Medicina General', id_doctor: 1, horario: "9:30"};
            
            (mockReq.body as AppointmentReq) = appointmentReq;
            (appointmentService.createAppointment as jest.Mock).mockRejectedValue(error)
            // Method excecution
            await appointmentController.createAppointment(mockReq, mockRes)
            //Asserts
            expect(appointmentService.createAppointment).toHaveBeenCalledWith(appointmentReq)
            expect(mockRes.json).toHaveBeenCalledWith({message:"Internal Server Error"})
            expect(mockRes.status).toHaveBeenCalledWith(400)

        })
    })

    describe ('getAppointmentById', () => {
        it('should get appointment by id', async () => {
            //Mock Process
            const appointmentRes : Appointment = {identificacion_paciente : "123456789", especialidad: 'Medicina General', consultorio:100, doctor: "Armando Puentes", horario: "9:30"};

            (mockReq.params) = {id: "1"};
            (appointmentService.getAppointmentById as jest.Mock).mockResolvedValue(appointmentRes)
            // Method excecution
            await appointmentController.getAppointmentById(mockReq, mockRes)
            //Asserts
            expect(appointmentService.getAppointmentById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith(appointmentRes)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('should return 400 status if appointment not found', async () => {
            (mockReq.params) = {id:"1"} ;
            (appointmentService.getAppointmentById as jest.Mock).mockResolvedValue(null)

            await appointmentController.getAppointmentById(mockReq, mockRes)

            expect(appointmentService.getAppointmentById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({error:"Record has not found yet"})
            expect(mockRes.status).toHaveBeenCalledWith(400)

        })

        it('should return 400 status if an error occurs', async () => {
            const error = new Error ('Internal Server Error');
            (mockReq.params) = {id:"1"} ;
            (appointmentService.getAppointmentById as jest.Mock).mockRejectedValue(error)

            await appointmentController.getAppointmentById(mockReq, mockRes)

            expect(appointmentService.getAppointmentById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({error:"Failed to retrieve patient"})
            expect(mockRes.status).toHaveBeenCalledWith(400)

        })

        it('should return 400 status if params is not a number', async () => {
            (mockReq.params) = {id:"test"} ;

            await appointmentController.getAppointmentById(mockReq, mockRes)
            
            expect(mockRes.json).toHaveBeenCalledWith({error:"Failed to retrieve patient"})
            expect(mockRes.status).toHaveBeenCalledWith(400)

        })
    })

    describe ('updateAppointment', () => {
        it('should update appointment', async () => {
            //Mock Process
            const appointmentReq : AppointmentReq = {identificacion_paciente : "123456789", especialidad: 'Medicina General', id_doctor: 1, horario: "9:30"};
            const appointmentRes : Appointment = {identificacion_paciente : "123456789", especialidad: 'Medicina General', consultorio:100, doctor: "Armando Puentes", horario: "9:30"};
            
            (mockReq.params) = {id: "1"};
            (appointmentService.updateAppointment as jest.Mock).mockResolvedValue(appointmentRes)
            // Method excecution
            await appointmentController.updateAppointment(mockReq, mockRes)
            //Asserts
            expect(appointmentService.updateAppointment).toHaveBeenCalledWith(1,appointmentReq)
            expect(mockRes.json).toHaveBeenCalledWith(appointmentRes)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('should return 400 status if appointment not found', async () => {
            const appointmentReq : AppointmentReq = {identificacion_paciente : "123456789", especialidad: 'Medicina General', id_doctor: 1, horario: "9:30"};
            
            (mockReq.params) = {id:"1"} ;
            (appointmentService.updateAppointment as jest.Mock).mockResolvedValue(null)

            await appointmentController.updateAppointment(mockReq, mockRes)

            expect(appointmentService.updateAppointment).toHaveBeenCalledWith(1,appointmentReq)
            expect(mockRes.json).toHaveBeenCalledWith({error:"Failed to update appointment"})
            expect(mockRes.status).toHaveBeenCalledWith(400)

        })

        
        it('should return 400 status if an error occurs', async () => {
            const error = new Error ('Internal Server Error');
            const appointmentReq : AppointmentReq = {identificacion_paciente : "123456789", especialidad: 'Medicina General', id_doctor: 1, horario: "9:30"};
            
            (mockReq.params) = {id:"1"} ;
            (appointmentService.updateAppointment as jest.Mock).mockRejectedValue(error)

            await appointmentController.updateAppointment(mockReq, mockRes)

            expect(appointmentService.updateAppointment).toHaveBeenCalledWith(1,appointmentReq)
            expect(mockRes.json).toHaveBeenCalledWith({error:"Failed to update appointment"})
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })

    describe ('deleteDoctorAppointment', () => {
        it('should delete doctor', async () => {
            (mockReq.params) = {id: "1"};
            
            await appointmentController.deleteAppointment(mockReq, mockRes)
            
            expect(appointmentService.deleteAppointment).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({message: 'Appointment was deleted succesfully'})
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('should return 400 status if appointment not found', async () => {
            const error = new DeleteError ('Appointment not Found', "Appointment");
            (mockReq.params) = {id:"1"} ;
            (appointmentService.deleteAppointment as jest.Mock).mockRejectedValue(error)

            await appointmentController.deleteAppointment(mockReq, mockRes)

            expect(appointmentService.deleteAppointment).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({error:"Appointment not Found"})
            expect(mockRes.status).toHaveBeenCalledWith(400)

        })

        
        it('should return 400 status if an error occurs', async () => {
            const error = new Error ('Internal Server Error');
            (mockReq.params) = {id:"1"} ;
            (appointmentService.deleteAppointment as jest.Mock).mockRejectedValue(error)

            await appointmentController.deleteAppointment(mockReq, mockRes)

            expect(appointmentService.deleteAppointment).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({error:"Failed to delete appointment"})
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })


})