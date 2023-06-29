export interface Patient {
    id_paciente: number
    nombre: string
    apellido: string
    identificacion: string
    telefono: number
    createdAt: Date
    upadteAt: Date
}

export interface PatientReq {
    nombre: string
    apellido: string
    identificacion: string
    telefono?: number
}

