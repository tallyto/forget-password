import {Router} from 'express'
import { saveUser, login, forgetPassword } from './controller/UserController'

const routes = Router()

routes.get("/", (req, res)=>{
    res.json({message: "Server Running..."})
})

routes.post("/users", saveUser)
routes.post("/session", login)
routes.post("/forgot-password", forgetPassword)



export default routes