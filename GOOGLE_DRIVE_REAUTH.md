# Getting a Fresh Google Drive Token

## Quick Method: Just Make Folder Public

**Easiest solution:** Instead of dealing with tokens, just make your Google Drive folder public:

1. Go to https://drive.google.com
2. Find your audio folder
3. Right-click → **Share**
4. Change to **"Anyone with the link"**
5. Done! ✅

This takes 30 seconds and solves everything.

---

## Alternative: Get Fresh Token (If You Need API Access)

If you need programmatic access, here's how to get a fresh token:

### Step 1: Run the Auth Helper

If you have a `google_drive_api_helper.py` script, run it. Otherwise, use this Node.js script:

```bash
node scripts/auth_google_drive.js
```

### Step 2: Follow the OAuth Flow

1. You'll get a URL in the console
2. Open it in your browser
3. Sign in to Google
4. Click "Allow" to grant permissions
5. Copy the authorization code
6. Paste it back into the terminal

### Step 3: Save Token

The script will save a new `token.json` with:
- Fresh access token
- Refresh token
- Expiry date (usually 1 hour)

### Step 4: Run Make Public Script

```bash
npm run make-drive-public
```

---

## Manual Token Refresh (If Refresh Token Works)

If your refresh token is still valid but access token expired:

```javascript
const { google } = require('googleapis');
const tokenData = require('./token.json');

const oauth2Client = new google.auth.OAuth2(
  tokenData.client_id,
  tokenData.client_secret
);

oauth2Client.setCredentials({
  refresh_token: tokenData.refresh_token
});

oauth2Client.refreshAccessToken().then(({ credentials }) => {
  console.log('New access token:', credentials.access_token);
  console.log('New expiry:', credentials.expiry_date);
  
  // Update token.json with new credentials
  const updatedToken = {
    ...tokenData,
    token: credentials.access_token,
    expiry: new Date(credentials.expiry_date).toISOString()
  };
  
  require('fs').writeFileSync('token.json', JSON.stringify(updatedToken));
});
```

---

## Recommendation

**Just make the folder public manually** - it's way faster and simpler than dealing with tokens!

The API approach is only needed if you:
- Want to automate this process
- Need to update permissions frequently
- Have thousands of files to manage

For your use case (1,000 files in one folder), manual sharing is perfect.

