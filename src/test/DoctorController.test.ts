import { Request, Response, json } from "express"
import { DoctorController, DoctorControllerImpl } from "../api/components/doctores/controller"
import { DoctorService } from "../api/components/doctores/service"
import { Doctor, DoctorReq } from "../api/components/doctores/model"
import { CreationError } from "../utils/customErrors"

const mockReq = {} as Request
const mockRes = {} as Response

describe ('DoctorController', () => {
    let doctorService : DoctorService
    let doctorController : DoctorController

    beforeEach ( () => {
        doctorService = {
            getAllDoctors : jest.fn(),
            createDoctor : jest.fn(),
            getDoctorById: jest.fn(),
            updateDoctor: jest.fn(),
            deleteDoctor: jest.fn()        
        }
        doctorController = new DoctorControllerImpl(doctorService)
        mockRes.status = jest.fn().mockReturnThis()
        mockRes.json = jest.fn().mockReturnThis()
    })
    
    describe ('getAllDoctors', () => {
        it('should get all doctors', async () => {
            //Mock Process
            const doctors: Doctor[] = [
                {id_doctor : 1, nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100},
                {id_doctor : 2, nombre: 'Alveiro', apellido: 'Tarsisio', especialidad: 'Ortopedia', consultorio:101}
            ];

            (doctorService.getAllDoctors as jest.Mock).mockResolvedValue(doctors)
            // Method excecution
            await doctorController.getAllDoctors(mockReq, mockRes)
            //Asserts
            expect(doctorService.getAllDoctors).toHaveBeenCalled()
            expect(mockRes.json).toHaveBeenCalledWith(doctors)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('should be handler a error and return 400 status', async () => {
            const error = new Error ('Internal Server Error');
            (doctorService.getAllDoctors as jest.Mock).mockRejectedValue(error)

            await doctorController.getAllDoctors(mockReq, mockRes)

            expect(doctorService.getAllDoctors).toHaveBeenCalled()
            expect(mockRes.json).toHaveBeenCalledWith({message:"Error getting all doctors"})
            expect(mockRes.status).toHaveBeenCalledWith(400)

        })
    })

    describe ('createDoctor', () => {
        it('should create a new doctor and return info', async () => {
            //Mock Process
            const doctorRes: Doctor = {id_doctor : 1, nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100};
            const doctorReq: DoctorReq = {nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100};
            
            (mockReq.body as DoctorReq) = doctorReq;
            (doctorService.createDoctor as jest.Mock).mockResolvedValue(doctorRes)
            // Method excecution
            await doctorController.createDoctor(mockReq, mockRes)
            //Asserts
            expect(doctorService.createDoctor).toHaveBeenCalledWith(doctorReq)
            expect(mockRes.json).toHaveBeenCalledWith(doctorRes)
            expect(mockRes.status).toHaveBeenCalledWith(201)
        })

        it('should be handler a error and return 400 status when request is incorrect', async () => {
            (mockReq.body) = {} ;

            await doctorController.createDoctor(mockReq, mockRes)

            expect(mockRes.json).toHaveBeenCalledWith({message:"\"nombre\" is required"})
            expect(mockRes.status).toHaveBeenCalledWith(400)

        })

        it('should be handler a error and return 400 status when doctor does not create', async () => {
            //Mock Process
            const error = new CreationError ('Internal Server Error', 'Doctor');
            const doctorReq: DoctorReq = {nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100};
            
            (mockReq.body as DoctorReq) = doctorReq;
            (doctorService.createDoctor as jest.Mock).mockRejectedValue(error)
            // Method excecution
            await doctorController.createDoctor(mockReq, mockRes)
            //Asserts
            expect(doctorService.createDoctor).toHaveBeenCalledWith(doctorReq)

            expect(mockRes.json).toHaveBeenCalledWith({
                error_name: "Doctor CreationError",
                message: "Internal Server Error"
            })
            expect(mockRes.status).toHaveBeenCalledWith(400)

        })
        it('should be handler a error and return 400 status failed doctor create', async () => {
            //Mock Process
            const error = new Error ('Internal Server Error');
            const doctorReq: DoctorReq = {nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100};
            
            (mockReq.body as DoctorReq) = doctorReq;
            (doctorService.createDoctor as jest.Mock).mockRejectedValue(error)
            // Method excecution
            await doctorController.createDoctor(mockReq, mockRes)
            //Asserts
            expect(doctorService.createDoctor).toHaveBeenCalledWith(doctorReq)
            expect(mockRes.json).toHaveBeenCalledWith({message:"Internal Server Error"})
            expect(mockRes.status).toHaveBeenCalledWith(400)

        })
    })

    describe ('getDoctorById', () => {
        it('should get doctor by id', async () => {
            //Mock Process
            const doctorRes: Doctor = {id_doctor : 1, nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100};            
            (mockReq.params) = {id: "1"};
            (doctorService.getDoctorById as jest.Mock).mockResolvedValue(doctorRes)
            // Method excecution
            await doctorController.getDoctorById(mockReq, mockRes)
            //Asserts
            expect(doctorService.getDoctorById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith(doctorRes)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('should return 400 status if doctor not found', async () => {
            (mockReq.params) = {id:"1"} ;
            (doctorService.getDoctorById as jest.Mock).mockResolvedValue(null)

            await doctorController.getDoctorById(mockReq, mockRes)

            expect(doctorService.getDoctorById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({error:"Record has not found yet"})
            expect(mockRes.status).toHaveBeenCalledWith(400)

        })

        it('should return 400 status if an error occurs', async () => {
            const error = new Error ('Internal Server Error');
            (mockReq.params) = {id:"1"} ;
            (doctorService.getDoctorById as jest.Mock).mockRejectedValue(error)

            await doctorController.getDoctorById(mockReq, mockRes)

            expect(doctorService.getDoctorById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({error:"Failed to retrieve doctor"})
            expect(mockRes.status).toHaveBeenCalledWith(400)

        })
    })


})