import { useMutation } from "@tanstack/react-query"
import { type SignupFormType } from "@/routes/auth/signup"
import { postData } from "@/lib/api-request-utils"
import { type LoginFormType } from "@/routes/auth/login"

export const useSignUpMutation = () => {
    return useMutation({
        mutationFn: (data:SignupFormType) => postData('auth/register', data)
    })
}

export const useVerifyEmailMutation = () => {
    return useMutation({
        mutationFn: (data: { token: string }) => postData('auth/verify-mail', data)
    })
}

export const useLoginMutation = () => {
    return useMutation({
        mutationFn: (data: LoginFormType) => postData('/auth/login', data), 
    })
}

export const useForgotPasswordMutation = () => {
    return useMutation({
        mutationFn: (data: {email: string}) => postData('auth/reset-password-request', data),
    })
}
 
export const useResetPasswordMutation = () => {
    return useMutation({
        mutationFn: (data: {token: string, newPassword: string, confirmPassword: string}) => postData('auth/reset-password', data)
    })
}