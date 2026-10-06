import { Client, AppSettings, ToolNote, BackupData } from '../types/client';

const STORAGE_KEY_CLIENTS = 'iptv_manager_clients_v1';
const STORAGE_KEY_SETTINGS = 'iptv_manager_settings_v1';
const STORAGE_KEY_NOTES = 'iptv_manager_notes_v1';

export const DEFAULT_PROVIDERS = [
  'Cobra',
  'VIP',
  'Lynx',
  'EJA',
  'Aroma',
  'Nova',
  'Shahid VIP',
  'Crystal',
  'Flash',
  'Lion TV',
  'Spider',
  'Marvel'
];

export const DEFAULT_SETTINGS: AppSettings = {
  googleSheetsUrl: '',
  autoSync: true,
  currency: 'ج.م',
  whatsappTemplate: 'مرحباً يا {name}، نود تذكيرك بأن اشتراك {server} الخاص بك ينتهي بتاريخ {expiry} (متبقي {days_left} يوم). هل ترغب في تجديد الاشتراك الآن لمواصلة المشاهدة دون انقطاع؟',
  customProviders: DEFAULT_PROVIDERS,
};

// Clean initial state - No dummy or sample data
export function getStoredClients(): Client[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CLIENTS);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Purge any legacy demo clients if present
    const cleaned = parsed.filter((c: Client) => !c.id?.startsWith('demo-'));
    if (cleaned.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch (e) {
    console.error('Error loading clients from localStorage', e);
    return [];
  }
}

export function saveStoredClients(clients: Client[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(clients));
  } catch (e) {
    console.error('Error saving clients to localStorage', e);
  }
}

export function getStoredNotes(): ToolNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTES);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Purge any legacy sample notes if present
    const cleaned = parsed.filter((n: ToolNote) => !n.id?.startsWith('note-'));
    if (cleaned.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch (e) {
    console.error('Error loading notes from localStorage', e);
    return [];
  }
}

export function saveStoredNotes(notes: ToolNote[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
  } catch (e) {
    console.error('Error saving notes to localStorage', e);
  }
}

export function getStoredSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) {
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      customProviders: Array.from(new Set([...DEFAULT_PROVIDERS, ...(parsed.customProviders || [])]))
    };
  } catch (e) {
    console.error('Error loading settings', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings', e);
  }
}

// Generate unified comprehensive backup
export function generateFullBackup(clients: Client[], notes: ToolNote[], settings: AppSettings): BackupData {
  return {
    version: '2.0',
    exportedAt: new Date().toISOString(),
    clients,
    notes,
    providers: settings.customProviders,
    settings: {
      currency: settings.currency,
      whatsappTemplate: settings.whatsappTemplate,
    }
  };
}

// Restore unified backup
export function parseAndValidateBackup(rawJson: string): {
  success: boolean;
  clients?: Client[];
  notes?: ToolNote[];
  providers?: string[];
  settings?: Partial<AppSettings>;
  message: string;
} {
  try {
    const data = JSON.parse(rawJson);
    // Support v2 (combined object) or legacy v1 (array of clients)
    if (Array.isArray(data)) {
      return {
        success: true,
        clients: data,
        notes: [],
        message: `تم استيراد ${data.length} عميل (ملف قديم).`
      };
    }

    if (data && typeof data === 'object') {
      const clients = Array.isArray(data.clients) ? data.clients : [];
      const notes = Array.isArray(data.notes) ? data.notes : [];
      return {
        success: true,
        clients,
        notes,
        providers: data.providers,
        settings: data.settings,
        message: `تم استيراد ${clients.length} عميل و ${notes.length} ملاحظة وأكواد بنجاح!`
      };
    }

    return { success: false, message: 'صيغة ملف النسخة الاحتياطية غير صالحة' };
  } catch (err: any) {
    return { success: false, message: `تعذر قراءة الملف: ${err.message}` };
  }
}
