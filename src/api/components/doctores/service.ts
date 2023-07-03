import { CreationError, DeleteError, UpdateError, RecordNotFoundError } from "../../../utils/customErrors"
import logger from "../../../utils/logger"
import { Doctor, DoctorReq } from "./model"
import { DoctorRepository } from "./repository"

export interface DoctorService {
    getAllDoctors() : Promise<Doctor[]>
    createDoctor(doctorReq: DoctorReq) : Promise <Doctor> 
    getDoctorById (id: number) : Promise <Doctor>
    updateDoctor (id: number, updates : Partial<Doctor>) : Promise <Doctor>
    deleteDoctor (id: number): Promise <void>
}

export class DoctorServiceImpl implements DoctorService {
    private doctorRepository: DoctorRepository

    constructor(doctorRepository: DoctorRepository){
        this.doctorRepository = doctorRepository
    }
    public getAllDoctors(): Promise<Doctor[]> {
        const doctors: Promise <Doctor[]> = this.doctorRepository.getAllDoctors()
        return doctors
    }

    public async createDoctor(doctorReq: DoctorReq): Promise<Doctor> {
        try {
            doctorReq.created_at = new Date ()          
            doctorReq.update_at = new Date ()          
            return this.doctorRepository.createDoctor(doctorReq)
        } catch (error) {
            throw new CreationError("Failed to create doctor",'Doctor')
        }
    }

    public getDoctorById (id: number): Promise <Doctor>{
        try {
            return this.doctorRepository.getDoctorById(id)
        } catch (error){
            logger.error(`Failed to get doctor from service`)
            throw new RecordNotFoundError ()
        }
    }

    public async updateDoctor (id: number, updates : Partial<DoctorReq>): Promise <Doctor>{
        try {
            const existDoctor = await this.doctorRepository.getDoctorById(id)
            if(existDoctor) {
                updates.update_at = new Date ()
                const updateDoctor = {...existDoctor, ...updates}
                this.doctorRepository.updateDoctor(id, updateDoctor)
                return updateDoctor
            } else {
                throw new RecordNotFoundError()
            }           
        } catch (error){
            logger.error(error)
            if (error instanceof RecordNotFoundError){
                throw new UpdateError('Doctor not Found', "Doctor")
            } else {
                throw new UpdateError('Failed to update doctor', "Doctor")
            }
        }
    }

    public async deleteDoctor (id: number): Promise <void>{
        try {
            const existDoctor = await this.doctorRepository.getDoctorById(id)
            if (!existDoctor){
                throw new RecordNotFoundError ()
            }
            await this.doctorRepository.deleteDoctor(id)
        } catch (error){
            logger.error(error)
            if (error instanceof RecordNotFoundError){
                throw new CreationError('Doctor not Found', "Doctor")
            } else {
                throw new CreationError('Failed to delete doctor', "Doctor")
            }
        }
    }
}
