/**
 * Petals Health — website leads (2026-10-30). Bound to the leads Google Sheet; deployed as a web app.
 * Deploy steps and what to send back: apps-script/README.md.
 *
 * Every form on the site posts one JSON object here (app/src/forms/submit.js). This script:
 *   1. checks it (name, 10-digit Indian mobile, consent, submission id) — a bad request gets { ok:false, retry:false };
 *   2. skips a submission id it has already written (the site re-sends failed attempts with the same id);
 *   3. appends ONE row to the "Leads" tab, columns in the approved order (COLUMNS below), IST timestamp first;
 *   4. only then emails the notification addresses. Email can fail or run out of quota; the row is already written,
 *      the failure goes to the "Log" tab, and the alert path below makes sure someone hears about it the same day.
 *   5. answers { ok:true, id } — the site treats nothing else as delivered.
 *
 * Nothing account-specific is in this code. Recipients and limits are Script Properties (Project Settings → Script
 * Properties), with the defaults below when a property is absent; the sheet is whichever spreadsheet the script is
 * bound to. A new owning account = copy the sheet (or a new sheet + this file), run setup(), deploy, and put the new
 * /exec URL in the site's VITE_FORM_ENDPOINT. No code changes.
 *
 * Email quota (Apps Script MailApp): about 100 recipients/day on a free Gmail account, about 1,500 on Google Workspace;
 * each lead uses one per notification address. Same-day visibility of a quota problem:
 *   - QUOTA_RESERVE recipients are always kept back. When sending a lead email would dip into the reserve, lead emails
 *     stop (rows still written, each skip logged) and ONE alert goes to ALERT_TO from the reserve, at the moment it
 *     happens — "lead emails have stopped for today; the sheet has every lead".
 *   - A send that throws (any reason) is logged and alerts ALERT_TO, at most once an hour.
 *   - dailyDigest() runs every evening at 20:00 IST (installed by setup()) and ALWAYS emails ALERT_TO: leads today,
 *     how many were emailed, every failure. It comes from the reserve. If the digest ever stops arriving, the script,
 *     its trigger or its account has a problem — the absence is the alarm.
 */

// ---- the sheet's columns, in the approved order: [header, payload key] ----------------------------------------------
var COLUMNS = [
  ['Timestamp (IST)', null],              // 1 — set here, on receipt
  ['Name', 'name'],                       // 2
  ['Mobile', 'mobile'],                   // 3
  ['Email', 'email'],                     // 4
  ['Department', 'department'],           // 5
  ['Doctor', 'doctor'],                   // 6
  ['Preferred date', 'date'],             // 7
  ['Gender', 'gender'],                   // 8
  ['Age', 'age'],                         // 9
  ['Message', 'message'],                 // 10
  ['Consent', 'consent'],                 // 11 — "Yes — <the sentence shown>"
  ['Form', 'form'],                       // 12
  ['Section', 'section'],                 // 13
  ['Page URL', 'pageUrl'],                // 14
  ['Page title', 'pageTitle'],            // 15
  ['Landing page', 'landingPage'],        // 16
  ['Referrer', 'referrer'],               // 17
  ['utm_source', 'utm_source'],           // 18
  ['utm_medium', 'utm_medium'],           // 19
  ['utm_campaign', 'utm_campaign'],       // 20
  ['utm_term', 'utm_term'],               // 21
  ['utm_content', 'utm_content'],         // 22
  ['gclid', 'gclid'],                     // 23
  ['fbclid', 'fbclid'],                   // 24
  ['Device type', 'deviceType'],          // 25
  ['Viewport', 'viewport'],               // 26
  ['Submission ID', 'id'],                // 27
];
var LEADS_TAB = 'Leads';
var LOG_TAB = 'Log';
var LOG_HEADERS = ['Timestamp (IST)', 'Submission ID', 'Event', 'Detail'];
var TZ = 'Asia/Kolkata';

