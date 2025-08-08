
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import * as z from 'zod';

export const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  country: z.string().min(2, { message: "Please select your country." }),
  inquiryType: z.string().min(1, { message: "Please select an inquiry type." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export type FormValues = z.infer<typeof formSchema>;

export async function submitContactForm(data: FormValues) {
    try {
        // Server-side validation
        const validatedData = formSchema.parse(data);

        await addDoc(collection(db, "contactSubmissions"), {
            ...validatedData,
            submittedAt: serverTimestamp(),
        });
        
        return { success: true, message: "Your message has been sent successfully!" };

    } catch (error) {
        console.error("Error submitting form:", error);
        if (error instanceof z.ZodError) {
             return { success: false, message: "Validation failed. Please check your input." };
        }
        return { success: false, message: "An unexpected error occurred. Please try again." };
    }
}
