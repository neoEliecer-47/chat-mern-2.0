import { Router } from 'express'
import { loginUser, registerUser, profile, allUsers } from '../controllers/usersControllers.js'
import requireUserToken from '../middlewares/requireUserToken.js'

const router = Router()

//router.route("/users",).get().post() con el route en una sola app podemos habilitar multiples rutas para multiples request distintos
router.route("/").post(registerUser).get(requireUserToken, allUsers)
router.get("/profile", requireUserToken, profile)
router.post("/login", loginUser)

export default router