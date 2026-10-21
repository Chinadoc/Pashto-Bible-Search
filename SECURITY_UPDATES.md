# Security update, 2026-10-21

Pin Node.js 22.23.4; the engine range also accepts patched Node 24.22.1 and 26.12.1 or newer in supported lines. Upgrade Next.js 14 to the 15.5.28 security backport, refresh compatible dependencies, and use patched PostCSS and selector parsing. Update the Next external-package configuration, fix existing nullable-book type errors, and use Next Link for the dashboard home link so production compilation succeeds.

Validation: dependency alerts reduced from 50 (including 5 critical) to 7 high, with no critical, moderate or low alerts. The production build passes. A local production GET / returned HTTP 200 and the Pashto Bible Search title. The remaining high alerts come from braces through Tailwind 3 and build tooling; GHSA-vfj7-8cjw-p6xm has no patched braces release. They remain unresolved and are not suppressed.

No deployment performed. Cloudflare pages:build, authenticated storage/search, voice generation and other provider integrations require separate deployment and account validation. A successful Next build does not validate the older next-on-pages deployment adapter. Provider credentials removed from Railway still require provider-side revocation where pending.