// Script Properties override these (Project Settings → Script Properties). Comma-separated address lists.
var DEFAULTS = {
  NOTIFY_TO: 'info@petalshealth.in,plandleadtest@gmail.com',   // every lead
  ALERT_TO: 'plandleadtest@gmail.com',                          // quota / failure alerts and the daily digest
  QUOTA_RESERVE: '5',                                           // recipients always kept back for alerts and the digest
  DIGEST_HOUR: '20',                                            // daily digest, hour in IST
};

var FORM_LABELS = {
  'book-appointment': 'Book an appointment', 'request-callback': 'Call back request', 'ask-doctor': 'Ask a doctor',
  'book-consultation': 'Book a consultation', 'book-consultation-page': 'Book a consultation (page form)',
  'sxo-agent': 'Assistant pop-up', 'careers': 'Careers enquiry', 'test': 'TEST (setup check)',
};

// ---- web app entry points ---------------------------------------------------------------------------------------
function doPost(e) {
  var p;
  try {
    var body = e && e.postData && e.postData.contents;
    if (!body || body.length > 20000) return reply_({ ok: false, retry: false, error: 'Empty or oversized request' });
    p = JSON.parse(body);
  } catch (err) {
    return reply_({ ok: false, retry: false, error: 'Not valid JSON' });
  }

  var problem = invalid_(p);
  if (problem) { log_(p && p.id, 'rejected', problem); return reply_({ ok: false, retry: false, error: problem }); }

  var row;
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);                                  // one writer at a time: the duplicate check stays true
    var sheet = leadsSheet_();
    if (alreadyWritten_(sheet, p.id)) { log_(p.id, 'duplicate', 'Already in the sheet; not written again'); return reply_({ ok: true, id: p.id, duplicate: true }); }
    row = toRow_(p);
    sheet.appendRow(row);
    SpreadsheetApp.flush();
  } catch (err) {
    // the row could NOT be written: tell the site (it keeps the lead, shows the error and retries) and raise the alarm
    log_(p.id, 'write_failed', String(err));
    alert_('Website lead NOT saved', 'A lead could not be written to the sheet. The visitor saw an error and the site will retry.\n\nError: ' + err + '\nSubmission ID: ' + p.id, 'write');
    return reply_({ ok: false, retry: true, error: 'Could not save just now' });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }

  var emailed = notify_(p, row);                            // after the write: email can never lose a lead
  return reply_({ ok: true, id: p.id, emailed: emailed });
}

// GET /exec — a health check: open the URL in a browser to confirm the deployment answers
function doGet() {
  return reply_({ ok: true, service: 'petals-health-leads', sheet: SpreadsheetApp.getActiveSpreadsheet().getName(), emailQuotaLeft: MailApp.getRemainingDailyQuota() });
}

// ---- checks ----------------------------------------------------------------------------------------------------
function invalid_(p) {
  if (!p || typeof p !== 'object') return 'Not an object';
  if (!/^[A-Za-z0-9-]{8,64}$/.test(String(p.id || ''))) return 'Missing submission id';
  if (String(p.name || '').trim().length < 2) return 'Name is required';
  if (!/^[6-9]\d{9}$/.test(String(p.mobile || ''))) return 'A 10-digit Indian mobile number is required';
  if (p.consent !== 'Yes') return 'Consent is required';
  return null;
}

function alreadyWritten_(sheet, id) {
  var last = sheet.getLastRow();
  if (last < 2) return false;
  var col = COLUMNS.length;                                 // Submission ID is the last column
  return sheet.getRange(2, col, last - 1, 1).createTextFinder(String(id)).matchEntireCell(true).findNext() !== null;
}

