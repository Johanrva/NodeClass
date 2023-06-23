import { Doctor, DoctorReq } from "./model"
import { DoctorRepository } from "./repository"

export interface DoctorService {
    getAllDoctors(): Promise<Doctor[]>
    createDoctor(doctorReq: DoctorReq): Promise <Doctor> 
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
        const createdDoctor: Promise<Doctor> = this.doctorRepository.createDoctor(doctorReq) 
        return createdDoctor
    }
}
