# Team Luxura Applications Backend Setup

This site now supports:
- Public submission from Apply page
- Password-protected staff dashboard on Applications page

To make it work for multiple viewers, deploy the backend below with Google Apps Script.

## 1. Create Apps Script project
1. Open https://script.google.com
2. Create a new project
3. Replace the default code with the script below
4. Set your values at the top:
- ALLOWED_STAFF_USERNAMES
- STAFF_PASSWORD
- SHEET_ID
- SHEET_NAME

## 2. Apps Script backend code
```javascript
const ALLOWED_STAFF_USERNAMES = [
  // Founder
  'kayru',
  'drxzL',
  // Co Lead
  'lukasz',
  // Management
  'explicitzenn',
  // Staff
  'slayser',
  'cairu',
  'ortx',
  // Trial
  'trial'
];
const STAFF_PASSWORD = 'teamluxurastaffaccess';
const SHEET_ID = '1NgJAx8JedHz7sYe-SW2GCwCV1d7xTc-w4zVpw0oAOSM';
const SHEET_NAME = 'Applications';

function doOptions() {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const body = {
      name: String((e.parameter && e.parameter.name) || '').trim(),
      discord: String((e.parameter && e.parameter.discord) || '').trim(),
      role: String((e.parameter && e.parameter.role) || '').trim(),
      age: Number((e.parameter && e.parameter.age) || 0),
      country: String((e.parameter && e.parameter.country) || '').trim(),
      message: String((e.parameter && e.parameter.message) || '').trim()
    };

    const required = ['name', 'discord', 'role', 'age', 'country', 'message'];
    for (const key of required) {
      if (!String(body[key] || '').trim()) {
        return json({ success: false, message: `Missing field: ${key}` });
      }
    }

    const sheet = getSheet();
    sheet.appendRow([
      new Date().toISOString(),
      String(body.name).trim(),
      String(body.discord).trim(),
      String(body.role).trim(),
      Number(body.age),
      String(body.country).trim(),
      String(body.message).trim()
    ]);

    return json({ success: true, message: 'Application stored.' });
  } catch (err) {
    return json({ success: false, message: err.message || 'Server error.' });
  }
}

function doGet(e) {
  try {
    const username = String((e.parameter && e.parameter.username) || '').trim();
    const password = String((e.parameter && e.parameter.password) || '').trim();
    const normalized = username.toLowerCase();
    const allowedSet = new Set(ALLOWED_STAFF_USERNAMES.map((name) => String(name).toLowerCase()));

    if (!allowedSet.has(normalized) || password !== STAFF_PASSWORD) {
      return json({ success: false, message: 'Access denied.' });
    }

    const action = String((e.parameter && e.parameter.action) || 'read').trim();

    if (action === 'delete') {
      const targetName = String((e.parameter && e.parameter.name) || '').trim();
      const targetDiscord = String((e.parameter && e.parameter.discord) || '').trim();

      if (!targetName || !targetDiscord) {
        return json({ success: false, message: 'Missing fields for deletion.' });
      }

      const sheet = getSheet();
      const values = sheet.getDataRange().getValues();

      for (let i = 1; i < values.length; i++) {
        const rowName = String(values[i][1]).trim();
        const rowDiscord = String(values[i][2]).trim();
        if (rowName === targetName && rowDiscord === targetDiscord) {
          sheet.deleteRow(i + 1);
          return json({ success: true, message: 'Application deleted.' });
        }
      }

      return json({ success: false, message: 'Application not found.' });
    }

    const sheet = getSheet();
    const values = sheet.getDataRange().getValues();

    if (values.length <= 1) {
      return json({ success: true, data: [] });
    }

    const data = values.slice(1).map((row) => ({
      createdAt: row[0],
      name: row[1],
      discord: row[2],
      role: row[3],
      age: row[4],
      country: row[5],
      message: row[6]
    }));

    return json({ success: true, data });
  } catch (err) {
    return json({ success: false, message: err.message || 'Server error.' });
  }
}

function getSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['createdAt', 'name', 'discord', 'role', 'age', 'country', 'message']);
  }

  return sheet;
}

function json(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. Deploy Apps Script
1. Click Deploy -> New deployment
2. Type: Web app
3. Execute as: Me
4. Who has access: Anyone
5. Deploy and copy the Web App URL

## 4. Connect your website
1. Open script.js
2. Set APPLICATIONS_API_BASE to your deployed Apps Script URL
3. Save and publish your site

## 5. Share with staff
- Send staff this page URL: Applications.html
- Send them the shared STAFF_PASSWORD and their username from ALLOWED_STAFF_USERNAMES

## Allowed usernames
- Founder: kayru, drxzL
- Co Lead: lukasz
- Management: explicitzenn
- Staff: slayser, cairu, ortx
- Trial: trial

## Security note
The dashboard password is checked on the backend in Apps Script. That means people cannot bypass it just by viewing your website source.