// ---- the row ---------------------------------------------------------------------------------------------------
function toRow_(p) {
  var now = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm:ss');
  return COLUMNS.map(function (c) {
    if (c[1] === null) return now;
    if (c[1] === 'consent') return p.consent === 'Yes' ? 'Yes — ' + safe_(p.consentText || '') : 'No';
    return safe_(p[c[1]]);
  });
}
// a cell never becomes a formula: text starting = + - @ is stored as text
function safe_(v) {
  var s = String(v == null ? '' : v).slice(0, 2000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

// ---- email -----------------------------------------------------------------------------------------------------
function notify_(p, row) {
  var to = list_('NOTIFY_TO');
  if (!to.length) { log_(p.id, 'email_skipped', 'NOTIFY_TO is empty'); return false; }
  var reserve = Number(prop_('QUOTA_RESERVE')) || 0;
  var left = MailApp.getRemainingDailyQuota();
  if (left - to.length < reserve) {
    log_(p.id, 'email_skipped_quota', 'Quota left ' + left + ', reserve ' + reserve + '. Lead is in the sheet.');
    alertOncePerDay_('quota', 'Website lead emails have STOPPED for today (quota)',
      'The daily email quota is nearly used (' + left + ' left, ' + reserve + ' kept for alerts). New leads are still saved to the sheet, but no lead emails will go out until the quota resets (about 24 hours after the first sends).\n\n' +
      'Check the sheet for new leads: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl() + '\n\nIf this happens often, the sending account needs Google Workspace (about 1,500 recipients a day instead of about 100).');
    return false;
  }
  try {
    var label = FORM_LABELS[p.form] || p.form || 'Form';
    var subject = 'New website lead — ' + label + ' — ' + String(p.name || '').trim().slice(0, 60);
    var lines = COLUMNS.map(function (c, i) { return c[0] + ': ' + (row[i] === '' ? '—' : row[i]); });
    var html = '<table cellpadding="6" style="border-collapse:collapse;font:14px Arial,sans-serif">' + COLUMNS.map(function (c, i) {
      return '<tr><td style="border-bottom:1px solid #ddd;color:#555;white-space:nowrap">' + esc_(c[0]) + '</td><td style="border-bottom:1px solid #ddd">' + esc_(row[i] === '' ? '—' : row[i]) + '</td></tr>';
    }).join('') + '</table><p style="font:13px Arial,sans-serif;color:#555">Sheet: <a href="' + SpreadsheetApp.getActiveSpreadsheet().getUrl() + '">' + esc_(SpreadsheetApp.getActiveSpreadsheet().getName()) + '</a></p>';
    MailApp.sendEmail({ to: to.join(','), subject: subject, body: lines.join('\n'), htmlBody: html, name: 'Petals Health website' });
    return true;
  } catch (err) {
    log_(p.id, 'email_failed', String(err));
    alert_('Website lead email FAILED', 'A lead was saved to the sheet but its email could not be sent.\n\nError: ' + err + '\nSubmission ID: ' + p.id + '\nSheet: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl(), 'send');
    return false;
  }
}

// alerts come out of the reserve; a failure to alert is itself logged (the daily digest and the Log tab still show it)
function alert_(subject, body, kind) {
  var cache = CacheService.getScriptCache();
  if (kind && cache.get('alert-' + kind)) return;           // at most one alert of a kind per hour
  try {
    var to = list_('ALERT_TO');
    if (!to.length) return;
    MailApp.sendEmail({ to: to.join(','), subject: subject, body: body, name: 'Petals Health website' });
    if (kind) cache.put('alert-' + kind, '1', 3600);
  } catch (err) {
    log_('', 'alert_failed', subject + ' — ' + err);
  }
}
function alertOncePerDay_(kind, subject, body) {
  var props = PropertiesService.getScriptProperties();
  var today = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd');
  if (props.getProperty('ALERTED_' + kind) === today) return;
  alert_(subject, body, null);
  props.setProperty('ALERTED_' + kind, today);
}

// ---- daily digest (time trigger, 20:00 IST) ----------------------------------------------------------------------
function dailyDigest() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var today = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd');
  var leads = rowsOn_(leadsSheet_(), today);
  var log = rowsOn_(logSheet_(), today);
  var problems = log.filter(function (r) { return /failed|skipped/.test(r[2]); });
  var notEmailed = problems.filter(function (r) { return /^email_/.test(r[2]); }).length;
  var subject = (problems.length ? '⚠ ' : '') + 'Petals website leads — ' + today + ': ' + leads.length + ' lead' + (leads.length === 1 ? '' : 's') + (notEmailed ? ', ' + notEmailed + ' NOT emailed' : '');
  var body = 'Leads saved today: ' + leads.length + '\n' +
    'Lead emails not sent today: ' + notEmailed + '\n' +
    'Email quota left now: ' + MailApp.getRemainingDailyQuota() + '\n\n' +
    (problems.length ? 'Problems today (Log tab):\n' + problems.map(function (r) { return '  ' + r[0] + '  ' + r[2] + '  ' + r[1] + '  ' + r[3]; }).join('\n') + '\n\n' : 'No problems today.\n\n') +
    'Sheet: ' + ss.getUrl() + '\n\nThis digest is sent every evening. If it stops arriving, check the script\'s trigger and account.';
  try { MailApp.sendEmail({ to: list_('ALERT_TO').join(','), subject: subject, body: body, name: 'Petals Health website' }); }
  catch (err) { log_('', 'digest_failed', String(err)); }
}
function rowsOn_(sheet, day) {
  var last = sheet.getLastRow();
  if (last < 2) return [];
  return sheet.getRange(2, 1, last - 1, sheet.getLastColumn()).getDisplayValues().filter(function (r) { return String(r[0]).indexOf(day) === 0; });
}

// ---- setup, test and menu ------------------------------------------------------------------------------------------
/** Run once from the editor (and again after changing DIGEST_HOUR): tabs, headers, text columns, defaults, trigger. */
function setup() {
  var props = PropertiesService.getScriptProperties();
  Object.keys(DEFAULTS).forEach(function (k) { if (props.getProperty(k) === null) props.setProperty(k, DEFAULTS[k]); });
  var sheet = leadsSheet_();
  sheet.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS.map(function (c) { return c[0]; })]).setFontWeight('bold');
  sheet.setFrozenRows(1);
  sheet.getRange(2, 1, sheet.getMaxRows() - 1, COLUMNS.length).setNumberFormat('@');   // everything as text: mobiles keep their digits, dates stay as sent
  logSheet_();
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'dailyDigest') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('dailyDigest').timeBased().atHour(Number(prop_('DIGEST_HOUR')) || 20).everyDays(1).inTimezone(TZ).create();
  Logger.log('Setup done. Notify: %s · Alerts: %s · Quota left today: %s', prop_('NOTIFY_TO'), prop_('ALERT_TO'), MailApp.getRemainingDailyQuota());
}

