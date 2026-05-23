import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "O e-mail é obrigatório")
    .email("Formato de e-mail inválido"),
  password: z
    .string()
    .min(1, "A senha é obrigatória")
    .min(4, "A senha deve ter pelo menos 4 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  firstName: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "O sobrenome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Formato de e-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  address: z.string().min(5, "O endereço é obrigatório"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    error: "Selecione um gênero válido",
  }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
