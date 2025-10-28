# Setting Up Google Drive API to Make Files Public

## Step 1: Create Google Cloud Project & Enable Drive API

1. Go to https://console.cloud.google.com/
2. Create a new project (or select existing)
3. Go to **APIs & Services** → **Library**
4. Search for "Google Drive API"
5. Click **Enable**

## Step 2: Create Service Account

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **Service Account**
3. Give it a name (e.g., "pashto-bible-drive")
4. Click **Create and Continue**
5. Click **Done** (skip role)

## Step 3: Create Key for Service Account

1. Click on the service account you just created
2. Go to **Keys** tab
3. Click **Add Key** → **Create new key**
4. Choose **JSON**
5. Download the JSON file

## Step 4: Get Credentials from JSON

Open the downloaded JSON file. You'll see:
```json
{
  "type": "service_account",
  "project_id": "...",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@project-id.iam.gserviceaccount.com",
  ...
}
```

You need:
- `client_email` → This is your `GOOGLE_CLIENT_EMAIL`
- `private_key` → This is your `GOOGLE_PRIVATE_KEY`

## Step 5: Share Files with Service Account

**Important:** Your Google Drive files must be shared with the service account email!

1. Open Google Drive
2. Select all audio files (or the folder containing them)
3. Right-click → **Share**
4. Add the service account email (`your-service-account@project-id.iam.gserviceaccount.com`)
5. Give it **Editor** permission
6. Click **Send**

## Step 6: Set Environment Variables

Create a `.env.local` file in your project root:

```bash
GOOGLE_CLIENT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

**Important:** Wrap the private key in quotes!

## Step 7: Run the Script

```bash
node scripts/make_drive_files_public.js
```

The script will:
1. Find all Google Drive URLs in your database
2. Extract unique file IDs
3. Make each file publicly accessible
4. Show progress and results

## Alternative: Manual Sharing

If you prefer not to use the API, you can manually share files:

1. Open Google Drive
2. Select files
3. Right-click → **Share**
4. Change access to **"Anyone with the link"**
5. Set permission to **"Viewer"**

This is simpler but more tedious for many files.

## Troubleshooting

**Error: "User does not have permission"**
- Make sure files are shared with the service account email
- Check that the service account has Editor permission

**Error: "API not enabled"**
- Go to Google Cloud Console
- Enable "Google Drive API"

**Error: "Invalid credentials"**
- Check that private key is properly formatted
- Make sure there are escaped newlines (`\n`) in the JSON

