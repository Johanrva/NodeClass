import { Appointment } from "./model"
import {Request, Response} from 'express'
import { AppointmentService } from "./service"
import logger from '../../../utils/logger'
import { CreationError, UpdateError, RecordNotFoundError } from "../../../utils/customErrors"

export interface AppointmentController {
    getAllAppointments(req: Request, res: Response): void
    createAppointment(req: Request, res: Response): void
    getAppointmentById (req: Request, res: Response): void
}

export class AppointmentControllerImpl implements AppointmentController {
    private appointmentService: AppointmentService 

    constructor ( appointmentService: AppointmentService ){
        this.appointmentService = appointmentService
    }
    public async getAllAppointments(req: Request, res: Response): Promise<void> {
        try {
            const patients = await this.appointmentService.getAllAppointments()
            res.status(200).json(patients) 
        } catch (error) {
            //logger.error(error)
            res.status(400).json({message:"Error getting all appointments"})
        }
    }
    public createAppointment(req: Request, res: Response): void {
        const appointmentReq = req.body
        this.appointmentService.createAppointment(appointmentReq)
        .then(
            (appointment) =>{
                 res.status(201).json(appointment)
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

    public async getAppointmentById (req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id)
            if (isNaN(id)){
                throw new Error('Id must be a number')
            }
            const appointment = await this.appointmentService.getAppointmentById(id)
            if (appointment) {
                res.status(200).json(appointment)
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

}