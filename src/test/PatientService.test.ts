import { Patient, PatientReq } from "../api/components/pacientes/model"
import { PatientServiceImpl } from "../api/components/pacientes/service"
import { PatientRepository } from "../api/components/pacientes/repository";
import { CreationError, DeleteError, RecordNotFoundError, UpdateError } from "../utils/customErrors";
import { DoctorRepository } from "../api/components/doctores/repository";

describe ('PatientService', () => {
    let patientService : PatientServiceImpl
    let patientRepository : PatientRepository

    beforeEach ( () => {
        patientRepository = {
            getAllPatients : jest.fn(),
            createPatient : jest.fn(),
            getPatientById : jest.fn(),
            getPatientByIdentification : jest.fn(),
            updatePatient: jest.fn(),
            deletePatient: jest.fn()
        }
        patientService = new PatientServiceImpl(patientRepository)
    })

    describe ('getAllPatients', () => {
        it('should get all patients from service', async () => {
            //Mock Process
            const patients: Patient[] = [
                {id_paciente : 1, nombre: 'Carlos', apellido: 'Caceres', identificacion: "123456789"},
                {id_paciente : 2, nombre: 'Alveiro', apellido: 'Tarsisio', identificacion: "1234567890"}
            ];
            
            (patientRepository.getAllPatients as jest.Mock).mockResolvedValue(patients)
            // Method excecution
            const result = await patientService.getAllPatients()
            //Asserts
            expect(patientRepository.getAllPatients).toHaveBeenCalled()
            expect(result).toEqual(patients)
            
        })
        it('should return an empty array when no patients are found', async () => {
            //Mock Process           
            (patientRepository.getAllPatients as jest.Mock).mockResolvedValue([])
            // Method excecution
            const result = await patientService.getAllPatients()
            //Asserts
            expect(patientRepository.getAllPatients).toHaveBeenCalled()
            expect(result).toEqual([])
            
        })
    })

    describe ('cratePatient', () => {
        it('should create a new patient and return it from service', async () => {
            //Mock Process
            const patientRes: Patient = {id_paciente : 1, nombre: 'Carlos', apellido: 'Caceres', identificacion: "123456789"};
            const patientReq: PatientReq = {nombre: 'Carlos', apellido: 'Caceres', identificacion: "123456789"};
            
            (patientRepository.createPatient as jest.Mock).mockResolvedValue(patientRes)
            // Method excecution
            const result = await patientService.createPatient(patientReq)
            //Asserts
            expect(patientRepository.createPatient).toHaveBeenCalledWith(patientReq)
            expect(result).toEqual(patientRes)
            
        })
        
        it('should throw and error if patient creation fails', async () => {
            //Mock Process 
            const patientReq: PatientReq = {nombre: 'Carlos', apellido: 'Caceres', identificacion: "123456789"};
            const error = new CreationError ('Failed to created a patient', 'Patient');
            const error1 = new Error ('Internal server error');
            (patientRepository.createPatient as jest.Mock).mockRejectedValue(error)
            // Method excecution
            //Asserts
            await expect(patientService.createPatient(patientReq)).rejects.toThrowError(error)
            expect(patientRepository.createPatient).toHaveBeenCalledWith(patientReq)
            
        })
    })

    describe ('getPatientById', () => {
        it('should get patient by id from service', async () => {
            //Mock Process
            const patient: Patient = {id_paciente : 1, nombre: 'Carlos', apellido: 'Caceres', identificacion: "123456789"};
            const patientId = 1;

            (patientRepository.getPatientById as jest.Mock).mockResolvedValue(patient)
            // Method excecution
            const result = await patientService.getPatientById(patientId)
            //Asserts
            expect(patientRepository.getPatientById).toHaveBeenCalledWith(1)
            expect(result).toEqual(patient)
            
        })
        it('should return an empty when no patient are found', async () => {
            //Mock Process    
            const patientId = 1;
            (patientRepository.getPatientById as jest.Mock).mockResolvedValue(null)
            // Method excecution
            const result = await patientService.getPatientById(patientId)
            //Asserts
            expect(patientRepository.getPatientById).toHaveBeenCalledWith(1)
            expect(result).toBeNull()
            
        })

        it('should throw an error if retriebal fails', async () => {
            //Mock Process    
            const patientId = 1;
            const error = new RecordNotFoundError();
            const error1 = new Error("Internal server error");
            (patientRepository.getPatientById as jest.Mock).mockRejectedValue(error)
           
            //Asserts
            await expect(patientService.getPatientById(patientId)).rejects.toThrowError(error)
            expect(patientRepository.getPatientById).toHaveBeenCalledWith(patientId)           
        })
    })

    describe ('updatePatient', () => {
        it('should update a patient and return it from service', async () => {
            //Mock Process
            const patientRes: Patient = {id_paciente : 1, nombre: 'Carlos', apellido: 'Caceres', identificacion: "123456789", update_at: new Date()};
            const patientReq: PatientReq = {nombre: 'Carlos', apellido: 'Caceres', identificacion: "123456789"};
            const id = 1;

            (patientRepository.getPatientById as jest.Mock).mockResolvedValue(patientRes)
            // Method excecution
            const result = await patientService.updatePatient(id,patientReq)
            //Asserts
            expect(patientRepository.getPatientById).toHaveBeenCalledWith(id)
            expect(patientRepository.updatePatient).toHaveBeenCalledWith(1,patientRes)
            expect(result).toEqual(patientRes)
            
        })
        
        it('should throw an error if patient updating fails', async () => {
            //Mock Process 
            const patientReq: PatientReq = {nombre: 'Carlos', apellido: 'Caceres', identificacion: "123456789"};
            const error1 = new UpdateError ('Failed to update patient', 'Doctor');
            const id = 1;
            (patientRepository.getPatientById as jest.Mock).mockRejectedValue(new Error())
            
            await expect(patientService.updatePatient(id,patientReq)).rejects.toThrowError(error1)
            expect(patientRepository.getPatientById).toHaveBeenCalledWith(1)
            
        })

        it('should throw an error if patient not found', async () => {
            const patientReq: PatientReq = {nombre: 'Carlos', apellido: 'Caceres', identificacion: "123456789"};
            const error = new UpdateError ('Patient not Found', 'Patient');
            const id = 1;

            (patientRepository.getPatientById as jest.Mock).mockResolvedValue(null)
            
            await expect(patientService.updatePatient(1,patientReq)).rejects.toThrowError(error)
            expect(patientRepository.getPatientById).toHaveBeenCalledWith(id)
            
        })
    })

    describe ('deletePatient', () => {
        it('should delete a patient and return it from service', async () => {
            const patientRes: Patient = {id_paciente : 1, nombre: 'Carlos', apellido: 'Caceres', identificacion: "123456789"};
            const id = 1;
            (patientRepository.getPatientById as jest.Mock).mockResolvedValue(patientRes)

            await patientService.deletePatient(id)

            expect(patientRepository.getPatientById).toHaveBeenCalledWith(1)
            expect(patientRepository.deletePatient).toHaveBeenCalledWith(1)            
        })
        
        it('should throw an error if patient deleting fails', async () => {
            //Mock Process 
            const error1 = new DeleteError ('Failed deleting patient', 'Patient');
            const id = 1;
            (patientRepository.getPatientById as jest.Mock).mockRejectedValue(new Error())
            
            await expect(patientService.deletePatient(id)).rejects.toThrowError(error1)
            expect(patientRepository.getPatientById).toHaveBeenCalledWith(1)
            
        })

        it('should throw an error if patient not found', async () => {
            const error1 = new DeleteError ('Patient not found', 'Patient');
            const id = 1;

            (patientRepository.getPatientById as jest.Mock).mockResolvedValue(null)
            
            await expect(patientService.deletePatient(1)).rejects.toThrowError(error1)
            expect(patientRepository.getPatientById).toHaveBeenCalledWith(id)
            
        })
    })
})