import joi from "joi"
import { Especialidad } from "../../../../utils/model"

const createAppointmentSchema= joi.object({
    identificacion_paciente: joi.string().min(8).max(13).required(),
    especialidad: joi.string().valid(...Object.values(Especialidad)).required(),
    id_doctor: joi.number().required(),
    horario: joi.string().required()
})

export { createAppointmentSchema }