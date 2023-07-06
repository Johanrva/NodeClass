import joi from "joi"
//import { Especialidad } from "../../../../utils/model"

const createPatientSchema= joi.object({
    nombre: joi.string().required(),
    apellido: joi.string().required(),
    identificacion: joi.string().min(8).max(13).required(),
    telefono: joi.number()
})

export { createPatientSchema }