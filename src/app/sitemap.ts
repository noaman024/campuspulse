import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db/connection';
import Event from '@/models/Event';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://campuspulse.vercel.app';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portal/feedback`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portal/qna`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/help`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/onboarding`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/legal`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/legal/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/legal/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/legal/community-guidelines`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  let eventRoutes: MetadataRoute.Sitemap = [];
  try {
    await dbConnect();
    const events = await Event.find({ status: { $ne: 'cancelled' } })
      .select('slug updatedAt')
      .lean();

    eventRoutes = events.map((event) => ({
      url: `${baseUrl}/events/${event.slug}`,
      lastModified: event.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }));
  } catch (err) {
    console.error('Error generating dynamic sitemap for events:', err);
  }

  return [...staticRoutes, ...eventRoutes];
}
