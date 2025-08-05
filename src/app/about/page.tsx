
import Image from 'next/image';

export default function AboutPage() {
  return (
    <>
      <section className="h-[60vh] flex flex-col bg-card">
        <div className="flex-1 flex items-center justify-center p-8">
          <h1 className="text-6xl md:text-8xl font-bold font-headline text-center uppercase tracking-widest text-foreground">
            About Us
          </h1>
        </div>
        <div className="flex-1 relative w-full">
          <Image
            src="https://placehold.co/1920x600.png"
            alt="A diverse team collaborating on travel plans"
            fill
            className="object-cover"
            data-ai-hint="team collaboration"
          />
        </div>
      </section>
    </>
  );
}
