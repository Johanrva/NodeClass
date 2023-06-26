import { Doctor, DoctorReq } from "../api/components/doctores/model";
import { DoctorServiceImpl } from "../api/components/doctores/service";
import { DoctorRepository } from "../api/components/doctores/repository";

describe ('DoctorService', () => {
    let doctorService : DoctorServiceImpl
    let doctorRepository : DoctorRepository

    beforeEach ( () => {
        doctorRepository = {
            getAllDoctors : jest.fn(),
            createDoctor : jest.fn()
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
        it('should return an empty array when no cotros are found', async () => {
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
        // To do manejo de errores
        // it('should throw and error if doctor creation fails', async () => {
        //     //Mock Process 
        //     const doctorReq: DoctorReq = {nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100};
        //     const error = new Error ('Failed to created a doctor');
        //     (doctorRepository.createDoctor as jest.Mock).mockResolvedValue(error)
        //     // Method excecution
        //     const result = await doctorService.createDoctor(doctorReq)
        //     //Asserts
        //     expect(doctorRepository.createDoctor).toHaveBeenCalledWith(doctorReq)
        //     expect(result).rejects.toThrowError(error)
            
        // })
    })

})