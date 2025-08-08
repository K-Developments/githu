
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country: string;
  inquiryType: string;
  message: string;
  submittedAt: Timestamp;
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const submissionsCollectionRef = collection(db, "contactSubmissions");
        const q = query(submissionsCollectionRef, orderBy("submittedAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedSubmissions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Submission));
        setSubmissions(fetchedSubmissions);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) {
    return <div>Loading submissions...</div>;
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Contact Form Submissions</CardTitle>
          <CardDescription>
            Here are the latest inquiries from your website's contact form.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {submissions.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                    {submissions.map((submission) => (
                        <AccordionItem value={submission.id} key={submission.id}>
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex justify-between items-center w-full pr-4">
                                    <div className="flex items-center gap-4 text-left">
                                        <div className="font-medium">{submission.name}</div>
                                        <div className="text-sm text-muted-foreground">{submission.email}</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge variant="outline" className="hidden md:inline-flex">{submission.inquiryType}</Badge>
                                        <span className="text-sm text-muted-foreground">
                                        {submission.submittedAt?.toDate().toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="bg-muted/50 p-6 rounded-md">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div><strong className="font-medium">Country:</strong> {submission.country}</div>
                                    <div><strong className="font-medium">Phone:</strong> {submission.phone || 'N/A'}</div>
                                    <div className="md:hidden"><strong className="font-medium">Inquiry:</strong> {submission.inquiryType}</div>
                                </div>
                                <p className="text-sm whitespace-pre-wrap">
                                <strong className="font-medium block mb-2">Message:</strong> 
                                {submission.message}
                                </p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            ) : (
                <div className="text-center py-16 text-muted-foreground">
                    <p>No submissions yet.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
