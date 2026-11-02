
import { z } from "zod";

export const driverSchema = z.object({
  driver_name: z.string().min(1, "Driver name is required"),
  age: z.coerce
    .number()
    .int("Age must be a whole number")
    .min(18, "Driver must be at least 18 years old"),
  email: z.string().email("Enter a valid email address"),
  phone_number: z.string().min(1, "Phone number is required"),
  license_number: z.string().min(1, "License number is required"),
  vehicle_number: z.string().min(1, "Vehicle number is required"),
  profile_avatar: z
    .any()
    .optional(),
});
