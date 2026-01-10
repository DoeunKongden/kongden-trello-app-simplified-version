import { title } from "process"
import { z } from "zod"


export const createdListScehma = z.object({
    title: z.string().min(1, 'Title is required').max(100),
})

export const updateListScehma = z.object({
    title: z.string().min(1).max(100).optional(),
})

export const reorderListsSchema = z.array(
    z.object({
        id: z.string(),
    })
);