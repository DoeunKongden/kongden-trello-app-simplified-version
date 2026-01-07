import { z } from "zod"

export const createBoardSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title too long"),
    description: z.string().max(500, "Description too long").optional(),
    backgroundColor: z.string().optional(), // e.g., "blue", "purple"
})

export const updateBoardSchema = z.object({
    title: z.string().min(1).max(100).optional(), // Allow partial updates
})