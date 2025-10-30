# Fixing node_modules Issue

## Problem
The `node_modules` directory appears corrupted, preventing installation of `@aws-sdk/client-s3`.

## Solution Options

### Option 1: Clean Install (Recommended)
```bash
cd /Users/jeremysamuels/Documents/pashto-bible-search
rm -rf node_modules package-lock.json
npm install
```

### Option 2: Fix Corrupted Directories
```bash
cd /Users/jeremysamuels/Documents/pashto-bible-search
# Remove problematic directories
find node_modules -name "* 2" -type d -exec rm -rf {} +
npm install
```

### Option 3: Manual Install (Quick Fix)
```bash
cd /Users/jeremysamuels/Documents/pashto-bible-search
npm install @aws-sdk/client-s3 --force
```

### Option 4: Use Alternative Package Manager
```bash
cd /Users/jeremysamuels/Documents/pashto-bible-search
yarn add @aws-sdk/client-s3
# or
pnpm add @aws-sdk/client-s3
```

---

## After Fixing

Once `@aws-sdk/client-s3` is installed, you can run:

```bash
npx tsx cloudflare/migrate-audio-from-local.ts
```

This will:
1. Find all local MP3 files (~48,799 files)
2. Upload them to R2 bucket `pashto-bible-audio`
3. Organize them in folders: `yousafzai/nt/`, `yousafzai/ot/`, `afghan2023/nt/`, `afghan2023/ot/`

Estimated time: 2-4 hours (depends on file sizes and network speed)


