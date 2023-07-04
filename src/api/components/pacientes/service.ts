import { CreationError, DeleteError, UpdateError, RecordNotFoundError } from "../../../utils/customErrors"
import logger from "../../../utils/logger"
import { Patient, PatientReq } from "./model"
import { PatientRepository } from "./repository"

export interface PatientService {
    getAllPatients() : Promise<Patient[]>
    createPatient(patientReq: PatientReq) : Promise <Patient> 
    getPatientById (id: number) : Promise <Patient>
    updatePatient (id: number, updates : Partial<PatientReq>): Promise <Patient>
    deletePatient (id: number): Promise <void>
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
            throw new CreationError("Failed to create patient", "Patient")
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

    public async updatePatient (id: number, updates : Partial<PatientReq>): Promise <Patient>{
        try {
            const existPatient = await this.patientRepository.getPatientById(id)
            if(existPatient) {
                updates.update_at = new Date ()
                const updatePatient = {...existPatient, ...updates}
                this.patientRepository.updatePatient(id, updatePatient)
                return updatePatient
            } else {
                throw new RecordNotFoundError()
            }
        } catch (error){
            logger.error(error)
            if (error instanceof RecordNotFoundError){
                throw new UpdateError('Patient not Found', "Patient")
            } else {
                throw new UpdateError('Failed to update patient', "Patient")
            }
        }
    }

    public async deletePatient (id: number): Promise <void>{
        try {
            const existPatient = await this.patientRepository.getPatientById(id)
            if(existPatient) {
                this.patientRepository.deletePatient(id)
            } else {
                throw new RecordNotFoundError()
            }
        } catch (error){
            logger.error(error)
            if (error instanceof RecordNotFoundError){
                throw new DeleteError('Patient not found', "Patient")
            } else {
                throw new DeleteError('Failed deleting patient', "Patient")
            }
        }
        
    }

    

}
