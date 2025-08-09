
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollAnimation } from "@/components/ui/scroll-animation";

interface PackagesCtaProps {
  title: string;
  description: string;
  image: string;
}

export function PackagesCtaSection({ title, description, image }: PackagesCtaProps) {
  return (
    <section className="py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="bg-card rounded-lg shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 md:p-16 flex flex-col justify-center">
            <ScrollAnimation>
              <h2 className="text-4xl md:text-5xl font-headline mb-4 text-foreground">
                {title}
              </h2>
            </ScrollAnimation>
            <ScrollAnimation delay={0.1}>
              <p className="text-muted-foreground leading-relaxed mb-8 text-body">
                {description}
              </p>
            </ScrollAnimation>
            <ScrollAnimation delay={0.2}>
              <div className="button-wrapper-for-border w-full sm:w-auto inline-block">
                <Button asChild size="lg" className="w-full">
                  <Link href="#">Book a Consultation</Link>
                </Button>
              </div>
            </ScrollAnimation>
          </div>
          <div className="relative min-h-[300px] md:min-h-[450px]">
            <Image
              src={image}
              alt="A travel expert planning a bespoke journey"
              fill
              className="object-cover"
              data-ai-hint="travel planning map"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
