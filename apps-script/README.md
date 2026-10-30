# Petals Health — website leads script

`Code.gs` receives every form on the website, writes one row per lead to a Google Sheet, then emails the
notification addresses. `appsscript.json` sets the time zone (IST) and the web-app access. Columns, recipients and the
alert rules are explained at the top of `Code.gs`.

## Deploy (about 10 minutes)

Do this signed in to the Google account that should **own the leads** (the client's account once confirmed; until
then the agency account is fine — moving it later is the same steps again, no code change).

1. **Create the sheet.** Go to <https://sheets.new>. Rename it (top left) to `Petals Health — Website Leads`.
2. **Open the script editor.** In the sheet: **Extensions → Apps Script**. A new tab opens with a file `Code.gs`.
3. **Paste the code.** Select everything in `Code.gs` and delete it. Paste the whole of this folder's `Code.gs`.
   Click the disk icon (**Save project**). Rename the project (top left, "Untitled project") to `Petals leads`.
4. **Paste the manifest.** Click the gear icon (**Project Settings**) in the left bar → tick
   **Show "appsscript.json" manifest file in editor**. Back in the editor (`< >` icon), open `appsscript.json`,
   replace its contents with this folder's `appsscript.json`, and save.
5. **Run the setup once.** In the editor's toolbar choose the function `setup` in the drop-down next to **Debug**,
   then click **Run**. Google asks for permission: **Review permissions** → choose the account →
   **Advanced** → **Go to Petals leads (unsafe)** → **Allow**. (It is "unsafe" only because the script is your own and
   not published by Google; it asks to edit this spreadsheet, send email as you, and run a daily trigger.)
   The execution log should end with `Setup done.` The sheet now has a **Leads** tab with 27 column headers and a
   **Log** tab.
6. **Check the recipients.** Project Settings (gear) → **Script Properties**. You should see `NOTIFY_TO`
   (`info@petalshealth.in,plandleadtest@gmail.com`), `ALERT_TO` (`plandleadtest@gmail.com`), `QUOTA_RESERVE` (`5`)
   and `DIGEST_HOUR` (`20`). Change any of them here — never in the code.
7. **Send a test lead.** Back in the editor, choose `sendTestLead` and click **Run**. A row "Setup test" appears in
   the Leads tab and both addresses receive a "New website lead — TEST (setup check)" email. Check both inboxes
   (and spam — mark it **Not spam** so real leads land in the inbox). Delete the test row afterwards if you like.
8. **Deploy as a web app.** Click **Deploy → New deployment**. Click the gear next to "Select type" → **Web app**.
   - Description: `Website leads v1`
   - Execute as: **Me (your address)**
   - Who has access: **Anyone**  ← must be "Anyone", not "Anyone with Google account" or "Only myself"; otherwise
     the website gets Google's sign-in page instead of an answer and (correctly) treats every lead as failed.

   Click **Deploy**, then copy the **Web app URL**. It looks like
   `https://script.google.com/macros/s/AKfycb…/exec`.
9. **Check the URL.** Paste it into a new browser tab. You should see a line starting `{"ok":true,"service":"petals-health-leads"`.

## What to send back

Just the **Web app URL** from step 8 (the one ending in `/exec`).

We put it in the website's Vercel setting `VITE_FORM_ENDPOINT` (Production), redeploy, send one real test from the
live site, and confirm the row, both emails and the thank-you page.

## Later changes

- **Change who gets emails:** edit `NOTIFY_TO` / `ALERT_TO` in Script Properties. Takes effect immediately.
- **Change the code:** paste the new `Code.gs`, then **Deploy → Manage deployments → (pencil) → Version: New version →
  Deploy**. The URL stays the same, so nothing on the website changes.
- **Move to another Google account:** in the new account repeat steps 1–9 (or **File → Make a copy** of the sheet,
  which copies the script; then run step 5 onwards). Send the new URL; we swap `VITE_FORM_ENDPOINT` and redeploy.
  Turn the old deployment off afterwards (**Deploy → Manage deployments → Archive**).

## How problems reach you the same day

- Every lead is written to the sheet **before** any email is attempted; an email failure never loses a lead.
- Every email failure or skip is a line in the **Log** tab.
- When the daily email quota is nearly used (about 100 recipients a day on free Gmail, each lead uses 2), lead
  emails stop, and **one alert email** goes to `ALERT_TO` straight away from the 5 sends kept in reserve.
- Any other email error sends an alert to `ALERT_TO` (at most one an hour).
- **Every evening at 20:00 IST** `ALERT_TO` gets a digest: leads saved today, how many were not emailed, any problems.
  It comes every day, even when all is well — **if it stops arriving, something is wrong** with the script, its
  trigger or the account.
- If a lead cannot be written to the sheet at all, the website shows the visitor an error (with the phone number),
  keeps the details and retries, and `ALERT_TO` gets a "Website lead NOT saved" email.
