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

        // it('should be handler a error and return 400 status', async () => {
        //     const error = new Error ('Internal Server Error');
        //     (doctorService.getAllDoctors as jest.Mock).mockRejectedValue(error)

        //     await doctorController.getAllDoctors(mockReq, mockRes)

        //     expect(doctorService.getAllDoctors).toHaveBeenCalled()
        //     expect(mockRes.json).toHaveBeenCalledWith({message:"Error getting all doctors"})
        //     expect(mockRes.status).toHaveBeenCalledWith(400)

        // })
    })

    // describe ('createDoctor', () => {
    //     it('should create a new doctor and return info', async () => {
    //         //Mock Process
    //         const doctorRes: Doctor = {id_doctor : 1, nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100};
    //         const doctorReq: DoctorReq = {nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100};
            
    //         (mockReq.body as DoctorReq) = doctorReq;
    //         (doctorService.createDoctor as jest.Mock).mockResolvedValue(doctorRes)
    //         // Method excecution
    //         await doctorController.createDoctor(mockReq, mockRes)
    //         //Asserts
    //         expect(doctorService.createDoctor).toHaveBeenCalledWith(doctorReq)
    //         expect(mockRes.json).toHaveBeenCalledWith(doctorRes)
    //         expect(mockRes.status).toHaveBeenCalledWith(201)
    //     })

    //     it('should be handler a error and return 400 status when request is incorrect', async () => {
    //         (mockReq.body) = {} ;

    //         await doctorController.createDoctor(mockReq, mockRes)

    //         expect(mockRes.json).toHaveBeenCalledWith({message:"\"nombre\" is required"})
    //         expect(mockRes.status).toHaveBeenCalledWith(400)

    //     })

    //     it('should be handler a error and return 400 status when doctor does not create', async () => {
    //         //Mock Process
    //         const error = new CreationError ('Internal Server Error', 'Doctor');
    //         const doctorReq: DoctorReq = {nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100};
            
    //         (mockReq.body as DoctorReq) = doctorReq;
    //         (doctorService.createDoctor as jest.Mock).mockRejectedValue(error)
    //         // Method excecution
    //         await doctorController.createDoctor(mockReq, mockRes)
    //         //Asserts
    //         expect(doctorService.createDoctor).toHaveBeenCalledWith(doctorReq)

    //         expect(mockRes.json).toHaveBeenCalledWith({
    //             error_name: "Doctor CreationError",
    //             message: "Internal Server Error"
    //         })
    //         expect(mockRes.status).toHaveBeenCalledWith(400)

    //     })
    //     it('should be handler a error and return 400 status failed doctor create', async () => {
    //         //Mock Process
    //         const error = new Error ('Internal Server Error');
    //         const doctorReq: DoctorReq = {nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100};
            
    //         (mockReq.body as DoctorReq) = doctorReq;
    //         (doctorService.createDoctor as jest.Mock).mockRejectedValue(error)
    //         // Method excecution
    //         await doctorController.createDoctor(mockReq, mockRes)
    //         //Asserts
    //         expect(doctorService.createDoctor).toHaveBeenCalledWith(doctorReq)
    //         expect(mockRes.json).toHaveBeenCalledWith({message:"Internal Server Error"})
    //         expect(mockRes.status).toHaveBeenCalledWith(400)

    //     })
    // })

    // describe ('getDoctorById', () => {
    //     it('should get doctor by id', async () => {
    //         //Mock Process
    //         const doctorRes: Doctor = {id_doctor : 1, nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100};            
    //         (mockReq.params) = {id: "1"};
    //         (doctorService.getDoctorById as jest.Mock).mockResolvedValue(doctorRes)
    //         // Method excecution
    //         await doctorController.getDoctorById(mockReq, mockRes)
    //         //Asserts
    //         expect(doctorService.getDoctorById).toHaveBeenCalledWith(1)
    //         expect(mockRes.json).toHaveBeenCalledWith(doctorRes)
    //         expect(mockRes.status).toHaveBeenCalledWith(200)
    //     })

    //     it('should return 400 status if doctor not found', async () => {
    //         (mockReq.params) = {id:"1"} ;
    //         (doctorService.getDoctorById as jest.Mock).mockResolvedValue(null)

    //         await doctorController.getDoctorById(mockReq, mockRes)

    //         expect(doctorService.getDoctorById).toHaveBeenCalledWith(1)
    //         expect(mockRes.json).toHaveBeenCalledWith({error:"Record has not found yet"})
    //         expect(mockRes.status).toHaveBeenCalledWith(400)

    //     })

    //     it('should return 400 status if an error occurs', async () => {
    //         const error = new Error ('Internal Server Error');
    //         (mockReq.params) = {id:"1"} ;
    //         (doctorService.getDoctorById as jest.Mock).mockRejectedValue(error)

    //         await doctorController.getDoctorById(mockReq, mockRes)

    //         expect(doctorService.getDoctorById).toHaveBeenCalledWith(1)
    //         expect(mockRes.json).toHaveBeenCalledWith({error:"Failed to retrieve doctor"})
    //         expect(mockRes.status).toHaveBeenCalledWith(400)

    //     })
    // })

    // describe ('updateDoctor', () => {
    //     it('should update doctor', async () => {
    //         //Mock Process

    //         const doctorReq: DoctorReq = { nombre: 'Carlos', apellido: 'Caceres',especialidad: 'Medicina General', consultorio:100};            
    //         const doctorRes: Doctor = {id_doctor : 1, nombre: "Carlos", apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100};            
    //         (mockReq.params) = {id: "1"};
    //         (doctorService.updateDoctor as jest.Mock).mockResolvedValue(doctorRes)
    //         // Method excecution
    //         await doctorController.updateDoctor(mockReq, mockRes)
    //         //Asserts
    //         expect(doctorService.updateDoctor).toHaveBeenCalledWith(1,doctorReq)
    //         expect(mockRes.json).toHaveBeenCalledWith(doctorRes)
    //         expect(mockRes.status).toHaveBeenCalledWith(200)
    //     })

    //     it('should return 400 status if doctor not found', async () => {
    //         const error = new UpdateError ('Doctor not Found', "Doctor");
    //         const doctorReq: DoctorReq = { nombre: 'Carlos', apellido: 'Caceres',especialidad: 'Medicina General', consultorio:100};            
    //         (mockReq.params) = {id:"1"} ;
    //         (doctorService.updateDoctor as jest.Mock).mockRejectedValue(error)

    //         await doctorController.updateDoctor(mockReq, mockRes)

    //         expect(doctorService.updateDoctor).toHaveBeenCalledWith(1,doctorReq)
    //         expect(mockRes.json).toHaveBeenCalledWith({error:"Doctor not Found"})
    //         expect(mockRes.status).toHaveBeenCalledWith(400)

    //     })

        
    //     it('should return 400 status if an error occurs', async () => {
    //         const error = new Error ('Internal Server Error');
    //         const doctorReq: DoctorReq = { nombre: 'Carlos', apellido: 'Caceres',especialidad: 'Medicina General', consultorio:100};            
    //         (mockReq.params) = {id:"1"} ;
    //         (doctorService.updateDoctor as jest.Mock).mockRejectedValue(error)

    //         await doctorController.updateDoctor(mockReq, mockRes)

    //         expect(doctorService.updateDoctor).toHaveBeenCalledWith(1,doctorReq)
    //         expect(mockRes.json).toHaveBeenCalledWith({error:"Failed to update doctor"})
    //         expect(mockRes.status).toHaveBeenCalledWith(400)
    //     })
    // })

    // describe ('deleteDoctor', () => {
    //     it('should delete doctor', async () => {
    //         (mockReq.params) = {id: "1"};
            
    //         await doctorController.deleteDoctor(mockReq, mockRes)
            
    //         expect(doctorService.deleteDoctor).toHaveBeenCalledWith(1)
    //         expect(mockRes.json).toHaveBeenCalledWith({message: 'Doctor was deleted succesfully'})
    //         expect(mockRes.status).toHaveBeenCalledWith(200)
    //     })

    //     it('should return 400 status if doctor not found', async () => {
    //         const error = new DeleteError ('Doctor not Found', "Doctor");
    //         (mockReq.params) = {id:"1"} ;
    //         (doctorService.deleteDoctor as jest.Mock).mockRejectedValue(error)

    //         await doctorController.deleteDoctor(mockReq, mockRes)

    //         expect(doctorService.deleteDoctor).toHaveBeenCalledWith(1)
    //         expect(mockRes.json).toHaveBeenCalledWith({error:"Doctor not Found"})
    //         expect(mockRes.status).toHaveBeenCalledWith(400)

    //     })

        
    //     it('should return 400 status if an error occurs', async () => {
    //         const error = new Error ('Internal Server Error');
    //         (mockReq.params) = {id:"1"} ;
    //         (doctorService.deleteDoctor as jest.Mock).mockRejectedValue(error)

    //         await doctorController.deleteDoctor(mockReq, mockRes)

    //         expect(doctorService.deleteDoctor).toHaveBeenCalledWith(1)
    //         expect(mockRes.json).toHaveBeenCalledWith({error:"Failed to delete doctor"})
    //         expect(mockRes.status).toHaveBeenCalledWith(400)
    //     })
    // })


})