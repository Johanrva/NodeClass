import { db } from "../../../config/database"
import { Patient, PatientReq } from "./model"
import logger from '../../../utils/logger'
import { CreationError, GetAllError, RecordNotFoundError } from "../../../utils/customErrors"

export class PatientRepository {
    public async createPatient(patient: PatientReq): Promise<Patient> {
        try {
            const [createdPatient] : any = await db('pacientes').insert(patient).returning('*') 
            return createdPatient
        } catch (error) {
            throw new CreationError(`Failed to create patient`, "Patient")
        }
    }

    public async getAllPatients(): Promise<Patient[]> {
        try {
            const patients : any = await db.select('*').from('pacientes') //select * from doctores 
            return patients
        } catch (error) {
            throw new GetAllError("Failed getting all patients", "Patient")
        }
    }

    public async getPatientById (id: number): Promise<Patient> {
        try{
            const patient = await db('pacientes').where({ id_paciente:id}).first()
            return patient
        } catch (error){
            logger.error(`Failed get patient by id in repository ${{error}}`)
            throw new RecordNotFoundError()
        }
    }

}