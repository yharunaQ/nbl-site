# Temporary Public Mode

## Purpose

- The live NBL site was exposing under-construction pages and prototype flows.
- Temporary public mode reduces the public surface to a minimal, safe landing page.
- Detailed prototype routes are replaced with holding pages until the renewed site is ready.

## Public surface now

- `/`
  - Minimal public-safe landing page
  - Contact and YouTube only
- `/jac`
- `/jac/guide`
- `/jac/guidebook`
- `/jac/guidebook/success`
- `/dao-participation-lab`
  - Rewritten to temporary holding pages with `noindex,nofollow`

## API surface temporarily disabled

- `/api/jac-assess`
- `/api/jac-assess-refinement`
- `/api/jac-tag-suggest`
- `/api/dao-participation-lab/*`
- `/api/ebook/*`
  - Returns `503` while temporary public mode is active

## Implementation points

- Switch: [lib/publicSiteMode.ts](/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/lib/publicSiteMode.ts)
- Temporary home: [components/TemporaryPublicHome.tsx](/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/components/TemporaryPublicHome.tsx)
- Preserved previous home: [components/LegacyPublicHome.tsx](/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/components/LegacyPublicHome.tsx)
- Route blocking: [proxy.ts](/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/proxy.ts)

## Later replacement

1. Complete the renewed site architecture and public content selection.
2. Replace the temporary landing page with the approved public homepage.
3. Re-open blocked routes only after each section passes publication review.
4. Turn off `TEMPORARY_PUBLIC_SITE_ENABLED` when the new public surface is ready.
