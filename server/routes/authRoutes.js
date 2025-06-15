import {Router} from "express"
import {validateRequest} from "zod-express-middleware"
import {registerSchema, loginSchema, verifyMailSchema} from "../utils/validate-schemas.js";
import { loginUser, registerUser, verifyMail} from "../controllers/auth.controller.js";

const router = Router();

// to regester a new user
router.post("/register", validateRequest({
    body: registerSchema,      // req.body should match this schema 
}), registerUser);

// login user
router.post("/login", validateRequest({
    body: loginSchema
}), loginUser);

// verify user with token
router.post("/verify-mail", validateRequest({
    body: verifyMailSchema
}), verifyMail);


export default router;