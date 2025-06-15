import { z } from 'zod';

export const LoginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),   
    password: z.string().min(6, {message: "password required"})
});

export const SignupSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),   
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 6 characters long' }),
    confirmPassword: z.string(),
    
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ["confirmPassword"]  //tells Zod where to apply the error
});