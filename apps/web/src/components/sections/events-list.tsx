import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { createDataAttribute } from "next-sanity";
import Link from "next/link";

import { dataset, projectId, studioUrl } from "@/lib/sanity/api";
import { getEventsQuery } from "@/lib/sanity/query";
import { client } from "@/lib/sanity/client";
import { SanityImage } from "@/components/sanity-image";
import type { EventsListType } from "@/types";
import type { Event } from "@/lib/sanity/sanity.types";

interface EventsListProps extends EventsListType {
  _key: string;
  _type: "eventsList";
}

export async function EventsList({
  title = "Upcoming Events",
  description,
  showPastEvents = false,
  maxEvents,
  _key,
}: EventsListProps) {
  // Fetch events from Sanity
  const events = await client.fetch<Event[]>(getEventsQuery, {
    start: 0,
    end: maxEvents || 50,
  });

  if (!events || events.length === 0) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-2xl font-bold text-foreground">{title}</h2>
            {description && (
              <p className="mt-2 text-muted-foreground">{description}</p>
            )}
            <p className="mt-4 text-muted-foreground">
              No events found at this time.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-16"
      data-sanity={createDataAttribute({
        baseUrl: studioUrl,
        projectId: projectId,
        dataset: dataset,
        type: "page",
        path: `pageBuilder[_key=="${_key}"]`,
      }).toString()}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Calendar className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 text-3xl font-bold text-foreground">{title}</h2>
          {description && (
            <p className="mt-2 text-lg text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const eventDate = new Date(event.dateTime);
            const isUpcoming = eventDate > new Date();

            return (
              <div
                key={event._id}
                className={`bg-card rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg ${
                  isUpcoming ? "" : "opacity-75"
                }`}
              >
                {event.featureImage && (
                  <div className="relative h-48 w-full">
                    <SanityImage
                      asset={event.featureImage}
                      alt={event.featureImage.alt || event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={event.dateTime}>
                      {eventDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <span>•</span>
                    <time dateTime={event.dateTime}>
                      {eventDate.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {event.title}
                  </h3>

                  <div className="flex items-start gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{event.location}</span>
                  </div>

                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {event.description}
                  </p>

                  <div className="flex gap-3">
                    <Link
                      href={`/events/${event.slug.current}`}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                      View Details
                    </Link>

                    {event.registrationLink && (
                      <a
                        href={event.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Register
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
