export interface Patient {
    id_paciente: number
    nombre: string
    apellido: string
    identificacion: string
    telefono: number
    created_at: Date
    update_at: Date
}

export interface PatientReq {
    nombre: string
    apellido: string
    identificacion: string
    telefono?: number
    created_at?: Date
    update_at?: Date
}

