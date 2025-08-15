import { Metadata } from "next";
import { notFound } from "next/navigation";

import { client } from "@/lib/sanity/client";
import { Calendar, MapPin, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SanityImage } from "@/components/sanity-image";
import type { Event } from "@/lib/sanity/sanity.types";

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await client.fetch<Event>(
    `*[_type == "event" && slug.current == $slug][0]{
      title,
      description,
      seoTitle,
      seoDescription,
      featureImage
    }`,
    { slug },
  );

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  return {
    title: event.seoTitle || event.title,
    description: event.seoDescription || event.description,
    openGraph: {
      title: event.seoTitle || event.title,
      description: event.seoDescription || event.description,
      images: [
        {
          url: event.featureImage?.asset?.url || "",
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
    },
  };
}

export async function generateStaticParams() {
  const events = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type == "event" && defined(slug.current)]{
      "slug": slug.current
    }`,
  );

  return events.map((event) => ({
    slug: event.slug.current,
  }));
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await client.fetch<Event>(
    `*[_type == "event" && slug.current == $slug][0]{
      _id,
      title,
      description,
      dateTime,
      location,
      registrationLink,
      featureImage
    }`,
    { slug },
  );

  if (!event) {
    notFound();
  }

  const eventDate = new Date(event.dateTime);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>

        {/* Event Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
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

          <h1 className="text-4xl font-bold text-foreground mb-4">
            {event.title}
          </h1>

          <div className="flex items-start gap-2 text-muted-foreground mb-6">
            <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <span className="text-lg">{event.location}</span>
          </div>
        </div>

        {/* Event Image */}
        {event.featureImage && (
          <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
            <SanityImage
              asset={event.featureImage}
              alt={event.featureImage.alt || event.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Event Description */}
        <div className="prose prose-lg max-w-none mb-8">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Registration Button */}
        {event.registrationLink && (
          <div className="flex justify-center">
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 py-3"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Register for Event
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
