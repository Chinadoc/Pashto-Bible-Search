# 📊 Current Migration Progress

## Quick Status Check

Run this command to see current progress:

```bash
npx wrangler d1 execute pashto-bible-db --remote --command="SELECT translation_key, COUNT(*) as count FROM verses GROUP BY translation_key; SELECT COUNT(*) as total FROM verses;"
```

## Expected Totals

- **Verses**: 54,570 total
  - Yousafzai 2019: 30,410
  - Afghan 2023: 24,160
- **Word Frequencies**: 7,405
- **Form Occurrences**: 7,252
- **Form to Root**: 7,252

## Resume Migration

If migration stopped, restart with:

```bash
npx tsx cloudflare/migrate-comprehensive-to-d1.ts
```

The script will continue from where it left off (but may insert duplicates - safe to rerun, you can clean up later).
