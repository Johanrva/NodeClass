import {Router} from 'express'
import { PatientController, PatientControllerImpl } from './controller'
import { PatientServiceImpl } from './service'
import { PatientRepository } from './repository'


const router = Router ()
const repository = new PatientRepository()
const service = new PatientServiceImpl(repository)
const controller: PatientController = new PatientControllerImpl(service)

router.get('', controller.getAllPatients.bind(controller))
router.post('/create', controller.createPatient.bind(controller))
router.get('/:id', controller.getPatientById.bind(controller))
router.put('/:id', controller.updatePatient.bind(controller))

export default router 