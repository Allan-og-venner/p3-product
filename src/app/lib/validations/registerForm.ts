import { z } from 'zod'
//.regex(new RegExp(/^[a-zA-Z0-9]+$/),'Special characters not allowed')

export const registerFormSchema = z.object({
  username: z.string().min(3).max(20).trim(),
  password: z.string().min(5).max(24).trim(),
  confirmPassword: z.string().min(5).max(24).trim(),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
})
 