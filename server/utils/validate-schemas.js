import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 6 characters long' })
})

export const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, { message: 'Password Required' })
})

export const verifyMailSchema = z.object({
    token: z.string().min(1, { message: 'Token is required' })
});