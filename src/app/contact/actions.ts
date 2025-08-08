
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import * as z from 'zod';
import type { FormValues } from '@/lib/data';
import { formSchema } from '@/lib/data';

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
