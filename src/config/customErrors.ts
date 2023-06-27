class DoctorGetAllError extends Error {
    constructor(){
        super("Failed to retrieve doctor list")
        this.name = "DoctorGetAllError"
    }
}

class DoctorCreationError extends Error {
    constructor(public message: string){
        super(message)
        this.name = "DoctorCreationError"
    }
}
class DoctorUpdateError extends Error {
    constructor(){
        super("Failed to update doctor")
        this.name = "DoctorUpdateError"
    }
}

class DoctorDeleteError extends Error {
    constructor(){
        super("Failed to delete doctor")
        this.name = "DoctorDeleteError"
    }
}
class RecordNotFoundError extends Error {
    constructor(){
        super("Record has not found yet")
        this.name = "RecordNotFound"
    }
}
export {
    DoctorGetAllError,
    DoctorCreationError,
    RecordNotFoundError,
    DoctorUpdateError,
    DoctorDeleteError
}