import { z } from "zod";

export const signUpSchema = z
  .object({
    firstname: z.string().nonempty("First name is required"),
    lastname: z.string().nonempty("Last name is required"),
    email: z.string().email("Invalid email address"),
    phonenumber: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(10, "Phone number must be at most 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    comfirmpassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),
    pickaddress: z.string().nonempty("Pick address is required"),
    pickcity: z.string().nonempty("Pick city is required"),
    picklocation: z.string().nonempty("Pick location is required"),
  })
  .refine((data) => data.password === data.comfirmpassword, {
    path: ["comfirmpassword"],
    message: "Passwords do not match",
  });

export type SignUpFormValues = z.infer<typeof signUpSchema>;

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;
