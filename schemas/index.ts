import * as z from "zod";

export const loginFormSchema = z.object({
   email: z.string().email({ message: 'Invalid email address' }),
   password: z.string().min(1, { message: 'Password is required' })
});

export const registerFormSchema = z.object({
   firstName: z.string()
      .min(2, { message: 'First Name must be at least 2 characters' })
      .max(50, { message: 'First Name must be at most 50 characters' }),
   lastName: z.string()
      .min(2, { message: 'Last Name must be at least 2 characters' })
      .max(50, { message: 'Last Name must be at most 50 characters' }),
   emailAddress: z.string().email({ message: 'Invalid email address' }).toLowerCase(),
   password: z.string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
});

export const emailVerifySchema = z.object({
   code: z.string().length(6, "Verification code must be 6 digits"),
});

export const resetPasswordSchema = z.object({
   code: z.string().optional(),
   password: z.string().optional(),
   emailAddress: z.email("Enter a valid email"),
});

export const requestResetSchema = z.object({
   email: z.email()
});

export type TloginFormData = z.infer<typeof loginFormSchema>;
export type TregisterFormData = z.infer<typeof registerFormSchema>;
export type TemailVerifyFormData = z.infer<typeof emailVerifySchema>;
export type TrequestResetFormData = z.infer<typeof requestResetSchema>;
export type TresetPasswordFormData = z.infer<typeof resetPasswordSchema>;