/** Writes a TEST row and sends its email, exactly as a real lead would. Delete the row afterwards if you like. */
function sendTestLead() {
  var res = doPost({ postData: { contents: JSON.stringify({ id: 'test-' + Date.now(), name: 'Setup test', mobile: '9000000000', consent: 'Yes', consentText: 'Setup test', form: 'test', section: 'apps-script', pageUrl: 'apps-script://sendTestLead', deviceType: 'n/a', viewport: 'n/a' }) } });
  Logger.log(res.getContent());
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Petals leads')
    .addItem('Set up (run once)', 'setup')
    .addItem('Send a test lead', 'sendTestLead')
    .addItem('Send today\'s digest now', 'dailyDigest')
    .addToUi();
}

// ---- helpers ---------------------------------------------------------------------------------------------------
function leadsSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(LEADS_TAB) || ss.insertSheet(LEADS_TAB, 0);
  if (sh.getLastRow() === 0) { sh.appendRow(COLUMNS.map(function (c) { return c[0]; })); sh.setFrozenRows(1); }
  return sh;
}
function logSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(LOG_TAB) || ss.insertSheet(LOG_TAB);
  if (sh.getLastRow() === 0) { sh.appendRow(LOG_HEADERS); sh.setFrozenRows(1); }
  return sh;
}
function log_(id, event, detail) {
  try { logSheet_().appendRow([Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm:ss'), safe_(id || ''), event, safe_(detail || '')]); }
  catch (err) { console.error('log failed', event, detail, err); }   // last resort: Executions log in the editor
}
function prop_(k) { var v = PropertiesService.getScriptProperties().getProperty(k); return v === null ? DEFAULTS[k] : v; }
function list_(k) { return String(prop_(k) || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean); }
function esc_(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function reply_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
