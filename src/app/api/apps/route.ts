import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    const apps = db.apps.find();
    return NextResponse.json({ success: true, data: apps });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch apps' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Auth Check
    const authHeader = request.headers.get('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    if (!verifyToken(token)) {
      return NextResponse.json({ success: false, error: 'Unauthorized session token' }, { status: 401 });
    }

    const body = await request.json();
    const { name, logo, rating, downloads, status, verified, downloadUrl, description, telegramLink, whatsappLink, chatLink } = body;

    if (!name || !logo || !downloadUrl) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Generate slug from name
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newApp = db.apps.create({
      name,
      slug,
      logo,
      rating: Number(rating) || 4.9,
      downloads: downloads || '100K+',
      status: status || 'active',
      verified: verified === undefined ? true : !!verified,
      downloadUrl,
      description,
      telegramLink,
      whatsappLink,
      chatLink
    });

    return NextResponse.json({ success: true, data: newApp });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create app' }, { status: 500 });
  }
}
