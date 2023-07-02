import { db } from "../../../config/database"
import { Doctor, DoctorReq } from "./model"
import logger from '../../../utils/logger'
import { GetAllError, CreationError, UpdateError, DeleteError, RecordNotFoundError } from "../../../utils/customErrors"

export class DoctorRepository {
    public async createDoctor(doctor: DoctorReq): Promise<Doctor> {
        try {
            const createdDoctor : any = await db('doctores').insert(doctor).returning('*') //select * from doctores where id_doctor=?
            return createdDoctor
        } catch (error) {
            throw new CreationError(`Failed to create doctor`, "Doctor")
        }
    }

    public async getAllDoctors(): Promise<Doctor[]> {
        try {
            const doctors : any = await db.select('*').from('doctores') //select * from doctores 
            return doctors
        } catch (error) {
            throw new GetAllError('Failed getting all doctors', "DoctorRepository")
        }
    }

    public async getDoctorById (id: number): Promise<Doctor> {
        try{
            const doctor = await db('doctores').where({ id_doctor:id}).first()
            return doctor
        } catch (error){
            logger.error(`Failed get doctor by id in repository ${{error}}`)
            throw new RecordNotFoundError()
        }
    }

    public async updateDoctor (id: number, updates: Partial<DoctorReq>): Promise<void> {
        try{
            await db('doctores').where({ id_doctor:id}).update(updates)
        } catch (error){
            logger.error(`Failed updated doctor in repository ${{error}}`)
            throw new UpdateError('Failed updated doctor', "DoctorRepository")
        }
    }

    public async deleteDoctor (id: number): Promise<void> {
        try{
            await db('doctores').where({ id_doctor:id}).del()
        } catch (error){
            logger.error(`Failed deleting doctor in repository ${{error}}`)
            throw new DeleteError('Failed deleting doctor', "DoctorRepository")
        }
    }
}

export default {
    DoctorRepository
}