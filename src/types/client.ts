export type AccountType = 'code' | 'credentials';

export interface Client {
  id: string;
  name: string;
  phone: string;
  subscriptionType: string; // e.g. "Cobra", "VIP", "Lynx", "EJA", etc.
  accountType: AccountType;
  code?: string;
  username?: string;
  password?: string;
  serverUrl?: string;
  costPrice: number;
  sellingPrice: number;
  profit: number;
  expiryDate: string; // YYYY-MM-DD
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ExpiryFilter = 'all' | 'expiring_today' | 'expiring_week' | 'expiring_month' | 'expired' | 'active';

export type NoteCategory = 'downloader' | 'app_link' | 'note' | 'server_info';

export interface ToolNote {
  id: string;
  title: string;
  category: NoteCategory;
  downloaderCode?: string; // Downloader shortcode (e.g. 841203)
  url?: string; // Direct APK or web link
  content: string; // Description, activation steps, or notes
  createdAt: string;
  updatedAt: string;
}

export interface BackupData {
  version: string;
  exportedAt: string;
  clients: Client[];
  notes: ToolNote[];
  providers?: string[];
  settings?: Partial<AppSettings>;
}

export interface AppSettings {
  googleSheetsUrl: string;
  autoSync: boolean;
  currency: string;
  whatsappTemplate: string;
  customProviders: string[];
}

export interface SyncResult {
  success: boolean;
  message: string;
  count?: number;
  timestamp?: string;
}
