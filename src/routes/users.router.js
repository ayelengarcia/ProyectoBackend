import {Router} from 'express'
import { createUser, deletedUser, getUserByEmail, getUsers, updatedUserById } from '../controllers/users.controller.js'

const router = Router()

router.post('/users', createUser)

router.get('/users', getUsers)

router.get('/users/:email', getUserByEmail)

router.put("/users/:id", updatedUserById);

router.delete("/users/:id", deletedUser);

export default router