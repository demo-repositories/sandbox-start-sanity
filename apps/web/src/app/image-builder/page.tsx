import { sanityFetch } from "@/lib/sanity/live";
import { querySampleImages } from "@/lib/sanity/query";
import ImageBuilderClient from "./components/ImageBuilderClient";

async function fetchSampleImages() {
  return await sanityFetch({
    query: querySampleImages,
    stega: false,
  });
}

export default async function ImageBuilderPage() {
  const { data: images } = await fetchSampleImages();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Sanity Image Pipeline Demo</h1>
          <p className="text-muted-foreground">
            Experiment with Sanity's image URL builder and see transformations in real-time
          </p>
        </div>
        <ImageBuilderClient initialImages={images ?? []} />
      </div>
    </div>
  );
}
