import { Request, Response } from 'express'
import { PatientService } from "./service"
import logger from '../../../utils/logger'
import { CreationError, DeleteError, UpdateError, RecordNotFoundError } from "../../../utils/customErrors"
import { createPatientSchema } from "./validations/patient.validations"

export interface PatientController {
    getAllPatients (req: Request, res: Response): void
    createPatient (req: Request, res: Response): void
    getPatientById (req: Request, res: Response): void
    updatePatient (req: Request, res: Response): Promise<void>
    deletePatient (req: Request, res: Response) : Promise<void>
}

export class PatientControllerImpl implements PatientController {
    private patientService: PatientService 

    constructor ( patientService: PatientService ){
        this.patientService = patientService
    }
    public async getAllPatients(req: Request, res: Response): Promise<void> {
        try {
            const patients = await this.patientService.getAllPatients()
            res.status(200).json(patients) 
        } catch (error) {
            res.status(400).json({message:"Error getting all patients"})
        }
    }
    public createPatient(req: Request, res: Response): void {
        const {error, value} = createPatientSchema.validate(req.body)
        if (error) {
            res.status(400).json({message: error.details[0].message})
        } else {        
            this.patientService.createPatient(value)
            .then(
                (patient) =>{
                    res.status(201).json(patient)
                },
                (error) => {
                    logger.error(error)
                    if (error instanceof CreationError){
                        res.status(400).json({
                            error_name: error.name,
                            message: error.message
                        })    
                    } else {
                        res.status(400).json({
                            message: "Internal Server Error"
                        })
                    }
                }
            )
        }
    }

    public async getPatientById (req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id)
            if (isNaN(id)){
                throw new Error('Id must be a number')
            }
            const patient = await this.patientService.getPatientById(id)
            if (patient) {
                res.status(200).json(patient)
            } else {
                throw new RecordNotFoundError ()
            }
        } catch (error) {
            logger.error(error)
            if (error instanceof RecordNotFoundError){
                res.status(400).json({error: error.message})
            } else {
                res.status(400).json({error: "Failed to retrieve patient"})
            }      
        }
    }

    public async updatePatient (req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id)
            const patientReq = req.body
            const patient = await this.patientService.updatePatient(id, patientReq)
            if (patient) {
                res.status(200).json(patient)
            } else {
                throw new UpdateError("Failed to update patient", "Patient")
            }
        } catch (error) {
            logger.error(error)
            if (error instanceof UpdateError){
                res.status(400).json({error: error.message})
            }else {
                res.status(400).json({error: "Failed to update patient"})
            }      
        }
    }

    public async deletePatient (req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id)
            await this.patientService.deletePatient(id)
            res.status(200).json({message: 'Patient was deleted succesfully'})   
        } catch (error) {
            logger.error(error)           
            if (error instanceof DeleteError){
                res.status(400).json({error: error.message})        
            } else {
                res.status(400).json({error: "Failed to delete patient"})
            }      
        }
    }
}