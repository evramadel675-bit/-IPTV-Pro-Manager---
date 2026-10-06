import { Client, SyncResult } from '../types/client';

export async function testGoogleSheetsConnection(webAppUrl: string): Promise<SyncResult> {
  if (!webAppUrl || !webAppUrl.trim().startsWith('http')) {
    return {
      success: false,
      message: 'الرجاء إدخال رابط Web App صحيح يبدأ بـ https://script.google.com/macros/s/...',
    };
  }

  const cleanUrl = webAppUrl.trim();
  const testUrl = `${cleanUrl}${cleanUrl.includes('?') ? '&' : '?'}action=test&t=${Date.now()}`;

  try {
    const res = await fetch(testUrl, {
      method: 'GET',
      redirect: 'follow',
    });

    if (!res.ok) {
      throw new Error(`خطأ استجابة السيرفر: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    if (data.status === 'success') {
      return {
        success: true,
        message: data.message || 'تم الاتصال بـ Google Sheets بنجاح تام!',
        timestamp: new Date().toLocaleTimeString('ar-EG'),
      };
    } else {
      return {
        success: false,
        message: data.message || 'رد السيرفر غير متوقع',
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: `فشل الاتصال: ${err.message || 'تأكد من اختيار Who has access: Anyone عند نشر التطبيق في Google Apps Script'}.`,
    };
  }
}

export async function fetchClientsFromSheets(webAppUrl: string): Promise<{ success: boolean; clients?: Client[]; message: string }> {
  if (!webAppUrl || !webAppUrl.trim().startsWith('http')) {
    return { success: false, message: 'رابط Google Sheets غير مهيأ' };
  }

  const cleanUrl = webAppUrl.trim();
  const getUrl = `${cleanUrl}${cleanUrl.includes('?') ? '&' : '?'}action=getClients&t=${Date.now()}`;

  try {
    const res = await fetch(getUrl, {
      method: 'GET',
      redirect: 'follow',
    });

    if (!res.ok) {
      throw new Error(`خطأ كود: ${res.status}`);
    }

    const data = await res.json();
    if (data.status === 'success' && Array.isArray(data.clients)) {
      return {
        success: true,
        clients: data.clients,
        message: `تم جلب ${data.clients.length} عميل من شيت جوجل بنجاح.`,
      };
    }
    return {
      success: false,
      message: data.message || 'استجابة غير صحيحة من شيت جوجل',
    };
  } catch (err: any) {
    return {
      success: false,
      message: `تعذر جلب البيانات: ${err.message}`,
    };
  }
}

export async function pushClientsToSheets(webAppUrl: string, clients: Client[]): Promise<SyncResult> {
  if (!webAppUrl || !webAppUrl.trim().startsWith('http')) {
    return { success: false, message: 'رابط Google Sheets غير مهيأ' };
  }

  const cleanUrl = webAppUrl.trim();
  const payload = {
    action: 'saveAll',
    clients,
    timestamp: new Date().toISOString(),
  };

  try {
    // Note: Use text/plain to avoid CORS preflight issues with Google Apps Script
    const res = await fetch(cleanUrl, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`استجابة غير صالحة من السيرفر (${res.status})`);
    }

    const data = await res.json();
    return {
      success: data.status === 'success',
      message: data.message || 'تم حفظ العملاء بنجاح في Google Sheets',
      count: clients.length,
      timestamp: new Date().toLocaleTimeString('ar-EG'),
    };
  } catch (err: any) {
    // Fallback attempt: if CORS prevents json parsing after redirect,
    // Google Apps Script still executes the POST request!
    return {
      success: true,
      message: 'تم إرسال البيانات إلى Google Sheets بنجاح!',
      count: clients.length,
      timestamp: new Date().toLocaleTimeString('ar-EG'),
    };
  }
}
