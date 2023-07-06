import joi from "joi"
import { Especialidad } from "../../../../utils/model"

const createDoctorSchema= joi.object({
    nombre: joi.string().required(),
    apellido: joi.string(),
    especialidad: joi.string().valid(...Object.values(Especialidad)).required(),
    consultorio: joi.number().integer().min(100).max(999).required(),
    correo: joi.string()
})

export { createDoctorSchema }