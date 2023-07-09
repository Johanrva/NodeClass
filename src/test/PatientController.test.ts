import { Request, Response } from "express"
import { PatientController, PatientControllerImpl } from "../api/components/pacientes/controller"
import { PatientService } from "../api/components/pacientes/service"
import { Patient, PatientReq } from "../api/components/pacientes/model"
import { CreationError, DeleteError, UpdateError } from "../utils/customErrors"

const mockReq = {} as Request
const mockRes = {} as Response

describe ('PatientController', () => {
    let patientService : PatientService
    let patientController : PatientController

    beforeEach ( () => {
        patientService = {
            getAllPatients : jest.fn(),
            createPatient : jest.fn(),
            getPatientById : jest.fn(),
            updatePatient : jest.fn(),
            deletePatient : jest.fn()        
        }
        patientController = new PatientControllerImpl(patientService)
        mockRes.status = jest.fn().mockReturnThis()
        mockRes.json = jest.fn().mockReturnThis()
    })
    
    describe ('getAllDoctors', () => {
        it('should get all patients', async () => {
            //Mock Process
            const patients: Patient[] = [
                {id_paciente : 1, nombre: 'Carlos', apellido: 'Caceres', identificacion: "123456789"},
                {id_paciente : 2, nombre: 'Alveiro', apellido: 'Tarsisio', identificacion: "12345678910"}
            ];

            (patientService.getAllPatients as jest.Mock).mockResolvedValue(patients)
            // Method excecution
            await patientController.getAllPatients(mockReq, mockRes)
            //Asserts
            expect(patientService.getAllPatients).toHaveBeenCalled()
            expect(mockRes.json).toHaveBeenCalledWith(patients)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })
    
        it('should be handler a error and return 400 status', async () => {
            const error = new Error ('Internal Server Error');
            (patientService.getAllPatients as jest.Mock).mockRejectedValue(error)

            await patientController.getAllPatients(mockReq, mockRes)

            expect(patientService.getAllPatients).toHaveBeenCalled()
            expect(mockRes.json).toHaveBeenCalledWith({message:"Error getting all patients"})
            expect(mockRes.status).toHaveBeenCalledWith(400)

        })
    })

    describe ('createPatient', () => {
        it('should create a new patient and return info', async () => {
            //Mock Process
            const patientRes: Patient =  {id_paciente : 1, nombre: 'Carlos', apellido: 'Caceres', identificacion: "123456789"};
            const patientReq: PatientReq = { nombre: 'Carlos', apellido: 'Caceres', identificacion: "123456789"};
            
            (mockReq.body as PatientReq) = patientReq;
            (patientService.createPatient as jest.Mock).mockResolvedValue(patientRes)
            // Method excecution
            await patientController.createPatient(mockReq, mockRes)
            //Asserts
            expect(patientService.createPatient).toHaveBeenCalledWith(patientReq)
            expect(mockRes.json).toHaveBeenCalledWith(patientRes)
            expect(mockRes.status).toHaveBeenCalledWith(201)
        })

        it('should be handler a error and return 400 status when request is incorrect', async () => {
            (mockReq.body) = {} ;

            await patientController.createPatient(mockReq, mockRes)

            expect(mockRes.json).toHaveBeenCalledWith({message:"\"nombre\" is required"})
            expect(mockRes.status).toHaveBeenCalledWith(400)

        })

        it('should be handler a error and return 400 status when doctor does not create', async () => {
            //Mock Process
            const error = new CreationError ('Internal Server Error', 'Patient');
            const patientReq: PatientReq = { nombre: 'Carlos', apellido: 'Caceres', identificacion: "123456789"};
            
            (mockReq.body as PatientReq) = patientReq;

            (patientService.createPatient as jest.Mock).mockRejectedValue(error)
            // Method excecution
            await patientController.createPatient(mockReq, mockRes)
            //Asserts
            expect(patientService.createPatient).toHaveBeenCalledWith(patientReq)

            expect(mockRes.json).toHaveBeenCalledWith({
                error_name: "Patient CreationError",
                message: "Internal Server Error"
            })
            expect(mockRes.status).toHaveBeenCalledWith(400)

        })
        it('should be handler a error and return 400 status failed doctor create', async () => {
            //Mock Process
            const error = new Error ('Internal Server Error');
            const patientReq: PatientReq = { nombre: 'Carlos', apellido: 'Caceres', identificacion: "123456789"};
            
            (mockReq.body as PatientReq) = patientReq;
            (patientService.createPatient as jest.Mock).mockRejectedValue(error)

            // Method excecution
            await patientController.createPatient(mockReq, mockRes)
            //Asserts
            expect(patientService.createPatient).toHaveBeenCalledWith(patientReq)
            expect(mockRes.json).toHaveBeenCalledWith({message:"Internal Server Error"})
            expect(mockRes.status).toHaveBeenCalledWith(400)

        })
    })

    describe ('getPatientById', () => {
        it('should get patient by id', async () => {
            //Mock Process
            const patientRes: Patient =  {id_paciente : 1, nombre: 'Carlos', apellido: 'Caceres', identificacion: "123456789"};

            (mockReq.params) = {id: "1"};
            (patientService.getPatientById as jest.Mock).mockResolvedValue(patientRes)
            // Method excecution
            await patientController.getPatientById(mockReq, mockRes)
            //Asserts
            expect(patientService.getPatientById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith(patientRes)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('should return 400 status if patient not found', async () => {
            (mockReq.params) = {id:"1"} ;
            (patientService.getPatientById as jest.Mock).mockResolvedValue(null)

            await patientController.getPatientById(mockReq, mockRes)

            expect(patientService.getPatientById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({error:"Record has not found yet"})
            expect(mockRes.status).toHaveBeenCalledWith(400)

        })

        it('should return 400 status if an error occurs', async () => {
            const error = new Error ('Internal Server Error');
            (mockReq.params) = {id:"1"} ;
            (patientService.getPatientById as jest.Mock).mockRejectedValue(error)

            await patientController.getPatientById(mockReq, mockRes)

            expect(patientService.getPatientById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({error:"Failed to retrieve patient"})
            expect(mockRes.status).toHaveBeenCalledWith(400)

        })

        it('should be handler a error and return 400 status when request is NaN', async () => {
            (mockReq.params) = {id:"test"} ;

            await patientController.getPatientById(mockReq, mockRes)

            expect(mockRes.json).toHaveBeenCalledWith({error:"Failed to retrieve patient"})
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })

     describe ('updatePatient', () => {
        it('should update patient', async () => {
            //Mock Process
            const patientRes: Patient =  {id_paciente : 1, nombre: 'Carlos', apellido: 'Caceres', identificacion: "123456789"};
            const patientReq: PatientReq = { nombre: 'Carlos', apellido: 'Caceres', identificacion: "123456789"};
                     
            (mockReq.params) = {id: "1"};
            (patientService.updatePatient as jest.Mock).mockResolvedValue(patientRes)
            // Method excecution
            await patientController.updatePatient(mockReq, mockRes)
            //Asserts
            expect(patientService.updatePatient).toHaveBeenCalledWith(1,patientReq)
            expect(mockRes.json).toHaveBeenCalledWith(patientRes)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('should return 400 status if patient not found', async () => {
            const error = new UpdateError ('Patient not Found', "Patient");
            const patientReq: PatientReq = { nombre: 'Carlos', apellido: 'Caceres', identificacion: "123456789"};
            
            (mockReq.params) = {id:"1"} ;
            (patientService.updatePatient as jest.Mock).mockRejectedValue(error)

            await patientController.updatePatient(mockReq, mockRes)

            expect(patientService.updatePatient).toHaveBeenCalledWith(1,patientReq)
            expect(mockRes.json).toHaveBeenCalledWith({error:"Patient not Found"})
            expect(mockRes.status).toHaveBeenCalledWith(400)

        })

        
        it('should return 400 status if an error occurs', async () => {
            const error = new Error ('Internal Server Error');
            const patientReq: PatientReq = { nombre: 'Carlos', apellido: 'Caceres', identificacion: "123456789"};
            (mockReq.params) = {id:"1"} ;
            (patientService.updatePatient as jest.Mock).mockRejectedValue(error)

            await patientController.updatePatient(mockReq, mockRes)

            expect(patientService.updatePatient).toHaveBeenCalledWith(1,patientReq)
            expect(mockRes.json).toHaveBeenCalledWith({error:"Failed to update patient"})
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })

    describe ('deletePatient', () => {
        it('should delete patient', async () => {
            (mockReq.params) = {id: "1"};
            
            await patientController.deletePatient(mockReq, mockRes)
            
            expect(patientService.deletePatient).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({message: 'Patient was deleted succesfully'})
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('should return 400 status if patient not found', async () => {
            const error = new DeleteError ('Patient not Found', "Patient");
            (mockReq.params) = {id:"1"} ;
            (patientService.deletePatient as jest.Mock).mockRejectedValue(error)

            await patientController.deletePatient(mockReq, mockRes)

            expect(patientService.deletePatient).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({error:"Patient not Found"})
            expect(mockRes.status).toHaveBeenCalledWith(400)

        })

        
        it('should return 400 status if an error occurs', async () => {
            const error = new Error ('Internal Server Error');
            (mockReq.params) = {id:"1"} ;
            (patientService.deletePatient as jest.Mock).mockRejectedValue(error)

            await patientController.deletePatient(mockReq, mockRes)

            expect(patientService.deletePatient).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({error:"Failed to delete patient"})
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })


})