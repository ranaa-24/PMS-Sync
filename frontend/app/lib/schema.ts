import { z } from 'zod';

export const LoginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),   
    password: z.string().min(6, {message: "password required"})
});

export const SignupSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters long' }).max(30, {message: "Name is too big for our DB"}),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    confirmPassword: z.string(),
    
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ["confirmPassword"]  //tells Zod where to apply the error
});

export const resetPasswordSchema = z.object({
    newPassword : z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    confirmPassword : z.string().min(8, { message: 'Password must be at least 8 characters long' }),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ["confirmPassword"]  //tells Zod where to apply the error
});

export const forgotPasswordSchema = z.object({
    email : z.string().email()
});

export const workspaceSchema = z.object({
    name: z.string().min(2, "Name must be atleast 3 characters long"), 
    color: z.string(), 
    description: z.string().max(45, "Too Long. Maximum 45 charcaters.").optional(),
})