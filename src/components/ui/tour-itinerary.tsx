
"use client";

import React from 'react';
import type { ItineraryDay } from '@/lib/data';

interface TourItineraryProps {
  overview: string;
  itinerary: ItineraryDay[];
}

export function TourItinerary({ overview, itinerary }: TourItineraryProps) {
  const hasItinerary = itinerary && itinerary.length > 0;

  return (
    <div>
        <h3 className="font-headline text-3xl mb-4">Tour Overview</h3>
        <p className="text-muted-foreground mb-8 whitespace-pre-line">{overview}</p>
        
        {hasItinerary && (
          <>
            <h3 className="font-headline text-3xl mb-6">Detailed Itinerary</h3>
            <div className="space-y-8">
              {itinerary.map((day, index) => (
                <div key={index} className="pl-6 border-l-2 border-primary relative">
                  <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-primary border-2 border-card"></div>
                  <h4 className="font-headline text-2xl text-primary mb-2 -mt-1">{day.title}</h4>
                  {day.activities && day.activities.length > 0 && (
                    <ul className="space-y-2">
                      {day.activities.map((activity, actIndex) => (
                        <li key={actIndex} className="flex items-start">
                          <span className="text-primary mr-3 mt-1.5">&#9679;</span>
                          <span className="text-muted-foreground">{activity}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
    </div>
  );
}
