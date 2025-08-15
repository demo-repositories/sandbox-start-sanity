import { Calendar, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

import { SanityButtons } from "@/components/sanity-buttons";
import { SanityImage } from "@/components/sanity-image";
import { RichText } from "@/components/richtext";

interface FeaturedEventProps {
  _key: string;
  _type: "featuredEvent";
  title?: string;
  event?: {
    _id: string;
    title: string;
    description: string;
    dateTime: string;
    location: string;
    registrationLink?: string;
    slug: string;
    featureImage?: any;
  };
  bannerText?: any[];
  backgroundImage?: any;
  buttons?: any[];
}

export function FeaturedEvent({
  event,
  title,
  bannerText,
  backgroundImage,
  buttons,
}: FeaturedEventProps) {
  if (!event) {
    return null;
  }

  const eventDate = new Date(event.dateTime);
  const imageAsset = backgroundImage || event.featureImage;

  return (
    <section className="relative overflow-hidden rounded-lg">
      {/* Background Image */}
      {imageAsset && (
        <div className="absolute inset-0">
          <SanityImage
            asset={imageAsset}
            alt={imageAsset.alt || event.title}
            fill
            className="object-cover"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 p-8 md:p-12 lg:p-16">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium mb-4">
            <Calendar className="h-4 w-4" />
            {title || "Featured Event"}
          </div>

          {/* Event Date */}
          <div className="text-white/80 text-sm mb-4">
            <time dateTime={event.dateTime}>
              {eventDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span className="mx-2">•</span>
            <time dateTime={event.dateTime}>
              {eventDate.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </time>
          </div>

          {/* Event Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {event.title}
          </h2>

          {/* Event Location */}
          <div className="flex items-center gap-2 text-white/80 mb-4">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>

          {/* Banner Text */}
          {bannerText && (
            <div className="text-white/90 text-lg mb-6 leading-relaxed">
              <RichText richText={bannerText} className="text-white/90" />
            </div>
          )}

          {/* Event Description (fallback if no banner text) */}
          {!bannerText && event.description && (
            <p className="text-white/90 text-lg mb-6 leading-relaxed">
              {event.description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Custom buttons from Sanity */}
            {buttons && buttons.length > 0 ? (
              <SanityButtons
                buttons={buttons}
                buttonClassName="h-11 px-8"
                className="flex flex-col sm:flex-row gap-4"
              />
            ) : (
              <>
                {/* Default Learn More button */}
                <Link
                  href={`/events/${event.slug}`}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>

                {/* Registration button if available */}
                {event.registrationLink && (
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-white/20 bg-white/10 text-white hover:bg-white/20 h-11 px-8"
                  >
                    Register Now
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
