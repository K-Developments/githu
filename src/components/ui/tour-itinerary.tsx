
"use client";

import React from 'react';

interface TourItineraryProps {
  text: string;
}

interface Itinerary {
  overview: string;
  itineraryTitle: string;
  days: {
    title: string;
    activities: string[];
  }[];
}

const parseItinerary = (text: string): Itinerary => {
  const lines = text.split('\\n').filter(line => line.trim() !== '');
  const itinerary: Itinerary = {
    overview: '',
    itineraryTitle: 'Detailed Itinerary',
    days: [],
  };

  let isItineraryStarted = false;
  let currentDay: { title: string; activities: string[] } | null = null;
  let overviewLines: string[] = [];

  for (const line of lines) {
    const dayMatch = line.match(/^Day\s*\d+.*$/i);
    const itineraryTitleMatch = line.match(/^(Detailed Itinerary|Tour Itinerary)/i);

    if (itineraryTitleMatch) {
      isItineraryStarted = true;
      itinerary.itineraryTitle = line;
      continue;
    }

    if (!isItineraryStarted) {
      overviewLines.push(line);
    } else {
      if (dayMatch) {
        if (currentDay) {
          itinerary.days.push(currentDay);
        }
        currentDay = { title: line, activities: [] };
      } else if (currentDay) {
        currentDay.activities.push(line);
      }
    }
  }

  if (currentDay) {
    itinerary.days.push(currentDay);
  }
  
  // If no "Detailed Itinerary" was found, assume the whole text is overview
  if (!isItineraryStarted) {
      itinerary.overview = overviewLines.join('\n\n');
  } else {
      itinerary.overview = overviewLines.join('\n\n');
  }


  return itinerary;
};

export function TourItinerary({ text }: TourItineraryProps) {
  const { overview, itineraryTitle, days } = parseItinerary(text);

  return (
    <div>
        <h3 className="font-headline text-3xl mb-4">Tour Overview</h3>
        <p className="text-muted-foreground mb-8 whitespace-pre-line">{overview}</p>
        
        {days.length > 0 && (
          <>
            <h3 className="font-headline text-3xl mb-6">{itineraryTitle}</h3>
            <div className="space-y-8">
              {days.map((day, index) => (
                <div key={index} className="pl-6 border-l-2 border-primary relative">
                  <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-primary border-2 border-card"></div>
                  <h4 className="font-headline text-2xl text-primary mb-2 -mt-1">{day.title}</h4>
                  <ul className="space-y-2">
                    {day.activities.map((activity, actIndex) => (
                      <li key={actIndex} className="flex items-start">
                        <span className="text-primary mr-3 mt-1.5">&#9679;</span>
                        <span className="text-muted-foreground">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
    </div>
  );
}
