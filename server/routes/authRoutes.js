import {Router} from "express"
import {validateRequest} from "zod-express-middleware"
import {registerSchema, loginSchema, verifyMailSchema, forgotPasswordRequestSchema, verifyRequestEmailAndRestPasswordSchema} from "../utils/validate-schemas.js";
import { loginUser, registerUser, verifyMail, resetPasswordRequest, verifyAndResetPassword} from "../controllers/auth.controller.js";

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

// request for password reset, by  mail, forget password
router.post('/reset-password-request', validateRequest({
    body: forgotPasswordRequestSchema
}), resetPasswordRequest);


// reset a new pass 
router.post('/reset-password', validateRequest({
    body : verifyRequestEmailAndRestPasswordSchema    
}), verifyAndResetPassword)

export default router;