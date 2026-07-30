import { z } from "zod";

// ─── Auth Schemas ─────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("البريد الإلكتروني غير صحيح"),
  password: z
    .string()
    .min(6, "كلمة المرور يجب أن تكون ٦ أحرف على الأقل"),
});
export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    firstName: z.string().min(2, "الاسم الأول يجب أن يكون حرفين على الأقل"),
    lastName: z.string().min(2, "اسم العائلة يجب أن يكون حرفين على الأقل"),
    email: z
      .string()
      .min(1, "البريد الإلكتروني مطلوب")
      .email("البريد الإلكتروني غير صحيح"),
    phone: z
      .string()
      .min(10, "رقم الجوال يجب أن يكون ١٠ أرقام على الأقل")
      .regex(/^[0-9+\s-]+$/, "رقم الجوال غير صحيح"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون ٦ أحرف على الأقل"),
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
    agreed: z.boolean().refine((v) => v, "يجب الموافقة على الشروط والأحكام"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });
export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("البريد الإلكتروني غير صحيح"),
});
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// ─── Checkout Schemas ─────────────────────────────────────────────
export const personalInfoSchema = z.object({
  firstName: z.string().min(2, "الاسم الأول مطلوب"),
  lastName: z.string().min(2, "اسم العائلة مطلوب"),
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("البريد الإلكتروني غير صحيح"),
  phone: z
    .string()
    .min(10, "رقم الجوال غير صحيح")
    .regex(/^[0-9+\s-]+$/, "رقم الجوال غير صحيح"),
});
export type PersonalInfoData = z.infer<typeof personalInfoSchema>;

export const deliveryAddressSchema = z.object({
  city: z.string().min(2, "المدينة مطلوبة"),
  district: z.string().min(2, "الحي مطلوب"),
  street: z.string().min(3, "الشارع مطلوب"),
  building: z.string().optional(),
  note: z.string().optional(),
});
export type DeliveryAddressData = z.infer<typeof deliveryAddressSchema>;

export const paymentSchema = z
  .object({
    method: z.enum(["card", "applepay", "mada", "cod"]),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvv: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.method === "card") {
      if (!data.cardNumber || data.cardNumber.replace(/\s/g, "").length < 16) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "رقم البطاقة غير صحيح",
          path: ["cardNumber"],
        });
      }
      if (!data.cardExpiry || !/^\d{2}\/\d{2}$/.test(data.cardExpiry)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "تاريخ الانتهاء غير صحيح (MM/YY)",
          path: ["cardExpiry"],
        });
      }
      if (!data.cardCvv || data.cardCvv.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "رمز الـ CVV غير صحيح",
          path: ["cardCvv"],
        });
      }
    }
  });
export type PaymentData = z.infer<typeof paymentSchema>;

// ─── Contact Schema ───────────────────────────────────────────────
export const contactSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  phone: z
    .string()
    .min(10, "رقم الجوال غير صحيح")
    .regex(/^[0-9+\s-]+$/, "رقم الجوال غير صحيح"),
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("البريد الإلكتروني غير صحيح"),
  type: z.string().min(1, "نوع الاستفسار مطلوب"),
  message: z.string().min(10, "الرسالة يجب أن تكون ١٠ أحرف على الأقل"),
});
export type ContactFormData = z.infer<typeof contactSchema>;

// ─── Newsletter Schema ────────────────────────────────────────────
export const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("البريد الإلكتروني غير صحيح"),
});
export type NewsletterFormData = z.infer<typeof newsletterSchema>;

// ─── Address Schema ───────────────────────────────────────────────
export const addressSchema = z.object({
  label: z.string().min(1, "اسم العنوان مطلوب"),
  city: z.string().min(2, "المدينة مطلوبة"),
  district: z.string().min(2, "الحي مطلوب"),
  street: z.string().min(3, "الشارع مطلوب"),
  building: z.string().optional(),
  isDefault: z.boolean(),
});
export type AddressFormData = z.infer<typeof addressSchema>;
