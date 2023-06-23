import { db } from "../../../config/database"
import { Doctor, DoctorReq } from "./model"
import logger from '../../../utils/logger'

export class DoctorRepository {
    public async createDoctor(doctor: DoctorReq): Promise<Doctor> {
        try {
            const createdDoctor : any = await db('doctores').insert(doctor).returning('*') //select * from doctores where id_doctor=?
            return createdDoctor
        } catch (error) {
            throw new Error (`Error creating doctor: ${error}`)
        }
    }

    public async getAllDoctors(): Promise<Doctor[]> {
        try {
            const doctors : any = await db.select('*').from('doctores') //select * from doctores 
            return doctors
        } catch (error) {
            throw new Error (`Error getting all doctors: ${error}`)
        }
    }
}