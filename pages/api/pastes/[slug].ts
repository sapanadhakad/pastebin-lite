import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;

  // We only allow GET requests to view a paste
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const paste = await prisma.paste.findUnique({ 
      where: { slug: slug as string } 
    });

    // If paste doesn't exist
    if (!paste) {
      return res.status(404).json({ error: "Paste not found" });
    }

    // Check 1: Time Expiration
    if (paste.expiresAt && new Date() > paste.expiresAt) {
      return res.status(410).json({ error: "This paste has expired." });
    }

    // Check 2: View Limit Expiration
    if (paste.maxViews && paste.viewCount >= paste.maxViews) {
      return res.status(410).json({ error: "View limit reached." });
    }

    // If valid, increment the view count in the database
    await prisma.paste.update({
      where: { slug: slug as string },
      data: { viewCount: { increment: 1 } },
    });

    // Send the paste data to the user
    return res.status(200).json(paste);
  } catch (error) {
    return res.status(500).json({ error: "Database error" });
  }
}