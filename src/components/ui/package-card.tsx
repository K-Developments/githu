
"use client";

import Image from "next/image";
import { Clock, MapPin, Sun } from "lucide-react";
import type { Package } from "@/lib/data";

export const PackageCard = ({ packageData }: { packageData: Package }) => {
  return (
    <div className="package-card">
      <div className="package-card__image noise-overlay">
        <Image
          src={packageData.images[0]}
          alt={`View of ${packageData.title}`}
          layout="fill"
          objectFit="cover"
          data-ai-hint={packageData.imageHints?.[0]}
        />
        {packageData.theme && (
          <div className="package-card__theme">{packageData.theme}</div>
        )}
      </div>
      <div className="package-card__content">
        <p className="package-card__location">
          <MapPin size={14} />
          <span>{packageData.location}</span>
        </p>
        <h3 className="package-card__title">{packageData.title}</h3>
        <p className="package-card__description">{packageData.description}</p>
        <div className="package-card__footer">
          <div className="package-card__detail">
            <Clock size={16} />
            <span>{packageData.duration} days</span>
          </div>
          <div className="package-card__price">
            ${packageData.price}
            <span>/person</span>
          </div>
        </div>
      </div>
    </div>
  );
};
