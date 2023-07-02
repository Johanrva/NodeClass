import { DoctorCreationError, DoctorDeleteError, DoctorUpdateError, RecordNotFoundError } from "../../../utils/customErrors"
import logger from "../../../utils/logger"
import { Patient, PatientReq } from "./model"
import { PatientRepository } from "./repository"

export interface PatientService {
    getAllPatients() : Promise<Patient[]>
    createPatient(patientReq: PatientReq) : Promise <Patient> 
    getPatientById (id: number) : Promise <Patient>
}

export class PatientServiceImpl implements PatientService {
    private patientRepository: PatientRepository

    constructor(patientRepository: PatientRepository){
        this.patientRepository = patientRepository
    }
    public getAllPatients(): Promise<Patient[]> {
        const patients: Promise <Patient[]> = this.patientRepository.getAllPatients()
        return patients
    }

    public async createPatient(patientReq: PatientReq): Promise<Patient> {
        try {
            patientReq.created_at = new Date ()
            patientReq.update_at = new Date ()
            return this.patientRepository.createPatient(patientReq)
        } catch (error) {
            throw new DoctorCreationError("Failed to create patient service")
        }
    }

    public getPatientById (id: number): Promise <Patient>{
        try {
            return this.patientRepository.getPatientById(id)
        } catch (error){
            logger.error(`Failed to get patient from service`)
            throw new RecordNotFoundError ()
        }
    }

}
