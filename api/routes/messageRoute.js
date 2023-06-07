import { Router } from 'express'
import requireUserToken from '../middlewares/requireUserToken.js'
import { sendMessage, allMessages } from '../controllers/messagesControllers.js'

const router = Router()

router.route("/").post(requireUserToken, sendMessage)
router.route("/:chatId").post(requireUserToken, allMessages)

export default router