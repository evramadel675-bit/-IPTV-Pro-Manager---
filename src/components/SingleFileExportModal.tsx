import React, { useState } from 'react';
import { X, FileCode, Download, Copy, Check } from 'lucide-react';

interface SingleFileExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SingleFileExportModal: React.FC<SingleFileExportModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Complete, updated standalone single HTML file code for Client Edition
  const getSingleHtmlCode = () => {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>IPTV Pro Manager - نسخة العميل النهائي</title>
  <meta name="theme-color" content="#030712" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Cairo', sans-serif; background-color: #030712; color: #f1f5f9; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="p-3 max-w-4xl mx-auto pb-24 min-h-screen flex flex-col justify-between">

  <!-- ================= 1. ONBOARDING WELCOME SCREEN ================= -->
  <div id="welcomeScreen" class="hidden my-auto py-8 max-w-md mx-auto w-full">
    <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl text-center">
      <div class="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-3xl mx-auto mb-4">
        ✨
      </div>
      <span class="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30 mb-2">
        نسخة مجانية ومفتوحة بالكامل ♾️
      </span>
      <h2 class="text-xl font-black text-white mb-1">مرحباً بك في IPTV Pro Manager!</h2>
      <p class="text-xs text-slate-400 mb-5 leading-relaxed">
        البرنامج مجاني ومفتوح بالكامل لخدمتك بدون أي أكواد تفعيل. يرجى إدخال اسمك للبدء وتخصيص تجربة العمل:
      </p>

      <!-- Welcome Form -->
      <form onsubmit="handleSaveName(event)" class="space-y-3 text-right">
        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1">الاسم الكريم:</label>
          <input required id="userNameInput" placeholder="اكتب اسمك هنا (مثال: م. أحمد عبد الله)" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-emerald-500" />
        </div>
        <button type="submit" class="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black py-3 rounded-xl text-sm shadow-lg hover:from-emerald-400 hover:to-teal-400 cursor-pointer transition">
          دخول وبدء استخدام البرنامج 🚀
        </button>
      </form>
    </div>
  </div>

  <!-- ================= 2. MAIN APPLICATION CONTENT (Unlocked) ================= -->
  <div id="appMainContent" class="hidden flex-1 flex flex-col">
    <!-- Header -->
    <header class="py-3 border-b border-slate-800 mb-4">
      <div class="flex items-center justify-between gap-2 mb-3">
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg">📺</div>
          <div>
            <h1 class="text-lg font-black text-white">IPTV <span class="text-emerald-400">Pro</span></h1>
            <p class="text-xs text-slate-400">نسخة مجانية مفتوحة بالكامل</p>
          </div>
        </div>
        <div class="flex items-center gap-1.5 sm:gap-2">
          <button onclick="openSheetsPrompt()" class="text-xs bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 px-3 py-1.5 rounded-xl font-bold">ربط الشيت</button>
          <button onclick="openBackupModal()" class="text-xs bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 px-3 py-1.5 rounded-xl font-bold">النسخ الاحتياطي</button>
          <button id="mainAddBtn" onclick="handleAddAction()" class="text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-1.5 rounded-xl font-black shadow">+ عميل جديد</button>
        </div>
      </div>

      <!-- User Greeting Bar -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-2 px-3 flex items-center justify-between text-xs mb-3">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span class="text-slate-400">أهلاً بك،</span>
          <strong id="displayUserName" class="text-emerald-300 font-bold">المستخدم</strong>
          <span class="text-slate-600">|</span>
          <span class="text-slate-400">نسخة مجانية ♾️</span>
        </div>
        <button onclick="editUserNamePrompt()" class="text-slate-500 hover:text-emerald-400 text-[11px] cursor-pointer">(تعديل الاسم)</button>
      </div>

      <!-- Navigation Tabs: Clients vs Tools -->
      <div class="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
        <button id="tabBtnClients" onclick="switchMainTab('clients')" class="flex-1 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 shadow">
          👥 العملاء والاشتراكات (<span id="countClients">0</span>)
        </button>
        <button id="tabBtnTools" onclick="switchMainTab('tools')" class="flex-1 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white">
          📲 الملاحظات وأكواد Downloader (<span id="countTools">0</span>)
        </button>
      </div>
    </header>

    <!-- SECTION 1: CLIENTS -->
    <section id="sectionClients">
      <div id="stats" class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4"></div>
      <div class="space-y-2 mb-4">
        <input type="text" id="searchInput" oninput="renderClients()" placeholder="ابحث بالاسم أو الهاتف أو السيرفر أو الكود..." class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:border-emerald-500 outline-none" />
        <div class="flex gap-1.5 overflow-x-auto text-xs pb-1" id="filterTabs">
          <button onclick="setFilter('all')" class="f-btn px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold" data-f="all">الكل</button>
          <button onclick="setFilter('week')" class="f-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300" data-f="week">تنتهي هذا الأسبوع</button>
          <button onclick="setFilter('today')" class="f-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300" data-f="today">تنتهي اليوم</button>
          <button onclick="setFilter('expired')" class="f-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300" data-f="expired">منتهية</button>
        </div>
      </div>
      <div id="clientsList" class="grid grid-cols-1 md:grid-cols-2 gap-3 pb-8"></div>
    </section>

    <!-- SECTION 2: TOOLS -->
    <section id="sectionTools" class="hidden">
      <div class="bg-slate-900 border border-emerald-500/30 rounded-2xl p-4 mb-4 flex items-center justify-between">
        <div>
          <h2 class="font-bold text-white text-sm sm:text-base">أكواد تحميل البرامج وملاحظات السيرفرات</h2>
          <p class="text-xs text-slate-300">أكواد Downloader وروابط التطبيقات للنسخ الفوري والمشاركة</p>
        </div>
        <button onclick="openToolModal()" class="text-xs bg-emerald-500 text-slate-950 font-bold px-3 py-2 rounded-xl shrink-0">+ كود جديد</button>
      </div>
      <input type="text" id="toolSearch" oninput="renderTools()" placeholder="ابحث باسم التطبيق أو كود Downloader..." class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:border-emerald-500 outline-none mb-3" />
      <div id="toolsList" class="grid grid-cols-1 md:grid-cols-2 gap-3 pb-8"></div>
    </section>
  </div>

  <!-- Permanent Developer Signature Footer -->
  <footer class="mt-auto pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
    <div class="flex items-center justify-center gap-2">
      <span class="p-1 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">&lt;/&gt;</span>
      <span>تم التطوير بواسطة:</span>
      <strong class="text-white font-bold">مهندس إفرام عادل</strong>
      <span class="text-slate-600">|</span>
      <span class="text-emerald-400 font-mono font-semibold" dir="ltr">Eng. Evram Adel - IT Support & Systems Engineeer</span>
    </div>
  </footer>

  <!-- MODALS -->
  <div id="clientModal" class="hidden fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3">
    <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-5 max-h-[90vh] overflow-y-auto text-xs">
      <div class="flex justify-between items-center mb-3">
        <h2 id="modalTitle" class="font-bold text-white text-base">إضافة عميل</h2>
        <button onclick="closeModal('clientModal')" class="text-slate-400 text-lg">✕</button>
      </div>
      <form onsubmit="saveClient(event)" class="space-y-3">
        <input type="hidden" id="cId" />
        <div><label class="block mb-1 text-slate-300 font-bold">اسم العميل *</label><input required id="cName" class="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white outline-none" /></div>
        <div><label class="block mb-1 text-slate-300 font-bold">رقم الهاتف *</label><input required id="cPhone" type="tel" dir="ltr" class="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white outline-none" /></div>
        <div>
          <label class="block mb-1 text-slate-300 font-bold">السيرفر</label>
          <div class="flex gap-2"><select id="cServer" class="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white outline-none"></select><button type="button" onclick="addServerPrompt()" class="bg-slate-800 text-emerald-400 px-3 rounded-xl border border-slate-700 font-bold">+</button></div>
        </div>
        <div>
          <label class="block mb-1 text-slate-300 font-bold">نوع البيانات</label>
          <div class="flex gap-2 mb-2">
            <button type="button" id="bCode" onclick="setType('code')" class="flex-1 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold">كود فقط</button>
            <button type="button" id="bCreds" onclick="setType('credentials')" class="flex-1 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-bold">User/Pass/URL</button>
          </div>
          <div id="boxCode"><input id="cCode" placeholder="كود الاشتراك" dir="ltr" class="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 font-mono text-emerald-300 outline-none" /></div>
          <div id="boxCreds" class="hidden space-y-2">
            <input id="cUser" placeholder="اسم المستخدم" dir="ltr" class="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 font-mono text-white outline-none" />
            <input id="cPass" placeholder="كلمة المرور" dir="ltr" class="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 font-mono text-white outline-none" />
            <input id="cUrl" placeholder="رابط السيرفر" dir="ltr" class="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 font-mono text-cyan-300 outline-none" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div><label class="block mb-1 text-slate-400">التكلفة (ج.م)</label><input id="cCost" type="number" oninput="calcProfit()" value="200" class="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white outline-none" /></div>
          <div><label class="block mb-1 text-slate-400">البيع (ج.م)</label><input id="cSell" type="number" oninput="calcProfit()" value="350" class="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white outline-none" /></div>
        </div>
        <div class="bg-emerald-950/40 p-2 rounded-xl text-emerald-400 font-bold flex justify-between"><span>الربح التلقائي:</span><span id="pPreview">+150 ج.م</span></div>
        <div>
          <label class="block mb-1 text-slate-300 font-bold">تاريخ الانتهاء *</label>
          <div class="relative mb-1">
            <input required id="cExpiry" type="date" dir="ltr" onclick="try{this.focus();this.showPicker()}catch(e){}" class="w-full bg-slate-800 border border-slate-700 rounded-xl pl-3 pr-10 py-2 text-white font-mono text-left outline-none cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:z-10" />
            <span onclick="try{document.getElementById('cExpiry').focus();document.getElementById('cExpiry').showPicker()}catch(e){}" class="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 cursor-pointer text-sm z-20" title="فتح التقويم">📅</span>
          </div>
          <div class="flex gap-1 text-[10px]">
            <button type="button" onclick="setMonths(1)" class="px-2 py-0.5 bg-slate-800 text-slate-300 rounded">+ شهر</button>
            <button type="button" onclick="setMonths(3)" class="px-2 py-0.5 bg-slate-800 text-slate-300 rounded">+ 3 شهور</button>
            <button type="button" onclick="setMonths(12)" class="px-2 py-0.5 bg-emerald-950 text-emerald-300 font-bold rounded">+ سنة</button>
          </div>
        </div>
        <div class="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <button type="button" onclick="closeModal('clientModal')" class="px-4 py-2 text-slate-400">إلغاء</button>
          <button type="submit" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2 rounded-xl font-bold">حفظ العميل</button>
        </div>
      </form>
    </div>
  </div>

  <div id="toolModal" class="hidden fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3">
    <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 text-xs max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-3">
        <h2 id="toolModalTitle" class="font-bold text-white text-base">إضافة أداة أو كود</h2>
        <button onclick="closeModal('toolModal')" class="text-slate-400 text-lg">✕</button>
      </div>
      <form onsubmit="saveTool(event)" class="space-y-3">
        <input type="hidden" id="tId" />
        <div>
          <label class="block mb-1 text-slate-300 font-bold">التصنيف:</label>
          <div class="grid grid-cols-4 gap-1 text-[11px] font-bold mb-1">
            <button type="button" onclick="setToolCat('downloader')" id="tCatDownloader" class="p-1.5 rounded-lg bg-emerald-500 text-slate-950">Downloader</button>
            <button type="button" onclick="setToolCat('app_link')" id="tCatLink" class="p-1.5 rounded-lg bg-slate-800 text-slate-300">رابط APK</button>
            <button type="button" onclick="setToolCat('server_info')" id="tCatDns" class="p-1.5 rounded-lg bg-slate-800 text-slate-300">سيرفر و DNS</button>
            <button type="button" onclick="setToolCat('note')" id="tCatNote" class="p-1.5 rounded-lg bg-slate-800 text-slate-300">شاملة</button>
          </div>
        </div>
        <div>
          <label class="block mb-1 text-slate-300 font-bold">اسم الأداة / العنوان *</label>
          <input required id="tTitle" placeholder="مثال: تطبيق IBO Player Pro" class="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white outline-none" />
        </div>
        
        <!-- Box Downloader -->
        <div id="tBoxCode" class="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700">
          <label class="block mb-1 text-emerald-400 font-bold">كود تطبيق Downloader الرقمي:</label>
          <input id="tCode" placeholder="مثال: 841203" dir="ltr" inputmode="numeric" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 font-mono text-emerald-300 outline-none" />
        </div>

        <!-- Box Link -->
        <div id="tBoxLink" class="hidden bg-slate-800/60 p-2.5 rounded-xl border border-slate-700">
          <label class="block mb-1 text-cyan-400 font-bold">رابط التحميل المباشر (Direct URL / APK):</label>
          <input id="tUrl" placeholder="https://example.com/app.apk" dir="ltr" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 font-mono text-cyan-300 outline-none" />
        </div>

        <!-- Box DNS -->
        <div id="tBoxDns" class="hidden space-y-2 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700">
          <div>
            <label class="block mb-1 text-purple-400 font-bold">الـ DNS الرئيسي (Primary DNS):</label>
            <input id="tDns1" placeholder="http://line.iptv-server.com:8080" dir="ltr" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 font-mono text-purple-300 outline-none" />
          </div>
          <div>
            <label class="block mb-1 text-slate-400 font-medium">الـ DNS الثانوي / البديل (Secondary DNS):</label>
            <input id="tDns2" placeholder="http://backup.iptv-server.com:8080" dir="ltr" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 font-mono text-slate-300 outline-none" />
          </div>
        </div>

        <div>
          <label class="block mb-1 text-slate-300">ملاحظات وشرح:</label>
          <textarea id="tContent" rows="3" placeholder="ملاحظات أو طريقة التثبيت..." class="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white outline-none"></textarea>
        </div>
        <div class="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <button type="button" onclick="closeModal('toolModal')" class="px-4 py-2 text-slate-400">إلغاء</button>
          <button type="submit" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2 rounded-xl font-bold">حفظ الأداة</button>
        </div>
      </form>
    </div>
  </div>

  <div id="backupModal" class="hidden fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3">
    <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 text-xs">
      <div class="flex justify-between items-center mb-3">
        <h2 class="font-bold text-white text-base">النسخ الاحتياطي الشامل</h2>
        <button onclick="closeModal('backupModal')" class="text-slate-400 text-lg">✕</button>
      </div>
      <p class="text-slate-300 mb-4 leading-relaxed">تصدير واسترجاع بيانات العملاء والملاحظات وأكواد Downloader معاً في ملف واحد.</p>
      <div class="space-y-3">
        <button onclick="exportComprehensiveBackup()" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow">📥 تصدير البيانات الشاملة (Export JSON)</button>
        <label class="block w-full py-2.5 text-center rounded-xl bg-slate-800 border border-slate-700 hover:border-emerald-500 text-slate-200 font-bold cursor-pointer">
          📤 استيراد البيانات (Import JSON)
          <input type="file" accept=".json" onchange="importComprehensiveBackup(event)" class="hidden" />
        </label>
      </div>
    </div>
  </div>

  <!-- SCRIPTS & LICENSING -->
  <script>
    const SECRET_KEY = "Evram_IPTV_Secure_2026";
    const DEVELOPER_PHONE = "201271603214"; // Eng. Evram Adel (01271603214)

    let clients = JSON.parse(localStorage.getItem('iptv_single_clients') || '[]');
    let tools = JSON.parse(localStorage.getItem('iptv_single_tools') || '[]');
    let providers = JSON.parse(localStorage.getItem('iptv_single_providers') || '["Cobra", "VIP", "Lynx", "EJA", "Aroma", "Nova", "Shahid VIP", "Crystal"]');
    let sheetsUrl = localStorage.getItem('iptv_single_sheets_url') || '';
    let curFilter = 'all', curType = 'code', activeTab = 'clients';

    // Unique Device ID
    function getDeviceId() {
      let id = localStorage.getItem('iptv_device_id');
      if(!id) {
        id = 'EVRAM-' + Math.random().toString(36).substring(2,6).toUpperCase() + '-' + Math.random().toString(36).substring(2,6).toUpperCase() + '-' + Date.now().toString(36).substring(3,7).toUpperCase();
        localStorage.setItem('iptv_device_id', id);
      }
      return id;
    }

    function hashString(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) { hash = (hash << 5) - hash + str.charCodeAt(i); hash |= 0; }
      return Math.abs(hash);
    }

    function checkUser() {
      const savedName = localStorage.getItem('iptv_user_name');
      if (!savedName) {
        document.getElementById('welcomeScreen').classList.remove('hidden');
        document.getElementById('appMainContent').classList.add('hidden');
        return false;
      }
      document.getElementById('displayUserName').textContent = savedName;
      document.getElementById('welcomeScreen').classList.add('hidden');
      document.getElementById('appMainContent').classList.remove('hidden');
      return true;
    }

    function handleSaveName(e) {
      e.preventDefault();
      const val = document.getElementById('userNameInput').value.trim();
      if (!val) return;
      localStorage.setItem('iptv_user_name', val);
      checkUser();
      initApp();
    }

    function editUserNamePrompt() {
      const current = localStorage.getItem('iptv_user_name') || '';
      const newName = prompt('تعديل اسمك الكريم:', current);
      if (newName && newName.trim()) {
        localStorage.setItem('iptv_user_name', newName.trim());
        document.getElementById('displayUserName').textContent = newName.trim();
      }
    }

    function initApp() {
      document.getElementById('welcomeScreen').classList.add('hidden');
      document.getElementById('appMainContent').classList.remove('hidden');
      populateProviders();
      updateCounts();
      renderStats();
      renderClients();
      renderTools();
    }

    function switchMainTab(tab) {
      activeTab = tab;
      document.getElementById('sectionClients').classList.toggle('hidden', tab !== 'clients');
      document.getElementById('sectionTools').classList.toggle('hidden', tab !== 'tools');
      document.getElementById('tabBtnClients').className = tab === 'clients' ? 'flex-1 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 shadow' : 'flex-1 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white';
      document.getElementById('tabBtnTools').className = tab === 'tools' ? 'flex-1 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 shadow' : 'flex-1 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white';
      document.getElementById('mainAddBtn').textContent = tab === 'clients' ? '+ عميل جديد' : '+ أداة جديدة';
    }

    function handleAddAction() { if(activeTab === 'clients') openClientModal(); else openToolModal(); }
    function updateCounts() { document.getElementById('countClients').textContent = clients.length; document.getElementById('countTools').textContent = tools.length; }
    function saveClients() { localStorage.setItem('iptv_single_clients', JSON.stringify(clients)); updateCounts(); if(sheetsUrl) fetch(sheetsUrl, { method: 'POST', headers: {'Content-Type': 'text/plain;charset=utf-8'}, body: JSON.stringify({ action: 'saveAll', clients }) }); }
    function saveTools() { localStorage.setItem('iptv_single_tools', JSON.stringify(tools)); updateCounts(); }
    function populateProviders() { document.getElementById('cServer').innerHTML = providers.map(p => '<option value="'+p+'">'+p+'</option>').join(''); }
    function addServerPrompt() { const p = prompt('اسم الشركة الجديدة:'); if(p && p.trim()) { providers.push(p.trim()); localStorage.setItem('iptv_single_providers', JSON.stringify(providers)); populateProviders(); document.getElementById('cServer').value = p.trim(); } }
    function setType(t) { curType = t; document.getElementById('boxCode').classList.toggle('hidden', t !== 'code'); document.getElementById('boxCreds').classList.toggle('hidden', t === 'code'); document.getElementById('bCode').className = t === 'code' ? 'flex-1 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold' : 'flex-1 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-bold'; document.getElementById('bCreds').className = t === 'credentials' ? 'flex-1 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold' : 'flex-1 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-bold'; }
    function calcProfit() { const p = (Number(document.getElementById('cSell').value)||0) - (Number(document.getElementById('cCost').value)||0); document.getElementById('pPreview').textContent = (p >= 0 ? '+' : '') + p + ' ج.م'; }
    function setMonths(m) { const d = new Date(); d.setMonth(d.getMonth()+m); document.getElementById('cExpiry').value = d.toISOString().split('T')[0]; }
    function renderStats() {
      const now = new Date().setHours(0,0,0,0);
      let profit = 0, week = 0, exp = 0;
      clients.forEach(c => { profit += Number(c.profit||0); const diff = Math.ceil((new Date(c.expiryDate).setHours(0,0,0,0) - now)/86400000); if(diff < 0) exp++; else if(diff <= 7) week++; });
      document.getElementById('stats').innerHTML = \`
        <div class="bg-slate-900 border border-slate-800 p-2.5 rounded-xl"><span class="text-slate-400 text-xs block">العملاء</span><span class="text-lg font-black text-white">\${clients.length}</span></div>
        <div class="bg-slate-900 border border-amber-500/40 p-2.5 rounded-xl"><span class="text-amber-400 text-xs block">خلال أسبوع</span><span class="text-lg font-black text-amber-400">\${week}</span></div>
        <div class="bg-slate-900 border border-rose-500/40 p-2.5 rounded-xl"><span class="text-rose-400 text-xs block">منتهية</span><span class="text-lg font-black text-rose-400">\${exp}</span></div>
        <div class="bg-slate-900 border border-emerald-500/40 p-2.5 rounded-xl"><span class="text-emerald-400 text-xs block">الأرباح</span><span class="text-lg font-black text-emerald-400">+\${profit} ج.م</span></div>
      \`;
    }
    function renderClients() {
      const q = document.getElementById('searchInput').value.toLowerCase();
      const now = new Date().setHours(0,0,0,0);
      const filtered = clients.filter(c => {
        if(q && !c.name.toLowerCase().includes(q) && !c.phone.includes(q) && !(c.code&&c.code.toLowerCase().includes(q))) return false;
        const diff = Math.ceil((new Date(c.expiryDate).setHours(0,0,0,0) - now)/86400000);
        if(curFilter === 'week') return diff >= 0 && diff <= 7;
        if(curFilter === 'today') return diff === 0;
        if(curFilter === 'expired') return diff < 0;
        return true;
      });
      document.getElementById('clientsList').innerHTML = filtered.map(c => {
        const diff = Math.ceil((new Date(c.expiryDate).setHours(0,0,0,0) - now)/86400000);
        const isExp = diff < 0;
        let phoneNorm = c.phone.replace(/[^0-9]/g, ''); if(phoneNorm.startsWith('01')) phoneNorm = '2'+phoneNorm;
        const waMsg = encodeURIComponent('مرحباً '+c.name+'، نود تذكيرك بأن اشتراكك ينتهي في '+c.expiryDate+'. للتجديد تواصل معنا.');
        return \`
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-2"><div><h3 class="font-bold text-white text-base">\${c.name}</h3><a href="tel:\${c.phone}" class="text-xs text-slate-400 font-mono">\${c.phone}</a></div><span class="bg-slate-800 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-lg text-xs font-bold">\${c.subscriptionType}</span></div>
              <div class="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold border mb-2 \${isExp?'text-rose-400 bg-rose-500/10 border-rose-500/20':'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'}">\${isExp?'منتهي منذ '+Math.abs(diff)+' يوم':'متبقي '+diff+' يوم ('+c.expiryDate+')'}</div>
              \${c.accountType === 'code' ? \`<div class="bg-slate-950 p-2 rounded-xl text-xs font-mono text-emerald-300 flex justify-between items-center mb-2"><span>الكود: \${c.code || '—'}</span><button onclick="navigator.clipboard.writeText('\${c.code}')" class="text-slate-400 hover:text-white">نسخ</button></div>\` : \`<div class="bg-slate-950 p-2 rounded-xl text-xs font-mono text-slate-300 space-y-1 mb-2"><div>مستخدم: \${c.username || '—'}</div><div>كلمة سر: \${c.password || '—'}</div><div class="text-cyan-400 truncate">سيرفر: \${c.serverUrl || '—'}</div></div>\`}
              <div class="flex justify-between text-xs bg-slate-950/60 p-2 rounded-lg text-slate-300 mb-2"><span>بيع: \${c.sellingPrice} | تكلفة: \${c.costPrice}</span><span class="text-emerald-400 font-bold">ربح: +\${c.profit} ج.م</span></div>
            </div>
            <div class="flex gap-2 pt-2 border-t border-slate-800">
              <a href="tel:\${c.phone}" class="p-2 bg-blue-500/20 text-blue-400 rounded-xl text-xs">📞 اتصال</a>
              <a href="https://wa.me/\${phoneNorm}?text=\${waMsg}" target="_blank" class="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold">💬 واتساب</a>
              <button onclick="openClientModal('\${c.id}')" class="p-2 bg-slate-800 text-slate-300 rounded-xl text-xs">✏️</button>
              <button onclick="deleteClient('\${c.id}')" class="p-2 bg-rose-500/10 text-rose-400 rounded-xl text-xs">🗑️</button>
            </div>
          </div>
        \`;
      }).join('');
    }
    let curToolCat = 'downloader';
    function setToolCat(cat) {
      curToolCat = cat;
      const cats = ['downloader', 'app_link', 'server_info', 'note'];
      cats.forEach(c => {
        const btn = document.getElementById(c === 'downloader' ? 'tCatDownloader' : c === 'app_link' ? 'tCatLink' : c === 'server_info' ? 'tCatDns' : 'tCatNote');
        if(btn) btn.className = c === cat ? 'p-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold' : 'p-1.5 rounded-lg bg-slate-800 text-slate-300';
      });
      document.getElementById('tBoxCode').classList.toggle('hidden', cat === 'app_link' || cat === 'server_info');
      document.getElementById('tBoxLink').classList.toggle('hidden', cat === 'downloader' || cat === 'server_info');
      document.getElementById('tBoxDns').classList.toggle('hidden', cat === 'downloader' || cat === 'app_link');
    }

    function renderTools() {
      const q = document.getElementById('toolSearch').value.toLowerCase();
      const filtered = tools.filter(t => !q || t.title.toLowerCase().includes(q) || (t.downloaderCode && t.downloaderCode.includes(q)) || (t.url && t.url.toLowerCase().includes(q)));
      document.getElementById('toolsList').innerHTML = filtered.map(t => {
        let waMsg = encodeURIComponent('*' + t.title + '*\\n' + (t.downloaderCode ? '📲 كود Downloader: *' + t.downloaderCode + '*\\n' : '') + (t.url ? (t.category === 'server_info' ? '🌐 الـ DNS الرئيسي: ' : '🔗 الرابط: ') + t.url + '\\n' : '') + (t.secondaryUrl ? '🌐 الـ DNS البديل: ' + t.secondaryUrl + '\\n' : '') + (t.content ? t.content : ''));
        return \`
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-2"><h3 class="font-bold text-white text-sm sm:text-base">\${t.title}</h3><div class="flex gap-1"><button onclick="openToolModal('\${t.id}')" class="p-1 text-slate-400">✏️</button><button onclick="deleteTool('\${t.id}')" class="p-1 text-rose-400">🗑️</button></div></div>
              \${t.downloaderCode ? \`<div class="bg-slate-950 border border-emerald-500/30 rounded-xl p-2.5 mb-2 flex justify-between items-center"><div><span class="text-[10px] text-slate-400 block">كود Downloader:</span><span class="font-mono text-base font-black text-emerald-300">\${t.downloaderCode}</span></div><button onclick="navigator.clipboard.writeText('\${t.downloaderCode}')" class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-xs font-bold">نسخ الكود</button></div>\` : ''}
              \${t.url ? \`<div class="bg-slate-950/80 border border-slate-800 rounded-xl p-2 mb-2 flex justify-between items-center text-xs"><div class="truncate"><span class="text-[10px] text-slate-400 block">\${t.category === 'server_info' ? 'الـ DNS الرئيسي:' : 'رابط التحميل:'}</span><span class="font-mono \${t.category === 'server_info' ? 'text-purple-300' : 'text-cyan-300'}">\${t.url}</span></div><button onclick="navigator.clipboard.writeText('\${t.url}')" class="p-1 text-slate-400 hover:text-white">نسخ</button></div>\` : ''}
              \${t.secondaryUrl ? \`<div class="bg-slate-950/80 border border-slate-800 rounded-xl p-2 mb-2 flex justify-between items-center text-xs"><div class="truncate"><span class="text-[10px] text-slate-400 block">الـ DNS البديل:</span><span class="font-mono text-purple-200">\${t.secondaryUrl}</span></div><button onclick="navigator.clipboard.writeText('\${t.secondaryUrl}')" class="p-1 text-slate-400 hover:text-white">نسخ</button></div>\` : ''}
              \${t.content ? \`<div class="text-xs text-slate-300 bg-slate-950/60 p-2 rounded-xl mb-2 whitespace-pre-wrap">\${t.content}</div>\` : ''}
            </div>
            <div class="pt-2 border-t border-slate-800 flex justify-end"><a href="https://wa.me/?text=\${waMsg}" target="_blank" class="text-xs text-emerald-400 font-bold">💬 إرسال للعميل عبر واتساب</a></div>
          </div>
        \`;
      }).join('');
    }
    function setFilter(f) { curFilter = f; document.querySelectorAll('.f-btn').forEach(b => b.className = b.dataset.f === f ? 'f-btn px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold' : 'f-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300'); renderClients(); }
    function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
    function openClientModal(id) { document.getElementById('clientModal').classList.remove('hidden'); }
    function openToolModal(id) {
      const tool = id ? tools.find(x => x.id === id) : null;
      document.getElementById('tId').value = tool ? tool.id : '';
      document.getElementById('tTitle').value = tool ? tool.title : '';
      document.getElementById('tCode').value = tool ? (tool.downloaderCode || '') : '';
      document.getElementById('tUrl').value = tool ? (tool.url || '') : '';
      document.getElementById('tDns1').value = tool && tool.category === 'server_info' ? (tool.url || '') : '';
      document.getElementById('tDns2').value = tool ? (tool.secondaryUrl || '') : '';
      document.getElementById('tContent').value = tool ? (tool.content || '') : '';
      setToolCat(tool ? (tool.category || 'downloader') : 'downloader');
      document.getElementById('toolModal').classList.remove('hidden');
    }
    function saveClient(e) { e.preventDefault(); const id = document.getElementById('cId').value || 'c_' + Date.now(); const cost = Number(document.getElementById('cCost').value)||0; const sell = Number(document.getElementById('cSell').value)||0; const data = { id, name: document.getElementById('cName').value, phone: document.getElementById('cPhone').value, subscriptionType: document.getElementById('cServer').value, accountType: curType, code: document.getElementById('cCode').value, username: document.getElementById('cUser').value, password: document.getElementById('cPass').value, serverUrl: document.getElementById('cUrl').value, costPrice: cost, sellingPrice: sell, profit: sell - cost, expiryDate: document.getElementById('cExpiry').value }; const idx = clients.findIndex(x => x.id === id); if(idx >= 0) clients[idx] = data; else clients.unshift(data); saveClients(); renderStats(); renderClients(); closeModal('clientModal'); }
    function deleteClient(id) { if(confirm('حذف العميل؟')) { clients = clients.filter(x => x.id !== id); saveClients(); renderStats(); renderClients(); } }
    function saveTool(e) {
      e.preventDefault();
      const id = document.getElementById('tId').value || 't_' + Date.now();
      const title = document.getElementById('tTitle').value.trim();
      const code = document.getElementById('tCode').value.trim();
      const url = curToolCat === 'server_info' ? document.getElementById('tDns1').value.trim() : document.getElementById('tUrl').value.trim();
      const secondaryUrl = document.getElementById('tDns2').value.trim();
      const content = document.getElementById('tContent').value.trim();
      const data = { id, title, category: curToolCat, downloaderCode: code, url, secondaryUrl, content, createdAt: new Date().toISOString() };
      const idx = tools.findIndex(x => x.id === id);
      if(idx >= 0) tools[idx] = data; else tools.unshift(data);
      saveTools();
      renderTools();
      closeModal('toolModal');
    }
    function deleteTool(id) { if(confirm('حذف الأداة؟')) { tools = tools.filter(x => x.id !== id); saveTools(); renderTools(); } }
    function openSheetsPrompt() { const u = prompt('أدخل رابط Google Apps Script Web App الخاص بك:', sheetsUrl); if(u !== null) { sheetsUrl = u.trim(); localStorage.setItem('iptv_single_sheets_url', sheetsUrl); if(sheetsUrl) saveClients(); } }
    function openBackupModal() { document.getElementById('backupModal').classList.remove('hidden'); }
    function exportComprehensiveBackup() { const backup = { version: "2.0", exportedAt: new Date().toISOString(), clients, notes: tools, providers }; const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'iptv_backup_full.json'; a.click(); }
    function importComprehensiveBackup(e) { const file = e.target.files && e.target.files[0]; if(!file) return; const reader = new FileReader(); reader.onload = (event) => { try { const data = JSON.parse(event.target.result); if(data.clients) clients = data.clients; if(data.notes) tools = data.notes; saveClients(); saveTools(); renderStats(); renderClients(); renderTools(); alert('تم استيراد البيانات بنجاح!'); closeModal('backupModal'); } catch(err){ alert('خطأ في الملف'); } }; reader.readAsText(file); }

    // Start-up logic
    if (checkUser()) {
      initApp();
    }
  </script>
</body>
</html>`;
  };

  const handleDownload = () => {
    const code = getSingleHtmlCode();
    const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'iptv_client_edition.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('تم تحميل نسخة العميل النهائي بنجاح', 'success');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getSingleHtmlCode());
    setCopied(true);
    onShowToast('تم نسخ كود نسخة العميل النهائي بالكامل!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                تصدير نسخة العميل المستقلة (Standalone Edition)
              </h2>
              <p className="text-xs text-slate-400">
                ملف مستقل مجاني ومفتوح بالكامل مع نافذة تسجيل اسم المستخدم لأول مرة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs text-slate-300">
          <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/80 space-y-2">
            <span className="font-bold text-emerald-400 block text-sm">
              ✨ نسخة مستقلة مجانية وسريعة:
            </span>
            <ul className="list-disc list-inside text-slate-300 space-y-1">
              <li>ملف HTML واحد يعمل مباشرة في أي متصفح دون اتصال إنترنت أو خادم.</li>
              <li>مجاني بالكامل ومفتوح بدون أكواد تفعيل أو كلمات مرور.</li>
              <li>يطلب من المستخدم إدخال اسمه عند أول تشغيل فقط ويحفظه محلياً.</li>
              <li>يدعم حفظ وإدارة العملاء، النسخ الاحتياطي، والربط مع شيت جوجل.</li>
              <li>توقيع المطور المهندس إفرام عادل محفوظ دائماً في أسفل الصفحة.</li>
            </ul>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold p-3 rounded-xl shadow-lg transition"
            >
              <Download className="w-4 h-4" />
              <span>تحميل ملف iptv_client_edition.html</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold p-3 rounded-xl transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'تم النسخ!' : 'نسخ الكود'}</span>
            </button>
          </div>

          <div>
            <span className="font-bold text-slate-400 block mb-1.5">معاينة الكود المصدري المحمي:</span>
            <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-slate-400 max-h-56 overflow-x-auto select-all leading-relaxed" dir="ltr">
              {getSingleHtmlCode()}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-800/80 border-t border-slate-700/80 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
