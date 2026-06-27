import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

    const settings = db.settings.get();

    // If session token is verified, return full settings (but clear adminPasswordHash for safety)
    if (verifyToken(token)) {
      const { adminPasswordHash, ...settingsData } = settings;
      return NextResponse.json({ success: true, data: { ...settingsData, adminPassword: '' } });
    }

    // Otherwise return public settings only (omit email and password hash)
    const { adminPasswordHash, adminEmail, ...publicSettings } = settings;
    return NextResponse.json({ success: true, data: publicSettings });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
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
    const newSettings = { ...body };

    // If adminPassword is empty, do not overwrite the existing password hash
    if (!newSettings.adminPassword) {
      delete newSettings.adminPassword;
    }

    const updated = db.settings.update(newSettings);
    
    const { adminPasswordHash, ...updatedData } = updated;
    return NextResponse.json({ success: true, data: { ...updatedData, adminPassword: '' } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
