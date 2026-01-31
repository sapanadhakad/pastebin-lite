import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

//const prisma = new PrismaClient();
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { content, expirationMinutes, maxViews } = req.body;

    if (!content) return res.status(400).json({ error: "Content is required" });

    const slug = nanoid(10);
    const expiresAt = expirationMinutes 
      ? new Date(Date.now() + parseInt(expirationMinutes) * 60000) 
      : null;

    const paste = await prisma.paste.create({
      data: {
        content,
        slug,
        maxViews: maxViews ? parseInt(maxViews) : null,
        expiresAt,
      },
    });

    return res.status(201).json({ slug: paste.slug });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}