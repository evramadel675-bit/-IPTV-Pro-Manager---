export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * ========================================================
 * IPTV Pro Manager - Google Sheets Backend Web App
 * كود الربط بين تطبيق إدارة اشتراكات IPTV وشيت جوجل
 * ========================================================
 * 
 * طريقة التركيب السريعة:
 * 1. افتح جدول بيانات Google جديد (Google Sheets).
 * 2. من القائمة العلوية اضغط: الإضافات (Extensions) -> Apps Script.
 * 3. امسح أي كود موجود في نافذة Code.gs والصق هذا الكود بالكامل.
 * 4. اضغط على زر الحفظ (Save / أيقونة القرص).
 * 5. اضغط على زر "نشر" (Deploy) بالأعلى -> "توزيع جديد" (New deployment).
 * 6. اختر نوع التوزيع: "تطبيق ويب" (Web app).
 * 7. الإعدادات المهمة:
 *    - الوصف (Description): IPTV Web App
 *    - تنفيذ كـ (Execute as): Me (حسابي)
 *    - من يمكنه الوصول (Who has access): Anyone (أي شخص / حتى بدون تسجيل دخول).
 * 8. اضغط Deploy / نشر، ووافق على الصلاحيات المطلوبة (Authorize access -> Advanced -> Go to ...).
 * 9. انسخ "Web App URL" والصقه في تطبيق IPTV Pro Manager!
 */

const SHEET_NAME = "عملاء IPTV";

// تهيئة الجدول وإنشاء الترويسة تلقائياً إذا لم تكن موجودة
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    const headers = [
      "معرف العميل (ID)",
      "اسم العميل",
      "رقم الهاتف",
      "نوع السيرفر",
      "نوع الحساب",
      "الكود",
      "اسم المستخدم (Username)",
      "كلمة المرور (Password)",
      "رابط السيرفر (URL)",
      "سعر التكلفة",
      "سعر البيع",
      "الربح",
      "تاريخ الانتهاء",
      "ملاحظات",
      "تاريخ الإنشاء",
      "آخر تحديث"
    ];
    sheet.appendRow(headers);
    
    // تنسيق شريط العناوين
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#0f172a");
    headerRange.setFontColor("#10b981");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// معالجة طلبات القراءة (GET)
function doGet(e) {
  try {
    const sheet = getOrCreateSheet();
    const action = e && e.parameter && e.parameter.action ? e.parameter.action : "getClients";
    
    if (action === "test") {
      return jsonResponse({
        status: "success",
        message: "الاتصال بجدول بيانات Google Sheets يعمل بنجاح وبكفاءة عالية!",
        timestamp: new Date().toISOString()
      });
    }

    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return jsonResponse({ status: "success", clients: [], count: 0 });
    }

    const headers = data[0];
    const clients = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[0] && !row[1]) continue; // تجاهل الصفوف الفارغة

      // تنسيق تاريخ الانتهاء
      let expiryFormatted = "";
      if (row[12] instanceof Date) {
        const y = row[12].getFullYear();
        const m = String(row[12].getMonth() + 1).padStart(2, '0');
        const d = String(row[12].getDate()).padStart(2, '0');
        expiryFormatted = \`\${y}-\${m}-\${d}\`;
      } else {
        expiryFormatted = String(row[12] || "");
      }

      clients.push({
        id: String(row[0] || ""),
        name: String(row[1] || ""),
        phone: String(row[2] || ""),
        subscriptionType: String(row[3] || "Cobra"),
        accountType: String(row[4] || "code"),
        code: String(row[5] || ""),
        username: String(row[6] || ""),
        password: String(row[7] || ""),
        serverUrl: String(row[8] || ""),
        costPrice: Number(row[9] || 0),
        sellingPrice: Number(row[10] || 0),
        profit: Number(row[11] || 0),
        expiryDate: expiryFormatted,
        notes: String(row[13] || ""),
        createdAt: String(row[14] || new Date().toISOString()),
        updatedAt: String(row[15] || new Date().toISOString())
      });
    }

    return jsonResponse({
      status: "success",
      count: clients.length,
      clients: clients
    });
  } catch (err) {
    return jsonResponse({
      status: "error",
      message: err.toString()
    });
  }
}

// معالجة طلبات الإضافة والتعديل والحذف (POST)
function doPost(e) {
  try {
    const sheet = getOrCreateSheet();
    let body = {};

    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    } else if (e && e.parameter && e.parameter.data) {
      body = JSON.parse(e.parameter.data);
    }

    const action = body.action || "saveAll";

    // 1. مزامنة / حفظ القائمة الكاملة
    if (action === "saveAll" || action === "sync") {
      const clients = body.clients || [];
      
      // تفريغ البيانات القديمة مع الإبقاء على سطر الترويسة
      const lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.getRange(2, 1, lastRow - 1, 16).clearContent();
      }

      if (clients.length > 0) {
        const rows = clients.map(c => [
          c.id || Utilities.getUuid(),
          c.name || "",
          c.phone || "",
          c.subscriptionType || "",
          c.accountType || "code",
          c.code || "",
          c.username || "",
          c.password || "",
          c.serverUrl || "",
          Number(c.costPrice || 0),
          Number(c.sellingPrice || 0),
          Number(c.profit || 0),
          c.expiryDate || "",
          c.notes || "",
          c.createdAt || new Date().toISOString(),
          new Date().toISOString()
        ]);
        sheet.getRange(2, 1, rows.length, 16).setValues(rows);
      }

      return jsonResponse({
        status: "success",
        message: "تمت مزامنة جميع العملاء في شيت جوجل بنجاح!",
        savedCount: clients.length
      });
    }

    // 2. إضافة عميل فردي
    if (action === "addClient") {
      const c = body.client;
      if (!c) throw new Error("بيانات العميل غير متوفرة");
      
      sheet.appendRow([
        c.id || Utilities.getUuid(),
        c.name || "",
        c.phone || "",
        c.subscriptionType || "",
        c.accountType || "code",
        c.code || "",
        c.username || "",
        c.password || "",
        c.serverUrl || "",
        Number(c.costPrice || 0),
        Number(c.sellingPrice || 0),
        Number(c.profit || 0),
        c.expiryDate || "",
        c.notes || "",
        c.createdAt || new Date().toISOString(),
        new Date().toISOString()
      ]);

      return jsonResponse({
        status: "success",
        message: "تم إضافة العميل بنجاح في Google Sheets!",
        client: c
      });
    }

    return jsonResponse({ status: "error", message: "أمر غير معروف: " + action });
  } catch (err) {
    return jsonResponse({
      status: "error",
      message: err.toString()
    });
  }
}

// دالة مساعدة لتصدير الاستجابة بتنسيق JSON مع ترويسة صحيحة
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
