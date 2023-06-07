import { Router } from 'express'
import { photoUploaderByDevice } from '../controllers/photosControllers.js'
import multer from 'multer'

const router = Router()
const photosMiddleware = multer({dest: 'uploads'})


router.post("/", photosMiddleware.array('photo', 10),photoUploaderByDevice)

export default router