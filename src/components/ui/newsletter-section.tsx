
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollAnimation } from "@/components/ui/scroll-animation";

export function NewsletterSection({ 
  backgroundImage 
}: { 
  backgroundImage?: string 
}) {
  return (
    <section 
      className="newsletter-section py-28"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="newsletter-container-wrapper">
        <div className="newsletter-container">
          <div className="newsletter-content">
            <ScrollAnimation>
              <div className="section-title-wrapper">
                <h2 className="section-title">Join Our Journey</h2>
              </div>
            </ScrollAnimation>
            <ScrollAnimation>
              <p className="newsletter-subtitle">
                Sign up for our newsletter to receive the latest travel inspiration, exclusive offers, and updates from the world of luxury travel.
              </p>
            </ScrollAnimation>
            <ScrollAnimation>
              <form className="newsletter-form">
                <Input type="email" placeholder="Enter your email address" className="newsletter-input" />
                <div className="button-wrapper-for-border">
                  <Button type="submit" size="lg" className="w-full">Subscribe</Button>
                </div>
              </form>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  );
}
