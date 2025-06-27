import { ProjectStatus } from '@/types';
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

export const ProjectSchma = z.object({
    title: z.string().min(2, "Title must be atleast 2 characters long"),
    description: z.string().max(120, "Too Long. Maximum 120 charcaters.").optional(),
    status: z.nativeEnum(ProjectStatus),
    startDate: z.string().min(1, "Start date is required"),
    dueDate: z.string().min(1, "Due date is required"),
    // array of objects with user and role
    members: z.array(
        z.object({
            user: z.string(),       // will only contain user id
            role: z.enum(["admin", "member", "owner", "viewer"]),
        })
    ).optional(),
    tags: z.string().optional(),
}).refine(
    (data) => {
        // Compare as ISO date strings
        return new Date(data.dueDate) >= new Date(data.startDate);
    },
    {
        message: "Due date must be the same day or after the start date",
        path: ["dueDate"],
    }
)