import { Doctor, DoctorReq } from "../api/components/doctores/model";
import { DoctorServiceImpl } from "../api/components/doctores/service";
import { DoctorRepository } from "../api/components/doctores/repository";
import { CreationError, DeleteError, RecordNotFoundError, UpdateError } from "../utils/customErrors";

describe ('DoctorService', () => {
    let doctorService : DoctorServiceImpl
    let doctorRepository : DoctorRepository

    beforeEach ( () => {
        doctorRepository = {
            getAllDoctors : jest.fn(),
            createDoctor : jest.fn(),
            getDoctorById : jest.fn(),
            updateDoctor: jest.fn(),
            deleteDoctor: jest.fn()
        }
        doctorService = new DoctorServiceImpl(doctorRepository)
    })

    describe ('getAllDoctors', () => {
        it('should get all doctors from service', async () => {
            //Mock Process
            const doctors: Doctor[] = [
                {id_doctor : 1, nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100},
                {id_doctor : 2, nombre: 'Alveiro', apellido: 'Tarsisio', especialidad: 'Ortopedia', consultorio:101}
            ];
            
            (doctorRepository.getAllDoctors as jest.Mock).mockResolvedValue(doctors)
            // Method excecution
            const result = await doctorService.getAllDoctors()
            //Asserts
            expect(doctorRepository.getAllDoctors).toHaveBeenCalled()
            expect(result).toEqual(doctors)
            
        })
        it('should return an empty array when no doctors are found', async () => {
            //Mock Process           
            (doctorRepository.getAllDoctors as jest.Mock).mockResolvedValue([])
            // Method excecution
            const result = await doctorService.getAllDoctors()
            //Asserts
            expect(doctorRepository.getAllDoctors).toHaveBeenCalled()
            expect(result).toEqual([])
            
        })
    })

    describe ('crateDoctor', () => {
        it('should create a new doctor and return it from service', async () => {
            //Mock Process
            const doctorRes: Doctor = {id_doctor : 1, nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100};
            const doctorReq: DoctorReq = {nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100};
            
            (doctorRepository.createDoctor as jest.Mock).mockResolvedValue(doctorRes)
            // Method excecution
            const result = await doctorService.createDoctor(doctorReq)
            //Asserts
            expect(doctorRepository.createDoctor).toHaveBeenCalledWith(doctorReq)
            expect(result).toEqual(doctorRes)
            
        })
        
        it('should throw and error if doctor creation fails', async () => {
            //Mock Process 
            const doctorReq: DoctorReq = {nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100};
            const error1 = new CreationError ('Failed to created a doctor', 'Doctor');
            (doctorRepository.createDoctor as jest.Mock).mockRejectedValue(error1)
            // Method excecution
            //Asserts
            await expect(doctorService.createDoctor(doctorReq)).rejects.toThrowError(error1)
            expect(doctorRepository.createDoctor).toHaveBeenCalledWith(doctorReq)
            
        })
    })

    describe ('getDoctorById', () => {
        it('should get doctor by id from service', async () => {
            //Mock Process
            const doctor: Doctor = {id_doctor : 1, nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100};        
            const doctorId = 1;

            (doctorRepository.getDoctorById as jest.Mock).mockResolvedValue(doctor)
            // Method excecution
            const result = await doctorService.getDoctorById(doctorId)
            //Asserts
            expect(doctorRepository.getDoctorById).toHaveBeenCalledWith(doctorId)
            expect(result).toEqual(doctor)
            
        })
        it('should return an empty when no doctor are found', async () => {
            //Mock Process    
            const doctorId = 1;
            (doctorRepository.getDoctorById as jest.Mock).mockResolvedValue(null)
            // Method excecution
            const result = await doctorService.getDoctorById(doctorId)
            //Asserts
            expect(doctorRepository.getDoctorById).toHaveBeenCalledWith(doctorId)
            expect(result).toBeNull()
            
        })

        it('should throw an error if retriebal fails', async () => {
            //Mock Process    
            const doctorId = 1;
            const error = new RecordNotFoundError();
            (doctorRepository.getDoctorById as jest.Mock).mockRejectedValue(error)
           
            //Asserts
            await expect(doctorService.getDoctorById(doctorId)).rejects.toThrowError(error)
            expect(doctorRepository.getDoctorById).toHaveBeenCalledWith(doctorId)           
        })
    })

    describe ('updateDoctor', () => {
        it('should update a doctor and return it from service', async () => {
            //Mock Process
            const doctorRes: Doctor = {id_doctor : 1, nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100, update_at: new Date()};
            const doctorReq: DoctorReq = {nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100};
            
            const id = 1;
            (doctorRepository.getDoctorById as jest.Mock).mockResolvedValue(doctorRes)
            // Method excecution
            const result = await doctorService.updateDoctor(id,doctorReq)
            //Asserts
            expect(doctorRepository.getDoctorById).toHaveBeenCalledWith(id)
            expect(doctorRepository.updateDoctor).toHaveBeenCalledWith(1,doctorRes)
            expect(result).toEqual(doctorRes)
            
        })
        
        it('should throw an error if doctor updating fails', async () => {
            //Mock Process 
            const doctorReq: DoctorReq = {nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100};
            const error1 = new UpdateError ('Failed updating doctor', 'Doctor');
            const id = 1;
            (doctorRepository.getDoctorById as jest.Mock).mockRejectedValue(new Error())
            
            await expect(doctorService.updateDoctor(id,doctorReq)).rejects.toThrowError(error1)
            expect(doctorRepository.getDoctorById).toHaveBeenCalledWith(1)
            
        })

        it('should throw an error if doctor not found', async () => {
            const doctorReq: DoctorReq = {nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100};
            const error1 = new UpdateError ('Doctor not Found', 'Doctor');
            const id = 1;

            (doctorRepository.getDoctorById as jest.Mock).mockResolvedValue(null)
            
            await expect(doctorService.updateDoctor(1,doctorReq)).rejects.toThrowError(error1)
            expect(doctorRepository.getDoctorById).toHaveBeenCalledWith(id)
            
        })
    })

    describe ('deleteDoctor', () => {
        it('should delete a doctor and return it from service', async () => {
            const doctorRes: Doctor = {id_doctor : 1, nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100};          
            const id = 1;
            (doctorRepository.getDoctorById as jest.Mock).mockResolvedValue(doctorRes)

            await doctorService.deleteDoctor(id)

            expect(doctorRepository.getDoctorById).toHaveBeenCalledWith(id)
            expect(doctorRepository.deleteDoctor).toHaveBeenCalledWith(id)            
        })
        
        it('should throw an error if doctor deleting fails', async () => {
            //Mock Process 
            const error1 = new DeleteError ('Failed deleting doctor', 'Doctor');
            const id = 1;
            (doctorRepository.getDoctorById as jest.Mock).mockRejectedValue(new Error())
            
            await expect(doctorService.deleteDoctor(id)).rejects.toThrowError(error1)
            expect(doctorRepository.getDoctorById).toHaveBeenCalledWith(id)
            
        })

        it('should throw an error if doctor not found', async () => {
            const error1 = new DeleteError ('Doctor not Found', 'Doctor');
            const id = 1;

            (doctorRepository.getDoctorById as jest.Mock).mockResolvedValue(null)
            
            await expect(doctorService.deleteDoctor(1)).rejects.toThrowError(error1)
            expect(doctorRepository.getDoctorById).toHaveBeenCalledWith(id)
            
        })
    })
})