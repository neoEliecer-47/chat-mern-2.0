import { Router } from 'express'
import { createOrAccessOneChat, accessAllChats, createGroupChat, renameGroup, addUserToGroup, removeUserFromGroup } from '../controllers/chatsControllers.js'
import requireUserToken from '../middlewares/requireUserToken.js'

const router = Router()

//router.get("/", allChats)
//router.get("/:id", oneChat)

router.route("/").post(requireUserToken, createOrAccessOneChat).get(requireUserToken, accessAllChats)
router.route("/group").post(requireUserToken, createGroupChat)
router.route("/rename").put(requireUserToken, renameGroup)//renombrar grupo
router.route("/groupadd").put(requireUserToken, addUserToGroup)//añadir usuario al chat grupal
router.route("/groupremove").put(requireUserToken, removeUserFromGroup)//remover usuario del chat grupal

export default router
//647a08d2ec778c08db37bf9e