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
    email: z.string().email({ message: "Invalid email address" })
});

export const verifyRequestEmailAndRestPasswordSchema = z.object({
    token: z.string().min(1, { message: "Token required!" }),
    newPassword: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    confirmPassword: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});

export const workspaceSchema = z.object({
    name: z.string().min(1, "Name Required"),
    description: z.string().max(250, "Maximum 250 characters long").optional(),
    color: z.string().min(1, "Color required"),
})

export const ProjectSchema = z.object({
    title: z.string().min(2, 'Title must be at least 2 characters long'),
    description: z.string().max(200, 'Description must be at most 200 characters long').optional(),
    status: z.enum(['Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled']),
    startDate: z.string(),
    dueDate: z.string().optional(),
    tags: z.string().optional(),
    members: z.array(
        z.object({
            user: z.string(),
            role: z.enum(["manager", "contributor", "viewer"])
        })
    ).optional(),
})

export const taskSchema = z.object({
    title: z.string().min(1, "Task title is required"),
    description: z.string().optional(),
    status: z.enum(["To Do", "In Progress", "Done"]),
    priority: z.enum(["Low", "Medium", "High"]),
    dueDate: z.string().min(1, "Due date is required"),
    assignees: z.array(z.string()).min(1, "At least one assignee is required"),
});


export const inviteMemberSchema = z.object({
    email: z.string().email("Invalid email address"),
    role: z.enum(["admin", "member", "viewer"]),
})