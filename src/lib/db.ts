import fs from 'fs';
import path from 'path';

// Define DB paths (Use /tmp on Vercel to allow write access in serverless environment)
const IS_VERCEL = !!process.env.VERCEL;
const DATA_DIR = IS_VERCEL ? '/tmp' : path.join(process.cwd(), 'data');
const JSON_DB_PATH = path.join(DATA_DIR, 'db.json');

export interface AppDetail {
  id: string;
  name: string;
  slug: string;
  logo: string; // url or base64
  rating: number;
  downloads: string;
  status: 'active' | 'inactive';
  verified: boolean;
  downloadUrl: string;
  description?: string;
  telegramLink?: string;
  whatsappLink?: string;
  chatLink?: string;
}

export interface SiteSettings {
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  adminEmail: string;
  adminPasswordHash: string;
  footerText: string;
  telegramLink: string;
  whatsappLink: string;
  chatLink: string;
  disclaimer: string;
}

const defaultSettings: SiteSettings = {
  siteName: 'Earn Daily',
  siteTitle: 'Premium App Store – Discover & Download Apps',
  siteDescription: 'Discover and download the latest and most popular Android apps safely and securely with our premium app vault.',
  adminEmail: 'spidyweb699@gmail.com',
  adminPasswordHash: '', // Hashed on seed
  footerText: '© 2026 Earn Daily. All rights reserved.',
  telegramLink: 'https://t.me/BossRummyOfficial',
  whatsappLink: 'https://whatsapp.com/channel/0029VbCfPsoGE56icPpsnI2e',
  chatLink: 'https://www.bossrummyhelp.com',
  disclaimer: 'Disclaimer: This website is not part of the Facebook website or Meta Platforms, Inc. Additionally, this site is NOT endorsed by Facebook in any way. FACEBOOK is a trademark of META PLATFORMS, INC.'
};

const defaultApps: AppDetail[] = [
  {
    id: '1',
    name: 'Kailash Puzzles',
    slug: 'kailash-puzzles',
    logo: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=150&auto=format&fit=crop&q=60',
    rating: 4.9,
    downloads: '100K+',
    status: 'active',
    verified: true,
    downloadUrl: 'https://primerwalla.online/getapk.php?id=1',
    description: 'Enjoy smooth block matching gameplay and progressive brain-teaser levels. Perfect offline companion for puzzle lovers.'
  },
  {
    id: '2',
    name: 'Lemon Juice Maker',
    slug: 'lemon-juice-maker',
    logo: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=150&auto=format&fit=crop&q=60',
    rating: 4.9,
    downloads: '50K+',
    status: 'active',
    verified: true,
    downloadUrl: 'https://primerwalla.online/getapk.php?id=2',
    description: 'A fun and simple casual physics juice game. Tap to squeeze lemons, mix flavors, and hit the target score.'
  },
  {
    id: '3',
    name: 'Spin Wheel Casual',
    slug: 'spin-wheel-casual',
    logo: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&auto=format&fit=crop&q=60',
    rating: 4.8,
    downloads: '500K+',
    status: 'active',
    verified: true,
    downloadUrl: 'https://primerwalla.online/getapk.php?id=5',
    description: 'Test your focus and timing in this offline spinning wheel arcade simulator. Earn scores and unlock new styles.'
  },
  {
    id: '4',
    name: 'Royal Match Triple',
    slug: 'royal-match-triple',
    logo: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=150&auto=format&fit=crop&q=60',
    rating: 4.9,
    downloads: '200K+',
    status: 'active',
    verified: true,
    downloadUrl: 'https://primerwalla.online/getapk.php?id=3',
    description: 'Match triple cards and clean the board. A challenging offline casual strategy card board game for all ages.'
  },
  {
    id: '5',
    name: 'Yono Utility Hub',
    slug: 'yono-utility-hub',
    logo: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?w=150&auto=format&fit=crop&q=60',
    rating: 4.7,
    downloads: '1M+',
    status: 'active',
    verified: true,
    downloadUrl: 'https://primerwalla.online/getapk.php?id=4',
    description: 'A clean utility dashboard listing casual offline game apps, device statistics organizers, and security managers.'
  }
];

interface LocalDatabase {
  apps: AppDetail[];
  settings: SiteSettings;
}

function initDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const bcrypt = require('bcryptjs');
    if (!fs.existsSync(JSON_DB_PATH)) {
      // If we are running on Vercel, try to load/seed from the committed data/db.json file
      const bundledDbPath = path.join(process.cwd(), 'data', 'db.json');
      if (IS_VERCEL && fs.existsSync(bundledDbPath)) {
        try {
          const dataStr = fs.readFileSync(bundledDbPath, 'utf-8');
          fs.writeFileSync(JSON_DB_PATH, dataStr, 'utf-8');
        } catch (err) {
          console.error('Failed to copy bundled db.json to /tmp:', err);
        }
      } else {
        const hashedSettings = {
          ...defaultSettings,
          adminPasswordHash: bcrypt.hashSync('yono6991', 10)
        };
        const data: LocalDatabase = {
          apps: defaultApps,
          settings: hashedSettings
        };
        fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
      }
    } else {
      // Auto-migrate existing plain-text or passcode settings to Email & password hash, and clean up apps for compliance
      const dataStr = fs.readFileSync(JSON_DB_PATH, 'utf-8');
      const data: any = JSON.parse(dataStr);
      let updated = false;

      if (!data.settings.adminEmail || data.settings.adminEmail !== 'spidyweb699@gmail.com') {
        data.settings.adminEmail = 'spidyweb699@gmail.com';
        updated = true;
      }

      if (!data.settings.adminPasswordHash || !data.settings.adminPasswordHash.startsWith('$2a$')) {
        data.settings.adminPasswordHash = bcrypt.hashSync('yono6991', 10);
        if (data.settings.adminPasscode) {
          delete data.settings.adminPasscode;
        }
        updated = true;
      }

      // Check if existing apps contain old gambling keywords, reset to defaults if so
      const hasGamblingKeywords = data.apps.some((app: any) => 
        /slots|casino|cash|withdraw|roulette|win real/i.test(app.description || '') ||
        /slots|casino|cash|withdraw|roulette|win real/i.test(app.name || '')
      );
      if (hasGamblingKeywords) {
        data.apps = defaultApps;
        updated = true;
      }

      if (updated) {
        fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
      }
    }
  } catch (error) {
    console.error('Failed to initialize local JSON DB:', error);
  }
}

export function readDb(): LocalDatabase {
  initDb();
  try {
    const dataStr = fs.readFileSync(JSON_DB_PATH, 'utf-8');
    return JSON.parse(dataStr);
  } catch (error) {
    console.error('Error reading JSON DB, using defaults:', error);
    return { apps: defaultApps, settings: defaultSettings };
  }
}

export function writeDb(data: LocalDatabase) {
  try {
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing JSON DB:', error);
  }
}

export const db = {
  apps: {
    find: (): AppDetail[] => {
      const data = readDb();
      return data.apps;
    },
    findOne: (slug: string): AppDetail | null => {
      const data = readDb();
      return data.apps.find(a => a.slug === slug) || null;
    },
    create: (app: Omit<AppDetail, 'id'>): AppDetail => {
      const data = readDb();
      const id = String(Date.now());
      const newApp = { ...app, id };
      data.apps.push(newApp);
      writeDb(data);
      return newApp;
    },
    update: (id: string, appData: Partial<AppDetail>): AppDetail | null => {
      const data = readDb();
      const index = data.apps.findIndex(a => a.id === id);
      if (index > -1) {
        data.apps[index] = { ...data.apps[index], ...appData } as AppDetail;
        writeDb(data);
        return data.apps[index];
      }
      return null;
    },
    delete: (id: string): boolean => {
      const data = readDb();
      const initialLength = data.apps.length;
      data.apps = data.apps.filter(a => a.id !== id);
      writeDb(data);
      return data.apps.length < initialLength;
    }
  },
  settings: {
    get: (): SiteSettings => {
      const data = readDb();
      return { ...defaultSettings, ...data.settings };
    },
    update: (settingsData: Partial<SiteSettings>): SiteSettings => {
      const data = readDb();
      const newSettings = { ...settingsData } as any;
      if (newSettings.adminPassword && !newSettings.adminPassword.startsWith('$2a$')) {
        const bcrypt = require('bcryptjs');
        newSettings.adminPasswordHash = bcrypt.hashSync(newSettings.adminPassword, 10);
        delete newSettings.adminPassword;
      }
      data.settings = { ...defaultSettings, ...data.settings, ...newSettings };
      writeDb(data);
      return data.settings;
    }
  }
};
