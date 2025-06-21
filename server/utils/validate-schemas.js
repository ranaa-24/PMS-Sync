import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
})

export const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, { message: 'Password Required' })
})

export const verifyMailSchema = z.object({
    token: z.string().min(1, { message: 'Token is required' })
});

export const forgotPasswordRequestSchema = z.object({
    email: z.string().email({message: "Invalid email address"})
});

export const verifyRequestEmailAndRestPasswordSchema = z.object({
    token : z.string().min(1, {message : "Token required!"}),
    newPassword: z.string().min(8, { message: 'Password must be at least 8 characters long' }), 
    confirmPassword: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});

export const workspaceSchema = z.object({
    name: z.string().min(1, "Name Required"), 
    description: z.string().max(250, "Maximum 250 characters long").optional(), 
    color: z.string().min(1, "Color required"),
})