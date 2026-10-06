/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  getStoredClients,
  saveStoredClients,
  getStoredNotes,
  saveStoredNotes,
  getStoredSettings,
  saveStoredSettings,
  DEFAULT_PROVIDERS,
} from './services/storage';
import { pushClientsToSheets } from './services/googleSheets';
import { Client, AppSettings, ExpiryFilter, ToolNote } from './types/client';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { FilterBar } from './components/FilterBar';
import { ClientCard } from './components/ClientCard';
import { ClientModal } from './components/ClientModal';
import { RenewModal } from './components/RenewModal';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { WhatsAppTemplateModal } from './components/WhatsAppTemplateModal';
import { SingleFileExportModal } from './components/SingleFileExportModal';
import { ToolsSection } from './components/ToolsSection';
import { ToolNoteModal } from './components/ToolNoteModal';
import { Footer } from './components/Footer';
import { WelcomeOnboardingModal } from './components/WelcomeOnboardingModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Plus, Tv, CheckCircle2, AlertCircle, Info, DownloadCloud, ShieldCheck, KeyRound, Smartphone } from 'lucide-react';

export default function App() {
  const [userName, setUserName] = useState<string>(() => {
    try {
      return localStorage.getItem('iptv_user_name') || '';
    } catch (e) {
      return '';
    }
  });
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState<boolean>(() => {
    try {
      return !Boolean(localStorage.getItem('iptv_user_name'));
    } catch (e) {
      return false;
    }
  });
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);

  const [clients, setClients] = useState<Client[]>([]);
  const [notes, setNotes] = useState<ToolNote[]>([]);
  const [settings, setSettings] = useState<AppSettings>(getStoredSettings());

  // Primary Tab navigation: 'clients' vs 'tools'
  const [activeTab, setActiveTab] = useState<'clients' | 'tools'>('clients');

  // Filter & Search states for clients
  const [searchQuery, setSearchQuery] = useState('');
  const [expiryFilter, setExpiryFilter] = useState<ExpiryFilter>('all');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [sortBy, setSortBy] = useState('expiry_asc');

  // Modal visibility states
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [clientToRenew, setClientToRenew] = useState<Client | null>(null);
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isSingleFileModalOpen, setIsSingleFileModalOpen] = useState(false);
  const [isToolNoteModalOpen, setIsToolNoteModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<ToolNote | null>(null);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  // Load clients, notes and settings on initial render
  useEffect(() => {
    const loadedClients = getStoredClients();
    setClients(loadedClients);
    const loadedNotes = getStoredNotes();
    setNotes(loadedNotes);
    const loadedSettings = getStoredSettings();
    setSettings(loadedSettings);
  }, []);

  // Save clients to localStorage whenever updated
  const updateClients = (newClients: Client[], triggerBackgroundSync = true) => {
    setClients(newClients);
    saveStoredClients(newClients);

    if (triggerBackgroundSync && settings.googleSheetsUrl && settings.autoSync) {
      pushClientsToSheets(settings.googleSheetsUrl, newClients).catch((err) => {
        console.warn('Background sync failed:', err);
      });
    }
  };

  // Save notes to localStorage whenever updated
  const updateNotes = (newNotes: ToolNote[]) => {
    setNotes(newNotes);
    saveStoredNotes(newNotes);
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
  };

  // Add custom IPTV provider
  const handleAddCustomProvider = (providerName: string) => {
    if (!settings.customProviders.includes(providerName)) {
      const updatedProviders = [...settings.customProviders, providerName];
      const updated = { ...settings, customProviders: updatedProviders };
      handleUpdateSettings(updated);
      showToast(`تمت إضافة شركة ${providerName} بنجاح إلى قائمة السيرفرات`, 'success');
    }
  };

  // Add or Edit Client
  const handleSaveClient = (
    clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>,
    existingId?: string
  ) => {
    const nowIso = new Date().toISOString();

    if (existingId) {
      // Edit mode
      const updated = clients.map((c) =>
        c.id === existingId
          ? {
              ...c,
              ...clientData,
              updatedAt: nowIso,
            }
          : c
      );
      updateClients(updated);
      showToast('تم تحديث بيانات العميل بنجاح', 'success');
    } else {
      // Create new
      const newClient: Client = {
        ...clientData,
        id: 'client_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      const updated = [newClient, ...clients];
      updateClients(updated);
      showToast('تمت إضافة العميل الجديد بنجاح!', 'success');
    }
    setClientToEdit(null);
  };

  // Delete Client
  const handleDeleteClient = (id: string) => {
    const client = clients.find((c) => c.id === id);
    if (!client) return;

    if (window.confirm(`هل أنت متأكد من حذف العميل "${client.name}" نهائياً؟`)) {
      const updated = clients.filter((c) => c.id !== id);
      updateClients(updated);
      showToast('تم حذف العميل بنجاح', 'info');
    }
  };

  // Quick Renewal
  const handleConfirmRenewal = (
    clientId: string,
    newExpiryDate: string,
    newCost: number,
    newSelling: number,
    newProfit: number
  ) => {
    const updated = clients.map((c) => {
      if (c.id === clientId) {
        return {
          ...c,
          expiryDate: newExpiryDate,
          costPrice: newCost,
          sellingPrice: newSelling,
          profit: newProfit,
          updatedAt: new Date().toISOString(),
        };
      }
      return c;
    });
    updateClients(updated);
    showToast('تم تجديد الاشتراك بنجاح وتحديث تاريخ الانتهاء!', 'success');
  };

  // Add or Edit Tool Note
  const handleSaveToolNote = (
    noteData: Omit<ToolNote, 'id' | 'createdAt' | 'updatedAt'>,
    existingId?: string
  ) => {
    const nowIso = new Date().toISOString();

    if (existingId) {
      const updated = notes.map((n) =>
        n.id === existingId
          ? {
              ...n,
              ...noteData,
              updatedAt: nowIso,
            }
          : n
      );
      updateNotes(updated);
      showToast('تم تحديث الأداة / الملاحظة بنجاح', 'success');
    } else {
      const newNote: ToolNote = {
        ...noteData,
        id: 'note_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      const updated = [newNote, ...notes];
      updateNotes(updated);
      showToast('تمت إضافة الأداة وكود التحميل بنجاح!', 'success');
    }
    setNoteToEdit(null);
  };

  // Delete Tool Note
  const handleDeleteToolNote = (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;

    if (window.confirm(`هل أنت متأكد من حذف "${note.title}"؟`)) {
      const updated = notes.filter((n) => n.id !== id);
      updateNotes(updated);
      showToast('تم الحذف بنجاح', 'info');
    }
  };

  // Manual Instant Sync
  const handleManualSync = async () => {
    if (!settings.googleSheetsUrl) {
      setIsSheetsModalOpen(true);
      return;
    }
    setIsSyncing(true);
    const res = await pushClientsToSheets(settings.googleSheetsUrl, clients);
    setIsSyncing(false);
    if (res.success) {
      showToast(`تمت مزامنة ${clients.length} عميل في شيت جوجل بنجاح!`, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  // Filter and Sort clients
  const filteredAndSortedClients = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return clients
      .filter((c) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = c.name.toLowerCase().includes(q);
          const matchesPhone = c.phone.includes(q);
          const matchesServer = c.subscriptionType.toLowerCase().includes(q);
          const matchesCode = c.code ? c.code.toLowerCase().includes(q) : false;
          const matchesUser = c.username ? c.username.toLowerCase().includes(q) : false;
          const matchesNotes = c.notes ? c.notes.toLowerCase().includes(q) : false;

          if (!matchesName && !matchesPhone && !matchesServer && !matchesCode && !matchesUser && !matchesNotes) {
            return false;
          }
        }

        // Provider filter
        if (selectedProvider !== 'all' && c.subscriptionType !== selectedProvider) {
          return false;
        }

        // Expiry filter
        if (expiryFilter !== 'all') {
          if (!c.expiryDate) return false;
          const exp = new Date(c.expiryDate);
          exp.setHours(0, 0, 0, 0);
          const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

          if (expiryFilter === 'expired') {
            return diffDays < 0;
          }
          if (expiryFilter === 'expiring_today') {
            return diffDays === 0;
          }
          if (expiryFilter === 'expiring_week') {
            return diffDays >= 0 && diffDays <= 7;
          }
          if (expiryFilter === 'expiring_month') {
            return diffDays >= 0 && diffDays <= 30;
          }
          if (expiryFilter === 'active') {
            return diffDays >= 0;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'expiry_asc') {
          return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
        }
        if (sortBy === 'expiry_desc') {
          return new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime();
        }
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'profit_desc') {
          return b.profit - a.profit;
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name, 'ar');
        }
        return 0;
      });
  }, [clients, searchQuery, selectedProvider, expiryFilter, sortBy]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      {/* PWA Install Banner at top */}
      <PWAInstallBanner />

      {/* Top Navigation Header with Tab Switcher */}
      <Header
        userName={userName}
        onEditUserName={() => setIsEditNameModalOpen(true)}
        onAddNewClient={() => {
          setClientToEdit(null);
          setIsClientModalOpen(true);
        }}
        onAddNewToolNote={() => {
          setNoteToEdit(null);
          setIsToolNoteModalOpen(true);
        }}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        clientsCount={clients.length}
        notesCount={notes.length}
        onOpenSheets={() => setIsSheetsModalOpen(true)}
        onOpenWhatsAppTemplate={() => setIsWhatsAppModalOpen(true)}
        onOpenSingleFileExport={() => setIsSingleFileModalOpen(true)}
        isSheetsConfigured={Boolean(settings.googleSheetsUrl)}
        isSyncing={isSyncing}
        onSync={handleManualSync}
        currency={settings.currency}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 md:px-6 py-2.5 sm:py-4 overflow-x-hidden">
        {/* Render Clients Tab */}
        {activeTab === 'clients' && (
          <div>
            {/* KPI & Financial Overview */}
            <StatsCards clients={clients} currency={settings.currency} />

            {/* Search, Filter, and Sort Controls */}
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              expiryFilter={expiryFilter}
              onExpiryFilterChange={setExpiryFilter}
              selectedProvider={selectedProvider}
              onProviderChange={setSelectedProvider}
              availableProviders={settings.customProviders}
              sortBy={sortBy}
              onSortChange={setSortBy}
              filteredCount={filteredAndSortedClients.length}
              totalCount={clients.length}
            />

            {/* Client Cards Grid */}
            {filteredAndSortedClients.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 pb-20">
                {filteredAndSortedClients.map((client) => (
                  <ClientCard
                    key={client.id}
                    client={client}
                    currency={settings.currency}
                    whatsappTemplate={settings.whatsappTemplate}
                    onEdit={(c) => {
                      setClientToEdit(c);
                      setIsClientModalOpen(true);
                    }}
                    onDelete={handleDeleteClient}
                    onRenew={(c) => {
                      setClientToRenew(c);
                      setIsRenewModalOpen(true);
                    }}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="glass-card rounded-3xl p-8 sm:p-12 text-center my-6 border border-slate-800 flex flex-col items-center justify-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                  <Tv className="w-8 h-8" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                  {clients.length === 0 ? 'لا يوجد عملاء حتى الآن' : 'لا توجد نتائج مطابقة لبحثك'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mb-5 leading-relaxed">
                  {clients.length === 0
                    ? 'ابدأ بإضافة أول عميل واشتراك IPTV وسجل بيانات التفعيل والأرباح'
                    : 'جرب تغيير شروط البحث أو الفلاتر المختارة لإظهار العملاء'}
                </p>
                {clients.length === 0 ? (
                  <button
                    onClick={() => {
                      setClientToEdit(null);
                      setIsClientModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>إضافة عميل جديد الآن</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setExpiryFilter('all');
                      setSelectedProvider('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold transition border border-slate-700"
                  >
                    إعادة ضبط جميع الفلاتر
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Render Tools & Notes Tab */}
        {activeTab === 'tools' && (
          <ToolsSection
            notes={notes}
            onAddNew={() => {
              setNoteToEdit(null);
              setIsToolNoteModalOpen(true);
            }}
            onEdit={(n) => {
              setNoteToEdit(n);
              setIsToolNoteModalOpen(true);
            }}
            onDelete={handleDeleteToolNote}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Developer Attribution & Footer */}
      <Footer />

      {/* Floating Action Button for Mobile Thumb Reach */}
      <button
        onClick={() => {
          if (activeTab === 'clients') {
            setClientToEdit(null);
            setIsClientModalOpen(true);
          } else {
            setNoteToEdit(null);
            setIsToolNoteModalOpen(true);
          }
        }}
        className="sm:hidden fixed bottom-6 left-6 z-30 flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-2xl shadow-emerald-500/40 active:scale-95 transition"
        title={activeTab === 'clients' ? 'إضافة عميل جديد' : 'إضافة كود أو أداة جديدة'}
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>

      {/* Offline Status Indicator */}
      <OfflineIndicator />

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-2xl text-xs sm:text-sm font-semibold border backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200 ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : toast.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
              : 'bg-slate-900/90 border-slate-700 text-slate-200'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Client Entry / Edit Modal */}
      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => {
          setIsClientModalOpen(false);
          setClientToEdit(null);
        }}
        onSave={handleSaveClient}
        clientToEdit={clientToEdit}
        availableProviders={settings.customProviders}
        onAddCustomProvider={handleAddCustomProvider}
        currency={settings.currency}
      />

      {/* Quick Renewal Modal */}
      <RenewModal
        isOpen={isRenewModalOpen}
        onClose={() => {
          setIsRenewModalOpen(false);
          setClientToRenew(null);
        }}
        client={clientToRenew}
        onConfirmRenewal={handleConfirmRenewal}
        currency={settings.currency}
      />

      {/* Google Sheets Integration & Comprehensive Backup Modal */}
      <GoogleSheetsModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        clients={clients}
        onClientsLoaded={(loaded) => updateClients(loaded, false)}
        notes={notes}
        onNotesLoaded={(loaded) => updateNotes(loaded)}
        onShowToast={showToast}
      />

      {/* WhatsApp Reminder Template Editor Modal */}
      <WhatsAppTemplateModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        currentTemplate={settings.whatsappTemplate}
        onSaveTemplate={(tmpl) => {
          handleUpdateSettings({ ...settings, whatsappTemplate: tmpl });
          showToast('تم تحديث قالب رسالة الواتساب بنجاح', 'success');
        }}
      />

      {/* Tool Note Add / Edit Modal */}
      <ToolNoteModal
        isOpen={isToolNoteModalOpen}
        onClose={() => {
          setIsToolNoteModalOpen(false);
          setNoteToEdit(null);
        }}
        onSave={handleSaveToolNote}
        noteToEdit={noteToEdit}
      />

      {/* Standalone Single File Export Modal */}
      <SingleFileExportModal
        isOpen={isSingleFileModalOpen}
        onClose={() => setIsSingleFileModalOpen(false)}
        onShowToast={showToast}
      />

      {/* First-time Welcome & Onboarding Modal */}
      <WelcomeOnboardingModal
        isOpen={isWelcomeModalOpen}
        isInitialSetup={true}
        onSaveName={(name) => {
          try {
            localStorage.setItem('iptv_user_name', name);
          } catch (e) {}
          setUserName(name);
          setIsWelcomeModalOpen(false);
          showToast(`أهلاً بك يا ${name}! تم فتح كافة ميزات البرنامج مجاناً.`, 'success');
        }}
      />

      {/* Edit User Name Modal */}
      <WelcomeOnboardingModal
        isOpen={isEditNameModalOpen}
        isInitialSetup={false}
        currentName={userName}
        onClose={() => setIsEditNameModalOpen(false)}
        onSaveName={(name) => {
          try {
            localStorage.setItem('iptv_user_name', name);
          } catch (e) {}
          setUserName(name);
          setIsEditNameModalOpen(false);
          showToast('تم تحديث الاسم بنجاح', 'success');
        }}
      />
    </div>
  );
}
