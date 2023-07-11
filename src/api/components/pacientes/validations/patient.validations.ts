import joi from "joi"

const createPatientSchema= joi.object({
    nombre: joi.string().required(),
    apellido: joi.string().required(),
    identificacion: joi.string().min(8).max(13).required(),
    telefono: joi.number()
})

export { createPatientSchema }