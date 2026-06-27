import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Auth Check
    const authHeader = request.headers.get('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    if (!verifyToken(token)) {
      return NextResponse.json({ success: false, error: 'Unauthorized session token' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { name, logo, rating, downloads, status, verified, downloadUrl, description, telegramLink, whatsappLink, chatLink } = body;

    const appUpdate: any = {};
    if (name) {
      appUpdate.name = name;
      appUpdate.slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (logo !== undefined) appUpdate.logo = logo;
    if (rating !== undefined) appUpdate.rating = Number(rating);
    if (downloads !== undefined) appUpdate.downloads = downloads;
    if (status !== undefined) appUpdate.status = status;
    if (verified !== undefined) appUpdate.verified = !!verified;
    if (downloadUrl !== undefined) appUpdate.downloadUrl = downloadUrl;
    if (description !== undefined) appUpdate.description = description;
    if (telegramLink !== undefined) appUpdate.telegramLink = telegramLink;
    if (whatsappLink !== undefined) appUpdate.whatsappLink = whatsappLink;
    if (chatLink !== undefined) appUpdate.chatLink = chatLink;

    const updated = db.apps.update(id, appUpdate);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'App not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update app' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Auth Check
    const authHeader = request.headers.get('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    if (!verifyToken(token)) {
      return NextResponse.json({ success: false, error: 'Unauthorized session token' }, { status: 401 });
    }

    const { id } = params;

    const deleted = db.apps.delete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'App not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'App deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete app' }, { status: 500 });
  }
}
