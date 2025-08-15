import { Metadata } from "next";
import { notFound } from "next/navigation";

import { client } from "@/lib/sanity/client";
import { getEventsQuery } from "@/lib/sanity/query";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import Link from "next/link";
import { SanityImage } from "@/components/sanity-image";
import type { Event } from "@/lib/sanity/sanity.types";

export const metadata: Metadata = {
  title: "Events",
  description: "Browse all our upcoming and past events",
};

export default async function EventsPage() {
  const events = await client.fetch<Event[]>(getEventsQuery, {
    start: 0,
    end: 100,
  });

  if (!events) {
    notFound();
  }

  const upcomingEvents = events.filter(
    (event) => new Date(event.dateTime) > new Date(),
  );
  const pastEvents = events.filter(
    (event) => new Date(event.dateTime) <= new Date(),
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <Calendar className="mx-auto h-16 w-16 text-primary" />
          <h1 className="mt-6 text-4xl font-bold text-foreground">Events</h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Discover our upcoming events and browse past gatherings
          </p>
        </div>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Upcoming Events
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => {
                const eventDate = new Date(event.dateTime);

                return (
                  <div
                    key={event._id}
                    className="bg-card rounded-lg shadow-md overflow-hidden border ring-2 ring-primary/20 transition-all duration-200 hover:shadow-lg"
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
          </section>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Past Events
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((event) => {
                const eventDate = new Date(event.dateTime);

                return (
                  <div
                    key={event._id}
                    className="bg-card rounded-lg shadow-md overflow-hidden border opacity-75 transition-all duration-200 hover:shadow-lg"
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

                      <Link
                        href={`/events/${event.slug.current}`}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {events.length === 0 && (
          <div className="text-center py-16">
            <Calendar className="mx-auto h-16 w-16 text-muted-foreground" />
            <h2 className="mt-4 text-2xl font-bold text-foreground">
              No Events Found
            </h2>
            <p className="mt-2 text-muted-foreground">
              Check back soon for upcoming events!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
